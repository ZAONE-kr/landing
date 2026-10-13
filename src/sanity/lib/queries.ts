import { defineQuery } from "next-sanity";

import { INSIGHT } from "@/sanity/postCategories";
import { ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 게시된 카드 태그 문서에서 카드별 태그만 꺼낸다. 문서가 없으면 null이다.
export const ZAONE_LAB_FIELD_TAGS_QUERY = defineQuery(
  `*[_id == $id][0]{${ZAONE_LAB_FIELDS.map((field) => field.key).join(", ")}}`,
);

// 사진 필드를 src/sanity/lib/image.ts의 SanityImageSource 모양으로 펼친다.
const IMAGE_FIELDS = `crop, hotspot, "url": asset->url, "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height`;

// 다음 인사이트 카드. 목록에 나오는 글(주소·게시일이 있는 글)만 고른다.
const INSIGHT_CARD_FILTER = `_type == "${INSIGHT.type}" && defined(slug.current) && defined(publishedAt)`;
const INSIGHT_CARD_FIELDS = `_id, title, "slug": slug.current, mainImage{${IMAGE_FIELDS}}`;

// 인사이트 목록과 같은 순서: 게시일 최신순, 같은 날이면 나중에 만든 글, 만든 시각도 같으면 _id 역순.
const NEWEST_FIRST = "order(publishedAt desc, _createdAt desc, _id desc)";

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
  "olderInsights": *[${INSIGHT_CARD_FILTER} && _id != ^._id && (
    publishedAt < ^.publishedAt ||
    (publishedAt == ^.publishedAt && (
      _createdAt < ^._createdAt ||
      (_createdAt == ^._createdAt && _id < ^._id)
    ))
  )] | ${NEWEST_FIRST}[0...3]{${INSIGHT_CARD_FIELDS}},
  "newestInsights": *[${INSIGHT_CARD_FILTER} && _id != ^._id] | ${NEWEST_FIRST}[0...3]{${INSIGHT_CARD_FIELDS}}
}`);
