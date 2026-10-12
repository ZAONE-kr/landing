import { Button } from "@/components/ui/Button";
import { CONTACT_FORM_HREF, NEW_TAB_PROPS, ZAONE_LAB_PROGRAMS_URL } from "@/lib/links";

/*
 * 바탕은 섹션 아래 가운데에서 bg-brand → #012985 → bg-navy로 퍼지는 타원 그라데이션이다. 반지름이 섹션
 * 폭·높이의 87.13%로 세 시안이 같다. 가운데 색 #012985와 모바일 본문 색 #e4eaf0은 Figma에서 변수 없이
 * 쓴 값이다(데스크톱 본문은 text-quaternary).
 * 버튼은 모바일 200px 폭에 세로로, 데스크톱 316px 폭에 가로로 놓는다. 글이 길면 버튼이 늘어난다.
 */
export function ExperienceCtaSection() {
  return (
    <section className="bg-[radial-gradient(87.13%_87.13%_at_50%_100%,var(--color-bg-brand),#012985,var(--color-bg-navy))] px-lg py-6xl lg:px-6xl lg:py-7xl">
      <div className="flex flex-col items-center gap-3xl lg:gap-6xl">
        <div className="flex flex-col items-center gap-xl text-center lg:gap-lg">
          <h2 className="text-title-m-b text-text-inverse lg:text-title-l-b">
            ZAONE LAB에서
            <br className="lg:hidden" /> 직접 경험해보세요.
          </h2>
          <p className="text-body-xs-m text-[#e4eaf0] lg:text-body-sm-r lg:text-text-quaternary">
            개인의 참여부터 교육자와 조직을 위한 훈련까지,
            <br /> 현재 열려 있는 프로그램을 확인할 수 있습니다.
          </p>
        </div>
        <div className="flex min-w-[12.5rem] flex-col gap-md lg:flex-row lg:gap-xl">
          <Button
            href={ZAONE_LAB_PROGRAMS_URL}
            {...NEW_TAB_PROPS}
            className="px-xl py-md text-body-xs-b lg:min-w-[19.75rem] lg:py-xl lg:text-body-sm-b"
          >
            현재 프로그램 보기
          </Button>
          <Button
            href={CONTACT_FORM_HREF.education}
            variant="inverse"
            className="px-xl py-md text-body-xs-b lg:min-w-[19.75rem] lg:py-xl lg:text-body-sm-b"
          >
            조직·기관 프로그램 문의하기
          </Button>
        </div>
      </div>
    </section>
  );
}
