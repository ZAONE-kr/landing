import Image from "next/image";

import heroImage from "@/assets/about/hero-stone-samples.jpg";

// 사진 위 검정 그라데이션은 Figma에서 변수 없이 쓴 값이다. 멈춤 위치는 시안의 사진 틀을 섹션 기준으로 옮겼다.
export function AboutHeroSection() {
  return (
    <section className="relative isolate flex h-[280px] items-center justify-center overflow-hidden px-lg lg:h-[680px] lg:px-5xl">
      <Image
        src={heroImage}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover lg:object-[50%_7%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(0_0_0/0.5)] from-3% to-[rgb(0_0_0/0.15)] to-63% lg:from-9% lg:to-84%"
      />
      <h1 className="text-center text-body-l-eb text-text-inverse lg:text-heading-l-eb">
        세상은 불완전한 것들로
        <br />
        이루어져 있습니다
      </h1>
    </section>
  );
}
