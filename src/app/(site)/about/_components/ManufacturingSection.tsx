import Image from "next/image";
import type { ReactNode } from "react";

import factoryImage from "@/assets/about/factory-production-line.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_MANUFACTURING } from "@/sanity/sections/about";

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
 * 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 화면 너비에 맞춰 나눈다.
 */
export async function ManufacturingSection() {
  const content = await loadSection(ABOUT_MANUFACTURING);

  return (
    <section>
      <div className="bg-bg-subtle px-lg pt-5xl pb-xl lg:bg-bg-default lg:px-6xl lg:pt-7xl lg:pb-0">
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[54rem] lg:gap-4xl">
          <h2 className="text-title-m-b text-balance text-text-primary lg:text-title-l-b">
            {content.title}
          </h2>
          <Point title={content.firstTitle}>{content.firstBody}</Point>
        </div>
      </div>

      <div className="bg-linear-to-b from-bg-subtle to-bg-highlight to-64% px-lg pt-xl pb-3xl lg:from-bg-default lg:px-6xl lg:pt-4xl lg:pb-7xl">
        <div className="mx-auto max-w-[37.5rem] lg:max-w-[54rem]">
          <Point title={content.secondTitle} bodyClassName="lg:max-w-[51.25rem]">
            {content.secondBody}
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
            alt={content.imageAlt}
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
