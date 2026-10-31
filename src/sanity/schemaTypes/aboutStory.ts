import { defineField, defineType } from "sanity";

import { ABOUT_STORY, ABOUT_STORY_PATH } from "@/sanity/aboutStory";

import { bodyField, checkTyping, slugField } from "./postFields";

// 제목은 1024 화면에서 두 줄(한 줄에 14자쯤)까지가 시안 모양이다.
const TITLE_MAX_LENGTH = 30;

/*
 * ABOUT 상세 글. 시안(Figma "ABOUT_상세01_1024px" 1912:5885·1912:6767) 순서: 제목 → 대표이미지 → 본문.
 * 인사이트 상세와 같은 템플릿이고 프로젝트명·파트너·포스터·다음 글이 없다. 목록에 늘어서지 않아 게시일도 없다.
 * ABOUT 페이지의 연결 카드가 주소(/about/…)로 이 글을 연다.
 */
export const aboutStoryType = defineType({
  name: ABOUT_STORY.type,
  title: ABOUT_STORY.title,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      description: `${TITLE_MAX_LENGTH}자 안팎이 알맞아요. 화면 폭에 맞춰 줄이 자동으로 나뉘어요.`,
      validation: (rule) => [
        rule.required().error("제목을 써 주세요."),
        rule
          .max(TITLE_MAX_LENGTH)
          .warning(
            `제목이 ${TITLE_MAX_LENGTH}자를 넘어요. 화면에서 세 줄 이상으로 넘어갈 수 있어요.`,
          ),
        rule.custom(checkTyping),
      ],
    }),
    {
      ...slugField,
      description: `${slugField.description} 여기서 정한 주소는 /about/주소 가 되고, ABOUT 페이지 연결 카드의 '자세히 보기 주소'에 그대로 넣으면 이 글이 새 창으로 열려요. 주소를 바꾸면 카드의 주소도 함께 고쳐 주세요.`,
    },
    defineField({
      name: "mainImage",
      title: "대표이미지",
      type: "image",
      description:
        "제목 아래에 크게 보이는 사진이에요. 가로:세로 = 9:5 틀에 맞춰 잘리니, 점을 끌어 꼭 보여야 할 곳에 놓아 주세요.",
      options: {
        hotspot: {
          // 1024 시안(864×480)과 375 시안(327×182)은 비율이 같다.
          previews: [{ title: "상세 페이지 (864×480)", aspectRatio: 864 / 480 }],
        },
      },
      // 빈 칸과 파일 없는 값을 나눠 잡는다(insight.ts의 대표이미지와 같다).
      validation: (rule) => [
        rule.required().error("대표이미지를 올려 주세요."),
        rule.assetRequired().error("대표이미지를 올려 주세요."),
      ],
    }),
    bodyField,
    // 두 시안의 본문 간격이 달라 글마다 고른다(1% for the Planet은 보통, 레미다는 넓게. 사용자 결정, 2026-10-31).
    defineField({
      name: "bodySpacing",
      title: "본문 간격",
      type: "string",
      description:
        "소제목 아래와 덩어리(문단 묶음·사진) 사이를 얼마나 띄울지 골라요. 컴퓨터 화면에만 적용되고 휴대폰 화면은 같아요.",
      options: {
        list: [
          { title: "보통 (소제목 아래 24px, 덩어리 사이 64px)", value: "normal" },
          { title: "넓게 (소제목 아래 32px, 덩어리 사이 80px)", value: "wide" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
  // 목록에는 제목과 사이트 주소를 보인다. 카드에 넣을 주소를 여기서 바로 볼 수 있게 한글도 인코딩하지 않고 둔다.
  preview: {
    select: { title: "title", slug: "slug.current", media: "mainImage" },
    prepare: ({ title, slug, media }) => ({
      title: title || "제목 없음",
      subtitle: slug ? `${ABOUT_STORY_PATH}/${slug}` : "주소 없음",
      media,
    }),
  },
});
