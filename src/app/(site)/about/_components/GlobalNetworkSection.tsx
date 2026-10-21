import Image, { type StaticImageData } from "next/image";

import italyImage from "@/assets/about/italy-reuse-center.jpg";
import onePercentImage from "@/assets/about/one-percent-for-the-planet.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { linkTargetProps } from "@/lib/links";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_GLOBAL_NETWORK } from "@/sanity/sections/about";

type CodePhoto = {
  image: StaticImageData;
  // 시안의 사진 틀(사진 비율 그대로). 카드 왼쪽에 붙이고, 세로는 translate로 사진의 어느 지점을
  // 카드 가운데에 둘지 정한다. 틀 폭에 최솟값이 있어 좁은 화면에서는 사진이 확대된다.
  imageBoxClassName: string;
};

// 기본 카드 두 장의 코드 사진과 놓은 자리(카드의 _key로 찾는다). 운영자가 사진을 올린 카드는 그 사진을 쓴다.
const CODE_PHOTOS: Record<string, CodePhoto> = {
  "connection-italy": {
    image: italyImage,
    // 틀 폭은 420px 이상이고, 사진 세로 50%(375)·46.2%(640) 지점이 카드 가운데다.
    // 데스크톱은 틀 폭이 카드와 같고, 사진 가운데가 카드 가운데보다 60px 아래에 온다(1024·1440 시안).
    imageBoxClassName:
      "aspect-[3/4] min-h-full w-[max(26.25rem,100%)] -translate-y-1/2 sm:translate-y-[-46.2%] lg:top-[calc(50%+60px)] lg:w-full lg:-translate-y-1/2",
  },
  "connection-one-percent": {
    image: onePercentImage,
    // 틀 폭은 413px 이상. 좁은 화면에서는 가운데 로고가 오른쪽으로 비켜나 제목과 덜 겹친다.
    imageBoxClassName: "aspect-[1400/678] min-h-full w-[max(25.8125rem,100%)] -translate-y-1/2",
  },
};

/*
 * 사진 위에 왼쪽이 짙은 가로 그라데이션을 덮는다(Figma에서 변수 없이 쓴 #1c2025, 80% → 10%).
 * 모바일 시안은 그라데이션 틀이 626px로 카드보다 넓어서 오른쪽 끝도 꽤 어둡다.
 */
function ConnectionCard({
  connection,
}: {
  connection: (typeof ABOUT_GLOBAL_NETWORK.defaults.cards)[number];
}) {
  const title = connection.title.replaceAll("\n", " ");
  const uploaded = toCroppedImage(connection.photo);
  const codePhoto = CODE_PHOTOS[connection._key];
  const sizes =
    "(min-width: 1440px) 1280px, (min-width: 1024px) calc(100vw - 10rem), (min-width: 420px) 100vw, 420px";

  return (
    <article className="group/card relative isolate flex h-[180px] flex-col items-start overflow-hidden rounded-md px-lg py-xl lg:h-[400px] lg:gap-6xl lg:rounded-xl lg:px-3xl lg:py-4xl">
      {/* 마우스를 올리면 사진이 천천히 살짝 커진다. */}
      <div className="absolute inset-0 -z-10 card-zoom">
        {uploaded ? (
          <SanityImage image={uploaded} alt="" sizes={sizes} />
        ) : (
          codePhoto && (
            <div className={`absolute top-1/2 left-0 ${codePhoto.imageBoxClassName}`}>
              <Image
                src={codePhoto.image}
                alt=""
                fill
                placeholder="blur"
                sizes={sizes}
                className="object-cover"
              />
            </div>
          )
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-[39.125rem] bg-linear-to-r from-[rgb(28_32_37/0.8)] to-[rgb(28_32_37/0.1)] lg:w-full"
      />

      <h3 className="flex-1 text-title-s-b whitespace-pre-line text-text-inverse lg:text-title-lm-b">
        {connection.title}
      </h3>
      <div className="lg:py-xs">
        <Button
          href={connection.href}
          {...linkTargetProps(connection.href)}
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

// 제목·카드는 Studio에서 고친다. 줄바꿈은 기본값에 담아 두었다(Enter로 고칠 수 있다).
export async function GlobalNetworkSection() {
  const { title, cards } = await loadSection(ABOUT_GLOBAL_NETWORK);

  return (
    // 데스크톱은 1024·1440 시안 모두 좌우 여백 80px로 카드를 늘린다. 1440보다 넓으면 1440 시안 폭(1280px)에 묶는다.
    <section className="bg-bg-surface px-lg py-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[80rem] lg:gap-5xl">
        <h2 className="text-title-m-b whitespace-pre-line text-text-primary lg:text-title-l-b">
          {title}
        </h2>
        <ul className="flex flex-col gap-s lg:gap-lg">
          {cards.map((connection) => (
            <li key={connection._key}>
              <ConnectionCard connection={connection} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
