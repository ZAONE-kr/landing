import { withDefaults } from "@/sanity/lib/content";
import { IMAGE_FIELDS } from "@/sanity/lib/queries";
import { fetchPublished } from "@/sanity/lib/published";
import type { SectionMeta } from "@/sanity/sections/pages";

/*
 * 섹션 문서는 하나뿐이고 ID가 종류 이름과 같다(src/sanity/sections). 게시된 문서가 없으면 null이다.
 * 카드 목록(cards)의 사진(photo)은 파일 주소와 크기를 함께 받는다(src/sanity/lib/image.ts의 SanityImageSource).
 */
export function getSection(id: string): Promise<unknown> {
  return fetchPublished(`*[_id == $id][0]{..., cards[]{..., photo{${IMAGE_FIELDS}}}}`, { id }, id);
}

// 섹션의 내용. 게시된 문서의 값을 코드의 기본값 위에 필드 단위로 얹는다.
export async function loadSection<T extends object>(section: SectionMeta<T>): Promise<T> {
  return withDefaults(section.defaults, await getSection(section.id));
}
