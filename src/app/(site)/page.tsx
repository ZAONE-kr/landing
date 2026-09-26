import { BrandVideoSection } from "./_components/BrandVideoSection";
import { ClimateStorySection } from "./_components/ClimateStorySection";
import { DormantResourceSection, EnvironmentSection } from "./_components/FeatureSections";
import { HeroSection } from "./_components/HeroSection";
import { InsightsSection } from "./_components/InsightsSection";
import { NewsletterSection } from "./_components/NewsletterSection";
import { PathwaysSection } from "./_components/PathwaysSection";
import { SupporterMarquee } from "./_components/SupporterMarquee";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ClimateStorySection />
      <BrandVideoSection />
      <EnvironmentSection />
      <DormantResourceSection />
      <PathwaysSection />
      <InsightsSection />
      <SupporterMarquee />
      <NewsletterSection />
    </main>
  );
}
