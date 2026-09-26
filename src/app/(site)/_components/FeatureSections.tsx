import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import leatherImage from "@/assets/home/feature-leather-factory.jpg";
import blocksImage from "@/assets/home/feature-play-blocks.jpg";

type FeatureSplitProps = {
  title: ReactNode;
  children: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  imageSide: "left" | "right";
  // 시안마다 사진을 자른 위치가 달라 object-position을 따로 받는다.
  imageClassName: string;
  className: string;
};

function FeatureSplit({
  title,
  children,
  image,
  imageAlt,
  imageSide,
  imageClassName,
  className,
}: FeatureSplitProps) {
  return (
    <section className={`bg-bg-subtle px-xl lg:px-5xl 2xl:px-7xl ${className}`}>
      <div
        className={`mx-auto flex max-w-[37rem] flex-col items-center gap-3xl lg:max-w-[75rem] lg:gap-5xl 2xl:gap-7xl ${imageSide === "left" ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      >
        <div className="flex w-full flex-col gap-xl lg:flex-1 2xl:gap-2xl">
          <h2 className="text-title-m-b text-text-primary xl:text-body-l-b 2xl:text-title-l-b">
            {title}
          </h2>
          <div className="flex flex-col gap-lg text-body-xs-m text-text-secondary lg:text-body-s-m 2xl:text-body-sm-m">
            {children}
          </div>
        </div>
        {/* 모바일 사진은 글보다 양옆으로 4px 넓다(시안 20px 여백 vs 글 24px). */}
        <div className="relative aspect-[3/2] w-[calc(100%+0.5rem)] overflow-hidden lg:aspect-[570/750] lg:w-[47.5%] lg:shrink-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={`object-cover ${imageClassName}`}
          />
        </div>
      </div>
    </section>
  );
}

// 줄바꿈은 시안 폭(2xl)에서만 강제하고, 그보다 좁으면 자연스럽게 흐르게 둔다.
const DESKTOP_BR = "hidden 2xl:inline";

export function EnvironmentSection() {
  return (
    <FeatureSplit
      title={
        <>
          우리가 가장 먼저 바꾸려는 것은,
          <br />
          어린 시절을 둘러싼 환경입니다.
        </>
      }
      image={blocksImage}
      imageAlt="구멍이 뚫린 흰색 조각들이 겹쳐 쌓인 모습"
      imageSide="right"
      imageClassName="lg:object-[29%_50%]"
      className="pt-5xl pb-3xl lg:pt-7xl"
    >
      <p>
        그 시작점에서 ZAONE은 물질을 봅니다.
        <br />
        무엇을 만들고, 얼마나 사용하고, 무엇을 버리는지. 어떤 물질을 <br className={DESKTOP_BR} />
        오래 쓰고, 어떤 것은 너무 쉽게 포기하는지. 이런 선택은 우리가 <br className={DESKTOP_BR} />
        살아갈 환경을 만들고, 동시에 어린 시절의 경험을 만듭니다.
      </p>
      <p>
        기후위기는 자연재해만의 문제가 아닙니다. 사람들이 살아가는 <br className={DESKTOP_BR} />
        장소와 방식, 가족과 지역사회의 조건, 어린이가 경험할 수 있는 <br className={DESKTOP_BR} />
        일상의 범위까지 바꿉니다. 우리는 환경을 지키는 일과 어린 시절을{" "}
        <br className={DESKTOP_BR} />
        지키는 일을 서로 다른 이야기로 보지 않습니다.
      </p>
    </FeatureSplit>
  );
}

export function DormantResourceSection() {
  return (
    <FeatureSplit
      title={
        <>
          휴면자원을 발굴하고,
          <br />
          교육과 사회의 현장에 제공합니다.
        </>
      }
      image={leatherImage}
      imageAlt="공장 안 거치대에 겹겹이 걸린 가죽 원단"
      imageSide="left"
      imageClassName="lg:object-[20%_50%]"
      className="py-lg lg:pt-3xl lg:pb-7xl"
    >
      <p>
        ZAONE은 기업이 보유한 휴면자원을 검토하고 분류해 학교와 <br className={DESKTOP_BR} />
        교육·돌봄기관, 복지기관, 도서관·문화공간 등이 사용할 수 있도록 제공합니다. 재료를 사용하는
        교사와 교육자에게는 휴면자원의 <br className={DESKTOP_BR} />
        특성을 이해하고 활용할 수 있는 교육과 훈련을 제공합니다.
      </p>
      <p>
        기업·재단·공공기관과는 휴면자원을 매개로 미래세대, 환경, <br className={DESKTOP_BR} />
        지역사회를 다루는 사회공헌 프로젝트를 기획하고 운영합니다.
      </p>
    </FeatureSplit>
  );
}
