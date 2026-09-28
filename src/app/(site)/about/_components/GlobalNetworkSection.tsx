import Image, { type StaticImageData } from "next/image";

import italyImage from "@/assets/about/italy-reuse-center.jpg";
import onePercentImage from "@/assets/about/one-percent-for-the-planet.jpg";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

type Connection = {
  title: [string, string];
  href: string;
  image: StaticImageData;
  // 시안에서 사진을 자른 위치와 확대. 1% 사진은 가운데 로고가 제목과 겹치지 않게 왼쪽에 맞춘다.
  imageClassName: string;
};

// TODO: "자세히 보기"가 갈 곳을 아직 받지 못해 인사이트 목록으로 보낸다. 주소를 받으면 바꾼다.
const CONNECTIONS: Connection[] = [
  {
    title: ["30년을 이어온 이탈리아의", "창의적 재사용 센터"],
    href: "/insights",
    image: italyImage,
    // 데스크톱 시안은 사진을 1.155배 키워 왼쪽에 붙였다. 375 시안의 확대(1.28배)는 오른쪽 사람이 잘려서 따르지 않는다.
    imageClassName: "object-center sm:object-[50%_45%] lg:origin-left lg:scale-[1.155]",
  },
  {
    title: ["1% for the Planet이", "인증한 환경단체"],
    href: "/insights",
    image: onePercentImage,
    imageClassName: "object-left",
  },
];

/*
 * 사진 위에 왼쪽이 짙은 가로 그라데이션을 덮는다(Figma에서 변수 없이 쓴 #1c2025, 80% → 10%).
 * 모바일 시안은 그라데이션 틀이 626px로 카드보다 넓어서 오른쪽 끝도 꽤 어둡다.
 */
function ConnectionCard({ connection }: { connection: Connection }) {
  const title = connection.title.join(" ");

  return (
    <article className="group/card relative isolate flex h-[180px] flex-col items-start overflow-hidden rounded-md px-lg py-xl lg:h-[457px] lg:gap-6xl lg:rounded-xl lg:px-3xl lg:py-4xl">
      {/* 마우스를 올리면 사진이 천천히 살짝 커진다. */}
      <div className="absolute inset-0 -z-10 transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03]">
        <Image
          src={connection.image}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1440px) 1200px, 100vw"
          className={`object-cover ${connection.imageClassName}`}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-[39.125rem] bg-linear-to-r from-[rgb(28_32_37/0.8)] to-[rgb(28_32_37/0.1)] lg:w-full"
      />

      <h3 className="flex-1 text-title-s-b text-text-inverse lg:text-heading-m-b">
        {connection.title[0]}
        <br />
        {connection.title[1]}
      </h3>
      <div className="lg:py-xs">
        <Button
          href={connection.href}
          variant="inverse"
          aria-label={`${title} 자세히 보기`}
          className="gap-1.5 py-s pr-sm pl-md text-detail-xs-sb lg:gap-sm lg:py-lg lg:pr-xl lg:pl-2xl lg:text-body-m-sb lg:leading-[1.3]"
        >
          자세히 보기
          {/* 화살표가 가리키는 쪽으로 4px 밀려난다. */}
          <ArrowRightIcon className="size-5 text-icon-primary transition-transform duration-250 ease-out motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1 lg:size-10" />
        </Button>
      </div>
    </article>
  );
}

export function GlobalNetworkSection() {
  return (
    <section className="bg-bg-surface px-lg py-3xl lg:px-5xl lg:py-7xl 2xl:px-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[75rem] lg:gap-5xl">
        <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
          우리는 더 넓은 세계와
          <br />
          연결되어 있습니다.
        </h2>
        <ul className="flex flex-col gap-s lg:gap-lg">
          {CONNECTIONS.map((connection) => (
            <li key={connection.title[0]}>
              <ConnectionCard connection={connection} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
