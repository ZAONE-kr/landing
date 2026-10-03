import membershipCtaImage from "@/assets/give-and-use/membership-cta-child-tubes.jpg";

import { type Faq, type FaqCta, FaqSection } from "./FaqSection";

const FAQS: Faq[] = [
  {
    question: "어떤 기관이 멤버십을 신청할 수 있나요?",
    answer:
      "학교와 교육·돌봄기관, 복지기관, 도서관·문화공간 등 휴면자원을 교육·문화·복지 목적으로 사용하는 기관이 신청할 수 있습니다. 멤버십은 개인이 아닌 기관 단위로 운영합니다. 교육자 또는 예술가 등의 ‘개인’ 단위로 휴면자원을 활용하고 싶으신 경우 ZAONE LAB에서 운영하는 교육에 참여 후에 보급 협의가 가능합니다.",
  },
  {
    question: "멤버십 비용과 이용 기간은 어떻게 되나요?",
    answer:
      "ZAONE의 휴면자원 사용은 유료 기관 멤버십으로 운영됩니다. 멤버십 비용과 이용 기간, 이용 범위는 신청 전에 안내합니다.",
  },
  {
    question: "멤버십을 이용하면 휴면자원을 어떻게 사용할 수 있나요?",
    answer:
      "기관은 ZAONE LAB에서 다양한 휴면자원을 직접 살펴보고 재료의 물성과 형태를 비교하며 필요한 재료를 선택할 수 있습니다. 선택한 재료는 기관으로 가져가 수업, 놀이, 탐구, 제작, 워크숍, 공간 활동 등에 활용할 수 있습니다.",
  },
  {
    question: "휴면자원을 활용하는 교육이나 훈련도 받을 수 있나요?",
    answer:
      "네. ZAONE은 재료를 제공하는 데서 끝나지 않고, 교사와 교육자, 기관이 휴면자원의 특성을 이해하고 실제 교육에 활용할 수 있도록 교육과 훈련 프로그램을 운영합니다. 재료 탐색, 개방형 재료의 활용, 교육환경 구성 등 기관의 목적에 맞는 프로그램은 ZAONE LAB에서 확인하고 신청할 수 있습니다.",
    link: { label: "교육·훈련 프로그램 보기", href: "/zaone-lab" },
  },
  {
    question: "교육 현장에서 사용할 재료는 어떤 기준으로 검토하나요?",
    answer:
      "ZAONE은 자원의 상태와 오염 여부, 물성, 실제 사용 환경 등을 확인해 교육적 활용에 적합한 자원을 선별합니다. 소재별로 별도의 사용이나 관리 기준이 필요한 경우 기관에 안내합니다.",
  },
];

/*
 * 375 시안은 이 배너에도 공급 배너의 공장 사진을 그대로 썼다. 1024 시안이 아이 사진으로 바꿔 두어서
 * 모바일도 아이 사진을 쓴다. 모바일은 아이 얼굴과 휴지심이 보이게 위쪽을 자른다.
 * 데스크톱 사진 틀은 배너 폭에 맞추고, 틀 높이의 26.7%를 위로 올린다(1024·1440 시안).
 */
// TODO: 멤버십 신청이 갈 곳을 아직 받지 못해 문의하기 페이지로 보낸다.
const CTA: FaqCta = {
  title: "기관에서 휴면자원을 사용하시겠어요?",
  button: { label: "기관 멤버십 신청하기", href: "/contact" },
  image: membershipCtaImage,
  imageBoxClassName:
    "inset-0 lg:inset-auto lg:top-0 lg:left-0 lg:aspect-[3/4] lg:w-full lg:-translate-y-[26.7%]",
  imageClassName: "object-[50%_40%] lg:object-center",
  sizes: "(min-width: 1440px) 1360px, (min-width: 1024px) calc(100vw - 5rem), 100vw",
};

export function HowToUseSection() {
  return (
    <FaqSection
      id="how-to-use"
      eyebrow="HOW TO USE"
      faqs={FAQS}
      cta={CTA}
      className="bg-bg-surface"
    />
  );
}
