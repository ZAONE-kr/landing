import membershipCtaImage from "@/assets/give-and-use/membership-cta-child-tubes.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { USE_FAQ } from "@/sanity/sections/giveAndUse";

import { type FaqCta, FaqSection } from "./FaqSection";

/*
 * 375 시안은 이 배너에도 공급 배너의 공장 사진을 그대로 썼다. 1024 시안이 아이 사진으로 바꿔 두어서
 * 모바일도 아이 사진을 쓴다. 모바일은 아이 얼굴과 휴지심이 보이게 위쪽을 자른다.
 * 데스크톱 사진 틀은 배너 폭에 맞추고, 틀 높이의 26.7%를 위로 올린다(1024·1440 시안).
 */
const CTA_IMAGE: Pick<FaqCta, "image" | "imageBoxClassName" | "imageClassName" | "sizes"> = {
  image: membershipCtaImage,
  imageBoxClassName:
    "inset-0 lg:inset-auto lg:top-0 lg:left-0 lg:aspect-[3/4] lg:w-full lg:-translate-y-[26.7%]",
  imageClassName: "object-[50%_40%] lg:object-center",
  sizes: "(min-width: 1440px) 1360px, (min-width: 1024px) calc(100vw - 5rem), 100vw",
};

export async function HowToUseSection() {
  const { eyebrow, heading, cards, ctaTitle, ctaButton } = await loadSection(USE_FAQ);

  return (
    <FaqSection
      id="how-to-use"
      eyebrow={eyebrow}
      heading={heading}
      faqs={cards}
      cta={{ title: ctaTitle, button: ctaButton, ...CTA_IMAGE }}
      className="bg-bg-surface"
    />
  );
}
