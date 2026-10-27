import { DONUS_DONATE_URL } from "@/lib/links";
import type { SanityImageSource } from "@/sanity/lib/image";

import type { SectionMeta } from "./pages";

// 후원하기 페이지(/donation)의 섹션. 페이지의 후원하기 버튼은 Donus 결제 페이지를 새 탭으로 연다.

type Button = { label: string; href: string };

export const DONATION_HERO: SectionMeta<{
  title: string;
  body: string;
  button: Button;
  imageAlt: string;
}> = {
  id: "donationHero",
  page: "donation",
  title: "맨 위 (사진과 소개)",
  where:
    "후원하기 페이지 맨 위, 왼쪽(모바일은 위)에 장갑을 낀 아이 사진, 오른쪽(모바일은 아래) 노란 배경에 제목·소개 글·버튼이 있는 부분이에요. 사진은 지금은 바꿀 수 없고, 사진 설명 글만 고칠 수 있어요. 소개 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "버리는 것이\n더 쉬운 세상을\n바꿉니다.",
    body: "당장의 효율보다 오래 남는 가치를 선택할 수 있도록, 그 선택이 계속 이어질 수 있게 돕습니다.",
    button: { label: "후원하기", href: DONUS_DONATE_URL },
    imageAlt: "주황색 장갑을 끼고 전동 드릴로 나무판에 구멍을 내는 아이",
  },
};

export const DONATION_MISSION: SectionMeta<{ text: string }> = {
  id: "donationMission",
  page: "donation",
  title: "미션 (사진 아래 한 문장)",
  where:
    "맨 위 사진 바로 아래, 가운데 정렬된 굵은 글 한 문장이에요. 컴퓨터 화면에서는 Enter를 누른 곳에서 줄이 바뀌고, 모바일에서는 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    text: "우리의 미션은 산업폐기물을 교육 재료로 전환하여,\n물질을 폐기하는 방식과 어린이가 배우는 방식에 변화를 만드는 것입니다.",
  },
};

type WorkBlock = { lead: string; body: string };

export const DONATION_WORK: SectionMeta<{
  label: string;
  first: WorkBlock;
  second: WorkBlock;
  third: WorkBlock;
}> = {
  id: "donationWork",
  page: "donation",
  title: "우리가 하는 일 (세 면)",
  where:
    "미션 아래, '우리가 하는 일'이 세 면으로 이어지는 부분이에요. 첫째·셋째 면은 어두운 흑백 사진 위에 흰 글씨, 둘째 면은 회색 배경이에요. 사진은 지금은 바꿀 수 없어요. 본문은 Enter를 누른 곳에서 문단이 나뉘고, 문단 안의 줄은 화면 너비에 맞춰 자동으로 나뉘어요.",
  defaults: {
    label: "우리가 하는 일",
    first: {
      lead: "우리는 소각과 매립으로 향할 수 있는\n산업폐기물을 교육 재료로 전환하여,\n물질을 다시 사용하는 경로를 만듭니다.",
      body: "버리는 것이 재사용보다 쉬운 구조에서는 물질의 가능성보다 처리 비용이 우선됩니다. 지금의 자원 생산과 폐기 방식을 바꾸지 않는다면, 그 환경적 부담은 미래세대에게 이어질 것입니다.",
    },
    second: {
      lead: "청소년 4명 중 1명은 일상을 멈출 만큼\n깊은 슬픔과 절망을 경험합니다.",
      body: "한국의 아동·청소년은 치열한 경쟁과 성취의 압박 속에서 성장합니다. 정해진 답과 결과를 중시하는 교육 환경에서 스스로 질문하고 실패하며 자신만의 방법을 찾는 경험은 뒤로 밀리기 쉽습니다.\n우리는 용도와 결과가 정해져 있지 않은 재료를 통해 어린이가 스스로 생각하고 선택하며, 타인과 협력해 문제를 해결하는 교육을 만듭니다.",
    },
    third: {
      lead: "버려지는 물질에 대한 사회의 인식을 바꿉니다.",
      body: "물질의 가치를 생산성과 경제적 효율로만 판단하는 한, 우리는 그 안에 남아 있는 새로운 쓰임과 가능성을 발견하기 어렵습니다. 우리는 산업폐기물이 어떻게 인간의 호기심과 창의적인 질문을 불러오는 교육 재료가 될 수 있는지 연구하고, 그 발견을 캠페인과 교육, 커뮤니티를 통해 확산합니다.",
    },
  },
};

export type DonationStat = {
  _key: string;
  // 줄바꿈(Enter)은 시안의 줄 위치 그대로다.
  label: string;
  // 숫자와 단위를 한 줄로 쓴다(예: 8,340만 톤 / 년, 주 1회). 숫자는 크게, 나머지 글자는 작게 그려진다.
  value: string;
};

export type DonationUse = {
  // 코드의 기본 카드와 이어 주는 이름(materials 등). 새로 더한 카드는 Studio가 붙인 임의의 값이다.
  _key: string;
  title: string;
  body: string;
  stats: DonationStat[];
  imageAlt: string;
  // 운영자가 올린 사진. 기본 카드는 비워 두면 코드의 사진을 쓴다.
  photo: SanityImageSource | null;
};

export const DONATION_USES: SectionMeta<{ title: string; cards: DonationUse[] }> = {
  id: "donationUses",
  page: "donation",
  title: "후원이 쓰이는 곳 (사진과 수치 카드)",
  where:
    "'후원으로, 더 많은 것을 바꿀 수 있습니다.' 제목 아래, 회색 배경에 사진과 글·수치가 한 면씩 이어지는 부분이에요. 컴퓨터 화면에서는 사진이 왼쪽·오른쪽 번갈아 놓여요. 카드는 끌어서 순서를 바꾸고, 목록 아래 Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 고친 내용은 오른쪽 아래 Publish를 눌러야 사이트에 나가요.",
  defaults: {
    title: "후원으로, 더 많은 것을 바꿀 수 있습니다.",
    cards: [
      {
        _key: "materials",
        title: "버려질 재료를\n교육 자원으로 가져옵니다.",
        body: "전국 제조 현장의 휴면자원을 수거・보관・가공하여 교육 재료로 전환하는 데 필요한 비용을 지원합니다.",
        stats: [
          {
            _key: "waste",
            label: "제조업 생산공정에서 매년 발생하는 폐기물",
            value: "8,340만 톤 / 년",
          },
        ],
        imageAlt: "야외 작업장에 높이 쌓인 자투리 파티클보드 더미",
        photo: null,
      },
      {
        _key: "lab",
        title: "자원랩을 찾아오는\n사람이 늘어나고 있습니다.",
        body: "더 많은 사람이 휴면자원을 직접 만지고 배우며 새로운 가능성을 경험할 수 있도록, 공간 운영과 재료 관리에 필요한 비용을 지원합니다.",
        stats: [
          { _key: "monthly-now", label: "현재\n월 평균 이용자", value: "120명" },
          { _key: "monthly-goal", label: "2027년 목표\n월평균 이용자", value: "300명" },
          { _key: "yearly-goal", label: "2027년 목표\n연간 방문자", value: "4,000명" },
        ],
        imageAlt: "빨간 작업대와 재료 선반이 놓인 자원랩 공간",
        photo: null,
      },
      {
        _key: "stories",
        title: "산업폐기물의 재사용 사례를\n더 많이 알립니다.",
        body: "산업폐기물이 교육 재료로 전환된 실제 사례와 활용 방법을 콘텐츠로 제작해 매주 발행합니다.",
        stats: [
          { _key: "publish", label: "콘텐츠 발행", value: "주 1회" },
          { _key: "views", label: "콘텐츠 당 조회", value: "1,000회+" },
          { _key: "yearly-views", label: "연간 누적 조회 목표", value: "5.2만회" },
        ],
        imageAlt: "자원포럼 2023에서 큰 화면의 발표 영상을 보는 청중",
        photo: null,
      },
    ],
  },
};

export type DonationParticipation = { _key: string; title: string; body: string };

export const DONATION_PARTICIPATION: SectionMeta<{
  title: string;
  cards: DonationParticipation[];
}> = {
  id: "donationParticipation",
  page: "donation",
  title: "후원자 참여 (선 위의 글 두 개)",
  where:
    "'후원은 참여의 시작입니다.' 제목 아래, 가는 선 위에 소제목과 설명이 나란히(모바일은 위아래로) 놓이는 부분이에요. 항목은 끌어서 순서를 바꾸고, Add item으로 더하고, ⋯ 메뉴의 Remove로 지울 수 있어요. 컴퓨터 화면에서는 두 개씩 한 줄에 놓여요. 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "후원은 참여의 시작입니다.",
    cards: [
      {
        _key: "impact-report",
        title: "우리가 만들어낸 변화를 공유합니다.",
        body: "후원자에게 자원의 활동과 변화, 후원금 사용 내역을 담은 임팩트 리포트를 보내드립니다.",
      },
      {
        _key: "general-meeting",
        title: "자원의 중요한 결정에 참여합니다.",
        body: "자원의 회원은 정관에서 정한 권한과 절차에 따라 정기총회에 참석하고, 주요 사업과 조직 운영에 관한 의사결정에 참여할 수 있습니다.",
      },
    ],
  },
};

export const DONATION_CTA: SectionMeta<{ title: string; body: string; button: Button }> = {
  id: "donationCta",
  page: "donation",
  title: "후원 안내 (맨 아래)",
  where:
    "후원하기 페이지 맨 아래, 회색 배경 아래쪽에 노란빛이 번지는 곳에 제목·한 줄 글·버튼이 있는 부분이에요. 한 줄 글은 화면 너비에 맞춰 줄이 자동으로 나뉘어요.",
  defaults: {
    title: "변화는 저절로\n일어나지 않습니다.",
    body: "우리가 당연하게 여겨온 것들을 바꾸는 일, 당신의 참여로 시작됩니다.",
    button: { label: "후원하기", href: DONUS_DONATE_URL },
  },
};

export const DONATION_SECTIONS = [
  DONATION_HERO,
  DONATION_MISSION,
  DONATION_WORK,
  DONATION_USES,
  DONATION_PARTICIPATION,
  DONATION_CTA,
] as const;
