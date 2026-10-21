import type { StructureResolver } from "sanity/structure";

import { POST_CATEGORIES } from "@/sanity/postCategories";
import { NEWEST_FIRST } from "@/sanity/schemaTypes/postFields";
import { SECTIONS } from "@/sanity/sections";
import { SITE_PAGES } from "@/sanity/sections/pages";
import { ZAONE_LAB_FIELD_TAGS_ID } from "@/sanity/zaoneLabFields";

/*
 * Studio 왼쪽 목록. 블로그 카테고리 셋을 위에 두고, 줄을 그은 뒤 페이지별 폴더를 둔다. 폴더를 열면 그 페이지에서
 * 고칠 수 있는 섹션이 하나씩 나오고, 섹션 하나가 문서 하나다(src/sanity/sections).
 * 카테고리는 문서 종류별 기본 목록이라 오른쪽 위에 새 글 버튼이 붙는다. 처음에는 게시일 최신순으로 늘어선다.
 * id를 직접 준다. 한글 제목에서는 id를 만들지 못해 "`id` is required" 에러가 난다.
 */
export const structure: StructureResolver = (S) => {
  // 문서가 하나뿐인 종류를 바로 편집 창으로 연다. 문서 ID는 종류 이름과 같다.
  const singleton = (id: string, title: string) =>
    S.listItem().id(id).title(title).child(S.document().schemaType(id).documentId(id).title(title));

  const pageFolders = SITE_PAGES.flatMap((page) => {
    const items = SECTIONS.filter((section) => section.page === page.id).map((section) =>
      singleton(section.id, section.title),
    );
    // 카드 태그는 아직 카드 섹션으로 옮기지 않아 ZAONE LAB 폴더에 따로 둔다.
    if (page.id === "zaone-lab") items.push(singleton(ZAONE_LAB_FIELD_TAGS_ID, "카드 태그"));
    if (items.length === 0) return [];
    return [
      S.listItem()
        .id(page.id)
        .title(page.title)
        .child(S.list().id(page.id).title(page.title).items(items)),
    ];
  });

  return S.list()
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
      ...pageFolders,
    ]);
};
