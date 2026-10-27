/*
 * Studio "콘텐츠" 목록의 페이지 폴더. 순서가 곧 화면 순서이고, 섹션이 하나도 없는 폴더는 보이지 않는다.
 * 섹션은 src/sanity/sections/index.ts의 SECTIONS에 page로 이 id를 적어 폴더에 넣는다.
 */
export const SITE_PAGES = [
  { id: "home", title: "홈" },
  { id: "about", title: "ABOUT" },
  { id: "give-and-use", title: "GIVE & USE" },
  { id: "impact", title: "IMPACT" },
  { id: "zaone-lab", title: "ZAONE LAB" },
  { id: "donation", title: "후원하기" },
  { id: "common", title: "공통" },
] as const;

export type SitePageId = (typeof SITE_PAGES)[number]["id"];

// 섹션 하나의 Studio 정보. 문서는 하나뿐이고 ID가 id와 같다. defaults는 사이트에 지금 보이는 내용이다.
export type SectionMeta<T extends object = object> = {
  id: string;
  page: SitePageId;
  // Studio 목록과 편집 창 제목.
  title: string;
  // 편집 창 위에 보여 줄 설명. 사이트의 어디에 나오는 내용인지 적는다.
  where: string;
  // 문서가 비어 있거나 Sanity에 닿지 못할 때 쓰고, 문서를 처음 열 때 채워 두는 값.
  defaults: T;
};
