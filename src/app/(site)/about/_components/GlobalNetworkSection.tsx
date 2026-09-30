import Image, { type StaticImageData } from "next/image";

import italyImage from "@/assets/about/italy-reuse-center.jpg";
import onePercentImage from "@/assets/about/one-percent-for-the-planet.jpg";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

type Connection = {
  title: [string, string];
  href: string;
  image: StaticImageData;
  // 시안의 사진 틀(사진 비율 그대로). 카드 왼쪽에 붙이고, 세로는 translate로 사진의 어느 지점을
  // 카드 가운데에 둘지 정한다. 틀 폭에 최솟값이 있어 좁은 화면에서는 사진이 확대된다.
  imageBoxClassName: string;
};

// TODO: "자세히 보기"가 갈 곳을 아직 받지 못해 인사이트 목록으로 보낸다. 주소를 받으면 바꾼다.
const CONNECTIONS: Connection[] = [
  {
    title: ["30년을 이어온 이탈리아의", "창의적 재사용 센터"],
    href: "/insights",
    image: italyImage,
    // 틀 폭은 420px 이상이고, 사진 세로 50%(375)·46.2%(640) 지점이 카드 가운데다.
    // 데스크톱은 틀 폭이 카드와 같고, 사진 가운데가 카드 가운데보다 60px 아래에 온다(1024·1440 시안).
    imageBoxClassName:
      "aspect-[3/4] min-h-full w-[max(26.25rem,100%)] -translate-y-1/2 sm:translate-y-[-46.2%] lg:top-[calc(50%+60px)] lg:w-full lg:-translate-y-1/2",
  },
  {
    title: ["1% for the Planet이", "인증한 환경단체"],
    href: "/insights",
    image: onePercentImage,
    // 틀 폭은 413px 이상. 좁은 화면에서는 가운데 로고가 오른쪽으로 비켜나 제목과 덜 겹친다.
    imageBoxClassName: "aspect-[1400/678] min-h-full w-[max(25.8125rem,100%)] -translate-y-1/2",
  },
];

/*
 * 사진 위에 왼쪽이 짙은 가로 그라데이션을 덮는다(Figma에서 변수 없이 쓴 #1c2025, 80% → 10%).
 * 모바일 시안은 그라데이션 틀이 626px로 카드보다 넓어서 오른쪽 끝도 꽤 어둡다.
 */
function ConnectionCard({ connection }: { connection: Connection }) {
  const title = connection.title.join(" ");

  return (
    <article className="group/card relative isolate flex h-[180px] flex-col items-start overflow-hidden rounded-md px-lg py-xl lg:h-[400px] lg:gap-6xl lg:rounded-xl lg:px-3xl lg:py-4xl">
      {/* 마우스를 올리면 사진이 천천히 살짝 커진다. */}
      <div className="absolute inset-0 -z-10 transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03]">
        <div className={`absolute top-1/2 left-0 ${connection.imageBoxClassName}`}>
          <Image
            src={connection.image}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1440px) 1280px, (min-width: 1024px) calc(100vw - 10rem), (min-width: 420px) 100vw, 420px"
            className="object-cover"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-[39.125rem] bg-linear-to-r from-[rgb(28_32_37/0.8)] to-[rgb(28_32_37/0.1)] lg:w-full"
      />

      <h3 className="flex-1 text-title-s-b text-text-inverse lg:text-title-lm-b">
        {connection.title[0]}
        <br />
        {connection.title[1]}
      </h3>
      <div className="lg:py-xs">
        <Button
          href={connection.href}
          variant="inverse"
          aria-label={`${title} 자세히 보기`}
          className="gap-1.5 py-s pr-sm pl-md text-detail-xs-sb lg:gap-sm lg:py-sm lg:pr-lg lg:pl-2xl lg:text-title-s-b"
        >
          자세히 보기
          {/* 화살표가 가리키는 쪽으로 4px 밀려난다. */}
          <ArrowRightIcon className="size-5 text-icon-primary transition-transform duration-250 ease-out motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1 lg:size-8" />
        </Button>
      </div>
    </article>
  );
}

export function GlobalNetworkSection() {
  return (
    // 데스크톱은 1024·1440 시안 모두 좌우 여백 80px로 카드를 늘린다. 1440보다 넓으면 1440 시안 폭(1280px)에 묶는다.
    <section className="bg-bg-surface px-lg py-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[80rem] lg:gap-5xl">
        <h2 className="text-title-m-b text-text-primary lg:text-title-l-b">
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
