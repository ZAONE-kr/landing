import "server-only";

import { type Inquiry, inquiryFields } from "@/lib/inquiry";

// 알림 메일 표의 한 줄(폼 순서). 고른 칸은 쉼표로 잇고, 여러 줄 칸은 쓴 줄바꿈을 그대로 둔다.
export function inquiryRows(inquiry: Inquiry): { label: string; value: string }[] {
  return inquiryFields(inquiry.type).map((field) => ({
    label: field.kind === "textarea" ? field.mailLabel : field.label,
    value:
      field.kind === "choices"
        ? (inquiry.values[field.name] ?? []).join(", ")
        : (inquiry.values[field.name] ?? ""),
  }));
}

// 서울 기준 날짜·시각 조각. 한국은 서머타임이 없다.
export function seoulTime(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    weekday: part("weekday"),
    hour: part("hour"),
    minute: part("minute"),
  };
}

/*
 * 시험 접수인지. 실제 사이트(Vercel production)만 담당자 메일·기록 시트의 본 탭으로 가고, 로컬 개발·미리보기 배포는
 * 개발용 주소와 시트의 "[테스트]" 탭으로 가서 시험 문의가 실제 문의에 섞이지 않는다.
 */
export function isTestInquiry(): boolean {
  return process.env.VERCEL_ENV !== "production";
}
