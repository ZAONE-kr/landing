"use server";

import { revalidateTag } from "next/cache";

// 한 번에 받는 태그 수와 태그 하나의 길이 상한. Sanity가 보내는 태그는 "sanity:s1:…" 꼴이고 몇 개뿐이다.
const MAX_TAGS = 50;
const MAX_TAG_LENGTH = 100;
const TAG_PATTERN = /^sanity:[\w:-]+$/;

/*
 * Studio(/admin)에 둔 SanityLive가 부르는 서버 액션. 바뀐 문서의 캐시 태그만 무효화하고 화면은 건드리지 않는다.
 * 아무것도 돌려주지 않고 revalidateTag(…, "max")는 응답에 페이지를 다시 그려 넣지 않아 Studio가 다시 마운트되지
 * 않는다. "max"라서 무효화 뒤 첫 방문은 이전 화면을 받으며 새로 만들기를 시작하고, 다음 방문부터 바뀐다.
 * 서버 액션은 누구나 부를 수 있는 주소라, 형식이 맞는 태그만 상한 안에서 받고 나머지는 조용히 무시한다.
 * next-sanity(defineLive)가 기본으로 등록하는 무효화 액션도 서버에 남아 있다. 그쪽은 이런 확인이 없지만 ID가
 * 화면 코드에 실리지 않고 빌드마다 바뀌어 밖에서 부르기 어렵다. 무효화가 되어도 페이지를 다시 만들 뿐이다.
 */
export async function revalidateSanityTags(unsafeTags: unknown) {
  if (!Array.isArray(unsafeTags) || unsafeTags.length > MAX_TAGS) return;
  const tags = new Set(
    unsafeTags.filter(
      (tag): tag is string =>
        typeof tag === "string" && tag.length <= MAX_TAG_LENGTH && TAG_PATTERN.test(tag),
    ),
  );
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
  // 무효화가 실제로 일어났는지 서버 로그로 확인할 수 있게 남긴다.
  if (tags.size > 0) console.log(`[sanity] 캐시 태그 무효화: ${[...tags].join(", ")}`);
}
