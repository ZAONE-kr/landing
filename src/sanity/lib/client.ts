import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

// 게시된 내용만 읽는다. 데이터셋이 공개라 토큰이 필요 없다.
// Sanity가 응답하지 않을 때 기본값(5분 기다림, 5번 재시도)이면 빌드의 페이지 생성 제한(60초)에 먼저 걸린다.
// 10초·2번으로 줄여 그 전에 코드 태그로 넘어가게 한다.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  timeout: 10_000,
  maxRetries: 2,
});
