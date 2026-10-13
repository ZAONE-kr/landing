import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";
import { getFirstInsights } from "@/sanity/lib/insights";

import { InsightListSection } from "./_components/InsightListSection";
import { InsightsHeroSection } from "./_components/InsightsHeroSection";

const title = "INSIGHTS - 자원(ZAONE)";
const description =
  "프로젝트에서 발견한 변화와 질문을 기록합니다. 다른 가능성을 만드는 사람들과의 실험과 배움을 나눕니다.";

/*
 * 페이지는 정적으로 만들어 두고 Sanity에서 인사이트를 게시하면 다시 만든다. 캐시 설정은 ZAONE LAB과 같다
 * (zaone-lab/page.tsx): Studio가 받은 게시는 바로 무효화하고, 놓친 게시는 한 시간마다 다시 만들 때 반영한다.
 * 페이지에는 첫 묶음만 들어 있고, 다음 묶음은 스크롤할 때 브라우저가 /api/insights에서 받는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/insights",
  },
  openGraph: pageOpenGraph({ url: "/insights", title, description }),
};

export default async function InsightsPage() {
  const firstPage = await getFirstInsights();
  return (
    <main>
      <InsightsHeroSection />
      <InsightListSection firstPage={firstPage} />
    </main>
  );
}
