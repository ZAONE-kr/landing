"use server";

import { revalidateTag } from "next/cache";
import { parseTags } from "next-sanity/live";

/*
 * Studio(/admin)에 둔 SanityLive가 부르는 서버 액션. 바뀐 문서의 캐시 태그만 무효화하고 화면은 건드리지 않는다.
 * "refresh"를 돌려주지 않고 revalidateTag(…, "max")는 응답에 페이지를 다시 그려 넣지 않아 Studio가 다시
 * 마운트되지 않는다. "max"라서 게시 뒤 첫 방문은 이전 화면을 받으며 새로 만들기를 시작하고, 다음 방문부터 바뀐다.
 * parseTags는 "sanity:"로 시작하는 문자열 태그만 통과시킨다.
 */
export async function revalidateSanityTags(unsafeTags: unknown) {
  for (const tag of parseTags(unsafeTags).tags) {
    revalidateTag(tag, "max");
  }
}
