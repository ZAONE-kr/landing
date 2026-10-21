import { SECTIONS } from "@/sanity/sections";

import { businessNewsType } from "./businessNews";
import { businessReportType } from "./businessReport";
import { insightType } from "./insight";
import { labExperienceCtaType } from "./labExperienceCta";
import { postBodyType } from "./postBody";
import { youtubeType } from "./youtube";
import { zaoneLabFieldTagsType } from "./zaoneLabFieldTags";

// 문서 종류는 이 순서로 Studio "새 문서" 메뉴에 놓인다. 본문(postBody)·YouTube는 글 안에 쓰는 종류다.
export const schemaTypes = [
  insightType,
  businessNewsType,
  businessReportType,
  zaoneLabFieldTagsType,
  labExperienceCtaType,
  postBodyType,
  youtubeType,
];

// 문서가 하나뿐인 종류. 새로 만들기·삭제·복제를 막는다(sanity.config.ts).
export const SINGLETON_TYPES = new Set<string>([
  zaoneLabFieldTagsType.name,
  ...SECTIONS.map((section) => section.id),
]);
