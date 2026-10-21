import { defineField } from "sanity";

import {
  buttonField,
  cardsField,
  defineSectionType,
  optionalLinkField,
  photoField,
  textField,
} from "@/sanity/fields";
import {
  GIVE_FAQ,
  GIVE_PANEL,
  GIVE_USE_HERO,
  SOCIAL_PROJECTS,
  USE_FAQ,
  USE_PANEL,
} from "@/sanity/sections/giveAndUse";

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

// 자주 묻는 질문 목록. 두 질문 섹션이 같은 입력칸을 쓴다.
function faqFields(defaults: typeof GIVE_FAQ.defaults) {
  return [
    textField({ name: "eyebrow", title: "작은 영문 제목", max: 20 }),
    textField({ name: "heading", title: "제목", max: 30 }),
    cardsField({
      title: "질문",
      min: 1,
      max: 12,
      defaults: defaults.cards,
      nested: { steps: "faqStep" },
      member: {
        name: "faq",
        title: "질문",
        previewTitle: "question",
        fields: [
          textField({ name: "question", title: "질문", max: 80, rows: 2 }),
          textField({ name: "answer", title: "답변", max: 560, rows: 8 }),
          optionalLinkField({
            name: "link",
            title: "답변 아래 링크 (선택)",
            description: "필요 없으면 둘 다 비워 두세요.",
          }),
          defineField({
            name: "steps",
            title: "답변 아래 단계 (선택)",
            description:
              "번호가 붙은 단계로 나와요. 필요 없으면 비워 두세요. 6단계까지 넣을 수 있어요.",
            type: "array",
            of: [
              {
                type: "object",
                name: "faqStep",
                title: "단계",
                fields: [
                  textField({ name: "title", title: "단계 제목", max: 30 }),
                  textField({ name: "description", title: "단계 설명", max: 80, lineBreaks: true }),
                ],
                preview: { select: { title: "title" } },
              },
            ],
            options: { disableActions: ["duplicate"] },
            validation: (rule) => rule.max(6).error("단계는 6개까지 넣을 수 있어요."),
          }),
        ],
      },
    }),
    textField({ name: "ctaTitle", title: "사진 배너 제목", max: 40 }),
    buttonField({ name: "ctaButton", title: "사진 배너 버튼" }),
  ];
}

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
  defineSectionType(GIVE_FAQ, faqFields(GIVE_FAQ.defaults)),
  defineSectionType(USE_FAQ, faqFields(USE_FAQ.defaults)),
  defineSectionType(SOCIAL_PROJECTS, [
    textField({ name: "title", title: "제목", max: 50, lineBreaks: true }),
    textField({ name: "intro", title: "소개 글", max: 230, rows: 5 }),
    textField({ name: "lead", title: "카드 목록 위 굵은 문장", max: 110, rows: 3 }),
    buttonField({ name: "button", title: "문의 버튼 (컴퓨터 화면에서만 보여요)" }),
    cardsField({
      title: "프로젝트 카드",
      min: 1,
      max: 8,
      defaults: SOCIAL_PROJECTS.defaults.cards,
      member: {
        name: "socialProject",
        title: "프로젝트",
        previewTitle: "title",
        fields: [
          textField({ name: "title", title: "프로젝트 이름", max: 40, rows: 2 }),
          textField({ name: "description", title: "설명", max: 230, rows: 5 }),
          photoField({
            required: (card) =>
              !card?._key || !SOCIAL_PROJECTS.defaults.cards.some((c) => c._key === card._key),
            description:
              "비워 두면 지금 사이트의 사진을 그대로 써요. 새로 더한 카드는 꼭 올려야 해요. 사진은 3:2 가로 비율로 잘려요.",
          }),
        ],
      },
    }),
  ]),
];
