import type { SanityImageSource } from "@/sanity/lib/image";

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

export type ImpactStat = {
  // 코드의 기본 카드와 이어 주는 이름(stat-35 등). 새로 더한 카드는 Studio가 붙인 임의의 값이다.
  _key: string;
  // 큰 숫자. 숫자가 들어 있으면 화면에 들어올 때 0부터 세어 올라가고, 앞뒤 글자(%, 톤)는 그대로 둔다.
  value: string;
  lead: string;
  body: string;
  source: string;
  // 운영자가 올린 사진. 기본 카드는 코드의 사진과 색을 쓰고, 새 카드는 비워 두면 흰 면이다.
  photo: SanityImageSource | null;
};

export const IMPACT_STATS: SectionMeta<{ cards: ImpactStat[] }> = {
  id: "impactStats",
  page: "impact",
  title: "수치 카드 (큰 숫자가 나오는 면들)",
  where:
    "IMPACT 페이지 가운데, 큰 숫자와 설명이 한 면씩 위아래로 이어지는 부분이에요. 사진이 있는 면과 흰 면이 섞여 있어요. 카드는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 새로 더한 카드는 사진을 올리지 않으면 흰 면이에요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    cards: [
      {
        _key: "stat-35",
        value: "35%",
        lead: "사용법이 정해져 있지 않은 휴면자원 기반 활동에서 아동의 주체성은 평균 35% 향상되었습니다.",
        body: "경쟁적 입시와 장시간 학습이 일상을 지배하는 한국에서, 여학생 10명 중 3명, 남학생 5명 중 1명 이상이 최근 1년 동안 2주 내내 일상생활을 중단할 정도의 슬픔이나 절망감을 경험했습니다.",
        source: "질병관리청, 2025년 청소년건강행태조사 주요 결과",
        photo: null,
      },
      {
        _key: "stat-34",
        value: "34%",
        lead: "정답과 완성 형태가 정해져 있지 않은 휴면자원 기반 활동에서 아동의 창의성은 평균 34% 향상되었습니다.",
        body: "한국 학생의 약 80%가 사교육에 참여하고 있으며, OECD는 이런 경쟁적 교육환경이 청소년의 정신건강과 삶의 만족도에 부담을 줄 수 있다고 지적하는 가운데, 아이가 정해진 답 밖에서 자유롭게 시도하고 실패할 시간도 점점 좁아질 수 있습니다.",
        source: "교육부, 초중고 사교육비 조사; OECD, Rejuvenating Korea",
        photo: null,
      },
      {
        _key: "stat-49",
        value: "49%",
        lead: "정답이 없는 재료를 함께 탐색하고 구성하는 과정에서 아동의 상호협력성은 평균 49% 향상되었습니다.",
        body: "전 세계 고용주의 61%가 리더십과 사회적 영향력을 핵심 역량으로 꼽았고, AI가 확산될수록 협업을 포함한 인간 중심 역량은 기술과 함께 더 중요해지고 있습니다.",
        source: "World Economic Forum, The Future of Jobs Report 2025",
        photo: null,
      },
      {
        _key: "stat-88",
        value: "88톤",
        lead: "ZAONE은 지금까지 약 88톤의 휴면자원을 폐기 경로에서 꺼내 교육·문화·사회적 자원으로 다시 사용했습니다.",
        // TODO: "비중에 계속 증가해"는 "비중이"의 오타로 보인다. 시안 문구를 그대로 두었다.
        body: "한국의 사업장 배출시설에서는 생산공정 상에서 매년 약 8,400만 톤의 폐기물이 발생하며, 산업 성장과 함께 사업장 폐기물의 비중에 계속 증가해 2020년에는 국가 전체 폐기물의 41.4%를 차지했습니다.",
        source: "환경부, 전국 폐기물 발생 및 처리 현황",
        photo: null,
      },
      {
        _key: "stat-526",
        value: "52.6%",
        lead: "휴면자원을 직접 경험한 임직원은 자사에서 발생하는 폐기물을 사회적 가치로 전환할 수 있는 자원으로 보기 시작했고, 참여자의 52.6%는 폐기물 문제를 제품 설계 단계에서부터 줄여야 한다고 답했습니다.",
        body: "전 세계 온실가스 배출의 55% 이상은 자원을 채굴하고 가공하는 과정에서 발생하며, 고소득 국가는 저소득 국가보다 1인당 6배 많은 자원을 사용하고 10배 큰 기후영향을 만들어냅니다.",
        source: "UNEP, Global Resources Outlook 2024",
        photo: null,
      },
      {
        _key: "stat-867",
        value: "86.7%",
        lead: "휴면자원 프로그램에 참여한 임직원의 86.7%는 제조공정에서 남은 재료가 폐기물이 아니라 교육재료로 전환될 수 있다는 가능성을 인식했습니다.",
        body: "산업폐기물은 대부분 폐기·재활용의 대상으로 관리되고 있지만, 교육·문화·지역사회가 사용할 수 있는 사회적 자원으로 전환하는 경로는 아직 드뭅니다.",
        source: "ZAONE 임팩트 잠재력 오버뷰 2025 (임팩트 리서치랩 측정)",
        photo: null,
      },
      {
        _key: "stat-63",
        value: "63%",
        lead: "휴면자원을 활용한 교육에 60시간 이상 참여한 학습자의 환경행동 역량은 비교집단보다 63% 높게 나타났습니다.",
        body: "전 세계 중등 교육과정의 69%는 기후변화를 언급하지 않았고, UNESCO는 현재의 기후교육 역시 지식 전달에 치우쳐 행동으로 이어지는 학습이 부족하다고 지적합니다.",
        source:
          "UNESCO, Climate change and sustainability in science and social science secondary school curricula",
        photo: null,
      },
    ],
  },
};

export const IMPACT_SECTIONS = [
  IMPACT_HERO,
  IMPACT_MEASURE_CHANGE,
  IMPACT_STATS,
  IMPACT_CHANGE_RECORD,
] as const;
