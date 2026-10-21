import { CONTACT_FORM_HREF, ZAONE_LAB_PROGRAMS_URL } from "@/lib/links";
import type { SanityImageSource } from "@/sanity/lib/image";

import type { SectionMeta } from "./pages";

// GIVE & USE 페이지(/give-and-use)의 섹션. 자주 묻는 질문과 프로젝트 카드는 카드 섹션으로 따로 옮긴다.

export const GIVE_USE_HERO: SectionMeta<{ title: string; first: string; second: string }> = {
  id: "giveUseHero",
  page: "give-and-use",
  title: "맨 위 (천 사진과 소개)",
  where:
    "GIVE & USE 페이지 맨 위, 천 사진 위에 제목과 소개 글 두 문단이 나오는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "기업의 휴면자원을 발굴해 교육·문화·복지 현장에 제공합니다.",
    first:
      "ZAONE은 기업이 보유한 휴면자원 가운데 교육적으로 활용할 수 있는 재료를 검토하고 분류해, 학교와 교육·돌봄기관, 복지기관, 도서관·문화공간 등이 사용할 수 있도록 제공합니다.",
    second: "휴면자원의 공급과 사용, 교육과 훈련을 하나의 체계로 운영합니다.",
  },
};

type PanelText = {
  title: string;
  description: string;
  check1: string;
  check2: string;
  // 같은 페이지의 자주 묻는 질문으로 가는 링크 글.
  faqLabel: string;
};

export const GIVE_PANEL: SectionMeta<PanelText & { button: { label: string; href: string } }> = {
  id: "giveOrUseGive",
  page: "give-and-use",
  title: "공급 안내 (왼쪽 연한 파란 면)",
  where:
    "GIVE & USE 페이지에서 '휴면자원을 가지고 있다면'으로 시작하는 왼쪽(모바일은 위쪽) 면이에요. 제목, 설명, 확인 문구 두 줄, 자주 묻는 질문 링크 글, 버튼 한 개를 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "휴면자원을 가지고 있다면",
    description:
      "생산 과정에서 발생한 부산물, 규격 외 용품, 불량, 재고 등 휴면자원을 공급할 수 있습니다. 자원의 종류와 상태, 수량, 발생 주기를 확인한 뒤 교육 재료로 활용할 수 있는지 검토하고 운송 방식을 협의합니다.",
    check1: "휴면자원의 검토와 공급에는 별도의 비용이 들지 않습니다.",
    check2: "관련 법령과 기준에 따라 현물기부로 처리하여 기부금 영수증을 발급할 수 있습니다.",
    faqLabel: "자주묻는 질문 보러가기",
    button: { label: "휴면자원 공급 문의하기", href: CONTACT_FORM_HREF.supply },
  },
};

export const USE_PANEL: SectionMeta<
  PanelText & {
    primaryButton: { label: string; href: string };
    secondaryButton: { label: string; href: string };
  }
> = {
  id: "giveOrUseUse",
  page: "give-and-use",
  title: "사용 안내 (오른쪽 남색 면)",
  where:
    "GIVE & USE 페이지에서 '휴면자원을 사용하고 싶다면'으로 시작하는 오른쪽(모바일은 아래쪽) 면이에요. 제목, 설명, 확인 문구 두 줄, 자주 묻는 질문 링크 글, 버튼 두 개를 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "휴면자원을 사용하고 싶다면",
    description:
      "학교와 교육·돌봄기관, 복지기관, 도서관·문화공간은 기관 단위 멤버십을 통해 ZAONE LAB을 이용할 수 있습니다. 재료를 직접 탐색하고 선택해 수업, 놀이, 탐구, 제작, 워크숍에 활용합니다.",
    check1: "멤버십은 기관 단위로 운영되는 유료 서비스입니다.",
    check2: "재료를 교육적으로 활용할 수 있도록 교사·기관 대상 교육과 훈련 프로그램을 운영합니다.",
    faqLabel: "자주묻는 질문 보러가기",
    primaryButton: { label: "기관 멤버십 신청하기", href: CONTACT_FORM_HREF.use },
    secondaryButton: { label: "교육·훈련 프로그램 보기", href: ZAONE_LAB_PROGRAMS_URL },
  },
};

export type FaqStepContent = {
  _key: string;
  title: string;
  // 줄바꿈(Enter)은 시안의 줄 위치 그대로다.
  description: string;
};

export type FaqContent = {
  _key: string;
  question: string;
  answer: string;
  // 답변 아래 링크. 글과 주소를 비워 두면 없다.
  link: { label: string; href: string };
  // 답변 아래 번호 단계. 비워 두면 없다.
  steps: FaqStepContent[];
};

type FaqSectionContent = {
  eyebrow: string;
  heading: string;
  cards: FaqContent[];
  ctaTitle: string;
  ctaButton: { label: string; href: string };
};

const NO_LINK = { label: "", href: "" };

export const GIVE_FAQ: SectionMeta<FaqSectionContent> = {
  id: "giveFaq",
  page: "give-and-use",
  title: "공급 자주 묻는 질문",
  where:
    "GIVE & USE 페이지 가운데, '휴면자원을 가지고 있다면' 면 아래 'HOW TO GIVE' 질문 목록과 맨 아래 사진 배너예요. 질문은 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 사진은 지금은 바꿀 수 없어요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    eyebrow: "HOW TO GIVE",
    heading: "자주 묻는 질문",
    cards: [
      {
        _key: "give-q1",
        question: "어떤 휴면자원을 공급할 수 있나요?",
        answer:
          "원부자재, 부산물, 규격 외 자원, 재고 등 기업이 더 이상 사용하지 않는 자원을 검토합니다. 자원의 종류뿐 아니라 상태, 성분, 오염 여부, 형태와 크기 등을 함께 확인해 교육 재료로 활용할 수 있는지 판단합니다. 공급 가능 여부가 궁금하다면 자원의 사진과 기본 정보를 먼저 보내주시면 검토할 수 있습니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "give-q2",
        question: "일회성으로 발생하거나 정기적으로 발생하는 자원 모두 공급할 수 있나요?",
        answer:
          "모두 검토할 수 있습니다. 한 번 발생한 자원은 수량과 상태에 따라 공급 가능 여부를 확인하고, 일정한 자원이 반복적으로 발생하는 경우에는 발생 주기와 수량을 바탕으로 지속적인 공급 방식을 협의합니다. 정기적으로 발생하는 자원은 안정적인 교육 재료 공급 기반을 만드는 데 특히 중요합니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "give-q3",
        question: "휴면자원 공급은 어떤 과정으로 진행되나요?",
        answer:
          "처음 문의할 때 모든 정보를 완벽하게 준비할 필요는 없습니다. 사진과 소재, 대략적인 수량을 알려주시면 검토를 시작할 수 있습니다.",
        link: NO_LINK,
        steps: [
          {
            _key: "step-1",
            title: "자원 정보 전달",
            description: "종류 · 소재 · 상태 ·\n수량 · 발생 주기 확인",
          },
          {
            _key: "step-2",
            title: "활용 가능성 검토",
            description: "물성과 상태,\n교육적 활용 가능성 확인",
          },
          { _key: "step-3", title: "공급 방식 협의", description: "수량 · 일정 · 운송 방식 협의" },
          {
            _key: "step-4",
            title: "ZAONE 입고 및 분류",
            description: "입고된 자원의 분류, 세척 및\n재단과 가공 등의 관리",
          },
          {
            _key: "step-5",
            title: "교육·문화·복지 현장에 제공",
            description: "학교, 돌봄 기관, 복지기관,\n도서관, 문화공간 등에 제공",
          },
        ],
      },
      {
        _key: "give-q4",
        question: "휴면자원의 운송은 어떻게 진행되나요?",
        answer:
          "기업의 소재지와 자원의 수량, 발생 주기 등을 확인한 뒤 적합한 운송 방식과 일정을 협의합니다. 일회성 공급과 정기 공급은 필요한 운송 방식이 다를 수 있기 때문에 자원 검토 후 구체적인 방법을 안내합니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "give-q5",
        question: "휴면자원 공급을 기업의 ESG·사회공헌에 어떻게 활용할 수 있나요?",
        answer:
          "공급된 휴면자원은 실제 교육·문화·복지 현장에서 재료로 사용됩니다. 기업은 자사에서 발생한 자원을 활용해 미래세대 교육, 지역사회 프로그램, 임직원 참여 등 기업의 사회공헌 목적에 맞는 프로젝트를 ZAONE과 함께 설계할 수 있습니다. 또한 관련 법령과 기준에 따라 현물기부로 처리하고 기부금 영수증을 발급할 수 있으며, 프로젝트의 성격에 따라 자원의 활용 과정과 결과를 함께 기록할 수 있습니다.",
        link: NO_LINK,
        steps: [],
      },
    ],
    ctaTitle: "휴면자원을 공급하시겠어요?",
    ctaButton: { label: "휴면자원 공급 문의하기", href: CONTACT_FORM_HREF.supply },
  },
};

export const USE_FAQ: SectionMeta<FaqSectionContent> = {
  id: "useFaq",
  page: "give-and-use",
  title: "사용 자주 묻는 질문",
  where:
    "GIVE & USE 페이지 가운데, '휴면자원을 사용하고 싶다면' 면 아래 'HOW TO USE' 질문 목록과 사진 배너예요. 질문은 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 사진은 지금은 바꿀 수 없어요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    eyebrow: "HOW TO USE",
    heading: "자주 묻는 질문",
    cards: [
      {
        _key: "use-q1",
        question: "어떤 기관이 멤버십을 신청할 수 있나요?",
        answer:
          "학교와 교육·돌봄기관, 복지기관, 도서관·문화공간 등 휴면자원을 교육·문화·복지 목적으로 사용하는 기관이 신청할 수 있습니다. 멤버십은 개인이 아닌 기관 단위로 운영합니다. 교육자 또는 예술가 등의 ‘개인’ 단위로 휴면자원을 활용하고 싶으신 경우 ZAONE LAB에서 운영하는 교육에 참여 후에 보급 협의가 가능합니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "use-q2",
        question: "멤버십 비용과 이용 기간은 어떻게 되나요?",
        answer:
          "ZAONE의 휴면자원 사용은 유료 기관 멤버십으로 운영됩니다. 멤버십 비용과 이용 기간, 이용 범위는 신청 전에 안내합니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "use-q3",
        question: "멤버십을 이용하면 휴면자원을 어떻게 사용할 수 있나요?",
        answer:
          "기관은 ZAONE LAB에서 다양한 휴면자원을 직접 살펴보고 재료의 물성과 형태를 비교하며 필요한 재료를 선택할 수 있습니다. 선택한 재료는 기관으로 가져가 수업, 놀이, 탐구, 제작, 워크숍, 공간 활동 등에 활용할 수 있습니다.",
        link: NO_LINK,
        steps: [],
      },
      {
        _key: "use-q4",
        question: "휴면자원을 활용하는 교육이나 훈련도 받을 수 있나요?",
        answer:
          "네. ZAONE은 재료를 제공하는 데서 끝나지 않고, 교사와 교육자, 기관이 휴면자원의 특성을 이해하고 실제 교육에 활용할 수 있도록 교육과 훈련 프로그램을 운영합니다. 재료 탐색, 개방형 재료의 활용, 교육환경 구성 등 기관의 목적에 맞는 프로그램은 ZAONE LAB에서 확인하고 신청할 수 있습니다.",
        link: { label: "교육·훈련 프로그램 보기", href: ZAONE_LAB_PROGRAMS_URL },
        steps: [],
      },
      {
        _key: "use-q5",
        question: "교육 현장에서 사용할 재료는 어떤 기준으로 검토하나요?",
        answer:
          "ZAONE은 자원의 상태와 오염 여부, 물성, 실제 사용 환경 등을 확인해 교육적 활용에 적합한 자원을 선별합니다. 소재별로 별도의 사용이나 관리 기준이 필요한 경우 기관에 안내합니다.",
        link: NO_LINK,
        steps: [],
      },
    ],
    ctaTitle: "기관에서 휴면자원을 사용하시겠어요?",
    ctaButton: { label: "기관 멤버십 신청하기", href: CONTACT_FORM_HREF.use },
  },
};

export type SocialProject = {
  _key: string;
  title: string;
  description: string;
  // 운영자가 올린 사진. 기본 카드는 비워 두면 코드의 사진을 쓴다.
  photo: SanityImageSource | null;
};

export const SOCIAL_PROJECTS: SectionMeta<{
  title: string;
  intro: string;
  lead: string;
  button: { label: string; href: string };
  cards: SocialProject[];
}> = {
  id: "socialProjects",
  page: "give-and-use",
  title: "사회공헌 프로젝트 (맨 아래 카드)",
  where:
    "GIVE & USE 페이지 맨 아래, 왼쪽(모바일은 위)에 제목과 소개 글, 오른쪽(모바일은 아래)에 프로젝트 사진 카드가 세로로 이어지는 부분이에요. 카드는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 문의 버튼은 컴퓨터 화면에서만 보여요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    title: "휴면자원으로\n사회공헌 프로젝트를\n만듭니다.",
    intro:
      "ZAONE은 제조기업에서 공급받은 휴면자원을 활용해 기업·재단·공공기관과 교육·문화·지역사회 프로젝트를 기획하고 운영합니다. 자사에서 발생한 휴면자원으로 기업만의 사회공헌 프로젝트를 만들 수도 있습니다.",
    lead: "환경, 미래세대, 지역사회를 함께 다루는 사회공헌이 필요하다면, 휴면자원을 매개로 ZAONE과 프로젝트를 설계할 수 있습니다.",
    button: { label: "사회공헌 프로젝트 문의하기", href: CONTACT_FORM_HREF.project },
    cards: [
      {
        _key: "project-future",
        title: "미래세대를 위한 교육 프로젝트",
        description:
          "휴면자원을 활용해 어린이가 직접 만지고, 질문하고, 탐구하는 교육 프로그램을 기획합니다. 기업·재단의 사회공헌 목적, 대상 연령, 지역과 운영 기간에 맞춰 프로그램을 설계할 수 있습니다.",
        photo: null,
      },
      {
        _key: "project-community",
        title: "지역사회를 위한 교육·문화 프로그램",
        description:
          "도서관, 문화시설, 커뮤니티 공간 등 지역의 일상적인 장소에서 휴면자원을 경험할 수 있는 프로그램과 공간 프로젝트를 만듭니다. 지역의 공공기관·재단·기업과 함께 지역 특성과 대상에 맞는 방식으로 기획할 수 있습니다.",
        photo: null,
      },
      {
        _key: "project-employee",
        title: "임직원·고객이 참여하는 사회공헌",
        description:
          "임직원이나 고객이 휴면자원을 직접 경험하고 사회문제와 연결해볼 수 있는 참여형 워크숍과 캠페인을 기획합니다. 일회성 체험에 그치지 않고 실제 교육·지역사회 활동과 연결되는 구조로 설계할 수 있습니다.",
        photo: null,
      },
    ],
  },
};

export const GIVE_AND_USE_SECTIONS = [
  GIVE_USE_HERO,
  GIVE_PANEL,
  USE_PANEL,
  GIVE_FAQ,
  USE_FAQ,
  SOCIAL_PROJECTS,
] as const;
