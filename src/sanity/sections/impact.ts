import type { SectionMeta } from "./pages";

// IMPACT 페이지(/impact)의 섹션. 수치 카드는 카드 섹션으로 따로 옮긴다.

export const IMPACT_HERO: SectionMeta<{ title: string }> = {
  id: "impactHero",
  page: "impact",
  title: "맨 위 (큰 사진과 질문)",
  where:
    "IMPACT 페이지 맨 위, 큰 사진 가운데에 흰 글씨 질문이 나오는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: { title: "자원이 버려지지 않는 것만으로 충분한 변화일까요?" },
};

export const IMPACT_MEASURE_CHANGE: SectionMeta<{
  title: string;
  sub: string;
  first: string;
  second: string;
}> = {
  id: "impactMeasureChange",
  page: "impact",
  title: "변화 측정 (스크롤하면 글이 밝아지는 부분)",
  where:
    "맨 위 사진 아래, 어두운 배경에서 스크롤할 때 글자가 하나씩 밝아지는 부분이에요. 제목 아래 한 줄과 본문 두 문단이 밝아져요. 글을 바꿔도 밝아지는 효과는 그대로 따라가요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "사회문제는 하나의 성과지표만으로 설명하기 어려울 만큼 복잡하게 연결되어 있습니다.",
    sub: "ZAONE은 재사용량만으로 프로젝트의 변화를 설명하지 않습니다.",
    first:
      "자원의 전환량과 폐기 감소, 자원을 바라보는 기업의 인식과 의사결정 변화를 함께 기록합니다.",
    second:
      "교육 재료로 전환된 이후에는 참여자의 인식과 역량, 행동이 어떻게 달라지는지 측정합니다. 기업이 투입한 자원과 활동이 실제로 어떤 환경·교육적 변화를 만들었는지 확인할 수 있도록 데이터를 축적합니다.",
  },
};

export const IMPACT_CHANGE_RECORD: SectionMeta<{
  title: string;
  body: string;
  button: { label: string; href: string };
}> = {
  id: "impactChangeRecord",
  page: "impact",
  title: "변화 기록 (맨 아래)",
  where:
    "IMPACT 페이지 맨 아래, 스크롤하면 사진이 화면 가득 펼쳐지고 제목·소개 글·버튼이 올라오는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "변화는 한 번의 결과로 끝나지 않습니다.",
    body: "ZAONE은 현장에서 확인한 변화와 데이터를 계속 축적하고, 그 과정에서 발견한 질문과 인사이트를 기록합니다.",
    button: { label: "데이터와 변화의 기록 보기", href: "/insights" },
  },
};

export const IMPACT_SECTIONS = [IMPACT_HERO, IMPACT_MEASURE_CHANGE, IMPACT_CHANGE_RECORD] as const;
