import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";

import { GiveOrUseSection } from "./_components/GiveOrUseSection";
import { GiveUseHeroSection } from "./_components/GiveUseHeroSection";

const title = "GIVE & USE - 자원(ZAONE)";
const description =
  "자원(ZAONE)은 기업의 휴면자원을 발굴해 교육·문화·복지 현장에 제공합니다. 휴면자원의 공급과 사용, 교육과 훈련을 하나의 체계로 운영합니다.";

// canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/give-and-use",
  },
  openGraph: pageOpenGraph({ url: "/give-and-use", title, description }),
};

export default function GiveAndUsePage() {
  return (
    <main>
      <GiveUseHeroSection />
      <GiveOrUseSection />
    </main>
  );
}
