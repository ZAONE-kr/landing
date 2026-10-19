import { BUSINESS_NEWS, BUSINESS_REPORT } from "@/sanity/postCategories";

/*
 * 사업소식·사업보고(CONTACT 페이지의 "공지사항"). 두 종류는 필드와 상세 페이지가 같고 주소와 칩 글자만 다르다.
 * 상세 페이지와 CONTACT 페이지의 공지사항 목록이 이 주소·날짜 모양을 함께 쓴다.
 */
export const NOTICE_CATEGORIES = [BUSINESS_NEWS, BUSINESS_REPORT] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];
export type NoticeType = NoticeCategory["type"];

// 상세 페이지 주소의 앞부분. 주소(slug)는 종류마다 따로 겹치지 않으므로 종류가 주소에 들어가야 한다.
const NOTICE_PATHS: Record<NoticeType, string> = {
  [BUSINESS_NEWS.type]: "/news",
  [BUSINESS_REPORT.type]: "/reports",
};

// 이전 글·다음 글 한 줄(queries.ts의 NOTICE_ROW_FIELDS).
export type NoticeRow = {
  _id: string;
  title: string | null;
  slug: string;
  publishedAt: string;
};

// 글 상세 주소. 한글 주소를 그대로 두면 브라우저마다 인코딩 시점이 달라, 링크에서부터 퍼센트 인코딩해 둔다.
export function noticeHref(type: NoticeType, slug: string): string {
  return `${NOTICE_PATHS[type]}/${encodeURIComponent(slug)}`;
}

// 게시일(YYYY-MM-DD)을 시안 모양("2026. 10. 19")으로. 모양이 다르면 받은 그대로 둔다.
export function formatNoticeDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return match ? `${match[1]}. ${match[2]}. ${match[3]}` : date;
}
