import Image from "next/image";

import heroImage from "@/assets/about/hero-stone-samples.jpg";

/*
 * 시안은 사진 틀을 3:2로 잡아 섹션 가운데에 둔다. 틀 폭은 480px 이상이라 375에서는 사진이 조금
 * 확대되고, 640부터는 화면 폭에 맞는다. 데스크톱은 틀이 섹션(640px)보다 높아서 위아래가 잘린다.
 * 검정 그라데이션은 Figma에서 변수 없이 쓴 값이고, 멈춤 위치는 사진 틀 기준이다.
 */
export function AboutHeroSection() {
  return (
    <section className="relative isolate flex h-[280px] items-center justify-center overflow-hidden px-lg lg:h-[640px] lg:px-7xl">
      <div className="absolute top-1/2 left-1/2 -z-10 aspect-[3/2] w-[max(30rem,100%)] -translate-x-1/2 -translate-y-1/2">
        <Image
          src={heroImage}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 480px) 100vw, 480px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[rgb(0_0_0/0.5)] from-[8.655%] to-[rgb(0_0_0/0.15)] to-[61.522%]"
        />
      </div>
      <h1 className="text-center text-body-l-eb text-text-inverse lg:text-heading-lm-eb">
        세상은 불완전한 것들로
        <br />
        이루어져 있습니다
      </h1>
    </section>
  );
}
