/*
 * ABOUT 상세 글. ABOUT 페이지 맨 아래 연결 카드(글로벌 네트워크)의 "자세히 보기"가 여는 글이다. 블로그 글과 같은
 * 본문 편집기·상세 템플릿을 쓰지만 목록·게시일·다음 글이 없어 블로그 카테고리(postCategories.ts)와 따로 둔다.
 * Studio의 문서 종류·ABOUT 폴더, 사이트 상세 페이지의 쿼리, 링크를 새 탭으로 열지 정하는 규칙(src/lib/links.ts)이
 * 이 이름과 주소를 함께 쓴다. 다른 패키지를 불러오지 않아 양쪽에서 가볍다.
 */

// type은 저장되는 문서의 _type이다. 바꾸면 이미 쓴 글과 이어지지 않는다.
export const ABOUT_STORY = { type: "aboutStory", title: "ABOUT 상세 글" } as const;

// 상세 페이지 주소의 앞부분. ABOUT 페이지(/about) 아래에 둔다.
export const ABOUT_STORY_PATH = "/about";

// 글 상세 주소. 한글 주소를 그대로 두면 브라우저마다 인코딩 시점이 달라, 링크에서부터 퍼센트 인코딩해 둔다.
export function aboutStoryHref(slug: string): string {
  return `${ABOUT_STORY_PATH}/${encodeURIComponent(slug)}`;
}
