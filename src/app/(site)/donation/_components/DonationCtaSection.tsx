import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { loadSection } from "@/sanity/lib/sections";
import { DONATION_CTA } from "@/sanity/sections/donation";

/*
 * 회색 바탕 아래 가운데에서 노란빛(bg-highlight)이 번진다. 시안의 흐린 타원(Ellipse 9: 375 510×416, 1024 1176×416,
 * 흐림 120)을 같은 크기·색·흐림으로 그리고, 섹션 아래 끝에서 같은 거리(375 224px, 1024 236px)만큼 내려 둔다.
 * 모바일은 글과 버튼을 가운데 세로로, 데스크톱은 글 왼쪽·버튼 오른쪽으로 놓고 864px(1024 시안 폭)에 묶는다.
 * 데스크톱 한 줄 글은 시안처럼 한 줄에 들어가고, 모바일은 줄 길이를 고르게 나눈다.
 */
export async function DonationCtaSection() {
  const { title, body, button } = await loadSection(DONATION_CTA);

  return (
    <section className="relative isolate overflow-hidden bg-bg-surface px-lg py-6xl lg:px-6xl lg:py-7xl">
      <div
        aria-hidden
        className="absolute -bottom-[224px] left-1/2 -z-10 h-[416px] w-[510px] -translate-x-1/2 rounded-[50%] bg-bg-highlight blur-[120px] lg:-bottom-[236px] lg:w-[1176px]"
      />
      <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-3xl lg:max-w-[54rem] lg:flex-row lg:gap-5xl">
        <div className="flex flex-col gap-md text-center lg:flex-1 lg:gap-lg lg:text-left">
          <h2 className="text-title-m-b whitespace-pre-line text-text-primary lg:text-title-l-b">
            {title}
          </h2>
          <p className="text-body-s-m text-balance text-text-secondary lg:text-body-sm-r">{body}</p>
        </div>
        <Button
          href={button.href}
          {...linkTargetProps(button.href)}
          className="w-[12.5rem] px-xl py-md text-body-xs-b lg:w-[15rem] lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          {button.label}
        </Button>
      </div>
    </section>
  );
}
