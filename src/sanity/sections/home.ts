import type { SanityImageSource } from "@/sanity/lib/image";

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
  doneMessage: string;
  errorMessage: string;
}> = {
  id: "homeNewsletter",
  page: "home",
  title: "뉴스레터 (맨 아래 남색 부분)",
  where:
    "홈 맨 아래, 남색 배경에 제목·소개 글과 이메일 입력칸이 있는 부분이에요. 입력칸 안내 글과 버튼 글, 구독하기를 누른 뒤 뜨는 알림창 글도 고칠 수 있어요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요. 구독한 이메일은 단체 구글 시트의 뉴스레터 구독 탭에 쌓여요.",
  defaults: {
    title: "우리가 더 오래 들여다보는 것들을\n함께 받아보세요",
    body: "물질과 교육, 지속가능성, 기업과 함께 만든 변화에 대한 새로운 기록을 보내드립니다.",
    emailLabel: "이메일",
    placeholder: "이메일을 입력해주세요",
    button: "구독하기",
    // 완료·실패 화면이 시안에 없어 브라우저 알림창(alert)으로 띄운다(사용자 결정, 2026-10-27).
    doneMessage: "구독 신청이 완료되었습니다.",
    errorMessage: "구독 신청을 보내지 못했어요.\n잠시 후 다시 시도해주세요.",
  },
};

// 인사이트 글은 외부에서 만드는 블로그(inblog)에 있다. 블로그가 완성될 때까지 카드는 여기서 직접 고친다.
const BLOG_URL = "https://blog.zaone.org";

export type HomeInsight = {
  // 코드의 기본 카드와 이어 주는 이름. 새로 더한 카드는 Studio가 붙인 임의의 값이다.
  _key: string;
  category: string;
  title: string;
  readingMinutes: number;
  href: string;
  // 운영자가 올린 사진. 기본 카드는 비워 두면 코드의 사진을 쓴다.
  photo: SanityImageSource | null;
};

export const HOME_INSIGHTS: SectionMeta<{
  title: string;
  description: string;
  cards: HomeInsight[];
  button: { label: string; href: string };
}> = {
  id: "homeInsights",
  page: "home",
  title: "인사이트 카드 (홈 아래쪽)",
  where:
    "홈 아래쪽, '우리가 더 오래 들여다보는 것들' 제목 아래에 사진 카드 세 장이 놓이는 부분이에요. 인사이트 글은 외부 블로그에서 쓰기 때문에, 블로그가 완성될 때까지 카드의 제목·사진·읽는 시간·연결할 글 주소를 여기서 직접 고쳐요. 카드는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 컴퓨터 화면에서는 세 장이 가장 보기 좋아요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  // TODO: 아래 카드는 시안의 자리표시 내용이고 읽는 시간도 임시 값이다. 블로그 글이 정해지면 Studio에서 바꾼다.
  defaults: {
    title: "우리가 더 오래\n들여다보는 것들",
    description:
      "물질과 교육, 지속가능성, 그리고 기업과 함께 만든 변화까지.\n현장에서 시작된 질문과 관찰을 기록합니다.",
    cards: [
      {
        _key: "insight-material",
        category: "Material",
        title: "버려진 자원에서\n새로운 가능성을 보다",
        readingMinutes: 1,
        href: BLOG_URL,
        photo: null,
      },
      {
        _key: "insight-partnership",
        category: "Partnership",
        title: "함께 만들어가는\n지속가능한 변화",
        readingMinutes: 1,
        href: BLOG_URL,
        photo: null,
      },
      {
        _key: "insight-education",
        category: "Education",
        title: "물질이 만드는\n다른 배움의 장면",
        readingMinutes: 1,
        href: BLOG_URL,
        photo: null,
      },
    ],
    button: { label: "모든 인사이트 보기", href: BLOG_URL },
  },
};

export type Pathway = {
  // 코드의 기본 카드와 이어 주는 이름. 새로 더한 카드는 Studio가 붙인 임의의 값이다.
  _key: string;
  // 카드 위의 영문 분류.
  audience: string;
  title: string;
  cta: string;
  href: string;
  photo: SanityImageSource | null;
};

// 갈 곳은 IA를 따른다. 협업 시작하기는 기업·재단 문의가 아니라 ABOUT으로 보낸다.
export const HOME_PATHWAYS: SectionMeta<{
  title: string;
  description: string;
  cards: Pathway[];
}> = {
  id: "homePathways",
  page: "home",
  title: "활용 경로 (사진 카드)",
  where:
    "홈 중간, '다음 쓰임을 함께 만드는 방법' 제목 아래에 큰 사진 카드 세 장이 놓이는 부분이에요. 카드는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 컴퓨터 화면에서는 옆으로 넘겨 봐요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    title: "다음 쓰임을 함께 만드는 방법",
    description:
      "환경을 지키는 일과 어린 시절을 지키는 일은 여러 자리에서 시작될 수 있습니다. ZAONE은 산업과 기업, 교육 현장이 가진 서로 다른 자원과 역할을 연결합니다.",
    cards: [
      {
        _key: "pathway-manufacturers",
        audience: "For manufacturers",
        title: "생산 과정에서\n더 이상 쓰이지 않는\n물질이 있다면",
        cta: "휴면자원 연결하기",
        href: "/give-and-use",
        photo: null,
      },
      {
        _key: "pathway-companies",
        audience: "For companies & Foundations",
        title: "환경과 어린 시절을\n함께 지키는 일을\n만들고 싶다면",
        cta: "협업 시작하기",
        href: "/about",
        photo: null,
      },
      {
        _key: "pathway-educators",
        audience: "For educators",
        title: "배움의 환경에\n더 많은 가능성을\n남기고 싶다면",
        cta: "ZAONE LAB보기",
        href: "/zaone-lab",
        photo: null,
      },
    ],
  },
};

export type Supporter = {
  _key: string;
  // 로고 이름(화면에는 안 보이고, 눈이 불편한 방문자에게 읽어 준다).
  name: string;
  // 운영자가 올린 로고. 기본 기관은 비워 두면 코드의 로고를 쓴다.
  photo: SanityImageSource | null;
};

export const HOME_SUPPORTERS: SectionMeta<{ cards: Supporter[] }> = {
  id: "homeSupporters",
  page: "home",
  title: "함께하는 기관 로고 (흐르는 로고 줄)",
  where:
    "홈 아래쪽, 기관 로고가 옆으로 계속 흐르는 줄이에요. 로고는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 새 로고는 아래 '로고 규격'을 지켜 올려 주세요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    cards: [
      { _key: "samsung-medical-center", name: "삼성서울병원", photo: null },
      { _key: "yuhan-kimberly", name: "유한킴벌리", photo: null },
      { _key: "beautiful-store", name: "아름다운가게", photo: null },
      { _key: "childfund-korea", name: "초록우산", photo: null },
      { _key: "seoul", name: "서울특별시", photo: null },
      { _key: "world-vision", name: "월드비전", photo: null },
      { _key: "root-impact", name: "루트임팩트", photo: null },
      { _key: "huggies", name: "하기스", photo: null },
      { _key: "amorepacific", name: "아모레퍼시픽", photo: null },
      { _key: "nhn", name: "NHN", photo: null },
      { _key: "fursys-group", name: "퍼시스 그룹", photo: null },
      { _key: "hyundai-transys", name: "현대트랜시스", photo: null },
      { _key: "hyundai", name: "현대", photo: null },
      { _key: "dauning", name: "다우닝", photo: null },
    ],
  },
};

export const HOME_SECTIONS = [
  HOME_HERO,
  HOME_CLIMATE_STORY,
  HOME_ENVIRONMENT,
  HOME_DORMANT_RESOURCE,
  HOME_PATHWAYS,
  HOME_INSIGHTS,
  HOME_SUPPORTERS,
  HOME_NEWSLETTER,
] as const;
