import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { withDefaults } from "@/sanity/lib/content";
import { getSection } from "@/sanity/lib/sections";
import { LAB_EXPERIENCE_CTA } from "@/sanity/sections/labExperienceCta";

/*
 * 바탕은 섹션 아래 가운데에서 bg-brand → #012985 → bg-navy로 퍼지는 타원 그라데이션이다. 반지름이 섹션
 * 폭·높이의 87.13%로 세 시안이 같다. 가운데 색 #012985와 모바일 본문 색 #e4eaf0은 Figma에서 변수 없이
 * 쓴 값이다(데스크톱 본문은 text-quaternary).
 * 버튼은 모바일 200px 폭에 세로로, 데스크톱 316px 폭에 가로로 놓는다. 글이 길면 버튼이 늘어난다.
 * 글과 버튼 주소는 Sanity Studio에서 고친다. 문서가 비어 있으면 sections/labExperienceCta.ts의 기본값을 쓴다.
 * 시안의 줄바꿈은 두지 않고 글을 고르게 나눈다(text-balance). 제목(1024 미만)과 소개 글은 폭을 묶어, 시안처럼 두 줄이 되는
 * 길이에서 한 줄로 흐르지 않게 한다.
 */
export async function ExperienceCtaSection() {
  const { title, body, programsButton, inquiryButton } = withDefaults(
    LAB_EXPERIENCE_CTA.defaults,
    await getSection(LAB_EXPERIENCE_CTA.id),
  );

  return (
    <section className="bg-[radial-gradient(87.13%_87.13%_at_50%_100%,var(--color-bg-brand),#012985,var(--color-bg-navy))] px-lg py-6xl lg:px-6xl lg:py-7xl">
      <div className="flex flex-col items-center gap-3xl lg:gap-6xl">
        <div className="flex flex-col items-center gap-xl text-center lg:gap-lg">
          <h2 className="max-w-[18rem] text-title-m-b text-balance text-text-inverse lg:max-w-full lg:text-title-l-b">
            {title}
          </h2>
          <p className="max-w-[28rem] text-body-xs-m text-balance text-[#e4eaf0] lg:text-body-sm-r lg:text-text-quaternary">
            {body}
          </p>
        </div>
        <div className="flex min-w-[12.5rem] flex-col gap-md lg:flex-row lg:gap-xl">
          <Button
            href={programsButton.href}
            {...linkTargetProps(programsButton.href)}
            className="px-xl py-md text-body-xs-b lg:min-w-[19.75rem] lg:py-xl lg:text-body-sm-b"
          >
            {programsButton.label}
          </Button>
          <Button
            href={inquiryButton.href}
            {...linkTargetProps(inquiryButton.href)}
            variant="inverse"
            className="px-xl py-md text-body-xs-b lg:min-w-[19.75rem] lg:py-xl lg:text-body-sm-b"
          >
            {inquiryButton.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
