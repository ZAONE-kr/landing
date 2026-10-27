import "server-only";

import { INQUIRY_FORMS, type Inquiry, type InquiryFieldName } from "@/lib/inquiry";

import { appendSheetRow, formatSheetTime, type SheetRow } from "../_lib/sheet";
import { isTestSubmission } from "../_lib/submission";

/*
 * 문의 기록 시트의 "문의" 탭(시트에 보내는 방법은 ../_lib/sheet.ts). 네 종류를 한 탭에 시간순으로 모으고(사용자 결정,
 * 2026-10-19) "문의 종류" 열로 나눈다. 운영자가 시트에서 열(처리 상태 등)을 더하거나 순서를 바꿔도 된다.
 */

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
export function inquirySheetRow(inquiry: Inquiry, receivedAt: Date): SheetRow {
  const fields = Object.entries(SHEET_COLUMNS) as [InquiryFieldName, string][];
  return {
    sheet: SHEET_NAME,
    test: isTestSubmission(),
    columns: [
      { label: "접수 일시", value: formatSheetTime(receivedAt) },
      { label: "문의 종류", value: INQUIRY_FORMS[inquiry.type].title },
      ...fields.map(([name, label]) => {
        const value = inquiry.values[name];
        return { label, value: Array.isArray(value) ? value.join(", ") : (value ?? "") };
      }),
      { label: "개인정보 수집·이용 동의", value: "동의함" },
    ],
  };
}

// 시트에 한 줄 더한다. 시트를 아직 붙이지 않았으면 "skipped"이고, 저장하지 못하면 던진다.
export function saveInquiryToSheet(
  inquiry: Inquiry,
  receivedAt: Date,
): Promise<"saved" | "skipped"> {
  return appendSheetRow(inquirySheetRow(inquiry, receivedAt));
}
