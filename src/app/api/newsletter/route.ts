import { after } from "next/server";

import { parseNewsletterRequest } from "@/lib/newsletter";

import { appendSheetRow, formatSheetTime } from "../_lib/sheet";
import { isCrossSite, isTestSubmission } from "../_lib/submission";
import { sendNewsletterMail } from "./mail";

/*
 * 홈 뉴스레터 구독 접수. 브라우저가 이메일을 JSON으로 보내면 다시 검사하고, 문의와 같은 기록 시트의 "뉴스레터 구독"
 * 탭에 한 줄 더하고(사용자 결정, 2026-10-27), 담당자에게 알림 메일도 보낸다(사용자 요청, 2026-11-25).
 * 흐름은 문의 접수(../inquiry/route.ts)와 같다. 메일이 되면 바로 답하고 시트 저장은 응답 뒤에 마저 끝낸다(after).
 * 메일이 실패하면 그때만 시트를 기다리고, 둘 다 안 되면 다시 시도하라고 알린다.
 * 이미 있는 이메일은 Code.gs가 시트에 더하지 않는다(알림 메일은 간다). 그래도 똑같이 구독된 것으로 답해서, 어떤
 * 이메일이 구독 중인지 이 주소로 알아낼 수 없게 한다.
 * 문의 접수(../inquiry/route.ts)처럼 Server Action이 아니라 라우트 핸들러로 둔다. 배포해도 주소가 그대로라 배포 전에
 * 열어 둔 페이지에서 보내도 된다.
 */

// 시트 저장(15초)과 메일(10초)을 함께 시작해 응답 뒤의 시트 저장까지 15초 안에 끝난다(../_lib/sheet.ts·../_lib/mail.ts).
export const maxDuration = 20;

// 이메일 하나라 1KB면 넉넉하다. 큰 본문은 읽기 전에 거절한다.
const MAX_BODY_BYTES = 1024;

const SHEET_NAME = "뉴스레터 구독";
const EMAIL_COLUMN = "이메일";

export async function POST(request: Request) {
  if (isCrossSite(request)) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return Response.json({ error: "보낸 내용이 너무 큽니다." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  const parsed = parseNewsletterRequest(body);
  if (!parsed) {
    return Response.json({ error: "이메일 주소를 확인해주세요." }, { status: 400 });
  }
  // 자동 입력 프로그램에는 받은 것처럼 답해서 다른 방법을 찾지 않게 한다.
  if (parsed.isBot) {
    return Response.json({ ok: true });
  }

  const subscribedAt = new Date();
  const sheet = appendSheetRow({
    sheet: SHEET_NAME,
    test: isTestSubmission(),
    columns: [
      { label: "구독 일시", value: formatSheetTime(subscribedAt) },
      { label: EMAIL_COLUMN, value: parsed.email },
    ],
    unique: EMAIL_COLUMN,
  }).then(
    (result) => {
      if (result === "skipped") {
        console.error("[newsletter] 시트 주소·비밀값이 없어 구독을 저장하지 못했습니다.");
      }
      return result;
    },
    (error: unknown) => {
      console.error("[newsletter] 구독을 시트에 저장하지 못했습니다.", error);
      return "failed" as const;
    },
  );
  after(() => sheet);

  try {
    await sendNewsletterMail(parsed.email, subscribedAt);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] 구독 알림 메일을 보내지 못했습니다.", error);
  }
  if ((await sheet) === "saved") {
    return Response.json({ ok: true });
  }
  return Response.json({ error: "구독 신청을 저장하지 못했습니다." }, { status: 502 });
}
