import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { pageOpenGraph } from "@/app/shared-metadata";
import { describePostBody } from "@/components/post/describe";
import type { PostBodyValue } from "@/components/post/PostBody";
import { formatFileSize } from "@/sanity/fileSize";
import type { SanityImageSource } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  type NoticeCategory,
  noticeHref,
  type NoticeRow,
  type NoticeType,
} from "@/sanity/lib/notices";
import { NOTICE_QUERY } from "@/sanity/lib/queries";
import { decodeSlugParam } from "@/sanity/slug";

// 쿼리가 주는 첨부파일 하나(queries.ts의 NOTICE_QUERY). 파일을 올리는 중이면 주소가 없을 수 있다.
type NoticeAttachmentRow = {
  _key: string;
  title: string | null;
  url: string | null;
  filename: string | null;
  size: number | null;
};

/*
 * 사업소식·사업보고 상세(NOTICE_QUERY). Studio가 필수 칸을 막지만 API로 들어온 글은 비어 있을 수 있어 null을 받아 둔다.
 */
export type Notice = {
  _id: string;
  title: string | null;
  slug: string;
  publishedAt: string | null;
  attachments: NoticeAttachmentRow[] | null;
  body: PostBodyValue | null;
  posterImage: (SanityImageSource & { alt?: string | null }) | null;
  older: NoticeRow | null;
  newer: NoticeRow | null;
};

export type NoticeAttachment = {
  key: string;
  name: string;
  size: string;
  href: string;
};

/*
 * 게시된 글 하나. 메타데이터와 페이지가 같은 글을 읽으므로 한 번만 묻도록 묶는다.
 * 실패하면 그대로 던진다. 운영 서버에서는 Next가 마지막으로 만든 페이지를 계속 보여 주고 다시 시도한다.
 */
const getNotice = cache(async (type: NoticeType, slug: string): Promise<Notice | null> => {
  const { data } = await sanityFetch({
    query: NOTICE_QUERY,
    params: { type, slug },
    perspective: "published",
    stega: false,
  });
  return data && typeof data === "object" ? (data as Notice) : null;
});

// 페이지 주소의 글. 없거나 주소가 깨졌으면 404다.
export async function loadNotice(
  type: NoticeType,
  params: Promise<{ slug: string }>,
): Promise<Notice> {
  const slug = decodeSlugParam((await params).slug);
  const notice = slug ? await getNotice(type, slug) : null;
  if (!notice) notFound();
  return notice;
}

export function noticeMetadata(category: NoticeCategory, notice: Notice): Metadata {
  const url = noticeHref(category.type, notice.slug);
  const title = `${notice.title?.trim() || category.title} - 자원(ZAONE)`;
  const description = describePostBody(notice.body) || `자원(ZAONE)의 ${category.title}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: pageOpenGraph({ url, title, description }),
  };
}

// 내려받는 파일 이름에서 뺄 글자. CDN이 이름을 따옴표로 감싸 헤더에 넣으므로 따옴표·역슬래시·제어 문자를 지운다.
const UNSAFE_FILENAME = /["\\\p{Cc}]/gu;

/*
 * 첨부파일 칸에 보일 이름·크기·내려받기 주소. 파일이 아직 없는 항목은 뺀다.
 * 내려받기는 Sanity 자산 CDN 주소 끝에 파일 이름을 붙이고 ?dl을 단다(…/해시.pdf/원래이름.pdf?dl). 다른 도메인이라
 * a의 download 속성은 듣지 않는다. ?dl=이름으로 넘기면 CDN이 이름을 퍼센트 인코딩해 Safari가 "2025%EB%85%84…"로
 * 저장하지만, 주소 끝 이름은 글자 그대로 보내 Chrome·Firefox·Safari 모두 한글 이름으로 저장한다(2026-10-19 확인).
 * macOS에서 올린 파일은 이름의 한글 자모가 나뉜 채(NFD) 저장되어 Windows에서 글자가 풀려 보이므로 합쳐서(NFC) 붙인다.
 */
export function toAttachments(rows: NoticeAttachmentRow[] | null): NoticeAttachment[] {
  return (rows ?? []).flatMap((row) => {
    if (!row.url) return [];
    const filename = (row.filename ?? "").normalize("NFC").replace(UNSAFE_FILENAME, "").trim();
    return {
      key: row._key,
      name: row.title?.trim() || filename || "첨부파일",
      size: formatFileSize(row.size),
      href: filename ? `${row.url}/${encodeURIComponent(filename)}?dl` : `${row.url}?dl`,
    };
  });
}
