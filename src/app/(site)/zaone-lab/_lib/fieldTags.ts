import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { unstable_rethrow } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { ZAONE_LAB_FIELD_TAGS_QUERY } from "@/sanity/lib/queries";
import { ZAONE_LAB_FIELD_TAGS_ID, type ZaoneLabFieldTags } from "@/sanity/zaoneLabFields";

/*
 * 게시된 카드 태그 문서. null이면 카드는 코드의 태그를 쓴다(문서를 아직 게시하지 않았거나, 빌드·개발 중 Sanity에
 * 닿지 못함). 운영 서버에서 실패하면 던진다. 그러면 Next가 마지막으로 성공한 페이지를 계속 보여 주고 30초 뒤
 * 요청부터 다시 시도한다. 여기서 코드 태그로 대신하면 그 화면이 캐시를 덮어쓰고 Sanity 태그도 빠져서, 다음에
 * 시간 기준으로 다시 만들 때까지(page.tsx의 revalidate) 운영자가 바꾼 태그가 안 보인다.
 * 프로젝트·데이터셋 설정이 틀렸거나 쿼리가 잘못된 4xx 응답은 일시적인 장애가 아니라서 빌드에서도 던져 알게 한다.
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
    const status = (error as { statusCode?: number }).statusCode;
    if (status !== undefined && status >= 400 && status < 500 && status !== 408 && status !== 429)
      throw error;
    const isProductionServer =
      process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD;
    if (isProductionServer) throw error;
    console.warn("[zaone-lab] Sanity에서 카드 태그를 불러오지 못해 코드의 태그를 씁니다.", error);
    return null;
  }
}

// 너비 없는 공백. trim()이 지우지 않아 이것만 있는 태그는 빈 알약으로 그려진다.
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;

/*
 * 게시된 문서에 있는 한 카드의 태그. 운영자가 태그를 모두 지우면 []로 저장되어 태그 줄이 사라진다. 필드가 아예
 * 없으면(null) 문서가 그 카드보다 먼저 만들어진 것이라 역시 태그가 없다(zaoneLabFields.ts 참고).
 * Studio 검증이 막지만 한 번 더 거른다: 한글 자모가 나뉜 글자(macOS 파일 이름에서 붙여 넣은 것)는 합치고,
 * 너비 없는 공백과 앞뒤 공백을 지운 뒤 빈 태그를 빼고, 같은 태그는 하나만 남긴다(목록의 key로 쓴다).
 */
export function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.normalize("NFC").replace(ZERO_WIDTH, "").trim())
    .filter(Boolean);
  return [...new Set(tags)];
}
