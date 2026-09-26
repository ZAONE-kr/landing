import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "PARTNER WITH US", path: "/partner-with-us" });

export default function PartnerWithUsPage() {
  return <ComingSoon name="PARTNER WITH US" />;
}
