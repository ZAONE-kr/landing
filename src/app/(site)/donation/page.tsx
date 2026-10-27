import type { Metadata } from "next";

import { pageMetadata } from "@/sanity/lib/seo";

import { DonationCtaSection } from "./_components/DonationCtaSection";
import { DonationHeroSection } from "./_components/DonationHeroSection";
import { MissionSection } from "./_components/MissionSection";
import { ParticipationSection } from "./_components/ParticipationSection";
import { UsesSection } from "./_components/UsesSection";
import { WorkSection } from "./_components/WorkSection";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("donation", "/donation");
}

// 기존 사이트(zaone.org, 아임웹)와 같은 주소를 쓴다. 헤더·푸터의 후원하기가 여기로 오고, 페이지의 버튼이 Donus를 연다.
export default function DonationPage() {
  return (
    <main>
      <DonationHeroSection />
      <MissionSection />
      <WorkSection />
      <UsesSection />
      <ParticipationSection />
      <DonationCtaSection />
    </main>
  );
}
