import Image from "next/image";

import heroImage from "@/assets/about/hero-stone-samples.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_HERO } from "@/sanity/sections/about";

/*
 * 시안은 사진 틀을 3:2로 잡아 섹션 가운데에 둔다. 틀 폭은 480px 이상이라 375에서는 사진이 조금
 * 확대되고, 640부터는 화면 폭에 맞는다. 데스크톱은 틀이 섹션(640px)보다 높아서 위아래가 잘린다.
 * 검정 그라데이션은 Figma에서 변수 없이 쓴 값이고, 멈춤 위치는 사진 틀 기준이다.
 * 운영자가 Studio에서 사진을 올리면 그 사진이 섹션을 채우고, 그라데이션도 섹션 기준이 된다.
 * 글은 Studio에서 고친다. 시안은 두 줄로 끊었으므로 폭을 묶고 낱말 단위로 끊어(break-keep) 시안의 줄에 맞춘다.
 */
export async function AboutHeroSection() {
  const { title, photo } = await loadSection(ABOUT_HERO);
  const uploaded = toCroppedImage(photo);

  return (
    <section className="relative isolate flex h-[280px] items-center justify-center overflow-hidden px-lg lg:h-[640px] lg:px-7xl">
      <div
        className={
          uploaded
            ? "absolute inset-0 -z-10"
            : "absolute top-1/2 left-1/2 -z-10 aspect-[3/2] w-[max(30rem,100%)] -translate-x-1/2 -translate-y-1/2"
        }
      >
        {uploaded ? (
          <SanityImage image={uploaded} alt="" sizes="100vw" loading="eager" fetchPriority="high" />
        ) : (
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
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-[rgb(0_0_0/0.5)] from-[8.655%] to-[rgb(0_0_0/0.15)] to-[61.522%]"
        />
      </div>
      <h1 className="max-w-[18rem] text-center text-body-l-eb break-keep text-text-inverse lg:max-w-[40rem] lg:text-heading-lm-eb">
        {title}
      </h1>
    </section>
  );
}
