import { defineField, defineType } from "sanity";

import { INSIGHT } from "@/sanity/postCategories";

import {
  bodyField,
  checkTyping,
  POST_ORDERINGS,
  posterImageField,
  publishedAtField,
  slugField,
  titleField,
} from "./postFields";

// 대표이미지 아래 프로젝트 명·파트너 줄. 이보다 길면 값이 여러 줄로 넘어간다.
const PROJECT_NAME_MAX_LENGTH = 40;
const PARTNER_MAX_LENGTH = 80;

/*
 * 인사이트 글. 상세 페이지 시안(Figma "[1012] INSIGHT 상세페이지 전달") 순서: 제목 → 대표이미지 → 프로젝트 명·파트너
 * → 본문 → 포스터이미지 → 다음 인사이트. 포스터이미지만 없어도 되고 나머지는 꼭 채운다(단체 결정, 2026-10-13).
 * 주소·게시일은 화면에 보이지 않고 주소와 순서에 쓴다.
 */
export const insightType = defineType({
  name: INSIGHT.type,
  title: INSIGHT.title,
  type: "document",
  fields: [
    titleField,
    slugField,
    publishedAtField,
    defineField({
      name: "mainImage",
      title: "대표이미지",
      type: "image",
      description:
        "목록과 상세 페이지 상단에 노출되는 대표 이미지, 가급적 16:9 비율의 이미지를 사용해주세요",
      options: {
        hotspot: {
          // 사진이 잘려 보이는 자리마다 미리 본다(1024 시안 크기). 375 화면의 상세(327×182)는 상세와 비율이 같다.
          previews: [
            { title: "상세 페이지 (864×480)", aspectRatio: 864 / 480 },
            { title: "인사이트 목록 카드 (416×280)", aspectRatio: 416 / 280 },
            { title: "다음 인사이트 카드 (277×280)", aspectRatio: 277 / 280 },
          ],
        },
      },
      // 규칙을 나눈다. required는 칸이 빈 것만, assetRequired는 값은 있는데 사진 파일이 없는 것(올리는 중 등)만 잡는다.
      // 한 규칙에 묶으면 빈 칸에서 같은 메시지가 두 번 뜬다.
      validation: (rule) => [
        rule.required().error("대표이미지를 올려 주세요."),
        rule.assetRequired().error("대표이미지를 올려 주세요."),
      ],
    }),
    defineField({
      name: "projectName",
      title: "프로젝트명",
      type: "string",
      placeholder: "예: Dauning Recycle Lab for Kids",
      validation: (rule) => [
        rule.required().error("프로젝트명을 써 주세요."),
        rule
          .max(PROJECT_NAME_MAX_LENGTH)
          .warning(
            `프로젝트명이 ${PROJECT_NAME_MAX_LENGTH}자를 넘어요. 화면에서 여러 줄로 넘어갈 수 있어요.`,
          ),
        rule.custom(checkTyping),
      ],
    }),
    defineField({
      name: "partner",
      title: "파트너",
      type: "string",
      placeholder: "예: REMIDA REGGIO EMILIA, KCCT",
      validation: (rule) => [
        rule.required().error("파트너를 써 주세요."),
        rule
          .max(PARTNER_MAX_LENGTH)
          .warning(
            `파트너가 ${PARTNER_MAX_LENGTH}자를 넘어요. 화면에서 여러 줄로 넘어갈 수 있어요.`,
          ),
        rule.custom(checkTyping),
      ],
    }),
    bodyField,
    posterImageField,
  ],
  orderings: POST_ORDERINGS,
  preview: {
    select: { title: "title", publishedAt: "publishedAt", media: "mainImage" },
    prepare: ({ title, publishedAt, media }) => ({
      title: title || "제목 없음",
      subtitle: publishedAt,
      media,
    }),
  },
});
