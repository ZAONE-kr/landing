import Link from "next/link";

import { SanityImage } from "@/components/post/SanityImage";
import { Button } from "@/components/ui/Button";
import { toCroppedImage } from "@/sanity/lib/image";

import { type InsightCard, insightHref } from "../_lib/insight";

/*
 * 1024 시안은 사진이 위에 있는 카드 세 장(277×420), 375 시안은 글이 왼쪽·사진이 오른쪽(120px)인 가로 카드다.
 * 제목은 카드 높이를 넘지 않게 세 줄까지 보이고, 줄 길이를 고르게 나눈다(1024 시안의 줄바꿈과 같아진다). 마우스를 올리면 사진이 천천히 살짝 커진다(홈 인사이트 카드와 같다).
 * 사진이 비면 사진 칸만 회색으로 남는다.
 */
function NextInsightCard({ insight }: { insight: InsightCard }) {
  const image = toCroppedImage(insight.mainImage);

  return (
    <Link
      href={insightHref(insight.slug)}
      className="group/card flex h-[124px] flex-row-reverse overflow-hidden rounded-sm bg-bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:h-full lg:flex-col lg:rounded-md"
    >
      <div className="relative w-[120px] shrink-0 overflow-hidden bg-bg-muted lg:h-[280px] lg:w-full">
        {image && (
          <SanityImage
            image={image}
            alt=""
            sizes="(min-width: 1024px) 277px, 120px"
            className="transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03]"
          />
        )}
      </div>
      <div className="min-w-0 flex-1 py-lg pr-lg pl-md lg:min-h-[140px] lg:px-xl lg:pt-xl lg:pb-3xl">
        <h3 className="line-clamp-3 text-body-s-b text-balance text-text-primary lg:text-center lg:text-title-s-b">
          {insight.title}
        </h3>
      </div>
    </Link>
  );
}

export function NextInsightsSection({ insights }: { insights: InsightCard[] }) {
  if (insights.length === 0) return null;

  return (
    <section className="bg-bg-surface px-xl py-3xl lg:px-6xl lg:pt-6xl lg:pb-7xl">
      <div className="mx-auto flex max-w-[54rem] flex-col items-center gap-xl lg:gap-3xl">
        <h2 className="self-stretch text-title-s-b text-text-primary lg:text-title-lm-b">
          다음 인사이트 확인하기
        </h2>
        <ul className="flex w-full flex-col gap-sm lg:grid lg:grid-cols-3 lg:gap-md">
          {insights.map((insight) => (
            <li key={insight._id}>
              <NextInsightCard insight={insight} />
            </li>
          ))}
        </ul>
        <Button
          href="/insights"
          className="w-[200px] px-xl py-md text-body-xs-b lg:w-[316px] lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          전체 인사이트 목록 보기
        </Button>
      </div>
    </section>
  );
}
