import { defineQuery } from "next-sanity";

import { ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 게시된 카드 태그 문서에서 카드별 태그만 꺼낸다. 문서가 없으면 null이다.
export const ZAONE_LAB_FIELD_TAGS_QUERY = defineQuery(
  `*[_id == $id][0]{${ZAONE_LAB_FIELDS.map((field) => field.key).join(", ")}}`,
);
