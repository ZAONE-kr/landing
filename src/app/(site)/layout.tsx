import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

// /admin(Sanity Studio)은 이 그룹 밖이라 헤더·푸터가 붙지 않는다.
// break-keep: 한글이 단어 중간에서 줄바꿈되지 않게 한다.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-bg-default break-keep">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
