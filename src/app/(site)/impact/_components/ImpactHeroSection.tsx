import Image from "next/image";

import heroImage from "@/assets/impact/hero-climate-strike.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { IMPACT_HERO } from "@/sanity/sections/impact";

/*
 * 사진은 섹션을 덮도록 가운데를 자르고(16:9, 375: 498px, 1024: 1209px 폭), 검정 50%를 덮는다.
 * 검정은 Figma에서 변수 없이 쓴 값이다. 원본이 1672px 폭뿐이라 넓은 화면의 레티나에서는 조금 흐리다.
 * 모바일 280px, 데스크톱 680px 높이에 제목을 가운데 둔다. 기본 글자 크기를 키우면 제목을 따라 높아진다.
 * 제목은 Studio에서 고친다. 시안은 모바일 세 줄, 데스크톱 두 줄로 끊었으므로 폭을 묶고 고르게 나눈다(text-balance).
 */
export async function ImpactHeroSection() {
  const { title } = await loadSection(IMPACT_HERO);

  return (
    <section className="relative isolate flex min-h-[17.5rem] items-center justify-center overflow-hidden px-xl text-center lg:min-h-[42.5rem] lg:px-7xl">
      <Image
        src={heroImage}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="(min-width: 1209px) 100vw, (min-width: 1024px) 1209px, (min-width: 498px) 100vw, 498px"
        className="-z-10 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(0_0_0/0.5)]" />
      <h1 className="max-w-[16rem] text-body-l-eb text-balance text-text-inverse lg:max-w-[40rem] lg:text-heading-mm-eb lg:text-pretty">
        {title}
      </h1>
    </section>
  );
}
