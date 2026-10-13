import type { NextRequest } from "next/server";

import { getInsightsAfter, parseInsightCursor } from "@/sanity/lib/insights";

/*
 * 인사이트 목록의 다음 묶음. 목록 끝에 닿으면 브라우저가 앞 묶음이 알려 준 nextUrl로 부른다
 * (src/sanity/lib/insights.ts). /insights 아래에 두면 같은 이름의 글 주소(/insights/[slug])를 가로채서 /api에 둔다.
 * Route Handler는 기본으로 응답을 저장하지 않아(요청 주소도 읽는다) 요청마다 Sanity CDN에 묻는다.
 */
export async function GET(request: NextRequest) {
  const after = parseInsightCursor(request.nextUrl.searchParams);
  if (!after) {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
  try {
    return Response.json(await getInsightsAfter(after));
  } catch (error) {
    console.error("[insights] 다음 인사이트를 불러오지 못했습니다.", error);
    return Response.json({ error: "인사이트를 불러오지 못했습니다." }, { status: 502 });
  }
}
