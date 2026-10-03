import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "GIVE & USE", path: "/give-and-use" });

export default function GiveAndUsePage() {
  return <ComingSoon name="GIVE & USE" />;
}
