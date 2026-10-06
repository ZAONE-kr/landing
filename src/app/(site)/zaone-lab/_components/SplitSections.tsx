import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import stonesImage from "@/assets/zaone-lab/children-exploring-stones.jpg";
import sewingImage from "@/assets/zaone-lab/sewing-workshop.jpg";

/*
 * 데스크톱에서 좁은 칸의 폭. 1024 시안 440px, 1440 시안 640px이 되도록 그 사이를 화면 폭에 따라 늘리고
 * (넓은 칸은 나머지 584·800px), 1440보다 넓어도 같은 비율로 늘어난다.
 */
const NARROW_COLUMN_CLASS = "lg:w-[calc(27.5rem+(100%-64rem)*0.4808)] lg:shrink-0";
const WIDE_COLUMN_CLASS = "lg:min-w-0 lg:flex-1";

type SplitSectionProps = {
  title: ReactNode;
  children: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  // 데스크톱에서 사진이 놓이는 쪽. 사진이 오른쪽이면 사진 칸이, 왼쪽이면 글 칸이 좁은 칸이다.
  imageSide: "left" | "right";
  // 데스크톱에서 사진을 자르는 위치(시안마다 다르다).
  imageClassName: string;
  sizes: string;
  className: {
    section: string;
    // 글 칸의 데스크톱 좌우 여백과 1440 시안의 글 폭.
    text: string;
    title: string;
    body: string;
  };
};

/*
 * 글과 사진이 나란히 놓이는 섹션. 모바일은 글 아래에 사진을 화면 폭(3:2)으로 둔다.
 * 데스크톱은 섹션 높이가 690px 이상이고, 사진은 칸을 덮도록 잘린다(칸 높이에 맞춰 1035px 안팎 폭).
 * 1440보다 넓으면 글은 1440 시안의 글 폭에 묶고 칸만 넓어진다.
 */
function SplitSection({
  title,
  children,
  image,
  imageAlt,
  imageSide,
  imageClassName,
  sizes,
  className,
}: SplitSectionProps) {
  const imageOnRight = imageSide === "right";

  return (
    <section
      className={`flex flex-col pt-5xl lg:min-h-[43.125rem] lg:pt-0 ${imageOnRight ? "lg:flex-row" : "lg:flex-row-reverse"} ${className.section}`}
    >
      <div
        className={`px-xl lg:py-7xl ${imageOnRight ? WIDE_COLUMN_CLASS : NARROW_COLUMN_CLASS} ${className.text}`}
      >
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:mx-0 lg:max-w-(--text-width)">
          <h2 className={`text-title-m-b lg:text-title-mm-sb ${className.title}`}>{title}</h2>
          <div className={`flex flex-col gap-md text-body-s-m ${className.body}`}>{children}</div>
        </div>
      </div>
      <div
        className={`relative mt-3xl aspect-[3/2] lg:mt-0 lg:aspect-auto ${imageOnRight ? NARROW_COLUMN_CLASS : WIDE_COLUMN_CLASS}`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          placeholder="blur"
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      </div>
    </section>
  );
}

/*
 * 사진은 1024 시안에서 오른쪽을 52px 남기고 자르고, 1440 시안에서는 오른쪽 끝에 맞춘다.
 * 사진 폭은 칸 높이를 따라 1035px 안팎이고, 화면이 2262px보다 넓으면 칸 폭이 그보다 넓어져 칸 폭을 따른다.
 * 1024 시안은 둘째 문단만 폭이 384px인데, 1440 시안처럼 두 문단 모두 글 폭을 채운다.
 */
export function MaterialPlaySection() {
  return (
    <SplitSection
      title={
        <>
          ZAONE LAB은
          <br /> 그 훈련을 물질과 놀이에서 시작합니다.
        </>
      }
      image={stonesImage}
      imageAlt="아이들이 탁자에 둘러앉아 여러 모양의 돌을 만지며 살펴보는 모습"
      imageSide="right"
      imageClassName="lg:object-[91.3%_50%] 2xl:object-right"
      sizes="(min-width: 2262px) calc(27.5rem + (100vw - 64rem) * 0.4808), (min-width: 1024px) 1035px, 100vw"
      className={{
        section: "bg-bg-navy",
        text: "lg:px-6xl lg:[--text-width:40rem]",
        title: "text-text-inverse",
        body: "text-text-quaternary lg:text-body-sm-r",
      }}
    >
      <p>
        휴면자원에는 정해진 사용법도, 완성해야 할 모양도 없습니다. 직접 만져보고, 움직여보고,
        연결해봐야 무엇이 가능한지 알 수 있습니다.
      </p>
      <p>
        예상과 다르면 다시 시도하고, 다른 사람이 같은 재료를 전혀 다른 방식으로 사용하는 것을 보며
        자신의 생각을 바꾸기도 합니다. 우리는 결과보다 과정, 혼자 해결하는 능력보다 협력과 상호의존,
        정답을 따르는 일보다 스스로 방법을 찾는 경험을 중요하게 봅니다.
      </p>
    </SplitSection>
  );
}

/*
 * 사진(16:9)은 1024·1440 시안 모두 왼쪽 266px을 잘라 둔다. 칸이 사진보다 266px 넘게 좁지 않으면(아주 넓은 화면)
 * 오른쪽 끝에 맞춰 빈틈이 생기지 않게 한다. 모바일은 3:2 틀에 가운데를 자른다.
 * 시안은 이 사진 밑에 다른 사진(창의성은_후보 3)을 깔아 위아래 1px씩 비치는데, 가려지는 사진이라 넣지 않았다.
 * 원본이 1920px 폭뿐이라(Figma 사진과 같은 파일) 데스크톱 레티나에서는 조금 흐리다.
 */
export function ResponsibilitySection() {
  return (
    <SplitSection
      title={
        <>
          우리는 무엇을 만들고 소비하는지, 무엇을 배우고 가르치는지,
          <br className="lg:hidden" /> 그리고 그 과정에서 사람과 환경에 어떤 책임을 갖는지 묻습니다.
        </>
      }
      image={sewingImage}
      imageAlt="공방에서 재봉틀로 가죽 조각을 박는 사람"
      imageSide="left"
      imageClassName="lg:object-[max(-266px,100%)_50%]"
      sizes="(min-width: 1024px) 1227px, 119vw"
      className={{
        section: "bg-bg-highlight",
        text: "lg:pr-6xl lg:pl-5xl lg:[--text-width:31rem]",
        title: "text-text-primary",
        body: "text-text-secondary lg:text-body-sm-m",
      }}
    >
      <p>
        ZAONE LAB은 UN 2030 Agenda가 다루는 지속가능한 생산과 소비, 교육, 지역사회와 환경의 문제를
        우리의 일상과 연결해 살펴봅니다.
      </p>
    </SplitSection>
  );
}
