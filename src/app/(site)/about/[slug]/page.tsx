import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { pageOpenGraph } from "@/app/shared-metadata";
import { describePostBody } from "@/components/post/describe";
import { PostBody, type PostBodyValue } from "@/components/post/PostBody";
import { PostHeader } from "@/components/post/PostHeader";
import { aboutStoryHref } from "@/sanity/aboutStory";
import { type SanityImageSource, toCroppedImage, toOpenGraphImage } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_STORY_QUERY } from "@/sanity/lib/queries";
import { decodeSlugParam } from "@/sanity/slug";

/*
 * ABOUT 상세 글(Figma "ABOUT_상세01_1024px" 1912:5885 1% for the Planet, 1912:6767 레미다). ABOUT 페이지 맨 아래
 * 연결 카드가 새 탭으로 연다(src/lib/links.ts). 375 시안은 없어 모바일은 블로그 글 상세 템플릿을 따른다.
 * 제목 → 대표이미지 → 본문. 대표이미지 아래 80px(1024 시안)에서 본문이 시작하고, 마지막 블록과 푸터 사이는 120px다.
 *
 * 글은 처음 열릴 때 만들어 두고 Sanity에서 바뀌면 다시 만든다(insights/[slug]/page.tsx와 같은 방식).
 * Studio 알림을 놓친 게시는 한 시간마다 다시 만들 때 반영된다. 그래서 Sanity 데이터는 Next 데이터 캐시에 두지 않는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

// ABOUT_STORY_QUERY 결과. Studio가 필수 칸을 막지만 API로 들어온 글은 비어 있을 수 있어 null을 받아 둔다.
type AboutStory = {
  _id: string;
  title: string | null;
  slug: string;
  mainImage: SanityImageSource | null;
  body: PostBodyValue | null;
};

// 메타데이터와 페이지가 같은 글을 읽으므로 한 번만 묻도록 묶는다. 실패하면 그대로 던진다.
const getAboutStory = cache(async (slug: string): Promise<AboutStory | null> => {
  const { data } = await sanityFetch({
    query: ABOUT_STORY_QUERY,
    params: { slug },
    perspective: "published",
    stega: false,
  });
  return data && typeof data === "object" ? (data as AboutStory) : null;
});

async function loadAboutStory(params: PageProps<"/about/[slug]">["params"]): Promise<AboutStory> {
  const slug = decodeSlugParam((await params).slug);
  const story = slug ? await getAboutStory(slug) : null;
  if (!story) notFound();
  return story;
}

export async function generateMetadata({ params }: PageProps<"/about/[slug]">): Promise<Metadata> {
  const story = await loadAboutStory(params);
  const url = aboutStoryHref(story.slug);
  const title = `${story.title?.trim() || "ABOUT"} - 자원(ZAONE)`;
  const description = describePostBody(story.body) || "자원(ZAONE) 소개";
  const ogImage = toOpenGraphImage(story.mainImage);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...pageOpenGraph({ url, title, description }),
      ...(ogImage && { images: ogImage }),
    },
  };
}

export default async function AboutStoryPage({ params }: PageProps<"/about/[slug]">) {
  const story = await loadAboutStory(params);

  return (
    <main>
      <article className="pb-3xl lg:pb-7xl">
        <PostHeader
          title={story.title?.trim() || "제목 없음"}
          image={toCroppedImage(story.mainImage)}
        />
        {story.body && <PostBody value={story.body} className="mt-4xl lg:mt-6xl" />}
      </article>
    </main>
  );
}
