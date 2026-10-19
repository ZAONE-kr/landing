import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextTypeComponentProps,
} from "next-sanity";
import type { ElementType, ReactNode } from "react";

import { NEW_TAB_PROPS } from "@/lib/links";
import { type SanityImageSource, toCroppedImage } from "@/sanity/lib/image";
import { parseYouTubeId } from "@/sanity/youtubeUrl";

import { POST_COLUMN, POST_IMAGE_WIDTH } from "./layout";
import { SanityImage } from "./SanityImage";
import { YouTubeEmbed } from "./YouTubeEmbed";

/*
 * 블로그 글 본문(Sanity postBody). 세 카테고리가 같은 편집기를 쓰므로 상세 페이지도 이 컴포넌트를 함께 쓴다.
 * 글자 모양과 위 간격은 Figma 본문 컴포넌트(1493:10833)를 따른다. 컴포넌트의 위 padding이 블록 사이 간격이다.
 *
 * | 편집기       | 태그       | 1024 이상                     | 모바일                       | 위 간격(1024 / 모바일) |
 * | Heading 1    | h2         | Body-L-B 32                   | Title-M-B 24                 | 64 / 48                |
 * | Heading 2    | h3         | Title-MM-B 28                 | Title-S-B 20                 | 64 / 48                |
 * | Heading 3    | h4         | Body-M-SB 24                  | Detail-M-SB 18               | 64 / 48                |
 * | Normal       | p          | Body-SM-R 20                  | Body-S-M 16                  | 24                     |
 * | Quote        | blockquote | Body-SM-M 20, 왼쪽 선 2.4px   | Detail-S-M 16, 왼쪽 선 1.6px | 24, 이어지면 12 / 16   |
 * | 목록(점·번호) | ul·ol      | Body-SM-M 20                  | Detail-S-M 16                | 24, 항목 사이 12       |
 *
 * 페이지 제목이 h1이라 Heading 1부터 h2로 그린다. 컴포넌트에 없는 사진·유튜브는 상세 시안(1465:3244 등)을 따른다:
 * 위아래 64px, 사진은 모바일에서 좌우 여백 없이 화면을 채우고 1024부터 가운데 칸(layout.ts)에 맞추며, 자르지 않고
 * 원래 비율 그대로 보인다(사용자 결정, 2026-10-19 — 예전 사이트에서 옮긴 세로 포스터·인포그래픽이 16:10 틀에 잘렸다).
 * 사진이 이어지면 12px 간격이다.
 * 블록마다 위 간격만 두고, 앞 블록에 따라 달라지는 간격은 아래 BODY_CLASS가 형제 선택자로 정한다.
 */

type PostBodyImage = SanityImageSource & {
  _type: "image";
  _key: string;
  alt?: string | null;
  caption?: string | null;
};

type PostBodyYouTube = { _type: "youtube"; _key: string; url?: string | null };

export type PostBodyValue = Array<PortableTextBlock | PostBodyImage | PostBodyYouTube>;

const BODY_CLASS = [
  // 첫 블록과 위 구분선 사이는 페이지가 정한다.
  "[&>:first-child]:mt-0",
  // 사진·영상 다음 블록은 무엇이든 64px 떨어진다.
  "[&>[data-media]+*]:mt-16",
  // 사진이 이어지면 12px 간격으로 붙는다.
  "[&>[data-block=image]+[data-block=image]]:mt-sm",
  // 인용이 이어지면 한 묶음처럼 좁게 붙는다.
  "[&>blockquote+blockquote]:mt-md lg:[&>blockquote+blockquote]:mt-sm",
].join(" ");

const HEADING_CLASS = `${POST_COLUMN} mt-12 text-text-primary lg:mt-16`;
const LIST_CLASS = "mt-6 space-y-sm text-detail-s-m text-text-secondary lg:text-body-sm-m";

// 엔터만 친 빈 줄은 그리지 않는다. 블록 사이 간격은 디자인이 정한 값만 쓴다.
function isEmptyBlock(block: PortableTextBlock): boolean {
  return block.children.every(
    (child) => !("text" in child) || typeof child.text !== "string" || child.text.trim() === "",
  );
}

function textBlock(Tag: ElementType, className: string) {
  return function TextBlock({
    children,
    value,
  }: {
    children?: ReactNode;
    value: PortableTextBlock;
  }) {
    return isEmptyBlock(value) ? null : <Tag className={className}>{children}</Tag>;
  };
}

// 편집기가 허용하는 주소만 링크로 만든다(postBody.ts). API로 들어온 javascript: 같은 주소는 글자로만 남긴다.
const EXTERNAL_HREF = /^https?:\/\//i;
const CONTACT_HREF = /^(mailto|tel):/i;
const LINK_CLASS = "text-text-link underline underline-offset-4";

function BodyLink({ value, children }: { value?: { href?: string }; children: ReactNode }) {
  const href = typeof value?.href === "string" ? value.href.trim() : "";
  // 사이트 안 주소는 화면 전환 없이 이동한다. //로 시작하면 다른 사이트라 막는다.
  if ((href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#")) {
    return (
      <Link href={href} className={LINK_CLASS}>
        {children}
      </Link>
    );
  }
  if (EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} className={LINK_CLASS} {...NEW_TAB_PROPS}>
        {children}
      </a>
    );
  }
  if (CONTACT_HREF.test(href)) {
    return (
      <a href={href} className={LINK_CLASS}>
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

function BodyImage({ value }: PortableTextTypeComponentProps<PostBodyImage>) {
  const image = toCroppedImage(value);
  if (!image) return null;
  const caption = value.caption?.trim();
  // 폭은 모바일에서 화면, 1024부터 가운데 칸(864)이고, 사진이 그보다 작으면 늘리지 않고 원래 폭으로 가운데 둔다.
  // 높이는 사진 비율대로라 잘리지 않는다. Studio에서 운영자가 자른(crop) 영역만 반영된다.

  return (
    <figure data-media data-block="image" className="mt-16">
      <div className={POST_IMAGE_WIDTH}>
        <div
          className="relative mx-auto"
          style={{ aspectRatio: image.aspectRatio, maxWidth: `${image.width}px` }}
        >
          <SanityImage
            image={image}
            alt={value.alt?.trim() ?? ""}
            sizes={`(min-width: 1024px) ${Math.min(864, image.width)}px, 100vw`}
          />
        </div>
      </div>
      {/* TODO: 캡션 모양은 시안에 없어 임시로 정했다. 디자이너에게 받으면 바꾼다. */}
      {caption && (
        <figcaption
          className={`${POST_COLUMN} mt-sm text-detail-ss-m text-text-tertiary lg:text-body-xs-m`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function BodyYouTube({ value }: PortableTextTypeComponentProps<PostBodyYouTube>) {
  const videoId = value.url ? parseYouTubeId(value.url) : null;
  if (!videoId) return null;

  return (
    <figure data-media data-block="youtube" className={`${POST_COLUMN} mt-16`}>
      <YouTubeEmbed videoId={videoId} />
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: textBlock(
      "p",
      `${POST_COLUMN} mt-6 text-body-s-m text-text-secondary lg:text-body-sm-r`,
    ),
    h1: textBlock("h2", `${HEADING_CLASS} text-title-m-b lg:text-body-l-b`),
    h2: textBlock("h3", `${HEADING_CLASS} text-title-s-b lg:text-title-mm-b`),
    h3: textBlock("h4", `${HEADING_CLASS} text-detail-m-sb lg:text-body-m-sb`),
    // 왼쪽 선은 글자 칸 왼쪽 끝에 가운데를 맞춘다(Figma). 1024에서는 첫 줄 글자 위·마지막 줄 글자 아래에서 8px씩 짧다.
    blockquote: textBlock(
      "blockquote",
      `${POST_COLUMN} relative mt-6 pl-md text-detail-s-m text-text-secondary before:absolute before:inset-y-0 before:-left-[0.8px] before:w-[1.6px] before:bg-border-default lg:pl-xl lg:text-body-sm-m lg:before:inset-y-2 lg:before:-left-[1.2px] lg:before:w-[2.4px]`,
    ),
  },
  // 목록 안에 들여 쓴 목록(Tab)은 항목 안에 들어가 칸 폭을 따로 잡지 않는다.
  list: {
    bullet: ({ children, value }) => (
      <ul className={value.level > 1 ? "mt-sm space-y-sm" : `${POST_COLUMN} ${LIST_CLASS}`}>
        {children}
      </ul>
    ),
    number: ({ children, value }) => (
      <ol className={value.level > 1 ? "mt-sm space-y-sm" : `${POST_COLUMN} ${LIST_CLASS}`}>
        {children}
      </ol>
    ),
  },
  // 점은 첫 줄 가운데에 놓인다(모바일 4px, 1024 5px). 번호는 20px 칸 가운데에 놓고 글은 그 뒤 8px(1024 16px)에서 시작한다.
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-md before:absolute before:top-[9.2px] before:left-0 before:size-1 before:rounded-full before:bg-icon-primary lg:pl-[21px] lg:before:top-4 lg:before:size-[5px]">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-7 before:absolute before:left-0 before:w-5 before:text-center before:content-[counter(list-item)_'.'] lg:pl-9">
        {children}
      </li>
    ),
  },
  marks: { link: BodyLink },
  types: { image: BodyImage, youtube: BodyYouTube },
};

export function PostBody({ value, className = "" }: { value: PostBodyValue; className?: string }) {
  return (
    <div className={`${BODY_CLASS} ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
