import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/*
 * 사이트 페이지는 정적으로 만들어 두고, 글·푸터·태그가 Sanity에서 바뀌면 다시 만든다(푸터가 모든 페이지에 붙어서 여기서 정한다).
 * - 게시를 Studio(/admin)가 받으면 그 문서의 캐시 태그를 무효화해, 다음 방문 때 새로 만든다(src/sanity/lib/live.ts).
 * - 그 알림을 놓친 게시(게시 직후 Studio 창을 닫음, 배포 전에 연 창, 예약 게시 등)는 한 시간마다 다시 만들 때 반영된다.
 *   그래서 Sanity 데이터는 Next 데이터 캐시에 두지 않는다(force-no-store). 두면 sanityFetch가 무기한으로 저장해 시간
 *   기준으로 다시 만들어도 예전 내용을 다시 쓰고, .next/cache를 남긴 채 다시 빌드하면 예전 내용으로 되돌아간다.
 *   force-static은 저장하지 않는 요청이 있어도 페이지를 정적으로 두게 한다. 다시 만들 때마다 Sanity를 한 번 더 읽는다.
 */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const revalidate = 3600;

// /admin(Sanity Studio)은 이 그룹 밖이라 헤더·푸터가 붙지 않는다.
// break-keep: 한글이 단어 중간에서 줄바꿈되지 않게 한다.
// antialiased: Mac 브라우저가 글자 획을 부풀려 그리지 않게 해 Figma 시안과 같은 굵기로 보이게 한다.
// 기본값이면 같은 굵기도 한 단계 굵어 보이고, 어두운 바탕의 밝은 글자에서 특히 두드러진다. Windows에는 영향이 없다.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-bg-default break-keep antialiased">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
