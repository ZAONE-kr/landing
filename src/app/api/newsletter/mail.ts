import "server-only";

import { formatMailTime, renderNotificationMail, sendNotificationMail } from "../_lib/mail";

/*
 * 뉴스레터 구독 알림 메일. 문의 알림처럼 단체 담당자에게 간다(받는 사람은 ../_lib/mail.ts, 사용자 요청 2026-11-25).
 * 제목에 구독한 이메일을 넣어 받은 편지함에서 바로 보이게 한다.
 */
const SENDER = "ZAONE 뉴스레터 <noreply@mail.zaone.org>";

export function buildNewsletterMail(email: string, subscribedAt: Date) {
  const { text, html } = renderNotificationMail({
    heading: "뉴스레터 구독 신청이 들어왔어요.",
    timeLabel: "구독 일시",
    time: formatMailTime(subscribedAt),
    rows: [{ label: "이메일", value: email }],
  });
  return { subject: `[뉴스레터 구독] ${email}`, text, html };
}

export function sendNewsletterMail(email: string, subscribedAt: Date): Promise<string> {
  return sendNotificationMail({ from: SENDER, ...buildNewsletterMail(email, subscribedAt) });
}
