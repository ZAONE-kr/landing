import Image from "next/image";

import heroImage from "@/assets/about/hero-stone-samples.jpg";

/*
 * 모바일 시안은 사진 틀을 폭 480px 이상(3:2)으로 잡아 가운데에 둔다. 그래서 375에서는 사진이
 * 조금 확대되고 640부터는 화면 폭에 맞는다. 데스크톱은 섹션을 채우고 위에서 7% 지점을 보여준다.
 * 검정 그라데이션은 Figma에서 변수 없이 쓴 값이다. 멈춤 위치는 모바일은 사진 틀, 데스크톱은 섹션 기준이다.
 */
export function AboutHeroSection() {
  return (
    <section className="relative isolate flex h-[280px] items-center justify-center overflow-hidden px-lg lg:h-[680px] lg:px-5xl">
      <div className="absolute top-1/2 left-1/2 -z-10 aspect-[3/2] w-[max(30rem,100%)] -translate-x-1/2 -translate-y-1/2 lg:inset-0 lg:aspect-auto lg:w-full lg:translate-none">
        <Image
          src={heroImage}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 480px) 100vw, 480px"
          className="object-cover lg:object-[50%_7%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[rgb(0_0_0/0.5)] from-[8.655%] to-[rgb(0_0_0/0.15)] to-[61.522%] lg:from-9% lg:to-84%"
        />
      </div>
      <h1 className="text-center text-body-l-eb text-text-inverse lg:text-heading-l-eb">
        세상은 불완전한 것들로
        <br />
        이루어져 있습니다
      </h1>
    </section>
  );
}
