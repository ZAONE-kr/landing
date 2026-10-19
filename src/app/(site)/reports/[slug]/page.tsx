import type { Metadata } from "next";

import { loadNotice, noticeMetadata } from "@/components/notice/notice";
import { NoticeDetail } from "@/components/notice/NoticeDetail";
import { BUSINESS_REPORT } from "@/sanity/postCategories";

/*
 * 사업보고 상세. 화면은 사업소식과 같다(src/components/notice/NoticeDetail.tsx).
 * 캐시 방식도 같다(news/[slug]/page.tsx). 이 설정은 Next가 파일마다 읽어서 나눠 쓸 수 없다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/reports/[slug]">): Promise<Metadata> {
  return noticeMetadata(BUSINESS_REPORT, await loadNotice(BUSINESS_REPORT.type, params));
}

export default async function BusinessReportPage({ params }: PageProps<"/reports/[slug]">) {
  const notice = await loadNotice(BUSINESS_REPORT.type, params);
  return <NoticeDetail category={BUSINESS_REPORT} notice={notice} />;
}
