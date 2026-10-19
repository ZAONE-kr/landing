import "server-only";

import { INQUIRY_FORMS, type Inquiry } from "@/lib/inquiry";

import { inquiryRows, isTestInquiry, seoulTime } from "./rows";

/*
 * 문의 알림 메일. 문의자가 아니라 단체 담당자에게 보내고, 담당자가 답장을 누르면 문의자에게 가도록 답장 주소를
 * 문의자 이메일로 둔다. 보내는 곳은 Resend이고, mail.zaone.org를 Resend에 도메인 인증해 두었다(2026-10-19).
 */
const SENDER = "ZAONE 문의 <noreply@mail.zaone.org>";

/*
 * 받는 사람. 실제 사이트만 담당자에게 보내고 시험 접수는 개발용 주소로 보낸다(rows.ts의 isTestInquiry).
 * 담당자가 바뀌면 배포 환경 변수 CONTACT_INQUIRY_TO로 바꾼다(코드 수정 없음).
 */
function recipient(): string {
  const override = process.env.CONTACT_INQUIRY_TO?.trim();
  if (override) return override;
  return isTestInquiry() ? "develop@zaone.org" : "lee@zaone.org";
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Resend가 응답하지 않을 때 문의자를 오래 붙잡지 않는다.
const SEND_TIMEOUT_MS = 10_000;

// 서울 기준 "2026. 10. 19 (일) 14:32".
function formatReceivedAt(date: Date): string {
  const { year, month, day, weekday, hour, minute } = seoulTime(date);
  return `${year}. ${month}. ${day} (${weekday}) ${hour}:${minute}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/*
 * 제목은 받은 편지함에서 바로 구분되게 "[문의 종류] 기관명 · 담당자명"이다. 본문은 문의 종류·접수 일시, 폼 순서대로의
 * 항목 표, 개인정보 동의 일시(동의문의 수집 항목)다. 메일 프로그램마다 CSS 지원이 달라 표와 인라인 스타일만 쓴다.
 */
export function buildInquiryMail(inquiry: Inquiry, receivedAt: Date) {
  const { title } = INQUIRY_FORMS[inquiry.type];
  const { organization = "", name = "", email = "" } = inquiry.values;
  const received = formatReceivedAt(receivedAt);
  const items = inquiryRows(inquiry);
  const consentLine = `개인정보 수집·이용 동의: 동의함 (${received})`;
  const replyLine = `이 메일에 답장하면 문의자(${email})에게 갑니다.`;

  const subject = `[${title}] ${organization} · ${name}`;

  const text = [
    `${title}가 들어왔어요.`,
    `접수 일시: ${received}`,
    "",
    ...items.map(({ label, value }) => `${label}: ${value}`),
    "",
    consentLine,
    replyLine,
  ].join("\n");

  const font =
    "font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;";
  const tableRows = items
    .map(
      ({ label, value }) => `
        <tr>
          <th scope="row" align="left" valign="top" style="${font}width:128px;padding:12px 16px 12px 0;border-top:1px solid #e5e9ed;font-size:14px;line-height:1.6;font-weight:600;color:#66717d;">${escapeHtml(label)}</th>
          <td valign="top" style="${font}padding:12px 0;border-top:1px solid #e5e9ed;font-size:15px;line-height:1.6;color:#121b24;word-break:break-all;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="ko">
  <body style="margin:0;padding:24px 12px;background:#f8f9fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;">
      <tr>
        <td style="padding:32px;">
          <p style="${font}margin:0 0 8px;font-size:20px;line-height:1.5;font-weight:700;color:#121b24;">${escapeHtml(title)}가 들어왔어요.</p>
          <p style="${font}margin:0 0 24px;font-size:14px;line-height:1.6;color:#66717d;">접수 일시 ${escapeHtml(received)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${tableRows}
          </table>
          <p style="${font}margin:24px 0 0;font-size:13px;line-height:1.6;color:#66717d;">${escapeHtml(consentLine)}<br>${escapeHtml(replyLine)}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

/*
 * Resend로 보낸다. 키가 없거나 Resend가 거절하면 던진다(라우트 핸들러가 문의자에게 다시 시도하라고 알린다).
 * 태그(inquiry_type)는 Resend 대시보드에서 문의 종류별로 찾을 때 쓴다.
 */
export async function sendInquiryMail(inquiry: Inquiry, receivedAt: Date): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY가 설정되지 않았습니다.");

  const { subject, text, html } = buildInquiryMail(inquiry, receivedAt);
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: SENDER,
      to: [recipient()],
      reply_to: inquiry.values.email,
      subject,
      text,
      html,
      tags: [{ name: "inquiry_type", value: inquiry.type }],
    }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `Resend가 메일을 보내지 않았습니다(${response.status}): ${await response.text()}`,
    );
  }
  const { id } = (await response.json()) as { id: string };
  return id;
}
