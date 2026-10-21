import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_CREATIVE_REUSE } from "@/sanity/sections/about";

type Need = {
  title: string;
  description: string;
  // lg부터 오각형으로 놓이는 자리. 시안의 680×750 틀 안 좌표다. 개수와 자리는 코드에 고정이고 글만 Studio에서 고친다.
  positionClassName: string;
};

// 원 안 글은 Studio에서 고치고 줄은 원 안에서 자동으로 나뉜다. 모바일은 이 순서대로 두 개씩 놓는다.
const POSITIONS = {
  circleLeft: "lg:top-[176px] lg:left-[2px]",
  circleTop: "lg:top-[17px] lg:left-[220px]",
  circleRight: "lg:top-[176px] lg:left-[438px]",
  circleBottomLeft: "lg:top-[438px] lg:left-[80px]",
  circleBottomRight: "lg:top-[438px] lg:left-[360px]",
} as const;

/*
 * 1024 시안은 원 다이어그램(680px)을 글 아래 가운데에 두고, 1440 시안은 글 옆에 놓는다.
 * 다이어그램이 글 옆에 들어가는 1280부터 좌우로 놓는다. 1440보다 넓으면 1440 시안의 폭(1280px)에 묶는다.
 */
export async function CreativeReuseSection() {
  const content = await loadSection(ABOUT_CREATIVE_REUSE);
  const NEEDS: Need[] = [
    { ...content.circleLeft, positionClassName: POSITIONS.circleLeft },
    { ...content.circleTop, positionClassName: POSITIONS.circleTop },
    { ...content.circleRight, positionClassName: POSITIONS.circleRight },
    { ...content.circleBottomLeft, positionClassName: POSITIONS.circleBottomLeft },
    { ...content.circleBottomRight, positionClassName: POSITIONS.circleBottomRight },
  ];

  return (
    // TODO: 배경 #eaf2ff는 Figma의 bg/brand-soft2다. 파란색 primitive 이름 정리 후 토큰이 생기면 바꾼다.
    <section className="bg-[#eaf2ff] px-lg pt-5xl pb-3xl lg:px-6xl lg:pt-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-4xl lg:max-w-[80rem] xl:flex-row">
        {/* 모바일은 가운데 정렬, 데스크톱은 1024 시안부터 왼쪽 정렬이다. */}
        <div className="flex flex-col items-center gap-xl text-center lg:w-full lg:items-start lg:gap-3xl lg:text-left xl:flex-1">
          <div className="flex flex-col gap-sm lg:gap-xl">
            <h2 className="text-title-m-b text-text-primary lg:text-title-l-b">{content.title}</h2>
            <p className="text-body-s-m text-pretty text-text-secondary lg:text-body-sm-r">
              {content.body}
            </p>
          </div>
          <Button
            href={content.button.href}
            {...linkTargetProps(content.button.href)}
            className="px-2xl py-md text-body-xs-b lg:px-4xl lg:text-title-s-b"
          >
            {content.button.label}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-xl px-s lg:relative lg:h-[750px] lg:w-[680px] lg:shrink-0 lg:px-0">
          <div className="flex flex-col items-center gap-1 text-center lg:absolute lg:top-[303px] lg:left-1/2 lg:-translate-x-1/2 lg:gap-s">
            <p className="text-body-sm-b text-text-primary lg:text-body-l-b">
              {content.centerName}
            </p>
            <p className="text-body-s-m text-text-secondary lg:max-w-[12rem] lg:text-body-sm-m">
              {content.centerDescription}
            </p>
          </div>

          {/* 모바일에서 개수가 홀수면 마지막 원을 가운데로 옮기고, 위 두 원 사이로 당겨 올린다(시안 간격 8px). */}
          <ul className="grid grid-cols-[repeat(2,10.25rem)] gap-x-sm gap-y-xl lg:absolute lg:inset-0 lg:block">
            {NEEDS.map((need, index) => {
              const isOddLast = NEEDS.length % 2 === 1 && index === NEEDS.length - 1;
              return (
                <li
                  key={need.title}
                  className={`flex size-[10.25rem] flex-col items-center justify-center gap-1 rounded-full bg-bg-default p-sm text-center lg:absolute lg:size-60 lg:gap-s lg:p-xl ${isOddLast ? "col-span-2 -mt-4 justify-self-center lg:mt-0" : ""} ${need.positionClassName}`}
                >
                  <h3 className="text-body-s-b text-text-primary lg:text-title-s-b">
                    {need.title}
                  </h3>
                  <p className="text-body-xs-m text-text-tertiary lg:text-body-s-m">
                    {need.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
