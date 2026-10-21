// 너비 없는 공백. trim()이 지우지 않아 이것만 있는 글은 빈 줄로 그려진다.
const ZERO_WIDTH = /[​-‍⁠﻿]/g;

/*
 * 운영자가 입력한 글을 다듬는다. 한글 자모가 나뉜 글자(macOS 파일 이름에서 붙여 넣은 것)는 합치고, 너비 없는 공백과
 * 앞뒤 공백을 지운다. 비어 있으면 null이다. Studio 검증이 막지만 API로 넣은 값 대비로 한 번 더 거른다.
 */
export function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.normalize("NFC").replace(ZERO_WIDTH, "").trim() || null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// 기본값과 같은 모양의 빈 값. 새로 더한 카드에 운영자가 채우지 않은 칸이 있어도 모양이 모자라지 않게 한다.
function blankOf(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (Array.isArray(value)) return [];
  if (isRecord(value))
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankOf(item)]));
  return value;
}

/*
 * 게시된 문서의 값을 코드의 기본값 위에 필드 단위로 얹는다. 문서가 없거나 필드가 비어 있으면 그 자리는 기본값이
 * 남는다. 그래서 Sanity가 비어 있어도, 운영자가 일부만 채워도 지금 사이트 모습이 유지된다.
 * - 글(string)과 그 묶음(object)은 필드마다 얹는다.
 * - 목록(배열)은 문서에 배열이 있으면 그 배열이 전부다(운영자가 카드를 지우거나 더한 결과). 없으면 기본 목록이다.
 *   목록의 칸 중 기본 목록에 같은 _key가 있는 칸은 그 칸의 기본값 위에, 새로 더한 칸은 빈 칸 위에 얹는다.
 *   글 목록(태그)은 다듬은 글만 남기고 빈 것을 뺀다.
 * - 기본값이 null이면 값을 그대로 넘긴다(Sanity 사진처럼 운영자가 올려야만 있는 값).
 */
export function withDefaults<T extends object>(defaults: T, doc: unknown): T {
  const source = isRecord(doc) ? doc : {};
  const merged: Record<string, unknown> = {};
  for (const [key, fallback] of Object.entries(defaults)) {
    const value = source[key];
    if (typeof fallback === "string") merged[key] = cleanText(value) ?? fallback;
    else if (fallback === null) merged[key] = value ?? null;
    else if (Array.isArray(fallback))
      merged[key] = Array.isArray(value) ? mergeList(fallback, value) : fallback;
    else if (isRecord(fallback)) merged[key] = withDefaults(fallback, value);
    else merged[key] = fallback;
  }
  return merged as T;
}

function mergeList(fallback: unknown[], list: unknown[]): unknown[] {
  if (fallback.every((item) => typeof item === "string") && fallback.length > 0)
    return list.map(cleanText).filter((item): item is string => item !== null);

  const template = fallback.find(isRecord);
  if (!template) {
    const texts = list.map(cleanText);
    return list.every((item) => typeof item === "string")
      ? texts.filter((item): item is string => item !== null)
      : list;
  }
  return list.filter(isRecord).map((item) => {
    const base = fallback.find((entry) => isRecord(entry) && entry._key === item._key);
    return withDefaults(isRecord(base) ? base : (blankOf(template) as object), item);
  });
}
