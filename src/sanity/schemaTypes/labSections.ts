import { buttonField, defineSectionType, textField } from "@/sanity/fields";
import {
  LAB_EXPERIENCE_CTA,
  LAB_HERO,
  LAB_LEARNERS,
  LAB_MATERIAL_PLAY,
  LAB_QUESTION,
  LAB_RESPONSIBILITY,
} from "@/sanity/sections/lab";

const IMAGE_ALT = "사진 설명";
const IMAGE_ALT_HELP =
  "눈이 불편한 방문자에게 읽어 주는 글이에요. 사진에 무엇이 보이는지 적어 주세요.";

export const labSectionTypes = [
  defineSectionType(LAB_HERO, [textField({ name: "title", title: "질문", max: 80 })]),
  defineSectionType(LAB_QUESTION, [
    textField({ name: "intro", title: "첫 문단", max: 260, rows: 4 }),
    textField({ name: "lead", title: "굵은 문장", max: 180, rows: 3 }),
    textField({ name: "body", title: "둘째 문단", max: 700, rows: 8 }),
  ]),
  defineSectionType(LAB_MATERIAL_PLAY, [
    textField({ name: "title", title: "제목", max: 80 }),
    textField({ name: "first", title: "첫 문단", max: 220, rows: 4 }),
    textField({ name: "second", title: "둘째 문단", max: 420, rows: 6 }),
    textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(LAB_LEARNERS, [
    textField({ name: "lead", title: "굵은 문장", max: 220, rows: 4 }),
    textField({ name: "body", title: "본문", max: 560, rows: 8 }),
  ]),
  defineSectionType(LAB_RESPONSIBILITY, [
    textField({ name: "title", title: "제목", max: 200, rows: 3 }),
    textField({ name: "body", title: "본문", max: 200, rows: 4 }),
    textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(LAB_EXPERIENCE_CTA, [
    textField({ name: "title", title: "제목", max: 40 }),
    textField({ name: "body", title: "소개 글", max: 120, rows: 3 }),
    buttonField({ name: "programsButton", title: "첫째 버튼 (왼쪽·위)" }),
    buttonField({ name: "inquiryButton", title: "둘째 버튼 (오른쪽·아래)" }),
  ]),
];
