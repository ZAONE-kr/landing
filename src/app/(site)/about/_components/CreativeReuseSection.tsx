import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

// 원 안 문구는 모바일(원 164px)과 데스크톱(원 240px) 시안이 서로 다른 자리에서 줄을 바꾼다.
const MOBILE_BR = "lg:hidden";
const DESKTOP_BR = "hidden lg:inline";

type Need = {
  title: string;
  description: ReactNode;
  // lg부터 오각형으로 놓이는 자리. 시안의 680×750 틀 안 좌표다.
  positionClassName: string;
};

// 모바일은 이 순서대로 두 개씩 놓는다.
const NEEDS: Need[] = [
  {
    title: "제조기업",
    description: (
      <>
        생산 과정에서 발생하는
        <br /> 휴면자원에 새로운
        <br className={MOBILE_BR} /> 연결이
        <br className={DESKTOP_BR} /> 필요합니다.
      </>
    ),
    positionClassName: "lg:top-[176px] lg:left-[2px]",
  },
  {
    title: "미래세대",
    description: (
      <>
        물질과 환경을 더 세심하게
        <br className={DESKTOP_BR} /> 보고, 스스로 질문하는 힘을 기릅니다.
      </>
    ),
    positionClassName: "lg:top-[17px] lg:left-[220px]",
  },
  {
    title: "교육현장",
    // 가운뎃점으로만 이어진 긴 낱말이라 break-keep에서는 줄이 안 바뀐다. 가운뎃점 뒤에 줄바꿈 자리를 둔다.
    description: (
      <>
        창의성·
        <wbr />
        문제해결력·
        <wbr />
        <br className={MOBILE_BR} />
        생태감수성을 함께
        <br className={MOBILE_BR} /> 기를 수 있는 교육환경이
        <br className={MOBILE_BR} /> 필요합니다.
      </>
    ),
    positionClassName: "lg:top-[176px] lg:left-[438px]",
  },
  {
    title: "공공·지역사회",
    // 모바일 시안은 "지속가능성"을 "지속 / 가능성"으로 나눠 원 안에 맞췄다.
    description: (
      <>
        도서관, 문화시설,
        <br className={MOBILE_BR} /> 커뮤니티 공간을 지속
        <br className={MOBILE_BR} />
        가능성을 배우는
        <br className={DESKTOP_BR} /> 장소로
        <br className={MOBILE_BR} /> 설계합니다.
      </>
    ),
    positionClassName: "lg:top-[438px] lg:left-[80px]",
  },
  {
    title: "기업·재단",
    description: (
      <>
        환경과 미래세대를 함께
        <br className={MOBILE_BR} /> 다루는
        <br className={DESKTOP_BR} /> 사회공헌 모델이
        <br className={MOBILE_BR} /> 필요합니다.
      </>
    ),
    positionClassName: "lg:top-[438px] lg:left-[360px]",
  },
];

/*
 * 1024 시안은 원 다이어그램(680px)을 글 아래 가운데에 두고, 1440 시안은 글 옆에 놓는다.
 * 다이어그램이 글 옆에 들어가는 1280부터 좌우로 놓는다. 1440보다 넓으면 1440 시안의 폭(1280px)에 묶는다.
 */
export function CreativeReuseSection() {
  return (
    // TODO: 배경 #eaf2ff는 Figma의 bg/brand-soft2다. 파란색 primitive 이름 정리 후 토큰이 생기면 바꾼다.
    <section className="bg-[#eaf2ff] px-lg pt-5xl pb-3xl lg:px-6xl lg:pt-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-4xl lg:max-w-[80rem] xl:flex-row">
        {/* 모바일은 가운데 정렬, 데스크톱은 1024 시안부터 왼쪽 정렬이다. */}
        <div className="flex flex-col items-center gap-xl text-center lg:w-full lg:items-start lg:gap-3xl lg:text-left xl:flex-1">
          <div className="flex flex-col gap-sm lg:gap-xl">
            <h2 className="text-title-m-b text-text-primary lg:text-title-l-b">
              재료의 창의적 재사용
            </h2>
            {/* 375 시안은 네 줄로 끊고, 640·1024·1440 시안은 흘려 둔다. */}
            <p className="text-body-s-m text-text-secondary lg:text-body-sm-r">
              자원은 산업 현장의 휴면자원을 교육과 사회의 다양한
              <br className="sm:hidden" /> 맥락으로 연결합니다. 재료를 다시 보고, 경험하고,
              <br className="sm:hidden" /> 해석하는 과정에서 교육적·사회적·환경적 가치가
              <br className="sm:hidden" /> 만들어집니다.
            </p>
          </div>
          <Button
            href="/partner-with-us"
            className="px-2xl py-md text-body-xs-b lg:px-4xl lg:text-title-s-b"
          >
            ZAONE과 협력하는 방법 보기
          </Button>
        </div>

        <div className="flex flex-col items-center gap-xl px-s lg:relative lg:h-[750px] lg:w-[680px] lg:shrink-0 lg:px-0">
          <div className="flex flex-col items-center gap-1 text-center lg:absolute lg:top-[303px] lg:left-1/2 lg:-translate-x-1/2 lg:gap-s">
            <p className="text-body-sm-b text-text-primary lg:text-body-l-b">ZAONE</p>
            <p className="text-body-s-m text-text-secondary lg:text-body-sm-m">
              휴면자원으로 서로 다른
              <br className={DESKTOP_BR} /> 필요를 연결합니다.
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
