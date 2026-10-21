import type { Metadata } from "next";

import { pageMetadata } from "@/sanity/lib/seo";

import { ApplicationsSection } from "./_components/ApplicationsSection";
import { ExperienceCtaSection } from "./_components/ExperienceCtaSection";
import { LabHeroSection } from "./_components/LabHeroSection";
import { MaterialPlaySection, ResponsibilitySection } from "./_components/SplitSections";
import { LearnersSection, QuestionSection } from "./_components/TextSections";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("zaoneLab", "/zaone-lab");
}

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
