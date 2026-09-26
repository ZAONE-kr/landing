import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "GIVE & TAKE", path: "/give-and-take" });

export default function GiveAndTakePage() {
  return <ComingSoon name="GIVE & TAKE" />;
}
