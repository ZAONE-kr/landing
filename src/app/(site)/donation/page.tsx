import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "후원하기", path: "/donation" });

// 기존 사이트(zaone.org, 아임웹)와 같은 주소를 쓴다.
export default function DonationPage() {
  return <ComingSoon name="후원하기" />;
}
