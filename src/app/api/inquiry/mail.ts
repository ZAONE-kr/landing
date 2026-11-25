import "server-only";

import { INQUIRY_FORMS, type Inquiry } from "@/lib/inquiry";

import { formatMailTime, renderNotificationMail, sendNotificationMail } from "../_lib/mail";
import { inquiryRows } from "./rows";

/*
 * 문의 알림 메일. 문의자가 아니라 단체 담당자에게 보내고(받는 사람은 ../_lib/mail.ts), 담당자가 답장을 누르면
 * 문의자에게 가도록 답장 주소를 문의자 이메일로 둔다.
 */
const SENDER = "ZAONE 문의 <noreply@mail.zaone.org>";

/*
 * 제목은 받은 편지함에서 바로 구분되게 "[문의 종류] 기관명 · 담당자명"이다. 본문은 문의 종류·접수 일시, 폼 순서대로의
 * 항목 표, 개인정보 동의 일시(동의문의 수집 항목)다.
 */
export function buildInquiryMail(inquiry: Inquiry, receivedAt: Date) {
  const { title } = INQUIRY_FORMS[inquiry.type];
  const { organization = "", name = "", email = "" } = inquiry.values;
  const received = formatMailTime(receivedAt);

  const { text, html } = renderNotificationMail({
    heading: `${title}가 들어왔어요.`,
    timeLabel: "접수 일시",
    time: received,
    rows: inquiryRows(inquiry),
    notes: [
      `개인정보 수집·이용 동의: 동의함 (${received})`,
      `이 메일에 답장하면 문의자(${email})에게 갑니다.`,
    ],
  });

  return { subject: `[${title}] ${organization} · ${name}`, text, html };
}

// 태그(inquiry_type)는 Resend 대시보드에서 문의 종류별로 찾을 때 쓴다.
export function sendInquiryMail(inquiry: Inquiry, receivedAt: Date): Promise<string> {
  return sendNotificationMail({
    from: SENDER,
    ...buildInquiryMail(inquiry, receivedAt),
    replyTo: inquiry.values.email,
    tags: [{ name: "inquiry_type", value: inquiry.type }],
  });
}
