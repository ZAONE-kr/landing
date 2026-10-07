import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

// 게시된 내용만 읽는다. 데이터셋이 공개라 토큰이 필요 없다.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
