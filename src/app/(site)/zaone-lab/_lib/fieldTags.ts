import { fetchPublished } from "@/sanity/lib/published";
import { ZAONE_LAB_FIELD_TAGS_QUERY } from "@/sanity/lib/queries";
import { ZAONE_LAB_FIELD_TAGS_ID, type ZaoneLabFieldTags } from "@/sanity/zaoneLabFields";

/*
 * 게시된 카드 태그 문서. null이면 카드는 코드의 태그를 쓴다(문서를 아직 게시하지 않았거나, 빌드·개발 중 Sanity에
 * 닿지 못함). 실패했을 때 어떻게 하는지는 fetchPublished에 적어 두었다.
 */
export function getFieldTagsDoc(): Promise<ZaoneLabFieldTags | null> {
  return fetchPublished<ZaoneLabFieldTags>(
    ZAONE_LAB_FIELD_TAGS_QUERY,
    { id: ZAONE_LAB_FIELD_TAGS_ID },
    "zaone-lab",
  );
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
