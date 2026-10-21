/*
 * 여러 페이지가 함께 쓰는 링크 주소. 갈 곳은 IA(Figma 572:2, 2026-10-12 공유)를 따른다.
 */

// 교육·훈련 프로그램을 운영하는 외부 사이트. 이 사이트의 ZAONE LAB 소개(/zaone-lab)와 다른 곳이고 새 탭으로 연다.
export const ZAONE_LAB_PROGRAMS_URL = "https://lab.zaone.org/";

// 문의하기 페이지의 문의 폼. 문의하기 페이지가 type으로 폼을 골라 #contact-form 자리에 보여준다.
export const CONTACT_FORM_HREF = {
  // 휴면자원 공급 문의
  supply: "/contact?type=supply#contact-form",
  // 휴면자원 사용 문의(기관 멤버십 신청)
  use: "/contact?type=use#contact-form",
  // 프로젝트 협력 문의
  project: "/contact?type=project#contact-form",
  // 교육 프로그램 문의
  education: "/contact?type=education#contact-form",
} as const;

// CONTACT 페이지의 공지사항 목록. 목록이 notice로 사업소식·사업보고 탭을 골라 #notices 자리에 보여 준다.
// 사업소식·사업보고 상세 페이지의 "공지사항 목록 보기"가 보던 글의 탭으로 돌아간다.
export const NOTICE_LIST_HREF = {
  businessNews: "/contact?notice=news#notices",
  businessReport: "/contact?notice=report#notices",
} as const;

// 새 탭으로 여는 외부 링크에 함께 넣는다.
export const NEW_TAB_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

// 주소가 외부(https://…)면 새 탭으로 연다. 운영자가 Studio에서 주소를 바꿔도 알맞게 열리도록 주소를 보고 정한다.
export function linkTargetProps(href: string) {
  return /^https?:\/\//i.test(href) ? NEW_TAB_PROPS : {};
}
