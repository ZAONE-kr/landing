import { defineField } from "sanity";

import {
  buttonField,
  cardsField,
  defineSectionType,
  hrefField,
  isCustomCard,
  photoField,
  textField,
} from "@/sanity/fields";
import {
  ABOUT_BOARD,
  ABOUT_CREATIVE_REUSE,
  ABOUT_CREATIVITY_QUESTION,
  ABOUT_GLOBAL_NETWORK,
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
    textField({ name: "title", title: "제목", max: 80, lineBreaks: true }),
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
  defineSectionType(ABOUT_BOARD, [
    textField({ name: "title", title: "제목", max: 50, lineBreaks: true }),
    textField({ name: "intro", title: "소개 글", max: 300, rows: 6 }),
    cardsField({
      title: "이사·감사 카드",
      min: 1,
      max: 12,
      defaults: ABOUT_BOARD.defaults.cards,
      member: {
        name: "boardMember",
        title: "이사·감사",
        previewTitle: "name",
        fields: [
          textField({ name: "name", title: "이름", max: 12 }),
          textField({ name: "role", title: "직함", max: 40, lineBreaks: true }),
          textField({ name: "bio", title: "소개 (마우스를 올리면 나와요)", max: 150, rows: 4 }),
          photoField({
            title: "사진",
            required: isCustomCard(ABOUT_BOARD.defaults.cards),
            description:
              "사진 규격: 배경이 투명한 PNG, 카드와 같은 세로로 긴 비율(가로:세로 = 306:420, 예: 612×840px). 사람이 카드 안에서 보일 모습 그대로 배치해 주세요(머리 위가 위에서 25~30% 지점, 몸은 카드 아래까지). 올린 사진은 카드를 꽉 채워 보여서 따로 자르거나 옮길 수 없어요. 기본 카드는 비워 두면 지금 사이트의 사진을 그대로 써요.",
          }),
        ],
      },
    }),
  ]),
  defineSectionType(ABOUT_GLOBAL_NETWORK, [
    textField({ name: "title", title: "제목", max: 50, lineBreaks: true }),
    cardsField({
      title: "연결 카드",
      min: 1,
      max: 6,
      defaults: ABOUT_GLOBAL_NETWORK.defaults.cards,
      member: {
        name: "connection",
        title: "연결 카드",
        previewTitle: "title",
        fields: [
          textField({ name: "title", title: "카드 제목", max: 60, lineBreaks: true }),
          hrefField({
            name: "href",
            title: "자세히 보기 주소",
            description:
              "누르면 열릴 주소예요. ABOUT 상세 글(/about/…)과 다른 사이트(https://…)는 새 창으로 열려요. ABOUT 상세 글의 주소는 ABOUT 폴더 아래 'ABOUT 상세 글' 목록에서 볼 수 있어요.",
          }),
          photoField({
            required: isCustomCard(ABOUT_GLOBAL_NETWORK.defaults.cards),
            description:
              "가로로 긴 사진(가로:세로 = 3:1 안팎)이 잘 맞아요. 왼쪽에 어두운 막이 덮여 글이 읽혀요. 사진을 올린 뒤 점을 끌어 꼭 보여야 할 곳에 놓으세요. 기본 카드는 비워 두면 지금 사이트의 사진을 그대로 써요.",
          }),
        ],
      },
    }),
  ]),
];
