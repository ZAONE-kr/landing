import type { Metadata } from "next";

import { pageMetadata } from "@/sanity/lib/seo";

import { AboutHeroSection } from "./_components/AboutHeroSection";
import { BoardSection } from "./_components/BoardSection";
import { CreativeReuseSection } from "./_components/CreativeReuseSection";
import { CreativityQuestionSection } from "./_components/CreativityQuestionSection";
import { GlobalNetworkSection } from "./_components/GlobalNetworkSection";
import { ImperfectionSection } from "./_components/ImperfectionSection";
import { ManufacturingSection } from "./_components/ManufacturingSection";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about", "/about");
}

// 기존 사이트(zaone.org, 아임웹)와 같은 주소를 쓴다.
export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <ImperfectionSection />
      <CreativityQuestionSection />
      <ManufacturingSection />
      <CreativeReuseSection />
      <BoardSection />
      <GlobalNetworkSection />
    </main>
  );
}
