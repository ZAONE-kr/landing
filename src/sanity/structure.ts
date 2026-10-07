import type { StructureResolver } from "sanity/structure";

import { ZAONE_LAB_FIELD_TAGS_ID } from "@/sanity/zaoneLabFields";

/*
 * Studio 왼쪽 목록. 문서 종류별 기본 목록(새로 만들기 버튼이 붙는다) 대신 태그 문서 하나만 연다.
 * id를 직접 준다. 한글 제목에서는 id를 만들지 못해 "`id` is required" 에러가 난다.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .id("content")
    .title("콘텐츠")
    .items([
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
