import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import leatherImage from "@/assets/home/feature-leather-factory.jpg";
import blocksImage from "@/assets/home/feature-play-blocks.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { HOME_DORMANT_RESOURCE, HOME_ENVIRONMENT } from "@/sanity/sections/home";

type FeatureSplitProps = {
  title: string;
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
    <section className={`bg-bg-subtle px-lg lg:px-5xl 2xl:px-7xl ${className}`}>
      <div
        className={`mx-auto flex max-w-[37.5rem] flex-col items-center gap-3xl lg:max-w-[75rem] lg:gap-5xl 2xl:gap-7xl ${imageSide === "left" ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      >
        <div className="flex w-full flex-col gap-xl lg:flex-1 2xl:gap-2xl">
          <h2 className="text-title-m-b whitespace-pre-line text-text-primary xl:text-body-l-b 2xl:text-title-l-b">
            {title}
          </h2>
          <div className="flex flex-col gap-lg text-body-xs-m text-text-secondary lg:text-body-s-m 2xl:text-body-sm-r">
            {children}
          </div>
        </div>
        <div className="relative aspect-[3/2] w-full overflow-hidden lg:aspect-[570/750] lg:w-[47.5%] lg:shrink-0">
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

// 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 화면 너비에 맞춰 나눈다.
export async function EnvironmentSection() {
  const { title, first, second, imageAlt } = await loadSection(HOME_ENVIRONMENT);

  return (
    <FeatureSplit
      title={title}
      image={blocksImage}
      imageAlt={imageAlt}
      imageSide="right"
      imageClassName="lg:object-[29%_50%]"
      className="pt-5xl pb-3xl lg:pt-7xl"
    >
      <p>{first}</p>
      <p>{second}</p>
    </FeatureSplit>
  );
}

export async function DormantResourceSection() {
  const { title, first, second, imageAlt } = await loadSection(HOME_DORMANT_RESOURCE);

  return (
    <FeatureSplit
      title={title}
      image={leatherImage}
      imageAlt={imageAlt}
      imageSide="left"
      imageClassName="lg:object-[20%_50%]"
      className="py-lg lg:pt-3xl lg:pb-7xl"
    >
      <p>{first}</p>
      <p>{second}</p>
    </FeatureSplit>
  );
}
