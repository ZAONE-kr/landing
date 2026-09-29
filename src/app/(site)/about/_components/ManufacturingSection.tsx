import Image from "next/image";
import type { ReactNode } from "react";

import factoryImage from "@/assets/about/factory-production-line.jpg";

// 줄바꿈은 시안 폭(2xl)에서만 강제하고, 그보다 좁으면 자연스럽게 흐르게 둔다.
const DESKTOP_BR = "hidden 2xl:inline";

function Point({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-lg lg:gap-xl">
      <h3 className="text-body-s-sb text-text-primary lg:text-title-m-b lg:text-text-secondary">
        {title}
      </h3>
      <p className="text-body-s-m text-text-secondary lg:text-body-sm-r">{children}</p>
    </div>
  );
}

/*
 * 글이 위아래 두 덩어리로 나뉜다. 아래 덩어리는 노란빛(bg-highlight)으로 번지는 그라데이션 위에 놓이고,
 * 그 끝에 공장 사진이 화면 폭으로 붙는다. 모바일은 위 덩어리부터 회색 배경(bg-subtle)이다.
 * 데스크톱 그라데이션은 섹션 아래쪽 368px에 깔리므로, 아래 덩어리가 소제목보다 44px 위에서 시작한다.
 */
export function ManufacturingSection() {
  return (
    <section>
      <div className="bg-bg-subtle px-lg pt-5xl pb-xl lg:bg-bg-default lg:px-7xl lg:pt-7xl lg:pb-lg">
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[51.25rem] lg:gap-5xl">
          <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
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

      <div className="bg-linear-to-b from-bg-subtle to-bg-highlight to-64% px-lg pt-xl pb-3xl lg:from-bg-default lg:px-7xl lg:pt-[44px] lg:pb-7xl">
        <div className="mx-auto max-w-[37.5rem] lg:max-w-[51.25rem]">
          {/* TODO: 시안에 이 소제목이 비어 있다(데스크톱은 위 소제목을 복사해 두었고 모바일은 "서브텍스트").
              실제 문구를 받으면 바꾼다. */}
          <Point title="산업에서 쓰임을 잃은 물질도, 다른 환경에서는 새로운 재료가 될 수 있습니다.">
            자원은 버려지고 있는 것을 다시 바라보는 관점이 미래세대가 물질을 감각적으로 경험하고,
            생태적 사고를 훈련하며, 환경과 사회를 입체적으로 이해하는 교육으로 이어질 수 있다고
            믿습니다.
            <br className="lg:hidden" /> 휴면자원의 창의적 재사용은 물질을 다시 보고, 세상을
            해석하고 관계 맺는 방식을 배우는 과정입니다. 자원은 휴면자원을 교육적 재료로 연결해
            미래세대가 환경과 사회를 사고하는 경험을 만들어갑니다.
          </Point>
        </div>
      </div>

      {/* 시안 세 폭 모두 9:4로 가운데를 자른다. 1440보다 넓으면 높이를 시안 값에 묶는다. */}
      <div className="relative aspect-[9/4] overflow-hidden 2xl:aspect-auto 2xl:h-[640px]">
        <Image
          src={factoryImage}
          alt="주황색 시트 부품이 줄지어 놓인 공장의 생산 라인"
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
