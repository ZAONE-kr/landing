import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata({ name: "INSIGHTS", path: "/insights" });

// TODO: Sanity 블로그 스키마가 생기면 글 목록을 보여준다.
export default function InsightsPage() {
  return <ComingSoon name="INSIGHTS" />;
}
