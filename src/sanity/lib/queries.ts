import { defineQuery } from "next-sanity";

import { INSIGHT } from "@/sanity/postCategories";
import { ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 게시된 카드 태그 문서에서 카드별 태그만 꺼낸다. 문서가 없으면 null이다.
export const ZAONE_LAB_FIELD_TAGS_QUERY = defineQuery(
  `*[_id == $id][0]{${ZAONE_LAB_FIELDS.map((field) => field.key).join(", ")}}`,
);

// 사진 필드를 src/sanity/lib/image.ts의 SanityImageSource 모양으로 펼친다.
export const IMAGE_FIELDS = `crop, hotspot, "url": asset->url, "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height`;

// 목록에 나오는 인사이트. 주소·게시일이 없는 글은 상세 링크와 순서를 만들 수 없어 뺀다(Studio 검사로 게시는 막히지만
// API로 만든 글 대비).
const LISTED_INSIGHT = `_type == "${INSIGHT.type}" && defined(slug.current) && defined(publishedAt)`;

// 인사이트 카드 한 장(src/sanity/lib/insights.ts의 InsightRow). 목록과 상세의 다음 인사이트가 같은 카드를 쓴다.
const INSIGHT_ROW_FIELDS = `_id, _createdAt, publishedAt, title, "slug": slug.current, "image": mainImage{${IMAGE_FIELDS}}`;

// 목록 순서. 게시일 최신순이고 같은 날이면 나중에 만든 글이 앞이다(Studio 목록과 같은 순서). 만든 시각까지 같으면
// (한 번에 옮겨 넣은 글) _id로 순서를 정한다. 다음 인사이트도 이 순서를 따른다.
const NEWEST_FIRST = "order(publishedAt desc, _createdAt desc, _id desc)";

/*
 * 인사이트 목록 한 묶음. 같은 순서 기준(_id까지)으로 묶음 경계에서 글이 빠지거나 겹치지 않게 한다.
 * $after가 null이면 첫 묶음, 아니면 앞 묶음의 마지막 글 바로 다음부터다. 몇 번째부터 자르는 방식은 그사이 새 글이
 * 게시되면 앞 묶음의 글이 밀려 내려와 다시 나오지만, 마지막 글을 기준으로 이어 받으면 그런 일이 없다.
 * $limit은 한 묶음보다 하나 더 받아 다음 묶음이 있는지 안다(src/sanity/lib/insights.ts).
 */
export const INSIGHT_LIST_QUERY = defineQuery(`
  *[
    ${LISTED_INSIGHT} && (
      $after == null ||
      publishedAt < $after.publishedAt ||
      (publishedAt == $after.publishedAt && (
        _createdAt < $after.createdAt ||
        (_createdAt == $after.createdAt && _id < $after.id)
      ))
    )
  ] | ${NEWEST_FIRST} [0...$limit] {${INSIGHT_ROW_FIELDS}}
`);

/*
 * 인사이트 상세 페이지. 주소(slug)로 글 하나를 찾는다. 없으면 null이다.
 * 다음 인사이트는 목록 순서에서 이 글 바로 뒤 글들(olderInsights)이고, 이 글이 끝 쪽이라 모자라면 맨 앞 글들
 * (newestInsights)로 채운다(src/app/(site)/insights/_lib/insight.ts).
 */
export const INSIGHT_QUERY = defineQuery(`*[_type == "${INSIGHT.type}" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  projectName,
  partner,
  mainImage{${IMAGE_FIELDS}},
  body[]{..., _type == "image" => {${IMAGE_FIELDS}}},
  posterImage{${IMAGE_FIELDS}, alt},
  "olderInsights": *[${LISTED_INSIGHT} && _id != ^._id && (
    publishedAt < ^.publishedAt ||
    (publishedAt == ^.publishedAt && (
      _createdAt < ^._createdAt ||
      (_createdAt == ^._createdAt && _id < ^._id)
    ))
  )] | ${NEWEST_FIRST}[0...3]{${INSIGHT_ROW_FIELDS}},
  "newestInsights": *[${LISTED_INSIGHT} && _id != ^._id] | ${NEWEST_FIRST}[0...3]{${INSIGHT_ROW_FIELDS}}
}`);

// 목록에 나오는 사업소식·사업보고($type). 주소·게시일이 없는 글은 링크와 순서를 만들 수 없어 뺀다.
const LISTED_NOTICE = `_type == $type && defined(slug.current) && defined(publishedAt)`;

// 이전 글·다음 글 한 줄(src/sanity/lib/notices.ts의 NoticeRow).
const NOTICE_ROW_FIELDS = `_id, title, "slug": slug.current, publishedAt`;

/*
 * 사업소식·사업보고 상세 페이지. 종류($type)와 주소(slug)로 글 하나를 찾는다. 없으면 null이다.
 * 이전 글은 목록 순서(인사이트와 같은 최신순)에서 바로 아래, 다음 글은 바로 위 글이다. 같은 종류 안에서만 찾는다.
 * 첨부파일은 Sanity 파일 자산의 주소·원래 이름·크기를 함께 받는다.
 */
export const NOTICE_QUERY = defineQuery(`*[_type == $type && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  attachments[]{_key, title, "url": asset->url, "filename": asset->originalFilename, "size": asset->size},
  body[]{..., _type == "image" => {${IMAGE_FIELDS}}},
  posterImage{${IMAGE_FIELDS}, alt},
  "older": *[${LISTED_NOTICE} && _id != ^._id && (
    publishedAt < ^.publishedAt ||
    (publishedAt == ^.publishedAt && (
      _createdAt < ^._createdAt ||
      (_createdAt == ^._createdAt && _id < ^._id)
    ))
  )] | ${NEWEST_FIRST}[0]{${NOTICE_ROW_FIELDS}},
  "newer": *[${LISTED_NOTICE} && _id != ^._id && (
    publishedAt > ^.publishedAt ||
    (publishedAt == ^.publishedAt && (
      _createdAt > ^._createdAt ||
      (_createdAt == ^._createdAt && _id > ^._id)
    ))
  )] | order(publishedAt asc, _createdAt asc, _id asc)[0]{${NOTICE_ROW_FIELDS}}
}`);

/*
 * CONTACT 페이지 공지사항 목록의 한 탭($type). 순서는 상세 페이지의 이전 글·다음 글과 같은 최신순이다.
 * 글이 수십 개 수준이라 한 번에 모두 받아 브라우저에서 5개씩 나눠 보인다.
 */
export const NOTICE_LIST_QUERY = defineQuery(
  `*[${LISTED_NOTICE}] | ${NEWEST_FIRST}{${NOTICE_ROW_FIELDS}}`,
);
