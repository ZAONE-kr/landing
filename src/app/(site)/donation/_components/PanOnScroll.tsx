"use client";

import { type ReactNode, useEffect, useRef } from "react";

/*
 * 모바일에서 스크롤 진행도(--pan, 0~1)를 정해, 틀보다 가로로 긴 사진이 옆으로 조금 흐르게 한다.
 * 진행도는 사진 틀(부모)의 위가 화면 아래에 닿을 때 0, 아래가 화면 위에 닿을 때 1이고 스크롤한 만큼 바뀐다.
 * 위로 올리면 되돌아간다. 사진을 얼마나 옮길지는 쓰는 곳의 CSS가 --pan으로 계산한다.
 * 데스크톱(lg 이상)과 움직임 줄이기 설정은 스크롤을 따르지 않고, 클래스에 둔 --pan 기본값(시안 위치)에 멈춘다.
 */
export function PanOnScroll({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const frame = element?.parentElement;
    if (!element || !frame) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 64rem)");

    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, height } = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(Math.max((viewport - top) / (viewport + height), 0), 1);
      element.style.setProperty("--pan", progress.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const start = () => {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      schedule();
    };
    // 인라인 --pan을 지워 클래스의 기본값이 쓰이게 한다.
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      element.style.removeProperty("--pan");
    };
    const sync = () => {
      stop();
      if (!reduceMotion.matches && !desktop.matches) start();
    };

    sync();
    reduceMotion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      stop();
      reduceMotion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
