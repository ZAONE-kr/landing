import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { unstable_rethrow } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";

/*
 * 게시된 내용을 읽는다. null이면 호출한 쪽이 코드의 기본값을 쓴다(문서를 아직 게시하지 않았거나, 빌드·개발 중
 * Sanity에 닿지 못함). 운영 서버에서 실패하면 던진다. 그러면 Next가 마지막으로 성공한 페이지를 계속 보여 주고
 * 30초 뒤 요청부터 다시 시도한다. 여기서 기본값으로 대신하면 그 화면이 캐시를 덮어쓰고 Sanity 태그도 빠져서,
 * 다음에 시간 기준으로 다시 만들 때까지(page.tsx의 revalidate) 운영자가 바꾼 내용이 안 보인다.
 * 프로젝트·데이터셋 설정이 틀렸거나 쿼리가 잘못된 4xx 응답은 일시적인 장애가 아니라서 빌드에서도 던져 알게 한다.
 */
export async function fetchPublished<T>(
  query: string,
  params: Record<string, string>,
  label: string,
): Promise<T | null> {
  try {
    const { data } = await sanityFetch({ query, params, perspective: "published", stega: false });
    return data && typeof data === "object" ? (data as T) : null;
  } catch (error) {
    unstable_rethrow(error);
    const status = (error as { statusCode?: number }).statusCode;
    if (status !== undefined && status >= 400 && status < 500 && status !== 408 && status !== 429)
      throw error;
    const isProductionServer =
      process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD;
    if (isProductionServer) throw error;
    console.warn(`[${label}] Sanity에서 내용을 불러오지 못해 코드의 기본값을 씁니다.`, error);
    return null;
  }
}
