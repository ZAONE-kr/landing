import Image from "next/image";

import heroImage from "@/assets/zaone-lab/hero-child-looking-up.jpg";

/*
 * 사진 틀은 원본 비율(3000×1996, 3:2보다 조금 넓다)이고, 틀 위에 왼쪽 위가 짙은 검정 그라데이션을 덮는다.
 * 그라데이션은 Figma에서 변수 없이 쓴 값이고, 각도와 멈춤 위치는 틀 기준이다(세 시안 모두 틀 비율이 같아 같은 값이다).
 * - 모바일: 섹션 418px에 제목을 위에 둔다. 틀은 폭 705px 이상으로 섹션 위에 붙이고, 가운데를 섹션 가운데보다
 *   30px 오른쪽에 둔다(375 시안). 그래서 좌우와 섹션 아래로 넘친 부분이 잘린다.
 * - 데스크톱: 섹션 680px에 제목을 세로 가운데 둔다. 틀은 폭 1227px 이상으로 왼쪽에 붙이고, 가운데가 섹션
 *   가운데보다 6px 아래에 온다(1024·1440 시안). 1024에서는 오른쪽이 잘리고, 더 넓으면 화면 폭을 따라 커진다.
 * 데스크톱 제목은 Heading-MM-EB 크기에 줄 간격만 1.3이다(Figma에 텍스트 스타일 없이 쓴 값).
 */
export function LabHeroSection() {
  return (
    <section className="relative isolate min-h-[26.125rem] overflow-hidden px-xl py-5xl lg:flex lg:min-h-[42.5rem] lg:items-center lg:px-6xl lg:py-7xl">
      <div className="absolute top-0 left-[calc(50%+30px)] -z-10 aspect-[1440/958] min-h-full w-[max(44.0625rem,calc(100%+60px))] -translate-x-1/2 lg:top-[calc(50%+6px)] lg:left-0 lg:min-h-0 lg:w-[max(76.6875rem,100%)] lg:translate-x-0 lg:-translate-y-1/2">
        <Image
          src={heroImage}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 1227px) 100vw, (min-width: 1024px) 1227px, (min-width: 645px) calc(100vw + 60px), 705px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(126.1deg,rgb(0_0_0/0.5)_25.28%,rgb(0_0_0/0)_82.148%)]"
        />
      </div>
      <h1 className="mx-auto max-w-[37.5rem] text-body-l-eb text-text-inverse lg:w-full lg:max-w-[80rem] lg:text-heading-mm-eb lg:leading-[1.3]">
        답을 얻는 일이
        <br /> 쉬워질수록, 우리는
        <br /> 무엇을 배워야 할까요?
      </h1>
    </section>
  );
}
