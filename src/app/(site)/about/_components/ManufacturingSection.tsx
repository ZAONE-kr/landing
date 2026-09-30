import Image from "next/image";
import type { ReactNode } from "react";

import factoryImage from "@/assets/about/factory-production-line.jpg";

// 줄바꿈은 데스크톱(글 폭 864px)에서만 강제하고, 모바일은 자연스럽게 흐르게 둔다.
const DESKTOP_BR = "hidden lg:inline";

function Point({
  title,
  children,
  bodyClassName = "",
}: {
  title: string;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-lg lg:gap-md">
      <h3 className="text-body-s-sb text-text-primary lg:text-title-s-b lg:text-text-secondary">
        {title}
      </h3>
      <p className={`text-body-s-m text-text-secondary lg:text-body-sm-r ${bodyClassName}`}>
        {children}
      </p>
    </div>
  );
}

/*
 * 글이 위아래 두 덩어리로 나뉜다. 아래 덩어리는 노란빛(bg-highlight)으로 번지는 그라데이션 위에 놓이고,
 * 그 끝에 공장 사진이 화면 폭으로 붙는다. 모바일은 위 덩어리부터 회색 배경(bg-subtle)이다.
 * 데스크톱 시안은 아래 본문만 폭을 820px로 두었다.
 * 데스크톱 시안은 그라데이션(섹션 아래쪽 368px)이 아래 소제목보다 58px 위에서 시작하는데, 코드는 두 덩어리
 * 사이(48px 위)에서 시작한다. 그 10px은 흰색에서 거의 바뀌지 않은 구간이라 차이가 보이지 않는다.
 */
export function ManufacturingSection() {
  return (
    <section>
      <div className="bg-bg-subtle px-lg pt-5xl pb-xl lg:bg-bg-default lg:px-6xl lg:pt-7xl lg:pb-0">
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[54rem] lg:gap-4xl">
          <h2 className="text-title-m-b text-text-primary lg:text-title-l-b">
            우리가 교육 안에서
            <br className="lg:hidden" /> 찾고 있던 답은,
            <br className="hidden lg:inline" /> 뜻밖에도
            <br className="lg:hidden" /> 제조 현장에 있었습니다.
          </h2>
          <Point title="산업에서 쓰임을 잃은 물질도, 다른 환경에서는 새로운 재료가 될 수 있습니다.">
            휴면자원은 제품이 되지 못했거나, 규격과 생산 계획에서 벗어나거나, 다른 쓰임의 경로를
            만나지 못한 채 <br className={DESKTOP_BR} />
            폐기의 경로에 놓이는 물질입니다. 하지만 세심한 관찰과 존중, 그리고 그 표현 가능성에 대한
            탐구를 더하면 휴면자원은 생각을 만들어내고 질문을 던지는 교육적 재료가 될 수 있습니다.
          </Point>
        </div>
      </div>

      <div className="bg-linear-to-b from-bg-subtle to-bg-highlight to-64% px-lg pt-xl pb-3xl lg:from-bg-default lg:px-6xl lg:pt-4xl lg:pb-7xl">
        <div className="mx-auto max-w-[37.5rem] lg:max-w-[54rem]">
          {/* TODO: 시안에 이 소제목이 비어 있다(데스크톱은 위 소제목을 복사해 두었고 모바일은 "서브텍스트").
              실제 문구를 받으면 바꾼다. */}
          <Point
            title="산업에서 쓰임을 잃은 물질도, 다른 환경에서는 새로운 재료가 될 수 있습니다."
            bodyClassName="lg:max-w-[51.25rem]"
          >
            자원은 버려지고 있는 것을 다시 바라보는 관점이 미래세대가 물질을 감각적으로 경험하고,
            생태적 사고를 훈련하며, 환경과 사회를 입체적으로 이해하는 교육으로 이어질 수 있다고
            믿습니다.
            <br className="lg:hidden" /> 휴면자원의 창의적 재사용은 물질을 다시 보고, 세상을
            해석하고 관계 맺는 방식을 배우는 과정입니다. 자원은 휴면자원을 교육적 재료로 연결해
            미래세대가 환경과 사회를 사고하는 경험을 만들어갑니다.
          </Point>
        </div>
      </div>

      {/*
       * 모바일 시안은 9:4로 가운데를 자른다. 데스크톱은 1024·1440 시안 모두 높이 640px에 사진을 폭 1446px로
       * 두고 왼쪽에 붙였다. 그래서 1024에서는 사진 오른쪽이 잘리고, 사진보다 넓은 화면에서는 화면 폭을 따라 커진다.
       */}
      <div className="relative aspect-[9/4] overflow-hidden lg:aspect-auto lg:h-[640px]">
        <div className="absolute inset-0 lg:inset-auto lg:top-1/2 lg:left-0 lg:aspect-[3/2] lg:w-[max(90.375rem,100%)] lg:-translate-y-1/2">
          <Image
            src={factoryImage}
            alt="주황색 시트 부품이 줄지어 놓인 공장의 생산 라인"
            fill
            placeholder="blur"
            sizes="(min-width: 1446px) 100vw, (min-width: 1024px) 1446px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
