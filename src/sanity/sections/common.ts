import type { SectionMeta } from "./pages";

// 모든 페이지 아래에 붙는 푸터. 바로가기 링크는 코드에 있다.

export const COMMON_FOOTER: SectionMeta<{
  copyright: string;
  instagramUrl: string;
  youtubeUrl: string;
  organization: string;
  representative: string;
  businessNumber: string;
  email: string;
  address: string;
  phone: string;
}> = {
  id: "commonFooter",
  page: "common",
  title: "푸터 (모든 페이지 맨 아래)",
  where:
    "모든 페이지 맨 아래 어두운 부분이에요. 저작권 글, 인스타그램·유튜브 주소, 단체 정보(이름, 대표, 사업자등록번호, 메일, 주소, 전화)를 고칠 수 있어요. 바로가기 링크는 지금은 바꿀 수 없어요.",
  defaults: {
    copyright: "© 2026 ZAONE. All rights reserved.",
    instagramUrl: "https://www.instagram.com/zaone.play/",
    youtubeUrl: "https://www.youtube.com/@zaone_org",
    organization: "사단법인 ZAONE (자원)",
    representative: "대표 이수영",
    businessNumber: "사업자등록번호 885-82-00479",
    email: "hello@zaone.org",
    address: "서울시 용산구 효창원로70길 14, 3F",
    phone: "070-4124-8887",
  },
};

type PageSeo = { title: string; description: string };

export const COMMON_PAGE_SEO: SectionMeta<{
  about: PageSeo;
  giveAndUse: PageSeo;
  impact: PageSeo;
  zaoneLab: PageSeo;
  donation: PageSeo;
}> = {
  id: "commonPageSeo",
  page: "common",
  title: "검색 결과에 보이는 제목·설명",
  where:
    "구글·네이버 같은 검색 결과와 링크를 공유할 때 보이는 페이지 제목과 설명이에요. 페이지마다 하나씩 고칠 수 있어요. 홈은 지금은 바꿀 수 없어요. 고친 내용은 검색 사이트에 반영되기까지 며칠이 걸릴 수 있어요.",
  defaults: {
    about: {
      title: "ABOUT - 자원(ZAONE)",
      description:
        "자원(ZAONE)은 산업 현장에서 사용 가치를 찾지 못해 버려진 자원을 다시 사회와 교육의 장으로 연결합니다.",
    },
    giveAndUse: {
      title: "GIVE & USE - 자원(ZAONE)",
      description:
        "자원(ZAONE)은 기업의 휴면자원을 발굴해 교육·문화·복지 현장에 제공합니다. 휴면자원의 공급과 사용, 교육과 훈련을 하나의 체계로 운영합니다.",
    },
    impact: {
      title: "IMPACT - 자원(ZAONE)",
      description:
        "자원(ZAONE)은 재사용량만으로 프로젝트의 변화를 설명하지 않습니다. 자원의 전환량과 폐기 감소, 기업의 인식 변화, 참여자의 인식과 역량, 행동의 변화를 함께 기록합니다.",
    },
    zaoneLab: {
      title: "ZAONE LAB - 자원(ZAONE)",
      description:
        "ZAONE LAB은 물질과 놀이에서 시작해 스스로 질문하고 방법을 찾는 경험을 만듭니다. 교육현장에서 조직, 지역의 장소까지 누구나 이곳의 학습자가 될 수 있습니다.",
    },
    donation: {
      title: "후원하기 - 자원(ZAONE)",
      description:
        "자원(ZAONE)은 산업폐기물을 교육 재료로 전환하여, 물질을 폐기하는 방식과 어린이가 배우는 방식에 변화를 만듭니다. 후원으로 더 많은 것을 바꿀 수 있습니다.",
    },
  },
};

export const COMMON_SECTIONS = [COMMON_FOOTER, COMMON_PAGE_SEO] as const;
