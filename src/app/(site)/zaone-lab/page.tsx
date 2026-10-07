import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { ApplicationsSection } from "./_components/ApplicationsSection";
import { ExperienceCtaSection } from "./_components/ExperienceCtaSection";
import { LabHeroSection } from "./_components/LabHeroSection";
import { MaterialPlaySection, ResponsibilitySection } from "./_components/SplitSections";
import { LearnersSection, QuestionSection } from "./_components/TextSections";

const title = "ZAONE LAB - 자원(ZAONE)";
const description =
  "ZAONE LAB은 물질과 놀이에서 시작해 스스로 질문하고 방법을 찾는 경험을 만듭니다. 교육현장에서 조직, 지역의 장소까지 누구나 이곳의 학습자가 될 수 있습니다.";

/*
 * 페이지는 정적으로 만들어 두고 카드 태그가 Sanity에서 바뀌면 다시 만든다.
 * - 게시를 Studio(/admin)가 받으면 그 문서의 캐시 태그를 무효화해, 다음 방문 때 새로 만든다(src/sanity/lib/live.ts).
 * - 그 알림을 놓친 게시(게시 직후 Studio 창을 닫음, 배포 전에 연 창, 예약 게시 등)는 한 시간마다 다시 만들 때 반영된다.
 *   그래서 Sanity 데이터는 Next 데이터 캐시에 두지 않는다(force-no-store). 두면 sanityFetch가 무기한으로 저장해 시간
 *   기준으로 다시 만들어도 예전 태그를 다시 쓰고, .next/cache를 남긴 채 다시 빌드하면 예전 태그로 되돌아간다.
 *   force-static은 저장하지 않는 요청이 있어도 페이지를 정적으로 두게 한다. 다시 만들 때마다 Sanity를 한 번 더 읽는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/zaone-lab",
  },
  openGraph: pageOpenGraph({ url: "/zaone-lab", title, description }),
};

export default function ZaoneLabPage() {
  return (
    <main>
      <LabHeroSection />
      <QuestionSection />
      <MaterialPlaySection />
      <LearnersSection />
      <ResponsibilitySection />
      <ApplicationsSection />
      <ExperienceCtaSection />
    </main>
  );
}
