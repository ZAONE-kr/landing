import type { Metadata } from "next";

import { pageMetadata } from "@/sanity/lib/seo";

import { GiveOrUseSection } from "./_components/GiveOrUseSection";
import { GiveUseHeroSection } from "./_components/GiveUseHeroSection";
import { HowToGiveSection } from "./_components/HowToGiveSection";
import { HowToUseSection } from "./_components/HowToUseSection";
import { SocialProjectsSection } from "./_components/SocialProjectsSection";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("giveAndUse", "/give-and-use");
}

export default function GiveAndUsePage() {
  return (
    <main>
      <GiveUseHeroSection />
      <GiveOrUseSection />
      <HowToGiveSection />
      <HowToUseSection />
      <SocialProjectsSection />
    </main>
  );
}
