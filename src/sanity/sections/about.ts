import type { SectionMeta } from "./pages";

// ABOUT 페이지(/about)의 섹션. 이사회와 글로벌 네트워크 카드는 카드 섹션으로 따로 옮긴다.

export const ABOUT_HERO: SectionMeta<{ title: string }> = {
  id: "aboutHero",
  page: "about",
  title: "맨 위 (돌 사진과 한 줄)",
  where:
    "ABOUT 페이지 맨 위, 큰 사진 가운데에 흰 글씨 한 문장이 나오는 부분이에요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: { title: "세상은 불완전한 것들로 이루어져 있습니다" },
};

export const ABOUT_IMPERFECTION: SectionMeta<{ title: string; first: string; second: string }> = {
  id: "aboutImperfection",
  page: "about",
  title: "불완전함 (사진 없는 글)",
  where:
    "맨 위 사진 아래, '완전하지 않다는 것은…'으로 시작하는 사진 없는 글이에요. 제목, 첫 문단, 둘째 문단 순서예요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "완전하지 않다는 것은 아직 다른 가능성이 남아 있다는 뜻입니다.",
    first:
      "저마다 다른 모양과 쓰임, 아직 정해지지 않은 상태와 서로 다른 가능성. 우리가 산업에서 남겨진 물질에 매료된 이유도 여기에 있습니다. 하나의 쓰임으로만 설명할 수 없습니다. 새로운 사람과 환경을 만나면 또 다른 쓰임과 관계가 시작됩니다.",
    second:
      "자원(ZAONE)은 산업 현장에서 사용 가치를 찾지 못해 버려진 자원을 다시 사회와 교육의 장으로 연결합니다. 자원을 더 오래 사용하고 환경의 부담을 줄이는 동시에, 정해진 답보다 질문과 탐구가 시작될 수 있는 열린 배움의 환경을 만듭니다. 용도가 정해져 있지 않은 재료는 만져보고, 비교하고, 연결하며 각자 다른 방식으로 탐구하게 합니다. 같은 재료도 누구의 손에 놓이느냐에 따라 전혀 다른 쓰임이 됩니다.",
  },
};

export const ABOUT_CREATIVITY_QUESTION: SectionMeta<{ title: string; sub: string }> = {
  id: "aboutCreativityQuestion",
  page: "about",
  title: "창의성 질문 (사진 배너)",
  where:
    "ABOUT 페이지 중간, 아이들 사진 위에 흰 글씨 질문과 한 줄 설명이 나오는 둥근 배너예요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "창의성은 어떠한 환경에서 더 잘 드러날까",
    sub: "이 질문에서 ZAONE의 질문이 시작되었습니다",
  },
};

export const ABOUT_MANUFACTURING: SectionMeta<{
  title: string;
  firstTitle: string;
  firstBody: string;
  secondTitle: string;
  secondBody: string;
  imageAlt: string;
}> = {
  id: "aboutManufacturing",
  page: "about",
  title: "제조 현장 (글 두 덩어리와 공장 사진)",
  where:
    "'우리가 교육 안에서 찾고 있던 답은…'으로 시작하는 부분이에요. 큰 제목 아래에 소제목과 본문 두 덩어리가 위아래로 나오고, 맨 아래에 공장 사진이 있어요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  // TODO: 시안에 아래 덩어리의 소제목이 비어 있다. 위 소제목을 복사해 둔 값이라 실제 문구를 받으면 바꾼다.
  defaults: {
    title: "우리가 교육 안에서 찾고 있던 답은, 뜻밖에도 제조 현장에 있었습니다.",
    firstTitle: "산업에서 쓰임을 잃은 물질도, 다른 환경에서는 새로운 재료가 될 수 있습니다.",
    firstBody:
      "휴면자원은 제품이 되지 못했거나, 규격과 생산 계획에서 벗어나거나, 다른 쓰임의 경로를 만나지 못한 채 폐기의 경로에 놓이는 물질입니다. 하지만 세심한 관찰과 존중, 그리고 그 표현 가능성에 대한 탐구를 더하면 휴면자원은 생각을 만들어내고 질문을 던지는 교육적 재료가 될 수 있습니다.",
    secondTitle: "산업에서 쓰임을 잃은 물질도, 다른 환경에서는 새로운 재료가 될 수 있습니다.",
    secondBody:
      "자원은 버려지고 있는 것을 다시 바라보는 관점이 미래세대가 물질을 감각적으로 경험하고, 생태적 사고를 훈련하며, 환경과 사회를 입체적으로 이해하는 교육으로 이어질 수 있다고 믿습니다. 휴면자원의 창의적 재사용은 물질을 다시 보고, 세상을 해석하고 관계 맺는 방식을 배우는 과정입니다. 자원은 휴면자원을 교육적 재료로 연결해 미래세대가 환경과 사회를 사고하는 경험을 만들어갑니다.",
    imageAlt: "주황색 시트 부품이 줄지어 놓인 공장의 생산 라인",
  },
};

type Circle = { title: string; description: string };

export const ABOUT_CREATIVE_REUSE: SectionMeta<{
  title: string;
  body: string;
  button: { label: string; href: string };
  centerName: string;
  centerDescription: string;
  circleTop: Circle;
  circleLeft: Circle;
  circleRight: Circle;
  circleBottomLeft: Circle;
  circleBottomRight: Circle;
}> = {
  id: "aboutCreativeReuse",
  page: "about",
  title: "재료의 창의적 재사용 (원 다이어그램)",
  where:
    "연한 파란 배경에 왼쪽(모바일은 위)에 제목·소개 글·버튼이, 오른쪽(모바일은 아래)에 ZAONE을 둘러싼 원 5개가 있는 부분이에요. 원은 5개로 정해져 있어서 늘리거나 줄일 수 없고, 각 원의 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "재료의 창의적 재사용",
    body: "자원은 산업 현장의 휴면자원을 교육과 사회의 다양한 맥락으로 연결합니다. 재료를 다시 보고, 경험하고, 해석하는 과정에서 교육적·사회적·환경적 가치가 만들어집니다.",
    button: { label: "ZAONE과 협력하는 방법 보기", href: "/contact" },
    centerName: "ZAONE",
    centerDescription: "휴면자원으로 서로 다른 필요를 연결합니다.",
    circleTop: {
      title: "미래세대",
      description: "물질과 환경을 더 세심하게 보고, 스스로 질문하는 힘을 기릅니다.",
    },
    circleLeft: {
      title: "제조기업",
      description: "생산 과정에서 발생하는 휴면자원에 새로운 연결이 필요합니다.",
    },
    circleRight: {
      title: "교육현장",
      description: "창의성·문제해결력·생태감수성을 함께 기를 수 있는 교육환경이 필요합니다.",
    },
    circleBottomLeft: {
      title: "공공·지역사회",
      description: "도서관, 문화시설, 커뮤니티 공간을 지속가능성을 배우는 장소로 설계합니다.",
    },
    circleBottomRight: {
      title: "기업·재단",
      description: "환경과 미래세대를 함께 다루는 사회공헌 모델이 필요합니다.",
    },
  },
};

export const ABOUT_SECTIONS = [
  ABOUT_HERO,
  ABOUT_IMPERFECTION,
  ABOUT_CREATIVITY_QUESTION,
  ABOUT_MANUFACTURING,
  ABOUT_CREATIVE_REUSE,
] as const;
