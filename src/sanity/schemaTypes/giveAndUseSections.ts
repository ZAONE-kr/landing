import { buttonField, defineSectionType, textField } from "@/sanity/fields";
import { GIVE_PANEL, GIVE_USE_HERO, USE_PANEL } from "@/sanity/sections/giveAndUse";

const panelTextFields = [
  textField({ name: "title", title: "제목", max: 40 }),
  textField({ name: "description", title: "설명", max: 340, rows: 6 }),
  textField({ name: "check1", title: "확인 문구 (첫째 줄)", max: 90, rows: 2 }),
  textField({ name: "check2", title: "확인 문구 (둘째 줄)", max: 110, rows: 2 }),
  textField({
    name: "faqLabel",
    title: "자주 묻는 질문 링크 글",
    description: "누르면 이 페이지 아래의 자주 묻는 질문으로 내려가요.",
    max: 30,
  }),
];

export const giveAndUseSectionTypes = [
  defineSectionType(GIVE_USE_HERO, [
    textField({ name: "title", title: "제목", max: 70, rows: 2 }),
    textField({ name: "first", title: "소개 글 첫 문단", max: 220, rows: 4 }),
    textField({ name: "second", title: "소개 글 둘째 문단", max: 80, rows: 2 }),
  ]),
  defineSectionType(GIVE_PANEL, [
    ...panelTextFields,
    buttonField({ name: "button", title: "버튼" }),
  ]),
  defineSectionType(USE_PANEL, [
    ...panelTextFields,
    buttonField({ name: "primaryButton", title: "첫째 버튼 (진한 색)" }),
    buttonField({ name: "secondaryButton", title: "둘째 버튼 (흰색)" }),
  ]),
];
