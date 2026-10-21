import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import heroImage from "@/assets/home/hero-glacier-child.jpg";
import educationImage from "@/assets/home/insight-education.jpg";
import partnershipImage from "@/assets/home/insight-partnership.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { HOME_INSIGHTS, type HomeInsight } from "@/sanity/sections/home";

// 기본 카드 세 장의 코드 사진과 사진을 자른 위치(카드의 _key로 찾는다). 운영자가 사진을 올린 카드는 그 사진을 쓴다.
const CODE_PHOTOS: Record<string, { image: StaticImageData; imageClassName?: string }> = {
  "insight-material": { image: heroImage, imageClassName: "lg:object-[50%_79%]" },
  "insight-partnership": { image: partnershipImage },
  "insight-education": { image: educationImage },
};

function InsightCard({ insight }: { insight: HomeInsight }) {
  const uploaded = toCroppedImage(insight.photo);
  const codePhoto = CODE_PHOTOS[insight._key];
  const photoClassName = "card-zoom";

  return (
    <Link
      href={insight.href}
      {...linkTargetProps(insight.href)}
      className="group/card flex h-[400px] w-[280px] flex-col overflow-hidden rounded-md lg:h-[511px] lg:w-auto lg:rounded-lg"
    >
      <div className="relative h-[156px] shrink-0 overflow-hidden lg:h-[180px]">
        {/* 마우스를 올리면 사진이 천천히 살짝 커진다. */}
        {uploaded ? (
          <SanityImage
            image={uploaded}
            alt=""
            sizes="(min-width: 1024px) 30vw, 280px"
            className={photoClassName}
          />
        ) : (
          codePhoto && (
            <Image
              src={codePhoto.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, 280px"
              className={`object-cover ${codePhoto.imageClassName ?? ""} ${photoClassName}`}
            />
          )
        )}
      </div>
      <div className="flex flex-1 flex-col items-start gap-sm bg-bg-surface px-lg py-2xl lg:px-xl lg:py-3xl">
        <p className="font-display text-display-s-b text-text-tertiary lg:text-display-m-b">
          {insight.category}
        </p>
        <h3 className="flex-1 text-title-s-sb whitespace-pre-line text-text-primary 2xl:text-title-mm-sb">
          {insight.title}
        </h3>
        <p className="rounded-full bg-bg-default px-lg py-s text-detail-xs-sb text-text-secondary lg:px-xl lg:py-sm lg:text-body-s-m">
          {insight.readingMinutes} min Read
        </p>
      </div>
    </Link>
  );
}

// 제목·카드·버튼은 Studio에서 고친다. 인사이트 글은 외부 블로그에 있어 카드는 그 주소로 연결한다.
export async function InsightsSection() {
  const { title, description, cards, button } = await loadSection(HOME_INSIGHTS);

  return (
    <section className="px-lg py-3xl lg:px-5xl lg:pt-6xl lg:pb-7xl 2xl:px-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[75rem] lg:gap-5xl">
        <div className="flex flex-col gap-md lg:flex-row lg:items-center lg:gap-4xl">
          <h2 className="text-title-m-b whitespace-pre-line text-text-primary lg:flex-1 lg:text-body-l-b 2xl:text-heading-s-b">
            {title}
          </h2>
          <p className="text-body-xs-m whitespace-pre-line text-text-secondary lg:text-body-sm-r">
            {description}
          </p>
        </div>

        {/* 모바일은 가로로 넘겨 보고, 목록이 화면 끝까지 이어지도록 좌우 여백 밖으로 편다. */}
        <ul className="-mx-lg flex snap-x snap-mandatory scroll-px-lg scrollbar-none gap-md overflow-x-auto px-lg lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-lg lg:overflow-visible lg:px-0">
          {cards.map((insight) => (
            <li key={insight._key} className="shrink-0 snap-start">
              <InsightCard insight={insight} />
            </li>
          ))}
        </ul>

        <Button
          href={button.href}
          {...linkTargetProps(button.href)}
          className="self-center px-4xl py-md text-body-s-b lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          {button.label}
        </Button>
      </div>
    </section>
  );
}
