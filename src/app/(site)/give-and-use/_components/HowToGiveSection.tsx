import supplyCtaImage from "@/assets/give-and-use/supply-cta-metal-parts.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { GIVE_FAQ } from "@/sanity/sections/giveAndUse";

import { type FaqCta, FaqSection } from "./FaqSection";

// 데스크톱 사진 틀은 1360px 이상이고 왼쪽에 붙인다. 틀 높이의 37.7%를 위로 올려 사진 가운데쯤을 보인다(1024·1440 시안).
const CTA_IMAGE: Pick<FaqCta, "image" | "imageBoxClassName" | "sizes"> = {
  image: supplyCtaImage,
  imageBoxClassName:
    "inset-0 lg:inset-auto lg:top-0 lg:left-0 lg:aspect-[3/2] lg:w-[max(85rem,100%)] lg:-translate-y-[37.7%]",
  sizes: "(min-width: 1440px) 100vw, (min-width: 1024px) 1360px, 100vw",
};

export async function HowToGiveSection() {
  const { eyebrow, heading, cards, ctaTitle, ctaButton } = await loadSection(GIVE_FAQ);

  return (
    <FaqSection
      id="how-to-give"
      eyebrow={eyebrow}
      heading={heading}
      faqs={cards}
      cta={{ title: ctaTitle, button: ctaButton, ...CTA_IMAGE }}
      className="bg-bg-default"
    />
  );
}
