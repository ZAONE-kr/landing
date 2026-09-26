import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";
import { Button } from "@/components/ui/Button";

// 시안이 아직 없는 페이지의 자리표시. 메뉴와 버튼이 갈 곳을 먼저 만들어 두고,
// 시안이 나오면 각 page.tsx를 실제 내용과 metadata로 바꾼다. 시안 없이 기존 토큰으로만 짠다.

// 빈 페이지가 검색 결과에 잡히지 않게 noindex로 둔다.
// canonical을 지정하지 않으면 루트의 "/"를 물려받아 noindex와 어긋난 신호가 된다.
export function comingSoonMetadata({ name, path }: { name: string; path: string }): Metadata {
  const title = `${name} - 자원(ZAONE)`;
  const description = `자원(ZAONE) ${name} 페이지를 준비하고 있습니다.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: pageOpenGraph({ url: path, title, description }),
    robots: {
      index: false,
    },
  };
}

// 헤더·푸터 사이가 비어 보이지 않게 화면 높이의 절반 이상을 차지한다.
export function ComingSoon({ name }: { name: string }) {
  return (
    <main className="flex min-h-[60svh] flex-col items-center justify-center gap-2xl px-lg py-5xl text-center lg:gap-4xl lg:py-7xl">
      <div className="flex flex-col items-center gap-md lg:gap-lg">
        <h1 className="font-display text-display-l-b text-text-primary">{name}</h1>
        <p className="text-body-xs-m text-text-secondary lg:text-body-s-m">
          페이지를 준비하고 있습니다.
        </p>
      </div>
      <Button href="/" className="px-4xl py-md text-detail-s-b lg:text-body-s-b">
        홈으로 가기
      </Button>
    </main>
  );
}
