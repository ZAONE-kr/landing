"use client";

import { type ReactNode, useEffect, useRef } from "react";

// 요소가 이만큼(높이 대비) 화면에 들어오면 나타나기 시작한다.
const VISIBLE = 0.2;

/*
 * 화면 아래에서 들어오면 40px 아래에서 제자리로 올라오며 나타난다(framer-motion의 whileInView로 하는
 * fade-in·slide-up). 0.7초 동안 처음에 빠르고 끝에 느리게(ease-out) 움직이고, 한 번 나타나면 그대로 둔다.
 * 서버 HTML(자바스크립트 전·없음)은 처음부터 보이는 상태다. 열었을 때 이미 화면에 보이거나 지나간 위치면
 * (새로고침 등) 숨기지 않는다. 숨기는 것은 화면 밖이라 보이던 것이 사라지는 순간이 없다.
 * 움직임 줄이기 설정이면 움직이지 않고 그대로 보인다.
 */
export function FadeUpOnView({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !element ||
      reduceMotion.matches ||
      element.getBoundingClientRect().top < window.innerHeight
    )
      return;

    /*
     * 화면 위쪽으로는 판정 영역을 크게 늘려 둔다. 끝으로 가기 키나 스크롤바로 단번에 건너뛰어 화면에 한 번도
     * 걸치지 않고 지나친 요소도 나타난 상태가 되어, 다시 올라왔을 때 비어 있지 않다.
     */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show();
      },
      { threshold: VISIBLE, rootMargin: "100000px 0px 0px 0px" },
    );
    const show = () => {
      observer.disconnect();
      element.dataset.reveal = "shown";
    };

    element.dataset.reveal = "hidden";
    observer.observe(element);
    // 움직임 줄이기로 바뀌면 기다리지 않고 바로 보여 준다.
    reduceMotion.addEventListener("change", show);
    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", show);
      delete element.dataset.reveal;
    };
  }, []);

  // 숨길 때는 바로 숨기고, 나타날 때만 움직인다.
  return (
    <div
      ref={ref}
      className={`data-[reveal=hidden]:translate-y-3xl data-[reveal=hidden]:opacity-0 data-[reveal=shown]:transition-[opacity,translate] data-[reveal=shown]:duration-700 data-[reveal=shown]:ease-out motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
