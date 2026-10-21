import { defineField } from "sanity";

import { buttonField, defineSectionType, textField } from "@/sanity/fields";
import {
  ABOUT_CREATIVE_REUSE,
  ABOUT_CREATIVITY_QUESTION,
  ABOUT_HERO,
  ABOUT_IMPERFECTION,
  ABOUT_MANUFACTURING,
} from "@/sanity/sections/about";

// 원 하나. 원 안은 좁아서 글자 수를 짧게 묶는다.
function circleField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    options: { collapsible: false },
    fields: [
      textField({ name: "title", title: "원 제목", max: 14 }),
      textField({ name: "description", title: "원 안 설명", max: 55, rows: 3 }),
    ],
  });
}

export const aboutSectionTypes = [
  defineSectionType(ABOUT_HERO, [textField({ name: "title", title: "한 문장", max: 50 })]),
  defineSectionType(ABOUT_IMPERFECTION, [
    textField({ name: "title", title: "제목", max: 80, rows: 2 }),
    textField({ name: "first", title: "첫 문단", max: 260, rows: 5 }),
    textField({ name: "second", title: "둘째 문단", max: 520, rows: 8 }),
  ]),
  defineSectionType(ABOUT_CREATIVITY_QUESTION, [
    textField({ name: "title", title: "질문", max: 50 }),
    textField({ name: "sub", title: "한 줄 설명", max: 50 }),
  ]),
  defineSectionType(ABOUT_MANUFACTURING, [
    textField({ name: "title", title: "큰 제목", max: 80, rows: 2 }),
    textField({ name: "firstTitle", title: "위 덩어리 소제목", max: 90, rows: 2 }),
    textField({ name: "firstBody", title: "위 덩어리 본문", max: 440, rows: 7 }),
    textField({
      name: "secondTitle",
      title: "아래 덩어리 소제목",
      description: "시안에 문구가 없어 위 소제목을 복사해 둔 상태예요. 실제 문구로 바꿔 주세요.",
      max: 90,
      rows: 2,
    }),
    textField({ name: "secondBody", title: "아래 덩어리 본문", max: 560, rows: 8 }),
    textField({
      name: "imageAlt",
      title: "사진 설명",
      description: "눈이 불편한 방문자에게 읽어 주는 글이에요. 사진에 무엇이 보이는지 적어 주세요.",
      max: 100,
    }),
  ]),
  defineSectionType(ABOUT_CREATIVE_REUSE, [
    textField({ name: "title", title: "제목", max: 30 }),
    textField({ name: "body", title: "소개 글", max: 220, rows: 5 }),
    buttonField({ name: "button", title: "버튼" }),
    textField({ name: "centerName", title: "가운데 이름", max: 20 }),
    textField({ name: "centerDescription", title: "가운데 설명", max: 50, rows: 2 }),
    circleField("circleTop", "원 1 (맨 위)"),
    circleField("circleLeft", "원 2 (왼쪽 위)"),
    circleField("circleRight", "원 3 (오른쪽 위)"),
    circleField("circleBottomLeft", "원 4 (왼쪽 아래)"),
    circleField("circleBottomRight", "원 5 (오른쪽 아래)"),
  ]),
];
