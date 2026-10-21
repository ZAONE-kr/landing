import { buttonField, cardsField, defineSectionType, photoField, textField } from "@/sanity/fields";
import {
  IMPACT_CHANGE_RECORD,
  IMPACT_HERO,
  IMPACT_MEASURE_CHANGE,
  IMPACT_STATS,
} from "@/sanity/sections/impact";

export const impactSectionTypes = [
  defineSectionType(IMPACT_HERO, [textField({ name: "title", title: "질문", max: 70 })]),
  defineSectionType(IMPACT_MEASURE_CHANGE, [
    textField({ name: "title", title: "제목", max: 120, rows: 3 }),
    textField({ name: "sub", title: "제목 아래 한 줄", max: 100, rows: 2 }),
    textField({ name: "first", title: "본문 첫 문단", max: 150, rows: 3 }),
    textField({ name: "second", title: "본문 둘째 문단", max: 320, rows: 6 }),
  ]),
  defineSectionType(IMPACT_STATS, [
    cardsField({
      title: "수치 카드",
      min: 1,
      max: 12,
      defaults: IMPACT_STATS.defaults.cards,
      member: {
        name: "impactStat",
        title: "수치 카드",
        previewTitle: "value",
        fields: [
          textField({
            name: "value",
            title: "큰 숫자",
            description:
              "숫자가 들어 있어야 화면에 들어올 때 0부터 세어 올라가요. 예: 35%, 88톤, 52.6%",
            max: 12,
          }),
          textField({ name: "lead", title: "굵은 설명", max: 170, rows: 3 }),
          textField({ name: "body", title: "본문", max: 330, rows: 6 }),
          textField({ name: "source", title: "출처", max: 140, rows: 2 }),
          photoField({
            description:
              "사진이 있는 면은 사진 위에 어두운 막을 씌운 흰 글씨로 나와요. 비워 두면 기본 카드는 지금 사이트의 사진·색을 그대로 쓰고, 새로 더한 카드는 흰 면이에요.",
          }),
        ],
      },
    }),
  ]),
  defineSectionType(IMPACT_CHANGE_RECORD, [
    textField({ name: "title", title: "제목", max: 50 }),
    textField({ name: "body", title: "소개 글", max: 170, rows: 3 }),
    buttonField({ name: "button", title: "버튼" }),
  ]),
];
