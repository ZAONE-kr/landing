import { buttonField, defineSectionType, textField } from "@/sanity/fields";
import { IMPACT_CHANGE_RECORD, IMPACT_HERO, IMPACT_MEASURE_CHANGE } from "@/sanity/sections/impact";

export const impactSectionTypes = [
  defineSectionType(IMPACT_HERO, [textField({ name: "title", title: "질문", max: 70 })]),
  defineSectionType(IMPACT_MEASURE_CHANGE, [
    textField({ name: "title", title: "제목", max: 120, rows: 3 }),
    textField({ name: "sub", title: "제목 아래 한 줄", max: 100, rows: 2 }),
    textField({ name: "first", title: "본문 첫 문단", max: 150, rows: 3 }),
    textField({ name: "second", title: "본문 둘째 문단", max: 320, rows: 6 }),
  ]),
  defineSectionType(IMPACT_CHANGE_RECORD, [
    textField({ name: "title", title: "제목", max: 50 }),
    textField({ name: "body", title: "소개 글", max: 170, rows: 3 }),
    buttonField({ name: "button", title: "버튼" }),
  ]),
];
