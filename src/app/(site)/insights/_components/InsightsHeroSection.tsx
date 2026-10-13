import Image from "next/image";

import heroImage from "@/assets/insights/hero-foam-factory.jpg";

/*
 * 사진(3:2) 위에 왼쪽 위가 짙은 검정 그라데이션을 덮고 제목·소개를 세로 가운데 둔다. 그라데이션은 Figma에서 변수 없이
 * 쓴 값이고, 각도와 멈춤 위치는 사진 틀 기준이다.
 * - 모바일: 섹션 418px. 틀은 높이 502px로 섹션 위에 붙어(375 시안) 아래가 잘린다. 사진은 틀 높이에 맞춰 폭이
 *   753px 이상이 되고, 그보다 넓은 화면에서만 화면 폭을 따라 커진다.
 * - 데스크톱: 섹션 680px. Figma 틀은 섹션 폭의 3:4 세로 틀이고, 가운데가 섹션 가운데보다 16px 위다(1024·1440
 *   시안). 3:2 사진이 이 틀을 덮어서 틀 가운데에 화면 폭의 두 배(1440에서 2880px)로 그려지고 가운데 부분만 보인다.
 *   1440보다 넓은 화면에서도 계속 두 배로 키우면 1920에서 사진이 원본(2880px)보다 커져 흐려지고 패널만 보여서,
 *   2880px에서 멈추고 보이는 폭만 넓힌다. 그보다 넓은 화면에서는 다시 화면 폭을 따른다. 그라데이션은 시안 틀에 둔다.
 */
export function InsightsHeroSection() {
  return (
    <section className="relative isolate flex min-h-[26.125rem] flex-col justify-center overflow-hidden px-xl py-5xl lg:min-h-[42.5rem] lg:px-6xl lg:py-7xl">
      <div className="absolute inset-x-0 top-0 -z-10 h-[31.375rem] lg:top-[calc(50%-1rem)] lg:aspect-[3/4] lg:h-auto lg:-translate-y-1/2">
        <div className="absolute inset-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:aspect-[3/2] lg:w-[200%] lg:-translate-1/2 2xl:w-[max(180rem,100%)]">
          <Image
            src={heroImage}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            sizes="(min-width: 2880px) 100vw, (min-width: 1440px) 2880px, (min-width: 1024px) 200vw, (min-width: 753px) 100vw, 753px"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(110deg,rgb(0_0_0/0.5)_25.28%,rgb(0_0_0/0)_82.148%)]"
        />
      </div>
      <div className="mx-auto flex w-full max-w-[37.5rem] flex-col gap-xl text-text-inverse lg:max-w-[80rem]">
        <h1 className="text-body-l-eb lg:text-heading-m-eb">
          프로젝트에서 발견한
          <br />
          변화와 질문을 기록합니다.
        </h1>
        <p className="text-body-xs-m lg:text-body-sm-r">
          다른 가능성을 만드는 사람들과의 실험과 배움을 나눕니다.
        </p>
      </div>
    </section>
  );
}
