import { CONTACT_FORM_HREF, ZAONE_LAB_PROGRAMS_URL } from "@/lib/links";

import type { SectionMeta } from "./pages";

// ZAONE LAB 페이지(/zaone-lab)의 섹션. 적용 현장 카드는 카드 섹션으로 따로 옮긴다.

export const LAB_HERO: SectionMeta<{ title: string }> = {
  id: "labHero",
  page: "zaone-lab",
  title: "맨 위 (큰 사진과 질문)",
  where:
    "ZAONE LAB 페이지 맨 위, 큰 사진 위에 흰 글씨 질문이 나오는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: { title: "답을 얻는 일이 쉬워질수록, 우리는 무엇을 배워야 할까요?" },
};

export const LAB_QUESTION: SectionMeta<{ intro: string; lead: string; body: string }> = {
  id: "labQuestion",
  page: "zaone-lab",
  title: "교육의 질문 (사진 없는 글)",
  where:
    "맨 위 사진 바로 아래, 사진 없이 글만 있는 부분이에요. 위에서부터 첫 문단, 굵은 문장, 둘째 문단 순서예요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    intro:
      "AI는 지식과 정답에 접근하는 비용을 빠르게 낮추고 있습니다. 그런데 우리는 여전히 이미 답이 있는 문제를 더 빨리, 더 정확하게 풀기 위해 많은 시간과 자원을 사용합니다.",
    lead: "이제 교육의 중심에는 인간이 무엇을 질문하고 무엇을 가치 있게 여길지 스스로 정하는 일이 놓여야 합니다.",
    body: "놀이하고, 의심하고, 자기 질문을 만들고, 다른 사람과 관계 맺으며 판단하는 경험은 기술이 대신할 수 없는 인간의 영역입니다. ZAONE LAB은 특히 아동기를 그 가능성이 가장 선명하게 드러나는 시기로 봅니다. 어린이를 가르침의 대상이 아니라 생각하고 선택하고 세계와 관계 맺는 한 사람으로 대할 때, 교육은 기술을 따라가는 일이 아니라 어떤 인간성과 어떤 사회를 만들어갈 것인지 묻는 일이 됩니다.",
  },
};

export const LAB_MATERIAL_PLAY: SectionMeta<{
  title: string;
  first: string;
  second: string;
  imageAlt: string;
}> = {
  id: "labMaterialPlay",
  page: "zaone-lab",
  title: "물질과 놀이 (남색 배경과 사진)",
  where:
    "남색 배경에 글은 왼쪽, 아이들이 돌을 만지는 사진은 오른쪽에 나오는 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "ZAONE LAB은 그 훈련을 물질과 놀이에서 시작합니다.",
    first:
      "휴면자원에는 정해진 사용법도, 완성해야 할 모양도 없습니다. 직접 만져보고, 움직여보고, 연결해봐야 무엇이 가능한지 알 수 있습니다.",
    second:
      "예상과 다르면 다시 시도하고, 다른 사람이 같은 재료를 전혀 다른 방식으로 사용하는 것을 보며 자신의 생각을 바꾸기도 합니다. 우리는 결과보다 과정, 혼자 해결하는 능력보다 협력과 상호의존, 정답을 따르는 일보다 스스로 방법을 찾는 경험을 중요하게 봅니다.",
    imageAlt: "아이들이 탁자에 둘러앉아 여러 모양의 돌을 만지며 살펴보는 모습",
  },
};

export const LAB_LEARNERS: SectionMeta<{ lead: string; body: string }> = {
  id: "labLearners",
  page: "zaone-lab",
  title: "학습자 (사진 없는 글)",
  where:
    "'ZAONE LAB의 학습자는…'으로 시작하는, 사진 없이 글만 있는 부분이에요. 굵은 문장이 먼저 나오고 그 아래에 본문이 나와요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    lead: "ZAONE LAB의 학습자는 어린이와 교육자에 한정되지 않습니다. 기업의 실무자, 예술가, 지역의 시민, 그리고 호기심 있는 사람이라면 누구나 이곳의 학습자가 될 수 있습니다.",
    body: "ZAONE LAB은 이런 만남을 팀과 조직의 학습에도 가져옵니다. 어린이는 ‘원래 이렇게 한다’는 규칙과 위계에 덜 매여 있습니다. 필요한 사람과 재료를 자유롭게 연결하고, 해보면서 방법을 찾아갑니다. 구성원이 직접 재료를 다루며 고정된 역할과 방식에서 벗어나 협력하는 훈련을 설계하기도 하고, 때로는 놀이와 아동기를 왜 조직의 중요한 의제로 다뤄야 하는지 리더십과 함께 살펴봅니다.",
  },
};

export const LAB_RESPONSIBILITY: SectionMeta<{ title: string; body: string; imageAlt: string }> = {
  id: "labResponsibility",
  page: "zaone-lab",
  title: "책임 (연한 배경과 사진)",
  where:
    "연한 배경에 사진은 왼쪽, 글은 오른쪽에 나오는 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title:
      "우리는 무엇을 만들고 소비하는지, 무엇을 배우고 가르치는지, 그리고 그 과정에서 사람과 환경에 어떤 책임을 갖는지 묻습니다.",
    body: "ZAONE LAB은 UN 2030 Agenda가 다루는 지속가능한 생산과 소비, 교육, 지역사회와 환경의 문제를 우리의 일상과 연결해 살펴봅니다.",
    imageAlt: "공방에서 재봉틀로 가죽 조각을 박는 사람",
  },
};

export type LabExperienceCtaContent = {
  title: string;
  body: string;
  programsButton: { label: string; href: string };
  inquiryButton: { label: string; href: string };
};

export const LAB_EXPERIENCE_CTA: SectionMeta<LabExperienceCtaContent> = {
  id: "labExperienceCta",
  page: "zaone-lab",
  title: "체험 안내 (맨 아래)",
  where:
    "ZAONE LAB 페이지 맨 아래, 파란 배경에 제목·소개 글·버튼 2개가 있는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "ZAONE LAB에서 직접 경험해보세요.",
    body: "개인의 참여부터 교육자와 조직을 위한 훈련까지, 현재 열려 있는 프로그램을 확인할 수 있습니다.",
    programsButton: { label: "현재 프로그램 보기", href: ZAONE_LAB_PROGRAMS_URL },
    inquiryButton: { label: "조직·기관 프로그램 문의하기", href: CONTACT_FORM_HREF.education },
  },
};

export const LAB_SECTIONS = [
  LAB_HERO,
  LAB_QUESTION,
  LAB_MATERIAL_PLAY,
  LAB_LEARNERS,
  LAB_RESPONSIBILITY,
  LAB_EXPERIENCE_CTA,
] as const;
