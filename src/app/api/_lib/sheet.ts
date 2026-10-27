import "server-only";

import { seoulTime } from "./submission";

/*
 * 기록 시트. 단체 구글 시트에 붙인 Apps Script 웹 앱(docs/inquiry-sheet/Code.gs)에 한 줄을 보내면, 보낸 탭에 머리줄
 * 이름대로 맞춰 넣는다. 문의는 "문의" 탭, 뉴스레터 구독은 "뉴스레터 구독" 탭이다(같은 시트 파일, 사용자 결정 2026-10-27).
 * 웹 앱 주소(INQUIRY_SHEET_URL)와 비밀값(INQUIRY_SHEET_SECRET, 스크립트 속성 SECRET과 같은 값)은 서버 환경 변수에만
 * 둔다. 문의 시트를 먼저 붙여서 이름이 INQUIRY_로 시작하지만 뉴스레터도 같은 값을 쓴다.
 */

// Apps Script는 처음 부를 때 몇 초씩 걸리기도 한다.
const SAVE_TIMEOUT_MS = 15_000;

export type SheetRow = {
  // 탭 이름. 시험 접수는 Code.gs가 앞에 "[테스트] "를 붙인 탭에 넣는다.
  sheet: string;
  test: boolean;
  // 머리줄 이름과 값. 처음 보는 이름은 Code.gs가 맨 오른쪽에 새 열로 만든다.
  columns: { label: string; value: string }[];
  // 이 이름의 열에 같은 값(대소문자 무시)이 이미 있으면 Code.gs가 줄을 더하지 않는다.
  unique?: string;
};

// 시트에서 정렬되도록 "2026-10-19 14:32" 모양으로 둔다.
export function formatSheetTime(date: Date): string {
  const { year, month, day, hour, minute } = seoulTime(date);
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/*
 * 시트에 한 줄 더한다. 주소·비밀값이 없으면(아직 시트를 붙이지 않음) 건너뛰고 "skipped"다. 같은 값이 있어 더하지
 * 않은 것도 "saved"다. 웹 앱이 거절하거나 응답하지 않으면 던진다. Apps Script는 오류도 200으로 답해서 본문의 ok로
 * 판단한다.
 */
export async function appendSheetRow(row: SheetRow): Promise<"saved" | "skipped"> {
  const url = process.env.INQUIRY_SHEET_URL?.trim();
  const secret = process.env.INQUIRY_SHEET_SECRET?.trim();
  if (!url || !secret) return "skipped";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, ...row }),
    signal: AbortSignal.timeout(SAVE_TIMEOUT_MS),
  });
  const text = await response.text();
  let result: { ok?: boolean; error?: string } = {};
  try {
    result = JSON.parse(text);
  } catch {
    // 웹 앱 주소가 틀리거나 접근 권한이 "모든 사용자"가 아니면 구글 로그인 HTML이 온다.
  }
  if (!response.ok || result.ok !== true) {
    throw new Error(
      `시트에 저장하지 못했습니다(${response.status}): ${result.error ?? text.slice(0, 200)}`,
    );
  }
  return "saved";
}
