import { ABOUT_SECTIONS } from "./about";
import { GIVE_AND_USE_SECTIONS } from "./giveAndUse";
import { IMPACT_SECTIONS } from "./impact";
import { LAB_SECTIONS } from "./lab";
import type { SectionMeta } from "./pages";

/*
 * Studio에서 고칠 수 있는 섹션. 새 섹션은 페이지별 파일(lab.ts 등)에 더하고 src/sanity/schemaTypes에 스키마를 만든다.
 * 목록 순서가 폴더 안의 순서다.
 */
export const SECTIONS: readonly SectionMeta[] = [
  ...GIVE_AND_USE_SECTIONS,
  ...IMPACT_SECTIONS,
  ...LAB_SECTIONS,
];
