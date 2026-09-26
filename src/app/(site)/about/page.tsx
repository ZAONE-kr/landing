import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "ABOUT", path: "/about" });

// 기존 사이트(zaone.org, 아임웹)와 같은 주소를 쓴다.
export default function AboutPage() {
  return <ComingSoon name="ABOUT" />;
}
