import { after } from "next/server";

import { parseInquiryRequest } from "@/lib/inquiry";

import { isCrossSite } from "../_lib/submission";
import { sendInquiryMail } from "./mail";
import { saveInquiryToSheet } from "./sheet";

/*
 * CONTACT 페이지 문의 접수. 브라우저가 폼 값을 JSON으로 보내면 다시 검사하고, 담당자 알림 메일과 기록 시트 저장을
 * 함께 시작한다. 둘 중 하나라도 되면 접수된 것으로 답한다.
 * 문의자는 메일(Resend, 1초 안쪽)만 기다린다. 시트(Apps Script)는 몇 초씩 걸리기도 해서, 메일이 되면 바로 답하고
 * 시트 저장은 응답을 보낸 뒤 마저 끝낸다(after). 메일이 실패하면 시트가 유일한 기록이라 그때만 시트를 기다린다.
 * 둘 다 안 되면 문의자에게 다시 시도하라고 알린다.
 * Server Action이 아니라 라우트 핸들러로 둔 이유: 배포하면 Server Action 주소가 바뀌어, 배포 전에 열어 둔 페이지에서
 * 긴 문의를 다 쓰고 보내면 "Failed to find Server Action"으로 실패한다. 이 주소는 배포해도 그대로다.
 */

// 응답 뒤의 시트 저장까지 이 시간 안에 끝난다(메일 10초·시트 15초 제한, mail.ts·../_lib/sheet.ts).
export const maxDuration = 30;

// 폼 값은 많아야 수 KB다. 큰 본문은 읽기 전에 거절한다.
const MAX_BODY_BYTES = 32 * 1024;

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
  const parsed = parseInquiryRequest(body);
  if (!parsed) {
    return Response.json({ error: "입력한 내용을 확인해주세요." }, { status: 400 });
  }
  // 자동 입력 프로그램에는 받은 것처럼 답해서 다른 방법을 찾지 않게 한다.
  if (parsed.isBot) {
    return Response.json({ ok: true });
  }

  const receivedAt = new Date();
  const sheet = saveInquiryToSheet(parsed.inquiry, receivedAt).catch((error: unknown) => {
    console.error("[inquiry] 문의를 시트에 저장하지 못했습니다.", error);
    return "failed" as const;
  });
  after(() => sheet);

  try {
    await sendInquiryMail(parsed.inquiry, receivedAt);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[inquiry] 문의 알림 메일을 보내지 못했습니다.", error);
  }
  if ((await sheet) === "saved") {
    return Response.json({ ok: true });
  }
  return Response.json({ error: "문의를 보내지 못했습니다." }, { status: 502 });
}
