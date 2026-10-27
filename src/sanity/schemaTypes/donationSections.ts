import { defineField } from "sanity";

import {
  buttonField,
  cardsField,
  defineSectionType,
  isCustomCard,
  photoField,
  textField,
} from "@/sanity/fields";
import {
  DONATION_CTA,
  DONATION_HERO,
  DONATION_MISSION,
  DONATION_PARTICIPATION,
  DONATION_USES,
  DONATION_WORK,
} from "@/sanity/sections/donation";

const IMAGE_ALT = "사진 설명";
const IMAGE_ALT_HELP =
  "눈이 불편한 방문자에게 읽어 주는 글이에요. 사진에 무엇이 보이는지 적어 주세요.";

// 버튼 주소는 Donus 후원 결제 페이지다. 다른 사이트 주소라 새 탭으로 열린다.
const DONATE_BUTTON_HELP = "누르면 Donus 후원 결제 페이지가 새 탭으로 열려요.";

// '우리가 하는 일' 한 면. 본문은 Enter로 문단을 나눈다.
function workBlockField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    options: { collapsible: false },
    fields: [
      textField({ name: "lead", title: "굵은 문장", max: 80, lineBreaks: true }),
      textField({
        name: "body",
        title: "본문",
        description: "Enter를 누르면 문단이 나뉘어요.",
        max: 420,
        rows: 6,
      }),
    ],
  });
}

export const donationSectionTypes = [
  defineSectionType(DONATION_HERO, [
    textField({ name: "title", title: "제목", max: 40, lineBreaks: true }),
    textField({ name: "body", title: "소개 글", max: 120, rows: 3 }),
    buttonField({ name: "button", title: "버튼", description: DONATE_BUTTON_HELP }),
    textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(DONATION_MISSION, [
    textField({
      name: "text",
      title: "미션 문장",
      description: "모바일에서는 Enter와 상관없이 화면 너비에 맞춰 나뉘어요.",
      max: 120,
      lineBreaks: true,
    }),
  ]),
  defineSectionType(DONATION_WORK, [
    textField({ name: "label", title: "작은 제목 (세 면 공통)", max: 20 }),
    workBlockField("first", "첫째 면 (흑백 사진)"),
    workBlockField("second", "둘째 면 (회색 배경)"),
    workBlockField("third", "셋째 면 (흑백 사진)"),
  ]),
  defineSectionType(DONATION_USES, [
    textField({ name: "title", title: "섹션 제목", max: 40 }),
    cardsField({
      title: "카드",
      min: 1,
      max: 6,
      defaults: DONATION_USES.defaults.cards,
      nested: { stats: "donationStat" },
      member: {
        name: "donationUse",
        title: "카드",
        previewTitle: "title",
        fields: [
          textField({ name: "title", title: "카드 제목", max: 40, lineBreaks: true }),
          textField({ name: "body", title: "설명", max: 120, rows: 3 }),
          defineField({
            name: "stats",
            title: "수치 (선택)",
            description:
              "설명 아래에 작은 이름과 큰 숫자로 나와요. 1개면 크게, 2~3개면 나란히 작게 놓여요. 필요 없으면 비워 두세요.",
            type: "array",
            of: [
              {
                type: "object",
                name: "donationStat",
                title: "수치",
                fields: [
                  textField({ name: "label", title: "이름", max: 30, lineBreaks: true }),
                  textField({
                    name: "value",
                    title: "숫자와 단위",
                    description:
                      "숫자는 크게, 단위 글자는 작게 보여요. 예: 8,340만 톤 / 년, 주 1회",
                    max: 16,
                  }),
                ],
                preview: { select: { title: "value", subtitle: "label" } },
              },
            ],
            options: { disableActions: ["duplicate"] },
            validation: (rule) => rule.max(3).error("수치는 3개까지 넣을 수 있어요."),
          }),
          textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
          photoField({
            required: isCustomCard(DONATION_USES.defaults.cards),
            description:
              "비워 두면 지금 사이트의 사진을 그대로 써요. 새로 더한 카드는 꼭 올려야 해요. 컴퓨터 화면에서는 세로가 조금 긴 정사각형, 모바일에서는 가로로 긴 틀(3:2 안팎)에 맞춰 잘려요. 사진을 올린 뒤 점을 끌어 꼭 보여야 할 곳에 놓으세요.",
          }),
        ],
      },
    }),
  ]),
  defineSectionType(DONATION_PARTICIPATION, [
    textField({ name: "title", title: "섹션 제목", max: 30 }),
    cardsField({
      title: "항목",
      min: 1,
      max: 6,
      defaults: DONATION_PARTICIPATION.defaults.cards,
      member: {
        name: "donationParticipation",
        title: "항목",
        previewTitle: "title",
        fields: [
          textField({ name: "title", title: "소제목", max: 40 }),
          textField({ name: "body", title: "설명", max: 120, rows: 3 }),
        ],
      },
    }),
  ]),
  defineSectionType(DONATION_CTA, [
    textField({ name: "title", title: "제목", max: 40, lineBreaks: true }),
    textField({ name: "body", title: "한 줄 글", max: 80, rows: 2 }),
    buttonField({ name: "button", title: "버튼", description: DONATE_BUTTON_HELP }),
  ]),
];
