import { type PortableTextBlock, toPlainText } from "next-sanity";

import type { PostBodyValue } from "./PostBody";

// 검색 결과·링크 공유에 보일 설명 길이.
const DESCRIPTION_MAX_LENGTH = 120;

// 글 상세 페이지의 설명(metadata description). 본문 문단 글자를 이어 앞부분만 쓴다. 문단이 없으면 ""다.
export function describePostBody(body: PostBodyValue | null): string {
  const paragraphs = (body ?? []).filter(
    (block): block is PortableTextBlock =>
      block._type === "block" && (block as PortableTextBlock).style === "normal",
  );
  const text = toPlainText(paragraphs).replace(/\s+/g, " ").trim();
  return text.length > DESCRIPTION_MAX_LENGTH
    ? `${text.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}…`
    : text;
}
