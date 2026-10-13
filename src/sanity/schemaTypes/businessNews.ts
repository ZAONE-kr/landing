import { defineType } from "sanity";

import { BUSINESS_NEWS } from "@/sanity/postCategories";

import {
  bodyField,
  POST_ORDERINGS,
  POST_PREVIEW,
  publishedAtField,
  slugField,
  titleField,
} from "./postFields";

// 사업소식 글. 아직 시안이 없어 세 카테고리 공통 필드만 둔다. 시안이 나오면 필드를 더한다.
export const businessNewsType = defineType({
  name: BUSINESS_NEWS.type,
  title: BUSINESS_NEWS.title,
  type: "document",
  fields: [titleField, slugField, publishedAtField, bodyField],
  orderings: POST_ORDERINGS,
  preview: POST_PREVIEW,
});
