import { fetchPublished } from "@/sanity/lib/published";

// 섹션 문서는 하나뿐이고 ID가 종류 이름과 같다(src/sanity/sections). 게시된 문서가 없으면 null이다.
export function getSection(id: string): Promise<unknown> {
  return fetchPublished(`*[_id == $id][0]`, { id }, id);
}
