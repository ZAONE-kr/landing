import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { AboutHeroSection } from "./_components/AboutHeroSection";
import { CreativityQuestionSection } from "./_components/CreativityQuestionSection";
import { ImperfectionSection } from "./_components/ImperfectionSection";

const title = "ABOUT - 자원(ZAONE)";
const description =
  "자원(ZAONE)은 산업 현장에서 사용 가치를 찾지 못해 버려진 자원을 다시 사회와 교육의 장으로 연결합니다.";

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: pageOpenGraph({ url: "/about", title, description }),
};

// 기존 사이트(zaone.org, 아임웹)와 같은 주소를 쓴다.
export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <ImperfectionSection />
      <CreativityQuestionSection />
    </main>
  );
}
