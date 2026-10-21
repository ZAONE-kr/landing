import Image from "next/image";

import heroImage from "@/assets/home/hero-glacier-child.jpg";
import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { loadSection } from "@/sanity/lib/sections";
import { HOME_HERO } from "@/sanity/sections/home";

// 글과 버튼은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 제목은 시안의 세 줄을 기본값에 줄바꿈으로 담아 두었다(Enter로 고칠 수 있다).
export async function HeroSection() {
  const { title, first, second, button, imageAlt } = await loadSection(HOME_HERO);

  return (
    <section className="flex flex-col lg:h-[680px] lg:flex-row">
      <div className="relative h-[280px] overflow-hidden lg:h-auto lg:flex-1">
        <Image
          src={heroImage}
          alt={imageAlt}
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 1024px) 59vw, 100vw"
          className="object-cover object-[50%_63%] lg:object-center"
        />
      </div>

      {/*
       * 데스크톱 글은 1440 시안 그대로 둔다. 글 칸이 41.32%로 좁아지면 시안의 줄(가장 긴 줄 391px)이
       * 들어가지 않으므로, 1280 아래에서는 글 칸 너비를 528px로 지키고 사진을 줄인다.
       */}
      <div className="bg-bg-brand-soft px-lg py-2xl lg:w-[41.32%] lg:min-w-[33rem] lg:overflow-hidden lg:px-5xl lg:py-6xl">
        <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-4xl lg:mx-0 lg:max-w-full lg:items-start">
          <div className="flex w-full flex-col gap-lg lg:gap-2xl">
            <h1 className="text-body-l-eb break-keep whitespace-pre-line text-text-primary lg:text-heading-m-eb">
              {title}
            </h1>
            <div className="text-body-s-m text-text-secondary lg:text-body-sm-m">
              <p>{first}</p>
              <p>{second}</p>
            </div>
          </div>
          <Button
            href={button.href}
            {...linkTargetProps(button.href)}
            className="px-4xl py-md text-detail-s-b 2xl:text-title-s-b"
          >
            {button.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
