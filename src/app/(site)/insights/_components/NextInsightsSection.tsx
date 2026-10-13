import { Button } from "@/components/ui/Button";
import type { InsightCard as InsightCardData } from "@/sanity/lib/insights";

import { InsightCard } from "./InsightCard";

/*
 * 상세 페이지 아래 "다음 인사이트 확인하기". 카드는 인사이트 목록과 같다(1024 시안 277×420 세 장, 375 시안 가로 카드).
 * 다른 글이 없으면 섹션째 숨긴다.
 */
export function NextInsightsSection({ insights }: { insights: InsightCardData[] }) {
  if (insights.length === 0) return null;

  return (
    <section className="bg-bg-surface px-xl py-3xl lg:px-6xl lg:pt-6xl lg:pb-7xl">
      <div className="mx-auto flex max-w-[54rem] flex-col items-center gap-xl lg:gap-3xl">
        <h2 className="self-stretch text-title-s-b text-text-primary lg:text-title-lm-b">
          다음 인사이트 확인하기
        </h2>
        <ul className="flex w-full flex-col gap-sm lg:grid lg:grid-cols-3 lg:gap-md">
          {insights.map((insight) => (
            <li key={insight.id}>
              <InsightCard insight={insight} headingLevel="h3" />
            </li>
          ))}
        </ul>
        <Button
          href="/insights"
          className="w-[200px] px-xl py-md text-body-xs-b lg:w-[316px] lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          전체 인사이트 목록 보기
        </Button>
      </div>
    </section>
  );
}
