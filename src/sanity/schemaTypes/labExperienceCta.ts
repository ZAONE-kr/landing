import { buttonField, defineSectionType, textField } from "@/sanity/fields";
import { LAB_EXPERIENCE_CTA } from "@/sanity/sections/labExperienceCta";

export const labExperienceCtaType = defineSectionType(LAB_EXPERIENCE_CTA, [
  textField({ name: "title", title: "제목", max: 40 }),
  textField({ name: "body", title: "소개 글", max: 120, rows: 3 }),
  buttonField({ name: "programsButton", title: "첫째 버튼 (왼쪽·위)" }),
  buttonField({ name: "inquiryButton", title: "둘째 버튼 (오른쪽·아래)" }),
]);
