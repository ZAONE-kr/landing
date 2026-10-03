"use client";

import { type ReactNode, useEffect, useRef } from "react";

// 고정 구간의 처음과 끝에서 이만큼(비율)은 전환하지 않고 멈춰 둔다.
const HOLD = 0.1;

/*
 * 데스크톱에서 섹션이 화면을 다 채우면 그 자리에 고정하고, 고정된 동안의 스크롤로
 * 공급 면 → 사용 면 전환 진행도(--p, 0~1)를 정한다. 전환이 끝나면 고정이 풀려 다시 스크롤된다.
 * - 고정 위치: 섹션 위가 화면 위에 닿을 때. 화면이 섹션(816px)보다 낮으면 섹션 아래를 화면 아래에 맞춘다.
 * - 고정 거리: 섹션 뒤 빈 칸(화면 높이) 만큼. 처음과 끝 10%는 멈춰 두고 가운데 80%에서 바뀐다.
 * 폭과 투명도는 CSS가 --p로 계산한다. 움직임 줄이기 설정이면 가운데 지점에서 바로 바뀐다.
 * 모바일은 고정하지 않는다.
 */
export function GiveOrUseScroll({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const spacer = spacerRef.current;
    if (!wrapper || !section || !spacer) return;

    const desktop = window.matchMedia("(min-width: 64rem)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 고정되는 위치(화면 위 기준)와 고정 거리.
    const measure = () => {
      const pinTop = Math.min(0, window.innerHeight - section.offsetHeight);
      return { pinTop, distance: spacer.offsetHeight, top: wrapper.getBoundingClientRect().top };
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      if (!desktop.matches) return;

      const { pinTop, distance, top } = measure();
      section.style.setProperty("--pin-top", `${pinTop}px`);

      const pinned = Math.min(Math.max((pinTop - top) / distance, 0), 1);
      let progress = Math.min(Math.max((pinned - HOLD) / (1 - 2 * HOLD), 0), 1);
      if (reduceMotion.matches) progress = progress < 0.5 ? 0 : 1;
      // 처음과 끝을 부드럽게 한다(smoothstep).
      const eased = progress * progress * (3 - 2 * progress);

      section.style.setProperty("--p", eased.toFixed(4));
      section.dataset.active = progress < 0.5 ? "give" : "use";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // 키보드로 접힌 면의 링크에 들어가면, 그 면이 다 펼쳐진 멈춤 구간으로 스크롤한다.
    const onFocusIn = (event: FocusEvent) => {
      if (!desktop.matches || !(event.target instanceof Element)) return;
      const side = event.target.closest<HTMLElement>("[data-side]")?.dataset.side;
      if (!side || side === section.dataset.active) return;

      requestAnimationFrame(() => {
        const { pinTop, distance, top } = measure();
        const pinned = side === "use" ? 1 - HOLD / 2 : HOLD / 2;
        window.scrollBy({
          top: top - (pinTop - pinned * distance),
          behavior: reduceMotion.matches ? "auto" : "smooth",
        });
      });
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    reduceMotion.addEventListener("change", schedule);
    section.addEventListener("focusin", onFocusIn);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
      reduceMotion.removeEventListener("change", schedule);
      section.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <section
        ref={sectionRef}
        data-active="give"
        className={`[--pin-top:0px] lg:sticky lg:top-(--pin-top) ${className}`}
      >
        {children}
      </section>
      {/* 고정 거리. 섹션이 이 칸을 지나는 동안 고정되어 있다. */}
      <div ref={spacerRef} aria-hidden className="hidden lg:block lg:h-screen" />
    </div>
  );
}
