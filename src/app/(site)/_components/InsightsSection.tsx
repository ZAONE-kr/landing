import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import heroImage from "@/assets/home/hero-glacier-child.jpg";
import educationImage from "@/assets/home/insight-education.jpg";
import partnershipImage from "@/assets/home/insight-partnership.jpg";
import { Button } from "@/components/ui/Button";

type Insight = {
  category: string;
  title: [string, string];
  readingMinutes: number;
  image: StaticImageData;
  // 시안에서 사진을 자른 위치. 없으면 가운데를 보여준다.
  imageClassName?: string;
  href: string;
};

// TODO: Sanity 블로그 스키마가 생기면 최신 글 3개를 불러온다.
// 지금은 시안의 자리표시 내용이고, 읽는 시간도 일단 모두 1분으로 둔 임시 값이다.
// 글 페이지가 없어서 카드는 인사이트 목록으로 보낸다.
const INSIGHTS: Insight[] = [
  {
    category: "Material",
    title: ["버려진 자원에서", "새로운 가능성을 보다"],
    readingMinutes: 1,
    image: heroImage,
    imageClassName: "lg:object-[50%_79%]",
    href: "/insights",
  },
  {
    category: "Partnership",
    title: ["함께 만들어가는", "지속가능한 변화"],
    readingMinutes: 1,
    image: partnershipImage,
    href: "/insights",
  },
  {
    category: "Education",
    title: ["물질이 만드는", "다른 배움의 장면"],
    readingMinutes: 1,
    image: educationImage,
    href: "/insights",
  },
];

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={insight.href}
      className="group/card flex h-[400px] w-[280px] flex-col overflow-hidden rounded-md lg:h-[511px] lg:w-auto lg:rounded-lg"
    >
      <div className="relative h-[156px] shrink-0 overflow-hidden lg:h-[180px]">
        {/* 마우스를 올리면 사진이 천천히 살짝 커진다. */}
        <Image
          src={insight.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, 280px"
          className={`object-cover ${insight.imageClassName ?? ""} transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03]`}
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-sm bg-bg-surface px-lg py-2xl lg:px-xl lg:py-3xl">
        <p className="font-display text-display-s-b text-text-tertiary lg:text-display-m-b">
          {insight.category}
        </p>
        <h3 className="flex-1 text-title-s-sb text-text-primary 2xl:text-title-mm-sb">
          {insight.title[0]}
          <br />
          {insight.title[1]}
        </h3>
        <p className="rounded-full bg-bg-default px-lg py-s text-detail-xs-sb text-text-secondary lg:px-xl lg:py-sm lg:text-body-s-m">
          {insight.readingMinutes} min Read
        </p>
      </div>
    </Link>
  );
}

export function InsightsSection() {
  return (
    <section className="px-lg py-3xl lg:px-5xl lg:pt-6xl lg:pb-7xl 2xl:px-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[75rem] lg:gap-5xl">
        <div className="flex flex-col gap-md lg:flex-row lg:items-center lg:gap-4xl">
          <h2 className="text-title-m-b text-text-primary lg:flex-1 lg:text-body-l-b 2xl:text-heading-s-b">
            우리가 더 오래
            <br />
            들여다보는 것들
          </h2>
          <p className="text-body-xs-m text-text-secondary lg:text-body-sm-m 2xl:text-body-m-m">
            물질과 교육, 지속가능성, 그리고 기업과 함께 만든 변화까지.
            <br />
            현장에서 시작된 질문과 관찰을 기록합니다.
          </p>
        </div>

        {/* 모바일은 가로로 넘겨 보고, 목록이 화면 끝까지 이어지도록 좌우 여백 밖으로 편다. */}
        <ul className="-mx-lg flex snap-x snap-mandatory scroll-px-lg scrollbar-none gap-md overflow-x-auto px-lg lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-lg lg:overflow-visible lg:px-0">
          {INSIGHTS.map((insight) => (
            <li key={insight.category} className="shrink-0 snap-start">
              <InsightCard insight={insight} />
            </li>
          ))}
        </ul>

        <Button
          href="/insights"
          className="self-center px-4xl py-md text-body-s-b lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          모든 인사이트 보기
        </Button>
      </div>
    </section>
  );
}
