import Link from "next/link";
import { Image } from "next-sanity/image";

import type { InsightCard as InsightCardData } from "@/sanity/lib/insights";

/*
 * 사진은 틀을 덮으므로 실제로 그려지는 폭은 틀 폭과 (틀 높이 × 사진 비율) 중 큰 쪽이다. 가로 사진이면 틀 높이가 폭을
 * 정해서, 틀 폭만 sizes로 주면 작은 사진을 받아 늘려 흐려진다. 데스크톱 틀 폭은 1440 시안의 416px를 상한으로 잡는다.
 */
function imageSizes(aspectRatio: number): string {
  const desktop = Math.ceil(Math.max(416, 280 * aspectRatio));
  const mobile = Math.ceil(Math.max(120, 124 * aspectRatio));
  return `(min-width: 1024px) ${desktop}px, ${mobile}px`;
}

/*
 * 모바일은 제목(왼쪽)과 사진(오른쪽 120px)을 나란히 둔 가로 카드, 데스크톱은 사진(280px) 아래 제목을 가운데 맞춘
 * 세로 카드다. 제목을 먼저 읽도록 DOM은 제목 → 사진 순서이고, 데스크톱은 flex-col-reverse로 사진을 위에 올린다.
 * 높이는 시안(모바일 124px, 데스크톱 420px)을 최소로 두고, 제목이 길면 카드가 늘어난다. 데스크톱 제목 칸 아래 여백은
 * 시안의 40px 대신 24px로 둔다. 시안도 세 줄 제목은 아래 여백을 줄여 420px 안에 넣어서, 세 줄까지는 같아 보인다.
 * 사진 바탕은 Figma의 #4c556f 대신 토큰 색이다. 사진이 틀을 다 덮어 사진이 없을 때만 보인다.
 * 카드는 상세 페이지로 가는 링크이고, hover·키보드 포커스 때 사진이 천천히 살짝 커진다(홈 인사이트 카드와 같은
 * 1.03배 0.6초). 목록이 계속 늘어나서 화면에 보이는 링크마다 상세 페이지를 미리 받아 두지 않는다(prefetch={false}).
 * 제목은 시안처럼 두 줄이 비슷한 길이가 되게 나눈다(text-balance). 제목이 문자열이라 시안의 수동 줄바꿈 대신 쓴다.
 * 상세 페이지 아래 "다음 인사이트"도 이 카드를 쓴다. 그곳은 섹션 제목(h2) 아래라 카드 제목이 h3다.
 */
export function InsightCard({
  insight,
  headingLevel: Heading = "h2",
}: {
  insight: InsightCardData;
  headingLevel?: "h2" | "h3";
}) {
  const { image } = insight;
  return (
    <Link
      href={insight.href}
      prefetch={false}
      className="group/card flex h-full min-h-[7.75rem] overflow-hidden rounded-sm bg-bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:min-h-[26.25rem] lg:flex-col-reverse lg:rounded-md"
    >
      <Heading className="flex-1 p-lg text-body-s-b text-balance text-text-primary lg:min-h-[8.75rem] lg:p-xl lg:text-center lg:text-title-s-b">
        {insight.title}
      </Heading>
      <div className="relative w-[7.5rem] shrink-0 overflow-hidden bg-bg-muted lg:h-[17.5rem] lg:w-full">
        {image && (
          <div className="absolute inset-0 transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03] motion-safe:group-focus-visible/card:scale-[1.03]">
            <Image
              src={image.src}
              alt=""
              fill
              sizes={imageSizes(image.aspectRatio)}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              className="object-cover"
              style={{ objectPosition: image.objectPosition }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
