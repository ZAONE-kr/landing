import type { InsightPage } from "@/sanity/lib/insights";

import { InsightList } from "./InsightList";

/*
 * 회색 바탕 위 인사이트 카드 목록. 모바일은 가로 카드를 한 줄에 하나씩(간격 16px), 데스크톱은 세 칸
 * 격자(가로 16px, 세로 80px)다. 데스크톱 칸 폭은 화면을 따라 1024 시안 277px에서 1440 시안 416px까지 늘어난다.
 */
export function InsightListSection({ firstPage }: { firstPage: InsightPage }) {
  return (
    <section aria-label="인사이트 목록" className="bg-bg-surface px-xl py-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto max-w-[37.5rem] lg:max-w-[80rem]">
        <InsightList firstPage={firstPage} />
      </div>
    </section>
  );
}
