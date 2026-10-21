import { CONTACT_FORM_HREF, ZAONE_LAB_PROGRAMS_URL } from "@/lib/links";

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

export const GIVE_AND_USE_SECTIONS = [GIVE_USE_HERO, GIVE_PANEL, USE_PANEL] as const;
