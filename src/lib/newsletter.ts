/*
 * 홈 뉴스레터 구독. 폼(브라우저)과 구독 라우트 핸들러(서버)가 함께 쓴다. 그래서 양쪽에서 쓸 수 있는 모듈(이메일
 * 검사)만 불러온다.
 */

import { isEmail } from "./email";

export const NEWSLETTER_API_PATH = "/api/newsletter";

// 구독 라우트 핸들러가 받는 본문(브라우저가 보낸다).
export type NewsletterRequest = {
  email: string;
  // 사람 눈에 안 보이는 칸. 채워져 있으면 자동 입력 프로그램으로 보고 조용히 버린다.
  website?: string;
};

// 붙여 넣을 때 섞여 들어오는 보이지 않는 글자(너비 없는 공백 등)와 앞뒤 공백을 뺀다.
export function cleanEmail(value: string): string {
  return value.replace(/[\p{Cf}\p{Cc}]/gu, "").trim();
}

/*
 * 받은 본문을 다시 검사한다. 누구나 브라우저를 거치지 않고 보낼 수 있으니 화면과 같은 규칙을 서버에서도 건다.
 * 모양이 맞지 않으면 null이다.
 */
export function parseNewsletterRequest(body: unknown): { email: string; isBot: boolean } | null {
  if (typeof body !== "object" || body === null) return null;
  const { email: rawEmail, website } = body as Record<string, unknown>;
  if (typeof rawEmail !== "string") return null;
  const email = cleanEmail(rawEmail);
  if (!isEmail(email)) return null;
  return { email, isBot: typeof website === "string" && website !== "" };
}
