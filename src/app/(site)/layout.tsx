import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

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
