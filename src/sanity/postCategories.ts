/*
 * 블로그 글 카테고리. 카테고리마다 Sanity 문서 종류가 따로 있고, 본문 편집기는 셋이 같다(schemaTypes/postBody.ts).
 * 인사이트만 상세 페이지 시안이 나와 고정 필드가 더 있다. 사업소식·사업보고는 시안이 나오면 필드를 더한다.
 * Studio의 문서 종류·왼쪽 목록과, 나중에 글을 보여 줄 사이트 페이지의 쿼리가 이 이름을 함께 쓴다.
 * 다른 패키지를 불러오지 않아 양쪽에서 가볍다.
 */

// type은 저장되는 문서의 _type이다. 바꾸면 이미 쓴 글과 이어지지 않는다.
export const INSIGHT = { type: "insight", title: "인사이트" } as const;
export const BUSINESS_NEWS = { type: "businessNews", title: "사업소식" } as const;
export const BUSINESS_REPORT = { type: "businessReport", title: "사업보고" } as const;

// Studio 왼쪽 목록에 놓이는 순서다(structure.ts).
export const POST_CATEGORIES = [INSIGHT, BUSINESS_NEWS, BUSINESS_REPORT] as const;
