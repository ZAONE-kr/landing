import "server-only";

import { isTestSubmission, seoulTime } from "./submission";

/*
 * 담당자 알림 메일. 문의(../inquiry/mail.ts)와 뉴스레터 구독(../newsletter/mail.ts)이 함께 쓴다. 보내는 곳은
 * Resend이고, mail.zaone.org를 Resend에 도메인 인증해 두었다(2026-10-19).
 */

/*
 * 받는 사람. 실제 사이트만 담당자에게 보내고 시험 접수는 개발용 주소로 보낸다(./submission.ts의 isTestSubmission).
 * 담당자가 바뀌면 배포 환경 변수 CONTACT_INQUIRY_TO로 바꾼다(코드 수정 없음). 뉴스레터 구독 알림도 같은 주소로 간다.
 */
function recipient(): string {
  const override = process.env.CONTACT_INQUIRY_TO?.trim();
  if (override) return override;
  return isTestSubmission() ? "develop@zaone.org" : "lee@zaone.org";
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Resend가 응답하지 않을 때 접수한 사람을 오래 붙잡지 않는다.
const SEND_TIMEOUT_MS = 10_000;

// 서울 기준 "2026. 10. 19 (일) 14:32".
export function formatMailTime(date: Date): string {
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

export type MailRow = { label: string; value: string };

/*
 * 알림 메일 본문. 맨 위 한 줄(heading), 일시, 항목 표, 맨 아래 안내 문장(notes) 순서다. 메일 프로그램마다 CSS 지원이
 * 달라 표와 인라인 스타일만 쓴다.
 */
export function renderNotificationMail({
  heading,
  timeLabel,
  time,
  rows,
  notes = [],
}: {
  heading: string;
  timeLabel: string;
  time: string;
  rows: MailRow[];
  notes?: string[];
}) {
  const text = [
    heading,
    `${timeLabel}: ${time}`,
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`),
    ...(notes.length > 0 ? ["", ...notes] : []),
  ].join("\n");

  const font =
    "font-family:Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;";
  const tableRows = rows
    .map(
      ({ label, value }) => `
        <tr>
          <th scope="row" align="left" valign="top" style="${font}width:128px;padding:12px 16px 12px 0;border-top:1px solid #e5e9ed;font-size:14px;line-height:1.6;font-weight:600;color:#66717d;">${escapeHtml(label)}</th>
          <td valign="top" style="${font}padding:12px 0;border-top:1px solid #e5e9ed;font-size:15px;line-height:1.6;color:#121b24;word-break:break-all;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`,
    )
    .join("");
  const notesHtml =
    notes.length > 0
      ? `
          <p style="${font}margin:24px 0 0;font-size:13px;line-height:1.6;color:#66717d;">${notes.map(escapeHtml).join("<br>")}</p>`
      : "";

  const html = `<!doctype html>
<html lang="ko">
  <body style="margin:0;padding:24px 12px;background:#f8f9fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;">
      <tr>
        <td style="padding:32px;">
          <p style="${font}margin:0 0 8px;font-size:20px;line-height:1.5;font-weight:700;color:#121b24;">${escapeHtml(heading)}</p>
          <p style="${font}margin:0 0 24px;font-size:14px;line-height:1.6;color:#66717d;">${escapeHtml(timeLabel)} ${escapeHtml(time)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${tableRows}
          </table>${notesHtml}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

/*
 * Resend로 담당자에게 보낸다. 키가 없거나 Resend가 거절하면 던진다(라우트 핸들러가 접수한 사람에게 다시 시도하라고
 * 알린다). 태그는 Resend 대시보드에서 찾을 때 쓴다.
 */
export async function sendNotificationMail(mail: {
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY가 설정되지 않았습니다.");

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: mail.from,
      to: [recipient()],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      tags: mail.tags,
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
