import { defineQuery } from "next-sanity";

import { INSIGHT } from "@/sanity/postCategories";
import { ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 게시된 카드 태그 문서에서 카드별 태그만 꺼낸다. 문서가 없으면 null이다.
export const ZAONE_LAB_FIELD_TAGS_QUERY = defineQuery(
  `*[_id == $id][0]{${ZAONE_LAB_FIELDS.map((field) => field.key).join(", ")}}`,
);

/*
 * 인사이트 목록 한 묶음. 게시일 최신순이고 같은 날이면 나중에 만든 글이 앞이다(Studio 목록과 같은 순서). 만든 시각까지
 * 같으면(한 번에 옮겨 넣은 글) _id로 순서를 정해, 묶음 경계에서 글이 빠지거나 겹치지 않게 한다.
 * $after가 null이면 첫 묶음, 아니면 앞 묶음의 마지막 글 바로 다음부터다. 몇 번째부터 자르는 방식은 그사이 새 글이
 * 게시되면 앞 묶음의 글이 밀려 내려와 다시 나오지만, 마지막 글을 기준으로 이어 받으면 그런 일이 없다.
 * 주소·게시일이 없는 글은 상세 링크와 순서를 만들 수 없어 뺀다(Studio 검사로 게시는 막히지만 API로 만든 글 대비).
 * $limit은 한 묶음보다 하나 더 받아 다음 묶음이 있는지 안다(src/sanity/lib/insights.ts).
 */
export const INSIGHT_LIST_QUERY = defineQuery(`
  *[
    _type == "${INSIGHT.type}" && defined(slug.current) && defined(publishedAt) && (
      $after == null ||
      publishedAt < $after.publishedAt ||
      (publishedAt == $after.publishedAt && (
        _createdAt < $after.createdAt ||
        (_createdAt == $after.createdAt && _id < $after.id)
      ))
    )
  ] | order(publishedAt desc, _createdAt desc, _id desc) [0...$limit] {
    _id,
    _createdAt,
    publishedAt,
    title,
    "slug": slug.current,
    "image": mainImage{
      crop,
      hotspot,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`);
