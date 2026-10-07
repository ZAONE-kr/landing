import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/*
 * 게시된 내용만 읽는다. 데이터셋이 공개라 토큰이 필요 없다.
 * Sanity가 응답하지 않을 때 기본값(5분)만큼 기다리면 빌드의 페이지 생성 제한(60초)에 먼저 걸린다. 10초에서
 * 기다리기를 멈춰 그 전에 코드 태그로 넘어가게 한다(연결 자체는 Node가 나중에 닫는다).
 * 재시도는 끈다. 페이지를 그리는 중에는 Next가 같은 요청을 한 번만 보내서 재시도해도 다시 묻지 않고 기다림만 늘어난다.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  timeout: 10_000,
  maxRetries: 0,
});
