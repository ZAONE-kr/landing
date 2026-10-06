import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { LabHeroSection } from "./_components/LabHeroSection";
import { MaterialPlaySection } from "./_components/SplitSections";
import { QuestionSection } from "./_components/TextSections";

const title = "ZAONE LAB - 자원(ZAONE)";
const description =
  "ZAONE LAB은 물질과 놀이에서 시작해 스스로 질문하고 방법을 찾는 경험을 만듭니다. 교육현장에서 조직, 지역의 장소까지 누구나 이곳의 학습자가 될 수 있습니다.";

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
    </main>
  );
}
