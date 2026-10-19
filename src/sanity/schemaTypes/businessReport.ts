import { defineType } from "sanity";

import { BUSINESS_REPORT } from "@/sanity/postCategories";

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
 * 사업보고 글. 필드와 상세 페이지는 사업소식과 같고(businessNews.ts), 칩 글자와 목록만 다르다.
 * 예전 사이트의 사업보고는 본문 없이 결산 공시 파일(PDF·엑셀)만 있어서, 첨부파일만 올리고 게시할 수 있다.
 */
export const businessReportType = defineType({
  name: BUSINESS_REPORT.type,
  title: BUSINESS_REPORT.title,
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
