import type { Metadata } from "next";

import { pageMetadata } from "@/sanity/lib/seo";

import { ChangeRecordSection } from "./_components/ChangeRecordSection";
import { ImpactHeroSection } from "./_components/ImpactHeroSection";
import { ImpactStatsSection } from "./_components/ImpactStatsSection";
import { MeasureChangeSection } from "./_components/MeasureChangeSection";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("impact", "/impact");
}

export default function ImpactPage() {
  return (
    <main>
      <ImpactHeroSection />
      <MeasureChangeSection />
      <ImpactStatsSection />
      <ChangeRecordSection />
    </main>
  );
}
