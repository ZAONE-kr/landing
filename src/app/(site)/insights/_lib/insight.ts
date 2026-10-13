import { cache } from "react";

import type { PostBodyValue } from "@/components/post/PostBody";
import { type SanityImageSource, toCroppedImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { INSIGHT_QUERY } from "@/sanity/lib/queries";

// 다음 인사이트 카드에 보이는 칸(INSIGHT_QUERY의 INSIGHT_CARD_FIELDS).
export type InsightCard = {
  _id: string;
  title: string | null;
  slug: string;
  mainImage: SanityImageSource | null;
};

/*
 * 인사이트 상세(INSIGHT_QUERY). Studio가 필수 칸을 막지만 API로 들어온 글은 비어 있을 수 있어 null을 받아 둔다.
 */
export type Insight = {
  _id: string;
  title: string | null;
  slug: string;
  projectName: string | null;
  partner: string | null;
  mainImage: SanityImageSource | null;
  body: PostBodyValue | null;
  posterImage: (SanityImageSource & { alt?: string | null }) | null;
  olderInsights: InsightCard[];
  newestInsights: InsightCard[];
};

// 다음 인사이트는 시안처럼 세 개까지 보인다.
const NEXT_INSIGHTS_COUNT = 3;

/*
 * 게시된 인사이트 하나. 메타데이터와 페이지가 같은 글을 읽으므로 한 번만 묻도록 묶는다.
 * 실패하면 그대로 던진다. 운영 서버에서는 Next가 마지막으로 만든 페이지를 계속 보여 주고 다시 시도한다.
 */
export const getInsight = cache(async (slug: string): Promise<Insight | null> => {
  const { data } = await sanityFetch({
    query: INSIGHT_QUERY,
    params: { slug },
    perspective: "published",
    stega: false,
  });
  return data && typeof data === "object" ? (data as Insight) : null;
});

// 목록 순서에서 이 글 다음 글들. 끝에 가까워 모자라면 맨 앞(최신) 글로 돌아가 채운다.
export function pickNextInsights(insight: Insight): InsightCard[] {
  const picked = new Map<string, InsightCard>();
  for (const card of [...(insight.olderInsights ?? []), ...(insight.newestInsights ?? [])]) {
    if (picked.size === NEXT_INSIGHTS_COUNT) break;
    picked.set(card._id, card);
  }
  return [...picked.values()];
}

/*
 * 주소창의 글 주소. 한글 주소는 퍼센트 인코딩되어 params로 들어오므로 풀어서 Sanity에 묻는다.
 * 잘못된 인코딩(%가 깨진 주소)이면 null이다. macOS에서 붙여 넣은 주소는 자모가 나뉘어 올 수 있어 합친다(NFC).
 */
export function decodeInsightSlug(param: string): string | null {
  try {
    return decodeURIComponent(param).normalize("NFC");
  } catch {
    return null;
  }
}

export function insightHref(slug: string): string {
  return `/insights/${encodeURIComponent(slug)}`;
}

/*
 * 링크 공유 그림(1200×630). 카카오톡·페이스북 등은 사진을 제 비율로 다시 잘라 보여서, 운영자가 정한 중심점을 기준으로
 * 미리 잘라 둔다(Sanity 이미지 CDN의 focalpoint 자르기). 공유 미리보기가 WebP·AVIF를 못 읽는 곳이 있어 JPG로 받는다.
 */
export function insightOpenGraphImage(source: SanityImageSource | null) {
  const image = toCroppedImage(source);
  if (!image) return null;
  const [x, y] = image.objectPosition.split(" ").map((value) => parseFloat(value) / 100);
  const url = new URL(image.src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("crop", "focalpoint");
  url.searchParams.set("fp-x", x.toFixed(4));
  url.searchParams.set("fp-y", y.toFixed(4));
  url.searchParams.set("fm", "jpg");
  return { url: url.href, width: 1200, height: 630 };
}
