import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { unstable_rethrow } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { ZAONE_LAB_FIELD_TAGS_QUERY } from "@/sanity/lib/queries";
import { ZAONE_LAB_FIELD_TAGS_ID, type ZaoneLabFieldTags } from "@/sanity/zaoneLabFields";

/*
 * 게시된 카드 태그 문서. null이면 카드는 코드의 태그를 쓴다(문서를 아직 게시하지 않았거나, 빌드·개발 중 Sanity에
 * 닿지 못함). 운영 서버에서 실패하면 던진다. 그러면 Next가 마지막으로 성공한 페이지를 계속 보여 주고 다음
 * 요청에서 다시 시도한다. 여기서 코드 태그로 대신하면 그 화면이 캐시를 덮어쓰고 Sanity 태그도 빠져서,
 * 다음에 다시 만들 때까지(page.tsx의 revalidate) 운영자가 바꾼 태그가 안 보인다.
 */
export async function getFieldTagsDoc(): Promise<ZaoneLabFieldTags | null> {
  try {
    const { data } = await sanityFetch({
      query: ZAONE_LAB_FIELD_TAGS_QUERY,
      params: { id: ZAONE_LAB_FIELD_TAGS_ID },
      perspective: "published",
      stega: false,
    });
    return data && typeof data === "object" ? (data as ZaoneLabFieldTags) : null;
  } catch (error) {
    unstable_rethrow(error);
    const isProductionServer =
      process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD;
    if (isProductionServer) throw error;
    console.warn("[zaone-lab] Sanity에서 카드 태그를 불러오지 못해 코드의 태그를 씁니다.", error);
    return null;
  }
}

/*
 * 문서에 있는 한 카드의 태그. 필드가 비었거나 없으면 운영자가 그 카드의 태그를 모두 지운 것이라 빈 목록이다.
 * Studio 검증이 막지만, 빈 태그와 앞뒤 공백은 한 번 더 걸러 내고 같은 태그는 하나만 남긴다(목록의 key로 쓴다).
 */
export function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return [...new Set(tags)];
}
