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
