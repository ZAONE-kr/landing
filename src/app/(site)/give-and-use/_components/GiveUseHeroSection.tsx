import Image from "next/image";

import heroImage from "@/assets/give-and-use/hero-fabric-texture.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { GIVE_USE_HERO } from "@/sanity/sections/giveAndUse";

/*
 * 천 사진은 원래 어두워서 시안에 덮는 그라데이션이 없다. 사진 틀은 섹션 높이에 맞춘 원본 비율이라
 * object-cover로 가운데를 자른다(375: 979px, 1024 이상 680px 높이: 1594px 폭).
 * 모바일 높이는 글 길이로 정해지고(375 시안 418px), 데스크톱은 680px에 글을 가운데 둔다
 * (시안은 640px이었으나 요청으로 높임).
 * 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 제목은 낱말 단위로 끊고(break-keep) 폭을 묶어 시안의 줄에 가깝게 나누고, 본문은 이어서 나눈다.
 */
export async function GiveUseHeroSection() {
  const { title, first, second } = await loadSection(GIVE_USE_HERO);

  return (
    <section className="relative isolate flex flex-col items-center justify-center gap-xl overflow-hidden px-xl py-5xl text-center lg:h-[680px] lg:gap-2xl lg:px-6xl lg:py-0">
      <Image
        src={heroImage}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="(min-width: 1594px) 100vw, (min-width: 1024px) 1594px, 980px"
        className="-z-10 object-cover"
      />
      <h1 className="max-w-[20rem] text-body-l-eb break-keep text-text-inverse lg:max-w-[45rem] lg:text-heading-mm-eb">
        {title}
      </h1>
      {/* 모바일 시안은 본문을 한 단계 흐린 색(text-quaternary)으로 둔다. */}
      <div className="flex max-w-[54rem] flex-col gap-sm text-body-xs-m text-text-quaternary lg:text-body-sm-r lg:text-text-inverse">
        <p>{first}</p>
        <p>{second}</p>
      </div>
    </section>
  );
}
