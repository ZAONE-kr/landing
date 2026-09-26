import type { Metadata } from "next";

// metadata는 얕게 병합된다. 하위 페이지가 openGraph를 지정하면 루트의 openGraph가 통째로
// 바뀌므로, 페이지마다 같아야 하는 필드는 여기서 나눠 쓴다.
export const siteOpenGraph = {
  type: "website",
  siteName: "자원(ZAONE)",
  locale: "ko_KR",
} satisfies Metadata["openGraph"];

// 하위 페이지용. app/opengraph-image.png는 루트 세그먼트의 openGraph에만 붙어서, 하위 페이지가
// openGraph를 지정하면 공유 이미지도 사라진다. 그래서 이미지 경로를 직접 넣는다.
// 루트는 파일 규칙이 크기·형식까지 채워 주므로 이 함수를 쓰지 않는다.
export function pageOpenGraph({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return {
    ...siteOpenGraph,
    url,
    title,
    description,
    images: "/opengraph-image.png",
  } satisfies Metadata["openGraph"];
}
