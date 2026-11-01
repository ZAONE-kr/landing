import { withDefaults } from "@/sanity/lib/content";
import { IMAGE_FIELDS } from "@/sanity/lib/queries";
import { fetchPublished } from "@/sanity/lib/published";
import type { SectionMeta } from "@/sanity/sections/pages";

/*
 * 섹션 문서는 하나뿐이고 ID가 종류 이름과 같다(src/sanity/sections). 게시된 문서가 없으면 null이다.
 * 사진은 파일 주소와 크기를 함께 받는다(src/sanity/lib/image.ts의 SanityImageSource). 섹션 사진은 기본값이 null인
 * 칸(운영자가 올려야만 있는 값)이고, 카드 사진은 카드 목록(cards)의 photo다.
 */
export function getSection(section: SectionMeta): Promise<unknown> {
  const photos = Object.entries(section.defaults)
    .filter(([, value]) => value === null)
    .map(([key]) => `${key}{${IMAGE_FIELDS}}`);
  const projection = ["...", ...photos, `cards[]{..., photo{${IMAGE_FIELDS}}}`].join(", ");
  return fetchPublished(`*[_id == $id][0]{${projection}}`, { id: section.id }, section.id);
}

// 섹션의 내용. 게시된 문서의 값을 코드의 기본값 위에 필드 단위로 얹는다.
export async function loadSection<T extends object>(section: SectionMeta<T>): Promise<T> {
  return withDefaults(section.defaults, await getSection(section));
}
