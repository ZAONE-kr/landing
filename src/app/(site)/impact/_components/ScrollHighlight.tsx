"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

// 진행도가 스크롤을 따라가는 시정수(초). 레고 재단 사이트의 스프링(약 0.15초)과 비슷하게 늦게 따라간다.
const SMOOTHING = 0.15;

// 진행도가 0·1이 되는 화면 위치(화면 높이 대비, 위에서부터). 블록 위가 START에 닿으면 밝아지기 시작하고
// 블록 아래가 END에 닿으면 다 밝아져서, 밝아지는 경계가 화면 75% 높이에서 25% 높이까지 지나간다.
const START = 0.75;
const END = 0.25;

/*
 * 스크롤 진행도(--p, 0~1)를 정해 안쪽 낱말들이 차례로 밝아지게 한다(레고 재단 "Every child deserves a
 * childhood" 방식). 낱말 색은 MeasureChangeSection이 --p와 낱말 순서(--i)로 CSS에서 계산한다.
 * - 진행도: 위의 START·END 사이에서 스크롤한 만큼 바뀌고, 위로 올리면 되돌아간다. 레고 재단은 블록이 화면 아래로
 *   들어올 때 시작해 화면 가운데에서 끝나는데, 마지막 줄을 읽기 전에 끝나 버려서 4분의 1 화면씩 늦췄다.
 * - 스크롤을 바로 따르지 않고 조금 늦게 따라가서 마우스 휠로 끊어 내려도 부드럽게 번진다.
 *   처음 열었을 때 블록이 화면 안에 있으면(모바일) 0에서 그 위치까지 같은 속도로 밝아진다.
 * 움직임 줄이기 설정과 자바스크립트가 꺼진 브라우저는 스크롤을 따르지 않고 처음부터 다 밝은 상태(--p: 1)로 둔다.
 * 어두운 상태(text-tertiary)는 배경과 대비가 3.5:1이라 그대로 남으면 읽기 어렵다.
 */
export function ScrollHighlight({
  words,
  className,
  children,
}: {
  // 밝아지는 낱말 수(--n). 낱말 하나가 밝아지는 구간(--w)이 이 수로 정해진다.
  words: number;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const target = () => {
      const { top, height } = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport * START - top) / (height + viewport * (START - END));
      return Math.min(Math.max(progress, 0), 1);
    };

    let shown = 0;
    let frame = 0;
    let lastTime = 0;
    const step = (time: number) => {
      const goal = target();
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
      shown += (goal - shown) * (1 - Math.exp(-dt / SMOOTHING));
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      element.style.setProperty("--p", shown.toFixed(4));

      const settled = shown === goal;
      lastTime = settled ? 0 : time;
      frame = settled ? 0 : requestAnimationFrame(step);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const start = () => {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      schedule();
    };
    // 움직임 줄이기: 인라인 --p를 지워 클래스의 motion-reduce 값(1)이 쓰이게 한다.
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      element.style.removeProperty("--p");
    };
    const sync = () => (reduceMotion.matches ? stop() : start());

    sync();
    reduceMotion.addEventListener("change", sync);
    return () => {
      stop();
      reduceMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--n": words } as CSSProperties}
      className={`[--p:0] [--w:min(0.3,8/var(--n))] motion-reduce:[--p:1] noscript:[--p:1] ${className}`}
    >
      {children}
    </div>
  );
}
