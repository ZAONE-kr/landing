import { sanityFetch } from "@/sanity/lib/live";
import {
  formatNoticeDate,
  NOTICE_CATEGORIES,
  noticeHref,
  type NoticeRow,
  type NoticeType,
} from "@/sanity/lib/notices";
import { NOTICE_LIST_QUERY } from "@/sanity/lib/queries";

// 목록 한 줄. 주소와 날짜 글자는 서버에서 만들어 브라우저로 넘긴다.
export type NoticeItem = {
  id: string;
  title: string;
  href: string;
  date: string;
  dateTime: string;
};

export type NoticeLists = Record<NoticeType, NoticeItem[]>;

/*
 * 사업소식·사업보고 게시 글 전부. sanityFetch가 글 문서의 캐시 태그를 페이지에 붙여 Studio에서 게시하면 페이지를 다시
 * 만든다(contact/page.tsx). 실패는 잡지 않는다(인사이트 목록과 같다, src/sanity/lib/insights.ts의 getFirstInsights).
 */
export async function getNoticeLists(): Promise<NoticeLists> {
  const entries = await Promise.all(
    NOTICE_CATEGORIES.map(async ({ type }) => {
      const { data } = await sanityFetch({
        query: NOTICE_LIST_QUERY,
        params: { type },
        perspective: "published",
        stega: false,
      });
      const items = (data as NoticeRow[]).map((row) => ({
        id: row._id,
        // Studio 검사가 빈 제목 게시를 막지만, API로 만든 글은 Studio 목록처럼 "제목 없음"으로 보인다.
        title: row.title?.trim() || "제목 없음",
        href: noticeHref(type, row.slug),
        date: formatNoticeDate(row.publishedAt),
        dateTime: row.publishedAt,
      }));
      return [type, items] as const;
    }),
  );
  return Object.fromEntries(entries) as NoticeLists;
}
