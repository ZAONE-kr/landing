import { CONTACT_FORM_HREF, ZAONE_LAB_PROGRAMS_URL } from "@/lib/links";

import type { SectionMeta } from "./pages";

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
