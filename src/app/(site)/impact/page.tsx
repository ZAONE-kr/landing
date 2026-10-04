import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { ImpactHeroSection } from "./_components/ImpactHeroSection";
import { ImpactStatsSection } from "./_components/ImpactStatsSection";

const title = "IMPACT - 자원(ZAONE)";
const description =
  "자원(ZAONE)은 재사용량만으로 프로젝트의 변화를 설명하지 않습니다. 자원의 전환량과 폐기 감소, 기업의 인식 변화, 참여자의 인식과 역량, 행동의 변화를 함께 기록합니다.";

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/impact",
  },
  openGraph: pageOpenGraph({ url: "/impact", title, description }),
};

export default function ImpactPage() {
  return (
    <main>
      <ImpactHeroSection />
      <ImpactStatsSection />
    </main>
  );
}
