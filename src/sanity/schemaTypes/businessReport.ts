import { defineType } from "sanity";

import { BUSINESS_REPORT } from "@/sanity/postCategories";

import {
  bodyField,
  POST_ORDERINGS,
  POST_PREVIEW,
  publishedAtField,
  slugField,
  titleField,
} from "./postFields";

/*
 * 사업보고 글. 아직 시안이 없어 세 카테고리 공통 필드만 둔다. 예전 사이트의 사업보고는 본문 없이 PDF·엑셀 첨부만
 * 있었는데, 첨부 파일 칸은 시안이 나오면 더한다.
 */
export const businessReportType = defineType({
  name: BUSINESS_REPORT.type,
  title: BUSINESS_REPORT.title,
  type: "document",
  fields: [titleField, slugField, publishedAtField, bodyField],
  orderings: POST_ORDERINGS,
  preview: POST_PREVIEW,
});
