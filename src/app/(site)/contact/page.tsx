import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "CONTACT", path: "/contact" });

export default function ContactPage() {
  return <ComingSoon name="CONTACT" />;
}
