import { SECTIONS } from "@/sanity/sections";

import { aboutSectionTypes } from "./aboutSections";
import { businessNewsType } from "./businessNews";
import { businessReportType } from "./businessReport";
import { giveAndUseSectionTypes } from "./giveAndUseSections";
import { impactSectionTypes } from "./impactSections";
import { insightType } from "./insight";
import { labSectionTypes } from "./labSections";
import { postBodyType } from "./postBody";
import { youtubeType } from "./youtube";
import { zaoneLabFieldTagsType } from "./zaoneLabFieldTags";

const sectionTypes = [
  ...aboutSectionTypes,
  ...giveAndUseSectionTypes,
  ...impactSectionTypes,
  ...labSectionTypes,
];

// 문서 종류는 이 순서로 Studio "새 문서" 메뉴에 놓인다. 본문(postBody)·YouTube는 글 안에 쓰는 종류다.
export const schemaTypes = [
  insightType,
  businessNewsType,
  businessReportType,
  zaoneLabFieldTagsType,
  ...sectionTypes,
  postBodyType,
  youtubeType,
];

/*
 * 섹션 스키마와 섹션 목록(src/sanity/sections)이 어긋나면 Studio 목록에 섹션이 빠지거나 새로 만들기가 열린 채로 남는다.
 * 한쪽에만 더하는 실수를 Studio가 열릴 때 바로 알도록 둘을 맞대어 본다.
 */
const sectionTypeNames = new Set(sectionTypes.map((type) => type.name));
for (const section of SECTIONS) {
  if (!sectionTypeNames.has(section.id)) throw new Error(`섹션 스키마가 없습니다: ${section.id}`);
}
for (const name of sectionTypeNames) {
  if (!SECTIONS.some((section) => section.id === name))
    throw new Error(`sections/index.ts의 SECTIONS에 없는 섹션 스키마입니다: ${name}`);
}

// 문서가 하나뿐인 종류. 새로 만들기·삭제·복제를 막는다(sanity.config.ts).
export const SINGLETON_TYPES = new Set<string>([
  zaoneLabFieldTagsType.name,
  ...SECTIONS.map((section) => section.id),
]);
