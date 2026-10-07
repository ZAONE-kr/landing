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

// 카드 태그는 Sanity에서 바뀌면 그 태그만 다시 만든다(src/sanity/lib/live.ts). 빌드 때 Sanity에 닿지 못해 코드
// 태그로 만든 페이지는 Sanity 캐시 태그가 없어 그 방법으로 고쳐지지 않으므로, 한 시간마다 다시 만들 기회를 준다.
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
