import { client } from "./client";
import { type CroppedImage, type SanityImageSource, toCroppedImage } from "./image";
import { sanityFetch } from "./live";
import { INSIGHT_LIST_QUERY } from "./queries";

// 처음 보이는 카드 수이자, 목록 끝에 닿을 때마다 더 불러오는 수.
export const INSIGHTS_PER_PAGE = 18;

// 다음 묶음을 주는 라우트 핸들러(src/app/api/insights/route.ts).
const INSIGHTS_API_PATH = "/api/insights";

// 쿼리가 주는 카드 한 장(queries.ts의 INSIGHT_ROW_FIELDS). 상세 페이지의 다음 인사이트도 같은 모양이다.
export type InsightRow = {
  _id: string;
  _createdAt: string;
  publishedAt: string;
  title: string | null;
  slug: string;
  image: SanityImageSource | null;
};

export type InsightCard = {
  id: string;
  title: string;
  href: string;
  image: CroppedImage | null;
};

/*
 * 목록 한 묶음. nextUrl은 다음 묶음을 받을 주소이고, 더 없으면 null이다. 브라우저는 이 주소를 그대로 부르기만 해서
 * 이어 받는 기준(앞 묶음의 마지막 글)이 어떻게 생겼는지 몰라도 된다.
 */
export type InsightPage = {
  items: InsightCard[];
  nextUrl: string | null;
};

// 앞 묶음의 마지막 글. 정렬 기준(게시일, 만든 시각, _id)과 같다(queries.ts).
export type InsightCursor = {
  publishedAt: string;
  createdAt: string;
  id: string;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
// Sanity 문서 ID에 쓸 수 있는 글자(영문·숫자·_·-·.)와 길이 상한.
const DOCUMENT_ID = /^[\w.-]{1,128}$/;

// nextUrl의 쿼리를 읽는다. 누구나 주소를 고쳐 부를 수 있으니 모양이 맞지 않으면 null이다.
export function parseInsightCursor(params: URLSearchParams): InsightCursor | null {
  const publishedAt = params.get("publishedAt");
  const createdAt = params.get("createdAt");
  const id = params.get("id");
  if (!publishedAt || !DATE.test(publishedAt)) return null;
  if (!createdAt || !DATETIME.test(createdAt)) return null;
  if (!id || !DOCUMENT_ID.test(id)) return null;
  return { publishedAt, createdAt, id };
}

// 글 상세 주소. 한글 주소를 그대로 두면 브라우저마다 인코딩 시점이 달라, 링크에서부터 퍼센트 인코딩해 둔다.
export function insightHref(slug: string): string {
  return `/insights/${encodeURIComponent(slug)}`;
}

export function toInsightCard(row: InsightRow): InsightCard {
  return {
    id: row._id,
    // Studio 검사가 빈 제목 게시를 막지만, API로 만든 글은 Studio 목록처럼 "제목 없음"으로 보인다.
    title: row.title?.trim() || "제목 없음",
    href: insightHref(row.slug),
    image: toCroppedImage(row.image),
  };
}

// 쿼리는 한 묶음보다 하나 더 받는다. 넘친 하나가 있으면 다음 묶음이 있다.
function toPage(rows: InsightRow[]): InsightPage {
  const pageRows = rows.slice(0, INSIGHTS_PER_PAGE);
  const last = pageRows.at(-1);
  const hasMore = rows.length > INSIGHTS_PER_PAGE && last !== undefined;
  return {
    items: pageRows.map(toInsightCard),
    nextUrl: hasMore
      ? `${INSIGHTS_API_PATH}?${new URLSearchParams({
          publishedAt: last.publishedAt,
          createdAt: last._createdAt,
          id: last._id,
        })}`
      : null,
  };
}

/*
 * 목록 페이지가 처음 그리는 묶음. sanityFetch가 글 문서의 캐시 태그를 페이지에 붙여, Studio에서 게시하면 페이지를
 * 다시 만든다(insights/page.tsx).
 * 실패는 잡지 않는다. 운영 서버에서는 Next가 마지막으로 성공한 페이지를 계속 보여 주고, 빌드는 멈춘다. ZAONE LAB
 * 카드 태그(zaone-lab/_lib/fieldTags.ts)와 달리 코드에 대신 보여 줄 글이 없어서, 빈 목록을 캐시에 남기지 않는다.
 */
export async function getFirstInsights(): Promise<InsightPage> {
  const { data } = await sanityFetch({
    query: INSIGHT_LIST_QUERY,
    params: { after: null, limit: INSIGHTS_PER_PAGE + 1 },
    perspective: "published",
    stega: false,
  });
  return toPage(data as InsightRow[]);
}

/*
 * 스크롤로 더 불러오는 묶음. 라우트 핸들러가 부르고, 페이지 캐시와 상관없이 매번 Sanity CDN에 묻는다.
 * 첫 묶음 페이지가 한 시간까지 예전 것이어도 그 마지막 글 다음부터 받으므로 글이 겹치지 않는다. 그사이 새로 게시된
 * 글은 첫 묶음보다 앞이라 여기서는 나오지 않고, 페이지를 다시 만들 때 맨 앞에 나온다.
 */
export async function getInsightsAfter(after: InsightCursor): Promise<InsightPage> {
  const rows = await client.fetch<InsightRow[]>(INSIGHT_LIST_QUERY, {
    after,
    limit: INSIGHTS_PER_PAGE + 1,
  });
  return toPage(rows);
}
