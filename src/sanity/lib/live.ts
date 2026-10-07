import { defineLive } from "next-sanity/live";

import { client } from "./client";

/*
 * sanityFetch는 가져온 문서의 Sanity 태그를 Next 캐시에 붙여, 페이지를 정적으로 만들어 두고 내용이 바뀌면 그 태그만
 * 무효화한다. 무효화는 Studio(/admin)에 둔 SanityLive가 맡는다(게시는 Studio에서 하므로 게시할 때 늘 열려 있다).
 * 사이트 페이지에는 SanityLive를 두지 않는다. 열린 탭이 그 자리에서 바뀌지도 않으면서 방문자마다 자바스크립트
 * 약 25KB와 Sanity 연결이 하나씩 붙기 때문이다. 게시된 내용만 읽으므로 토큰을 쓰지 않는다.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});
