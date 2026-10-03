import supplyCtaImage from "@/assets/give-and-use/supply-cta-metal-parts.jpg";

import { type Faq, type FaqCta, FaqSection } from "./FaqSection";

const MOBILE_BR = "lg:hidden";
const DESKTOP_BR = "hidden lg:inline";

const FAQS: Faq[] = [
  {
    question: "어떤 휴면자원을 공급할 수 있나요?",
    answer:
      "원부자재, 부산물, 규격 외 자원, 재고 등 기업이 더 이상 사용하지 않는 자원을 검토합니다. 자원의 종류뿐 아니라 상태, 성분, 오염 여부, 형태와 크기 등을 함께 확인해 교육 재료로 활용할 수 있는지 판단합니다. 공급 가능 여부가 궁금하다면 자원의 사진과 기본 정보를 먼저 보내주시면 검토할 수 있습니다.",
  },
  {
    question: (
      <>
        일회성으로 발생하거나 정기적으로
        <br /> 발생하는 자원 모두 공급할 수 있나요?
      </>
    ),
    answer:
      "모두 검토할 수 있습니다. 한 번 발생한 자원은 수량과 상태에 따라 공급 가능 여부를 확인하고, 일정한 자원이 반복적으로 발생하는 경우에는 발생 주기와 수량을 바탕으로 지속적인 공급 방식을 협의합니다. 정기적으로 발생하는 자원은 안정적인 교육 재료 공급 기반을 만드는 데 특히 중요합니다.",
  },
  {
    question: (
      <>
        휴면자원 공급은
        <br className={MOBILE_BR} /> 어떤 과정으로 진행되나요?
      </>
    ),
    answer: (
      <>
        처음 문의할 때 모든 정보를 완벽하게 준비할 필요는 없습니다.
        <br className={DESKTOP_BR} /> 사진과 소재, 대략적인 수량을 알려주시면 검토를 시작할 수
        있습니다.
      </>
    ),
    steps: [
      { title: "자원 정보 전달", description: "종류 · 소재 · 상태 ·\n수량 · 발생 주기 확인" },
      { title: "활용 가능성 검토", description: "물성과 상태,\n교육적 활용 가능성 확인" },
      { title: "공급 방식 협의", description: "수량 · 일정 · 운송 방식 협의" },
      {
        title: "ZAONE 입고 및 분류",
        description: "입고된 자원의 분류, 세척 및\n재단과 가공 등의 관리",
      },
      {
        title: "교육·문화·복지 현장에 제공",
        description: "학교, 돌봄 기관, 복지기관,\n도서관, 문화공간 등에 제공",
      },
    ],
  },
  {
    question: "휴면자원의 운송은 어떻게 진행되나요?",
    answer:
      "기업의 소재지와 자원의 수량, 발생 주기 등을 확인한 뒤 적합한 운송 방식과 일정을 협의합니다. 일회성 공급과 정기 공급은 필요한 운송 방식이 다를 수 있기 때문에 자원 검토 후 구체적인 방법을 안내합니다.",
  },
  {
    // 모바일과 데스크톱 시안이 서로 다른 자리에서 줄을 바꾼다.
    question: (
      <>
        휴면자원 공급을 기업의 ESG·
        <br className={MOBILE_BR} />
        사회공헌에
        <br className={DESKTOP_BR} /> 어떻게 활용할 수 있나요?
      </>
    ),
    answer:
      "공급된 휴면자원은 실제 교육·문화·복지 현장에서 재료로 사용됩니다. 기업은 자사에서 발생한 자원을 활용해 미래세대 교육, 지역사회 프로그램, 임직원 참여 등 기업의 사회공헌 목적에 맞는 프로젝트를 ZAONE과 함께 설계할 수 있습니다. 또한 관련 법령과 기준에 따라 현물기부로 처리하고 기부금 영수증을 발급할 수 있으며, 프로젝트의 성격에 따라 자원의 활용 과정과 결과를 함께 기록할 수 있습니다.",
  },
];

// 데스크톱 사진 틀은 1360px 이상이고 왼쪽에 붙인다. 틀 높이의 37.7%를 위로 올려 사진 가운데쯤을 보인다(1024·1440 시안).
// TODO: 문의 버튼이 갈 곳을 아직 받지 못해 문의하기 페이지로 보낸다.
const CTA: FaqCta = {
  title: "휴면자원을 공급하시겠어요?",
  button: { label: "휴면자원 공급 문의하기", href: "/contact" },
  image: supplyCtaImage,
  imageBoxClassName:
    "inset-0 lg:inset-auto lg:top-0 lg:left-0 lg:aspect-[3/2] lg:w-[max(85rem,100%)] lg:-translate-y-[37.7%]",
  sizes: "(min-width: 1440px) 100vw, (min-width: 1024px) 1360px, 100vw",
};

export function HowToGiveSection() {
  return (
    <FaqSection
      id="how-to-give"
      eyebrow="HOW TO GIVE"
      faqs={FAQS}
      cta={CTA}
      className="bg-bg-default"
    />
  );
}
