import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "IMPACT", path: "/impact" });

export default function ImpactPage() {
  return <ComingSoon name="IMPACT" />;
}
