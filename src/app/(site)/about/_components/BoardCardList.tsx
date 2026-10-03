"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// 고배율 화면에서는 스크롤 위치가 소수점이라 끝에 닿아도 1px 안쪽에서 멈출 수 있다.
const EDGE_TOLERANCE_PX = 1;

const EDGE_FADE_CLASS =
  "pointer-events-none absolute -inset-y-[10px] w-[60px] from-transparent from-[9.375%] via-bg-default/20 via-[41.16%] to-bg-default transition-opacity duration-250 ease-out lg:hidden";

/*
 * 이사 카드 목록. 모바일은 좌우 여백 밖으로 펴서 넘겨 보고, 포커스 링이 잘리지 않게 위아래로 4px 띄운다.
 * 목록 양 끝에는 카드가 흐려지며 잘리도록 60px 그라데이션을 덮는다. 시안대로 카드보다 위아래로 10px씩 길고,
 * 끝 색은 섹션 배경(bg-subtle)이 아니라 bg-default다(시안 그대로). 목록을 끝까지 넘기면 그쪽 그라데이션을
 * 걷어서 더 넘길 카드가 없다는 걸 보여 준다. 처음 그릴 때는 맨 앞에 있으므로 왼쪽만 걷어 둔다.
 * 데스크톱은 카드를 줄바꿈해 놓으므로 감싼 div를 contents로 풀어 목록이 그대로 flex 항목이 되게 한다.
 */
export function BoardCardList({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    function updateEdges() {
      if (!list) return;
      const maxScroll = list.scrollWidth - list.clientWidth;
      setAtStart(list.scrollLeft <= EDGE_TOLERANCE_PX);
      setAtEnd(list.scrollLeft >= maxScroll - EDGE_TOLERANCE_PX);
    }

    updateEdges();
    list.addEventListener("scroll", updateEdges, { passive: true });
    // 화면 폭이 바뀌면 넘길 수 있는 거리도 바뀐다.
    const observer = new ResizeObserver(updateEdges);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative -mx-lg lg:contents">
      <ul
        ref={listRef}
        className="-my-1 flex snap-x snap-mandatory scroll-px-lg scrollbar-none gap-s overflow-x-auto px-lg py-1 lg:m-0 lg:w-full lg:max-w-[58.875rem] lg:snap-none lg:flex-wrap lg:justify-center lg:gap-x-sm lg:gap-y-4xl lg:overflow-visible lg:p-0"
      >
        {children}
      </ul>
      <div
        aria-hidden
        className={`left-0 bg-linear-to-l ${EDGE_FADE_CLASS} ${atStart ? "opacity-0" : ""}`}
      />
      <div
        aria-hidden
        className={`right-0 bg-linear-to-r ${EDGE_FADE_CLASS} ${atEnd ? "opacity-0" : ""}`}
      />
    </div>
  );
}
