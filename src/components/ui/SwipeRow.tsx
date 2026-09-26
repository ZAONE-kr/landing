"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";

// 이만큼 넘게 움직여야 끌기로 본다. 그 전에 떼면 평소처럼 클릭된다.
const DRAG_THRESHOLD_PX = 5;

/*
 * 가로로 넘겨 보는 영역. 터치·트랙패드는 브라우저 기본 스크롤로 넘기고, 마우스는 끌어서 넘긴다.
 * 끄는 동안에는 스냅을 꺼 두었다가 놓으면 되돌려서 가까운 카드에 맞춘다.
 */
export function SwipeRow({ className = "", children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    drag.current.moved = false;
    if (!el || event.pointerType !== "mouse" || event.button !== 0) return;
    if (el.scrollWidth <= el.clientWidth) return;
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    const state = drag.current;
    if (!el || !state.active) return;

    const dx = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      state.moved = true;
      el.setPointerCapture(event.pointerId);
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    }
    el.scrollLeft = state.startScroll - dx;
  }

  function endDrag() {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    el.style.scrollSnapType = "";
    el.style.cursor = "";
    el.style.userSelect = "";
  }

  return (
    <div
      ref={ref}
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // 끌고 난 직후의 클릭은 카드 링크로 넘어가지 않게 막는다.
      onClickCapture={(event) => {
        if (drag.current.moved) {
          event.preventDefault();
          event.stopPropagation();
          drag.current.moved = false;
        }
      }}
      // 사진을 끌면 브라우저의 이미지 드래그가 시작되어 끌기가 끊긴다.
      onDragStart={(event) => event.preventDefault()}
      className={`scrollbar-none overflow-x-auto [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
