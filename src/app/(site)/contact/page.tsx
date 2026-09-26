import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "문의하기", path: "/contact" });

export default function ContactPage() {
  return <ComingSoon name="문의하기" />;
}
