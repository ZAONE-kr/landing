import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock, toPlainText } from "next-sanity";

import { pageOpenGraph } from "@/app/shared-metadata";
import { POST_COLUMN, POST_WIDTH } from "@/components/post/layout";
import { PostBody, type PostBodyValue } from "@/components/post/PostBody";
import { PostHeader } from "@/components/post/PostHeader";
import { SanityImage } from "@/components/post/SanityImage";
import { toCroppedImage } from "@/sanity/lib/image";

import { InsightMeta } from "../_components/InsightMeta";
import { NextInsightsSection } from "../_components/NextInsightsSection";
import {
  decodeInsightSlug,
  getInsight,
  type Insight,
  insightHref,
  insightOpenGraphImage,
  pickNextInsights,
} from "../_lib/insight";

/*
 * 인사이트 상세(Figma "[1012] INSIGHT 상세페이지 전달", 1024 1465:3244·1482:9073·1482:9586, 375 1482:10478).
 * 제목 → 대표이미지 → 프로젝트 명·파트너 → 구분선 → 본문 → 포스터 → 다음 인사이트. 본문 말고는 자리가 고정이다.
 *
 * 글은 처음 열릴 때 만들어 두고 Sanity에서 바뀌면 다시 만든다(zaone-lab/page.tsx와 같은 방식).
 * - Studio(/admin)가 게시를 받으면 그 글과 다음 인사이트 카드에 쓰인 글의 캐시 태그를 무효화한다(src/sanity/lib/live.ts).
 * - 그 알림을 놓친 게시는 한 시간마다 다시 만들 때 반영된다. 그래서 Sanity 데이터는 Next 데이터 캐시에 두지 않는다.
 * 빌드 때 미리 만들지 않아서 빌드가 Sanity에 닿지 못해도 멈추지 않는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

async function loadInsight(params: PageProps<"/insights/[slug]">["params"]): Promise<Insight> {
  const slug = decodeInsightSlug((await params).slug);
  const insight = slug ? await getInsight(slug) : null;
  if (!insight) notFound();
  return insight;
}

// 검색 결과·링크 공유에 보일 설명. 본문 문단 글자를 이어 앞부분만 쓴다.
const DESCRIPTION_MAX_LENGTH = 120;

function describe(body: PostBodyValue | null): string {
  const paragraphs = (body ?? []).filter(
    (block): block is PortableTextBlock =>
      block._type === "block" && (block as PortableTextBlock).style === "normal",
  );
  const text = toPlainText(paragraphs).replace(/\s+/g, " ").trim();
  return text.length > DESCRIPTION_MAX_LENGTH
    ? `${text.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}…`
    : text;
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const insight = await loadInsight(params);
  const url = insightHref(insight.slug);
  const title = `${insight.title ?? "인사이트"} - 자원(ZAONE)`;
  const description = describe(insight.body) || "자원(ZAONE)의 인사이트";
  const ogImage = insightOpenGraphImage(insight.mainImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...pageOpenGraph({ url, title, description }),
      ...(ogImage && { images: ogImage }),
    },
  };
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const insight = await loadInsight(params);
  const poster = toCroppedImage(insight.posterImage);

  return (
    <main>
      <article className={`${POST_WIDTH} pb-3xl lg:pb-7xl`}>
        <PostHeader title={insight.title ?? ""} image={toCroppedImage(insight.mainImage)} />
        <InsightMeta projectName={insight.projectName} partner={insight.partner} />
        {/* 시안의 구분선은 두께 없는 선이라 위아래 간격을 선 자리에서 잰다. 선 두께(1px)만큼 아래 간격을 줄인다. */}
        <hr className={`${POST_COLUMN} mt-4xl -mb-px border-border-strong lg:mt-5xl`} />
        {insight.body && <PostBody value={insight.body} className="mt-4xl lg:mt-5xl" />}
        {/* 포스터는 원래 비율 그대로, 폭만 고정한다(1024 350px, 375 160px). */}
        {poster && (
          <div
            className="relative mx-auto mt-16 w-[160px] overflow-hidden rounded-sm lg:w-[350px]"
            style={{ aspectRatio: poster.aspectRatio }}
          >
            <SanityImage
              image={poster}
              alt={insight.posterImage?.alt?.trim() ?? ""}
              sizes="(min-width: 1024px) 350px, 160px"
            />
          </div>
        )}
      </article>
      <NextInsightsSection insights={pickNextInsights(insight)} />
    </main>
  );
}
