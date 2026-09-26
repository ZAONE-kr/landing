import Image, { type StaticImageData } from "next/image";

import companiesImage from "@/assets/home/pathway-companies.jpg";
import educatorsImage from "@/assets/home/pathway-educators.jpg";
import manufacturersImage from "@/assets/home/pathway-manufacturers.jpg";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SwipeRow } from "@/components/ui/SwipeRow";

type Pathway = {
  audience: string;
  title: [string, string, string];
  cta: string;
  href: string;
  image: StaticImageData;
  // 시안에서 사진을 자른 위치(모바일, 데스크톱). 두 번째 사진은 시안에서 좌우 반전되어 있다.
  imageClassName: string;
};

// TODO: 시안이 없어 갈 곳을 임시로 정했다. 휴면자원 연결하기는 GIVE & TAKE로 보냈는데,
// 시안이 나오면 PARTNER WITH US가 맞는지 다시 확인한다.
const PATHWAYS: Pathway[] = [
  {
    audience: "For manufacturers",
    title: ["생산 과정에서", "더 이상 쓰이지 않는", "물질이 있다면"],
    cta: "휴면자원 연결하기",
    href: "/give-and-take",
    image: manufacturersImage,
    imageClassName: "object-[93%_13%] lg:object-[58%_50%]",
  },
  {
    audience: "For companies & Foundations",
    title: ["환경과 어린 시절을", "함께 지키는 일을", "만들고 싶다면"],
    cta: "협업 시작하기",
    href: "/partner-with-us",
    image: companiesImage,
    imageClassName: "-scale-x-100 object-[50%_30%] lg:object-[50%_23%]",
  },
  {
    audience: "For educators",
    title: ["배움의 환경에", "더 많은 가능성을", "남기고 싶다면"],
    cta: "ZAONE LAB보기",
    href: "/zaone-lab",
    image: educatorsImage,
    imageClassName: "object-center lg:object-[36%_50%]",
  },
];

function PathwayCard({ pathway }: { pathway: Pathway }) {
  return (
    <article className="group/card relative isolate flex h-[240px] w-full shrink-0 flex-col overflow-hidden rounded-md px-lg py-xl lg:h-[640px] lg:w-[500px] lg:rounded-xl lg:px-3xl lg:py-5xl">
      {/* 마우스를 올리면 사진이 천천히 살짝 커진다. 좌우 반전(scale-x)과 겹치지 않게 감싸는 요소를 키운다. */}
      <div className="absolute inset-0 -z-10 transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03]">
        <Image
          src={pathway.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          className={`object-cover ${pathway.imageClassName}`}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-bg-overlay-a10 to-bg-overlay-a80"
      />

      <div className="flex flex-1 flex-col items-start gap-sm lg:gap-xl">
        <p className="rounded-full border border-border-subtle px-sm py-xs font-display text-display-xs-b text-text-inverse lg:border-[1.2px] lg:px-lg lg:py-s lg:text-display-m-b">
          {pathway.audience}
        </p>
        <h3 className="text-title-s-b text-text-inverse lg:text-body-l-b">
          {pathway.title[0]}
          <br />
          {pathway.title[1]}
          <br />
          {pathway.title[2]}
        </h3>
      </div>

      <div className="flex justify-end lg:py-xs">
        <Button
          href={pathway.href}
          variant="inverse"
          className="gap-1.5 py-s pr-sm pl-md text-detail-xs-sb lg:gap-sm lg:py-lg lg:pr-xl lg:pl-2xl lg:text-title-s-sb"
        >
          {pathway.cta}
          {/* 화살표가 가리키는 쪽으로 4px 밀려난다. */}
          <ArrowRightIcon className="size-5 text-icon-primary transition-transform duration-250 ease-out motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1 lg:size-9" />
        </Button>
      </div>
    </article>
  );
}

export function PathwaysSection() {
  return (
    <section className="flex flex-col items-center gap-2xl px-lg py-3xl lg:gap-5xl lg:px-0 lg:py-7xl">
      <div className="flex max-w-[37.5rem] flex-col items-center gap-md text-center lg:max-w-[51.25rem] lg:gap-2xl">
        <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
          다음 쓰임을 함께 만드는 방법
        </h2>
        <p className="text-body-xs-m text-text-secondary lg:text-body-m-m">
          환경을 지키는 일과 어린 시절을 지키는 일은 여러 자리에서 시작될 수 있습니다.
          <br className="hidden lg:inline" /> ZAONE은 산업과 기업, 교육 현장이 가진 서로 다른 자원과
          역할을 연결합니다.
        </p>
      </div>

      {/*
       * 모바일은 카드 3장을 세로로 쌓고, 데스크톱은 가로로 넘겨 본다.
       * 첫 카드는 다른 섹션의 본문 왼쪽 선에 맞추고, 오른쪽은 화면 끝까지 이어진다.
       * overscroll-x-contain: 트랙패드로 끝까지 넘겼을 때 브라우저 뒤로 가기가 되지 않게 한다.
       */}
      <SwipeRow className="w-full max-w-[37.5rem] lg:max-w-full lg:cursor-grab lg:snap-x lg:snap-mandatory lg:scroll-px-[max(4rem,calc((100%-75rem)/2))] lg:overscroll-x-contain">
        <ul className="flex flex-col gap-md lg:w-max lg:flex-row lg:gap-lg lg:px-[max(4rem,calc((100%-75rem)/2))]">
          {PATHWAYS.map((pathway) => (
            <li key={pathway.cta} className="lg:snap-start">
              <PathwayCard pathway={pathway} />
            </li>
          ))}
        </ul>
      </SwipeRow>
    </section>
  );
}
