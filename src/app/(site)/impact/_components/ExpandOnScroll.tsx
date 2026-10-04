"use client";

import { type ReactNode, useEffect, useRef } from "react";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/*
 * 마지막 사진 섹션의 스크롤 진행도를 정한다(파타고니아 climate-goals 마지막 섹션 방식).
 * 섹션은 화면 높이만큼이고, 위가 화면 위에 닿으면 뒤 빈 칸(화면 높이의 50%)을 지나는 동안 그 자리에 고정된다.
 * - raw: 고정될 때 0, 고정이 풀릴 때 1.
 * - --e(사진이 커지는 정도): 고정되기 조금 전(raw -0.2)부터 고정이 풀릴 때까지, 처음에 빠르고 끝에 느리게
 *   (cubic ease-out) 바뀐다. 파타고니아와 같은 타이밍이라 멈췄다 커지는 느낌이 없고, 고정 중간쯤에 거의 다 커진다.
 * - --q(문구가 올라오는 정도): raw 0에서 1까지 스크롤한 만큼 같은 속도로 바뀐다. 문구는 고정 거리만큼
 *   (화면 아래 끝에서 가운데까지) 올라오므로, 페이지를 내리는 속도 그대로 올라오는 것처럼 보인다.
 * 사진 창·폭·문구 위치와 투명도는 CSS가 --e, --q로 계산한다. 끝나면 고정이 풀려 푸터로 이어진다.
 *
 * 서버 HTML(자바스크립트 전·없음)과 움직임 줄이기 설정은 다 펼친 상태(--e: 1, --q: 1)로, 고정하지 않는다.
 * 고정과 빈 칸은 이 컴포넌트가 data-pin을 붙인 뒤에만 생긴다. 새로고침으로 섹션이 이미 화면에 보이거나
 * 지나간 위치에서 열리면, 펼친 사진이 접히지 않게 섹션이 화면 아래로 벗어날 때까지 그 상태로 둔다.
 */
export function ExpandOnScroll({
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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // raw와, raw가 1이 되려면 더 내려야 하는 거리.
    const measure = () => {
      const top = wrapper.getBoundingClientRect().top;
      const distance = Math.max(spacer.offsetHeight, 1);
      return { raw: -top / distance, toEnd: top + distance };
    };

    let armed = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!armed) {
        if (reduceMotion.matches || wrapper.getBoundingClientRect().top < window.innerHeight)
          return;
        armed = true;
        wrapper.dataset.pin = "";
      }
      if (reduceMotion.matches) {
        armed = false;
        delete wrapper.dataset.pin;
        delete section.dataset.revealed;
        for (const name of ["--e", "--q"]) section.style.removeProperty(name);
        return;
      }

      const { raw } = measure();
      const q = clamp01(raw);
      section.style.setProperty("--e", (1 - (1 - clamp01((raw + 0.2) / 1.2)) ** 3).toFixed(4));
      section.style.setProperty("--q", q.toFixed(4));
      section.dataset.revealed = String(q >= 0.5);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    /*
     * 키보드로 아직 다 올라오지 않은 버튼에 들어가면, 문구가 다 보이는 위치로 스크롤한다.
     * 마우스로 누르거나 터치해도 포커스가 생기는데, 그때 스크롤하면 버튼이 손가락 밑에서 빠져나가 눌리지 않는다.
     * 그래서 :focus-visible(키보드 포커스)일 때만 스크롤한다.
     */
    const onFocusIn = (event: FocusEvent) => {
      if (!armed || !(event.target instanceof Element) || !event.target.matches(":focus-visible"))
        return;
      requestAnimationFrame(() => {
        const { raw, toEnd } = measure();
        if (raw < 1) window.scrollBy({ top: toEnd, behavior: "smooth" });
      });
    };
    // 키보드로 들어가자마자 버튼을 누르면 그 스크롤이 다음 페이지까지 이어지므로, 누르는 순간 멈춘다.
    const stopScroll = () => window.scrollTo({ top: window.scrollY, behavior: "instant" });

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduceMotion.addEventListener("change", schedule);
    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("click", stopScroll, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener("change", schedule);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("click", stopScroll, true);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="group/pin">
      <section
        ref={sectionRef}
        className={`group/expand relative [--e:1] [--q:1] group-data-pin/pin:sticky group-data-pin/pin:top-0 ${className}`}
      >
        {children}
      </section>
      {/* 고정 거리. 섹션이 이 칸을 지나는 동안 화면에 고정되어 있다. */}
      <div ref={spacerRef} aria-hidden className="hidden h-[50vh] group-data-pin/pin:block" />
    </div>
  );
}
