import Image from "next/image";

import heroImage from "@/assets/donation/hero-child-drilling.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { linkTargetProps } from "@/lib/links";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { DONATION_HERO } from "@/sanity/sections/donation";

/*
 * 사진 파일에는 시안의 주황 패치(장갑의 상표 글자를 흐리게 덮은 Vector 26921)를 합쳐 두었다. 화면 폭마다 잘리는
 * 곳이 달라도 패치가 글자 위에 남는다. 1024 시안은 사진 틀(580px)에서 원본의 왼쪽 241px을 잘라 둔다(54.5%).
 * 데스크톱 글 칸은 1024 시안 폭(444px)을 지키고, 화면이 넓어지면 사진 칸만 넓어진다(1440 시안은 없다).
 * 시안 1024의 제목 색은 #111524(변수 없음)인데 375와 같은 text-primary로 맞췄다.
 * 운영자가 Studio에서 사진을 올리면 그 사진이 사진 칸을 채운다(패치는 합치지 않는다).
 * 글과 버튼은 Studio에서 고친다. 제목은 시안의 세 줄을 기본값에 줄바꿈으로 담아 두었다.
 */
export async function DonationHeroSection() {
  const { title, body, button, imageAlt, photo } = await loadSection(DONATION_HERO);
  const uploaded = toCroppedImage(photo);

  return (
    <section className="flex flex-col lg:h-[680px] lg:flex-row">
      <div className="relative h-[280px] overflow-hidden lg:h-auto lg:flex-1">
        {uploaded ? (
          <SanityImage
            image={uploaded}
            alt={imageAlt}
            sizes="(min-width: 1464px) calc(100vw - 444px), (min-width: 1024px) 1020px, (min-width: 420px) 100vw, 420px"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <Image
            src={heroImage}
            alt={imageAlt}
            fill
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            sizes="(min-width: 1464px) calc(100vw - 444px), (min-width: 1024px) 1020px, (min-width: 420px) 100vw, 420px"
            className="object-cover lg:object-[54.5%_50%]"
          />
        )}
      </div>

      <div className="bg-bg-highlight px-xl pt-2xl pb-3xl lg:w-[27.75rem] lg:shrink-0 lg:px-5xl lg:py-6xl">
        <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-4xl lg:mx-0 lg:items-start">
          <div className="flex w-full flex-col gap-lg lg:gap-2xl">
            <h1 className="text-body-l-eb whitespace-pre-line text-text-primary lg:text-heading-m-eb">
              {title}
            </h1>
            <p className="text-body-s-m text-text-secondary lg:text-body-sm-m">{body}</p>
          </div>
          <Button
            href={button.href}
            {...linkTargetProps(button.href)}
            data-track-event={ANALYTICS_EVENTS.donate}
            className="px-4xl py-md text-detail-s-b lg:text-title-s-b"
          >
            {button.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
