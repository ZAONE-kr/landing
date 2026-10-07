import { defineLive } from "next-sanity/live";

import { client } from "./client";

/*
 * sanityFetch는 가져온 문서의 Sanity 태그를 페이지 캐시에 붙여, 내용이 바뀌면 그 태그가 붙은 페이지만 다시 만든다.
 * 무효화는 Studio(/admin)에 둔 SanityLive가 맡는다. 게시는 Studio에서 하므로 보통은 게시하는 창이 알림을 받지만,
 * 게시 직후 창을 닫거나 배포 전에 연 창이면 놓친다. 놓친 게시는 페이지를 시간 기준으로 다시 만들 때 반영된다
 * (zaone-lab/page.tsx의 revalidate·fetchCache).
 * 사이트 페이지에는 SanityLive를 두지 않는다. 열린 탭이 그 자리에서 바뀌지도 않으면서 방문자마다 자바스크립트
 * 약 25KB와 Sanity 연결이 하나씩 붙기 때문이다. 다만 sanityFetch를 이 파일에서 가져오므로, 태그를 쓰는 페이지에는
 * 그리지 않는 SanityLive 껍데기(약 2KB gzip)가 함께 실린다. 게시된 내용만 읽으므로 토큰을 쓰지 않는다.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});
