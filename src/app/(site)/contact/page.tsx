import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { ContactInquiry } from "./_components/ContactInquiry";
import { NoticeSection } from "./_components/NoticeSection";
import { getNoticeLists } from "./_lib/notices";

const title = "CONTACT - 자원(ZAONE)";
const description =
  "휴면자원 공급·사용, 프로젝트 협력, 교육 프로그램까지 ZAONE과 나누고 싶은 이야기를 남겨주세요.";

/*
 * 페이지는 정적으로 만들어 두고 Sanity에서 사업소식·사업보고를 게시하면 다시 만든다. 캐시 설정은 인사이트 목록과
 * 같다(insights/page.tsx).
 * 고른 카드(?type=)와 공지 탭·쪽(?notice=, ?noticePage=)은 HTML에 기본 상태(첫 카드, 사업소식 첫 쪽)로 그려 두고
 * 브라우저가 주소를 읽어 바꾼다(contact/_lib/url.ts).
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: pageOpenGraph({ url: "/contact", title, description }),
};

export default async function ContactPage() {
  const notices = await getNoticeLists();
  return (
    <main>
      <ContactInquiry />
      <NoticeSection lists={notices} />
    </main>
  );
}
