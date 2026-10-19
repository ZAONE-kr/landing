import { defineType } from "sanity";

import { BUSINESS_NEWS } from "@/sanity/postCategories";

import {
  attachmentsField,
  noticeBodyField,
  POST_ORDERINGS,
  POST_PREVIEW,
  posterImageField,
  publishedAtField,
  slugField,
  titleField,
} from "./postFields";

/*
 * 사업소식 글. 상세 페이지 시안(Figma "[1017] CONTACT 작업중" 1555:5653)은 사업보고와 같다: 칩 → 제목 → 게시일까지
 * 꼭 채우고, 첨부파일·본문 사진·포스터는 있을 때만 보인다. 본문과 첨부파일 중 하나는 있어야 한다.
 */
export const businessNewsType = defineType({
  name: BUSINESS_NEWS.type,
  title: BUSINESS_NEWS.title,
  type: "document",
  fields: [
    titleField,
    slugField,
    publishedAtField,
    attachmentsField,
    noticeBodyField,
    posterImageField,
  ],
  orderings: POST_ORDERINGS,
  preview: POST_PREVIEW,
});
