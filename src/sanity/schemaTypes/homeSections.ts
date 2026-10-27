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
import { COMMON_FOOTER, COMMON_PAGE_SEO } from "@/sanity/sections/common";
import {
  HOME_CLIMATE_STORY,
  HOME_DORMANT_RESOURCE,
  HOME_ENVIRONMENT,
  HOME_HERO,
  HOME_INSIGHTS,
  HOME_NEWSLETTER,
  HOME_PATHWAYS,
  HOME_SUPPORTERS,
} from "@/sanity/sections/home";

const IMAGE_ALT_HELP =
  "눈이 불편한 방문자에게 읽어 주는 글이에요. 사진에 무엇이 보이는지 적어 주세요.";

// 검색 결과에 보이는 제목과 설명. 구글은 제목을 60자, 설명을 160자 안팎에서 잘라 보여 준다.
function seoField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    options: { collapsible: false },
    fields: [
      textField({ name: "title", title: "제목", max: 60 }),
      textField({ name: "description", title: "설명", max: 160, rows: 3 }),
    ],
  });
}

const featureFields = [
  textField({ name: "title", title: "제목", max: 80, lineBreaks: true }),
  textField({ name: "first", title: "첫 문단", max: 360, rows: 6 }),
  textField({ name: "second", title: "둘째 문단", max: 360, rows: 6 }),
  textField({ name: "imageAlt", title: "사진 설명", description: IMAGE_ALT_HELP, max: 100 }),
];

export const homeSectionTypes = [
  defineSectionType(HOME_HERO, [
    textField({ name: "title", title: "제목", max: 60, lineBreaks: true }),
    textField({ name: "first", title: "소개 글 첫 문단", max: 160, rows: 4 }),
    textField({ name: "second", title: "소개 글 둘째 문단", max: 100, rows: 3 }),
    buttonField({ name: "button", title: "버튼" }),
    textField({ name: "imageAlt", title: "사진 설명", description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(HOME_CLIMATE_STORY, [
    textField({ name: "first", title: "첫 문단", max: 180, rows: 4 }),
    textField({ name: "title", title: "굵은 제목", max: 80, lineBreaks: true }),
    textField({ name: "second", title: "둘째 문단", max: 260, rows: 5 }),
    textField({ name: "third", title: "셋째 문단", max: 440, rows: 8 }),
  ]),
  defineSectionType(HOME_ENVIRONMENT, featureFields),
  defineSectionType(HOME_DORMANT_RESOURCE, featureFields),
  defineSectionType(HOME_INSIGHTS, [
    textField({ name: "title", title: "제목", max: 40, lineBreaks: true }),
    textField({ name: "description", title: "소개 글", max: 110, lineBreaks: true }),
    cardsField({
      title: "인사이트 카드",
      min: 1,
      max: 6,
      defaults: HOME_INSIGHTS.defaults.cards,
      member: {
        name: "homeInsight",
        title: "인사이트 카드",
        previewTitle: "title",
        fields: [
          textField({ name: "category", title: "분류 (영문)", max: 20 }),
          textField({ name: "title", title: "글 제목", max: 50, lineBreaks: true }),
          defineField({
            name: "readingMinutes",
            title: "읽는 시간 (분)",
            type: "number",
            validation: (rule) => [
              rule.required().error("읽는 시간을 써 주세요."),
              rule.integer().error("정수로 써 주세요."),
              rule.min(1).max(60).error("1~60분 사이로 써 주세요."),
            ],
          }),
          hrefField({
            name: "href",
            title: "연결할 글 주소",
            description: "블로그 글의 주소 전체를 붙여 넣어요. 예: https://blog.zaone.org/…",
          }),
          photoField({
            required: (card) =>
              !card?._key || !HOME_INSIGHTS.defaults.cards.some((c) => c._key === card._key),
            description:
              "비워 두면 지금 사이트의 사진을 그대로 써요. 새로 더한 카드는 꼭 올려야 해요.",
          }),
        ],
      },
    }),
    buttonField({ name: "button", title: "맨 아래 버튼 (모든 인사이트 보기)" }),
  ]),
  defineSectionType(HOME_PATHWAYS, [
    textField({ name: "title", title: "제목", max: 40 }),
    textField({ name: "description", title: "소개 글", max: 130, rows: 3 }),
    cardsField({
      title: "활용 경로 카드",
      min: 1,
      max: 6,
      defaults: HOME_PATHWAYS.defaults.cards,
      member: {
        name: "pathway",
        title: "활용 경로 카드",
        previewTitle: "audience",
        fields: [
          textField({ name: "audience", title: "분류 (영문)", max: 40 }),
          textField({ name: "title", title: "카드 제목", max: 60, lineBreaks: true }),
          textField({ name: "cta", title: "버튼 글", max: 20 }),
          hrefField({ name: "href", title: "버튼을 누르면 갈 주소" }),
          photoField({
            required: isCustomCard(HOME_PATHWAYS.defaults.cards),
            description:
              "세로로 긴 사진이 잘 맞아요(컴퓨터 화면에서 가로:세로 = 500:640). 사진을 올린 뒤 점을 끌어 꼭 보여야 할 곳에 놓으세요. 아래쪽에 어두운 막이 덮여 글이 읽혀요. 기본 카드는 비워 두면 지금 사이트의 사진을 그대로 써요.",
          }),
        ],
      },
    }),
  ]),
  defineSectionType(HOME_SUPPORTERS, [
    cardsField({
      title: "기관 로고",
      min: 4,
      max: 30,
      defaults: HOME_SUPPORTERS.defaults.cards,
      member: {
        name: "supporter",
        title: "기관 로고",
        previewTitle: "name",
        fields: [
          textField({
            name: "name",
            title: "기관 이름",
            description: "화면에는 안 보이고, 눈이 불편한 방문자에게 읽어 줘요.",
            max: 30,
          }),
          photoField({
            title: "로고",
            required: isCustomCard(HOME_SUPPORTERS.defaults.cards),
            description:
              "로고 규격: 가로로 긴 상자 비율(가로:세로 = 206:80, 예: 412×160px) 안에 로고를 위아래·좌우 여백을 두고 가운데 놓은 PNG(투명 또는 흰 배경)예요. 올린 로고는 상자 안에 통째로 보여요. 기본 기관은 비워 두면 지금 사이트의 로고를 그대로 써요.",
          }),
        ],
      },
    }),
  ]),
  defineSectionType(HOME_NEWSLETTER, [
    textField({ name: "title", title: "제목", max: 60, lineBreaks: true }),
    textField({ name: "body", title: "소개 글", max: 100, rows: 3 }),
    textField({
      name: "emailLabel",
      title: "입력칸 이름 (화면에는 안 보임)",
      description: "눈이 불편한 방문자에게 읽어 주는 이름이에요.",
      max: 20,
    }),
    textField({ name: "placeholder", title: "입력칸 안내 글", max: 30 }),
    textField({ name: "button", title: "버튼 글", max: 12 }),
    textField({
      name: "doneMessage",
      title: "구독 완료 알림 글",
      description:
        "구독하기를 누르고 신청이 저장되면 뜨는 알림창의 글이에요. Enter로 줄을 바꿀 수 있어요.",
      max: 80,
      rows: 2,
    }),
    textField({
      name: "errorMessage",
      title: "구독 실패 알림 글",
      description:
        "인터넷이 끊기는 등으로 신청을 저장하지 못했을 때 뜨는 알림창의 글이에요. Enter로 줄을 바꿀 수 있어요.",
      max: 80,
      rows: 2,
    }),
  ]),
  defineSectionType(COMMON_PAGE_SEO, [
    seoField("about", "ABOUT 페이지"),
    seoField("giveAndUse", "GIVE & USE 페이지"),
    seoField("impact", "IMPACT 페이지"),
    seoField("zaoneLab", "ZAONE LAB 페이지"),
    seoField("donation", "후원하기 페이지"),
  ]),
  defineSectionType(COMMON_FOOTER, [
    textField({ name: "copyright", title: "저작권 글", max: 60 }),
    hrefField({
      name: "instagramUrl",
      title: "인스타그램 주소",
      description: "https://로 시작하는 주소 전체를 붙여 넣어요.",
    }),
    hrefField({
      name: "youtubeUrl",
      title: "유튜브 주소",
      description: "https://로 시작하는 주소 전체를 붙여 넣어요.",
    }),
    textField({ name: "organization", title: "단체 이름", max: 40 }),
    textField({ name: "representative", title: "대표", max: 30 }),
    textField({ name: "businessNumber", title: "사업자등록번호", max: 40 }),
    textField({ name: "email", title: "메일 주소", max: 60 }),
    textField({ name: "address", title: "주소", max: 80 }),
    textField({ name: "phone", title: "전화번호", max: 30 }),
  ]),
];
