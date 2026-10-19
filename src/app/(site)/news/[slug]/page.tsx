import type { Metadata } from "next";

import { loadNotice, noticeMetadata } from "@/components/notice/notice";
import { NoticeDetail } from "@/components/notice/NoticeDetail";
import { BUSINESS_NEWS } from "@/sanity/postCategories";

/*
 * 사업소식 상세. 화면은 사업보고와 같다(src/components/notice/NoticeDetail.tsx).
 * 글은 처음 열릴 때 만들어 두고 Sanity에서 바뀌면 다시 만든다(insights/[slug]/page.tsx와 같은 방식).
 * Studio 알림을 놓친 게시는 한 시간마다 다시 만들 때 반영된다. 그래서 Sanity 데이터는 Next 데이터 캐시에 두지 않는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  return noticeMetadata(BUSINESS_NEWS, await loadNotice(BUSINESS_NEWS.type, params));
}

export default async function BusinessNewsPage({ params }: PageProps<"/news/[slug]">) {
  const notice = await loadNotice(BUSINESS_NEWS.type, params);
  return <NoticeDetail category={BUSINESS_NEWS} notice={notice} />;
}
