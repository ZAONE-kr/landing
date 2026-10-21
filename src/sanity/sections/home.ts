import type { SectionMeta } from "./pages";

// 홈(/)의 섹션. 활용 경로·인사이트·후원사 카드는 카드 섹션으로 따로 옮긴다. 브랜드 영상은 글이 없다.

export const HOME_HERO: SectionMeta<{
  title: string;
  first: string;
  second: string;
  button: { label: string; href: string };
  imageAlt: string;
}> = {
  id: "homeHero",
  page: "home",
  title: "맨 위 (사진과 소개)",
  where:
    "홈 맨 위, 왼쪽(모바일은 위)에 빙하 사진, 오른쪽(모바일은 아래)에 제목·소개 글·버튼이 있는 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "지금의 선택이\n다음 세대가 살아갈\n환경을 만듭니다",
    first:
      "기후위기는 먼 미래의 이야기가 아닙니다. 오늘 우리가 자원을 만들고 사용하고 버리는 방식이, 아이들이 살아갈 환경을 결정하고 있습니다.",
    second: "ZAONE은 이 문제를 다른 시각에서 바라보고, 새로운 변화를 만들어가고 있습니다.",
    button: { label: "ZAONE이 만드는 변화 보기", href: "/impact" },
    imageAlt: "빙하 앞 바위에 서 있는 아이의 뒷모습",
  },
};

export const HOME_CLIMATE_STORY: SectionMeta<{
  first: string;
  title: string;
  second: string;
  third: string;
}> = {
  id: "homeClimateStory",
  page: "home",
  title: "기후 이야기 (사진 없는 글)",
  where:
    "홈 맨 위 아래, 사진 없이 글만 있는 부분이에요. 위에서부터 첫 문단, 굵은 제목, 둘째·셋째 문단 순서예요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    first:
      "2015년, 세계는 지구 온도 상승을 1.5°C 안에서 막기 위해 노력하기로 약속했습니다. 2024년은 처음으로 한 해 평균기온이 그 기준을 넘어선 해였습니다.",
    title: "그런데 이 거대한 변화 앞에서,\n우리가 주목한 것은 어린 시절이었습니다.",
    second:
      "어떤 사람과 시간을 보냈는지, 어떤 공간에서 자랐는지, 무엇을 만지고 가지고 놀았는지, 자연과 사물을 어떻게 경험했는지. 이런 작은 경험들이 한 사람이 세계를 이해하는 방식에 오래 남습니다.",
    third:
      "물건을 소비하고, 사용하고, 버리고, 다시 사용하는 감각도 어린 시절의 경험 속에서 만들어집니다. 지금 어린 시절을 흔드는 문제는 하나가 아닙니다. 전쟁과 재난으로 일상이 끊기고, 사는 곳에 따라 배움과 경험의 기회가 달라지기도 합니다. 어린 시절을 지켜야 할 이유는 그 어느 때보다 많아졌습니다.",
  },
};

type Feature = { title: string; first: string; second: string; imageAlt: string };

export const HOME_ENVIRONMENT: SectionMeta<Feature> = {
  id: "homeEnvironment",
  page: "home",
  title: "환경 소개 (글과 사진)",
  where:
    "홈 중간, 글은 왼쪽 사진은 오른쪽에 있는 첫째 소개 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "우리가 가장 먼저 바꾸려는 것은,\n어린 시절을 둘러싼 환경입니다.",
    first:
      "그 시작점에서 ZAONE은 물질을 봅니다. 무엇을 만들고, 얼마나 사용하고, 무엇을 버리는지. 어떤 물질을 오래 쓰고, 어떤 것은 너무 쉽게 포기하는지. 이런 선택은 우리가 살아갈 환경을 만들고, 동시에 어린 시절의 경험을 만듭니다.",
    second:
      "기후위기는 자연재해만의 문제가 아닙니다. 사람들이 살아가는 장소와 방식, 가족과 지역사회의 조건, 어린이가 경험할 수 있는 일상의 범위까지 바꿉니다. 우리는 환경을 지키는 일과 어린 시절을 지키는 일을 서로 다른 이야기로 보지 않습니다.",
    imageAlt: "구멍이 뚫린 흰색 조각들이 겹쳐 쌓인 모습",
  },
};

export const HOME_DORMANT_RESOURCE: SectionMeta<Feature> = {
  id: "homeDormantResource",
  page: "home",
  title: "휴면자원 소개 (사진과 글)",
  where:
    "홈 중간, 사진은 왼쪽 글은 오른쪽에 있는 둘째 소개 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "휴면자원을 발굴하고,\n교육과 사회의 현장에 제공합니다.",
    first:
      "ZAONE은 기업이 보유한 휴면자원을 검토하고 분류해 학교와 교육·돌봄기관, 복지기관, 도서관·문화공간 등이 사용할 수 있도록 제공합니다. 재료를 사용하는 교사와 교육자에게는 휴면자원의 특성을 이해하고 활용할 수 있는 교육과 훈련을 제공합니다.",
    second:
      "기업·재단·공공기관과는 휴면자원을 매개로 미래세대, 환경, 지역사회를 다루는 사회공헌 프로젝트를 기획하고 운영합니다.",
    imageAlt: "공장 안 거치대에 겹겹이 걸린 가죽 원단",
  },
};

export const HOME_NEWSLETTER: SectionMeta<{
  title: string;
  body: string;
  emailLabel: string;
  placeholder: string;
  button: string;
}> = {
  id: "homeNewsletter",
  page: "home",
  title: "뉴스레터 (맨 아래 남색 부분)",
  where:
    "홈 맨 아래, 남색 배경에 제목·소개 글과 이메일 입력칸이 있는 부분이에요. 입력칸 안내 글과 버튼 글도 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "우리가 더 오래 들여다보는 것들을\n함께 받아보세요",
    body: "물질과 교육, 지속가능성, 기업과 함께 만든 변화에 대한 새로운 기록을 보내드립니다.",
    emailLabel: "이메일",
    placeholder: "이메일을 입력해주세요",
    button: "구독하기",
  },
};

export const HOME_SECTIONS = [
  HOME_HERO,
  HOME_CLIMATE_STORY,
  HOME_ENVIRONMENT,
  HOME_DORMANT_RESOURCE,
  HOME_NEWSLETTER,
] as const;
