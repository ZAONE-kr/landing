import type { StructureResolver } from "sanity/structure";

import { POST_CATEGORIES } from "@/sanity/postCategories";
import { NEWEST_FIRST } from "@/sanity/schemaTypes/postFields";
import { ZAONE_LAB_FIELD_TAGS_ID } from "@/sanity/zaoneLabFields";

/*
 * Studio 왼쪽 목록. 블로그 카테고리 셋을 위에 두고, 줄을 그은 뒤 하나뿐인 태그 문서를 연다.
 * 카테고리는 문서 종류별 기본 목록이라 오른쪽 위에 새 글 버튼이 붙는다. 처음에는 게시일 최신순으로 늘어선다.
 * id를 직접 준다. 한글 제목에서는 id를 만들지 못해 "`id` is required" 에러가 난다.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .id("content")
    .title("콘텐츠")
    .items([
      ...POST_CATEGORIES.map(({ type, title }) =>
        S.listItem()
          .id(type)
          .title(title)
          .schemaType(type)
          .child(S.documentTypeList(type).defaultOrdering(NEWEST_FIRST)),
      ),
      S.divider(),
      S.listItem()
        .id(ZAONE_LAB_FIELD_TAGS_ID)
        .title("ZAONE LAB 카드 태그")
        .child(
          S.document()
            .schemaType(ZAONE_LAB_FIELD_TAGS_ID)
            .documentId(ZAONE_LAB_FIELD_TAGS_ID)
            .title("ZAONE LAB 카드 태그"),
        ),
    ]);
