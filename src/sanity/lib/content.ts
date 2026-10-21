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

/*
 * 게시된 문서의 값을 코드의 기본값 위에 필드 단위로 얹는다. 문서가 없거나 필드가 비어 있으면 그 자리는 기본값이
 * 남는다. 그래서 Sanity가 비어 있어도, 운영자가 일부만 채워도 지금 사이트 모습이 유지된다.
 * 글(string)과 그 묶음(object)만 다룬다. 카드 목록(배열)은 카드를 다루는 섹션에서 따로 처리한다.
 */
export function withDefaults<T extends object>(defaults: T, doc: unknown): T {
  const source = doc && typeof doc === "object" ? (doc as Record<string, unknown>) : {};
  const merged: Record<string, unknown> = {};
  for (const [key, fallback] of Object.entries(defaults)) {
    if (typeof fallback === "string") merged[key] = cleanText(source[key]) ?? fallback;
    else if (fallback && typeof fallback === "object" && !Array.isArray(fallback))
      merged[key] = withDefaults(fallback, source[key]);
    else merged[key] = fallback;
  }
  return merged as T;
}
