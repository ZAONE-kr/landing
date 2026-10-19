import "server-only";

import { INQUIRY_FORMS, type Inquiry, type InquiryFieldName } from "@/lib/inquiry";

import { isTestInquiry, seoulTime } from "./rows";

/*
 * 문의 기록 시트. 단체 구글 시트에 붙인 Apps Script 웹 앱(docs/inquiry-sheet/Code.gs)에 한 줄을 보내면, "문의" 탭에
 * 머리줄 이름대로 맞춰 넣는다. 네 종류를 한 탭에 시간순으로 모으고(사용자 결정, 2026-10-19) "문의 종류" 열로 나눈다.
 * 운영자가 시트에서 열(처리 상태 등)을 더하거나 순서를 바꿔도 된다.
 * 웹 앱 주소(INQUIRY_SHEET_URL)와 비밀값(INQUIRY_SHEET_SECRET, 스크립트 속성 SECRET과 같은 값)은 서버 환경 변수에만 둔다.
 */

// Apps Script는 처음 부를 때 몇 초씩 걸리기도 한다.
const SAVE_TIMEOUT_MS = 15_000;

// 접수 일시는 시트에서 정렬되도록 "2026-10-19 14:32" 모양으로 둔다.
function formatReceivedAt(date: Date): string {
  const { year, month, day, hour, minute } = seoulTime(date);
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 시험 접수는 "[테스트] 문의" 탭에 따로 쌓인다(Code.gs).
const SHEET_NAME = "문의";

/*
 * 문의 칸의 시트 열 이름. 이 순서대로 열이 생긴다: 모든 문의에 있는 칸을 앞에, 종류마다 다른 칸을 뒤에 둔다.
 * 사용 문의 폼만 "기관명"이라 부르는 칸도 같은 열에 넣는다. 문의 칸이 늘면 여기에 열을 더해야 타입 검사를 지난다.
 */
const SHEET_COLUMNS = {
  organization: "기업 또는 기관명",
  name: "담당자명",
  email: "이메일",
  phone: "연락처",
  department: "소속/부서",
  region: "이용지역",
  collaborationAreas: "관심 있는 협력 분야",
  educationTargets: "교육 대상",
  useTargets: "주요 이용 대상",
  resource: "자원 설명",
  plan: "활용 계획",
} satisfies Record<InquiryFieldName, string>;

/*
 * 시트 한 줄. 첫 접수가 어느 종류든 머리줄이 같은 순서로 생기도록 해당 없는 칸도 빈 값으로 모두 보낸다.
 * 고른 칸은 쉼표로 잇는다.
 */
export function inquirySheetRow(inquiry: Inquiry, receivedAt: Date) {
  const fields = Object.entries(SHEET_COLUMNS) as [InquiryFieldName, string][];
  return {
    sheet: SHEET_NAME,
    test: isTestInquiry(),
    columns: [
      { label: "접수 일시", value: formatReceivedAt(receivedAt) },
      { label: "문의 종류", value: INQUIRY_FORMS[inquiry.type].title },
      ...fields.map(([name, label]) => {
        const value = inquiry.values[name];
        return { label, value: Array.isArray(value) ? value.join(", ") : (value ?? "") };
      }),
      { label: "개인정보 수집·이용 동의", value: "동의함" },
    ],
  };
}

/*
 * 시트에 한 줄 더한다. 주소·비밀값이 없으면(아직 시트를 붙이지 않음) 건너뛰고 "skipped"다. 웹 앱이 거절하거나
 * 응답하지 않으면 던진다. Apps Script는 오류도 200으로 답해서 본문의 ok로 판단한다.
 */
export async function saveInquiryToSheet(
  inquiry: Inquiry,
  receivedAt: Date,
): Promise<"saved" | "skipped"> {
  const url = process.env.INQUIRY_SHEET_URL?.trim();
  const secret = process.env.INQUIRY_SHEET_SECRET?.trim();
  if (!url || !secret) return "skipped";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, ...inquirySheetRow(inquiry, receivedAt) }),
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
