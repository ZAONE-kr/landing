import type { Metadata } from "next";

import { pageOpenGraph } from "@/app/shared-metadata";
import { loadSection } from "@/sanity/lib/sections";
import { COMMON_PAGE_SEO } from "@/sanity/sections/common";

type SeoPage = keyof (typeof COMMON_PAGE_SEO)["defaults"];

/*
 * 페이지의 검색 결과 제목·설명을 Studio에서 고친 값(없으면 기본값)으로 만든다.
 * canonical을 지정하지 않으면 루트의 "/"를 물려받아 홈페이지의 중복 페이지로 잡힌다.
 */
export async function pageMetadata(page: SeoPage, path: string): Promise<Metadata> {
  const { title, description } = (await loadSection(COMMON_PAGE_SEO))[page];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: pageOpenGraph({ url: path, title, description }),
  };
}
