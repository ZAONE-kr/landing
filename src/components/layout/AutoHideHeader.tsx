"use client";

import { type ReactNode, useEffect, useRef } from "react";

// 이만큼 움직여야 방향을 바꾼다(파타고니아와 같은 10px). 조금 흔들리는 정도로는 헤더가 들락거리지 않는다.
const THRESHOLD = 10;

/*
 * 헤더를 화면 위에 붙여 두고, 내리면 위로 숨기고 올리면 다시 보인다(파타고니아 방식).
 * - 방향은 마지막으로 정한 위치에서 10px 넘게 움직였을 때만 바꾼다. 맨 위 근처(헤더 높이 안)에서는 늘 보인다.
 * - 키보드로 헤더 안 링크에 들어오면 숨어 있어도 바로 보인다.
 * - 보이는 동안 헤더 높이를 <html>의 --site-header-offset에 적는다. 화면 위에서 조금 떨어져 붙는 요소
 *   (Give & Use 사회공헌 소개 글)가 이 값만큼 내려가 헤더에 가리지 않는다. 숨으면 0이다.
 *   화면을 가득 채워 고정되는 섹션은 파타고니아처럼 헤더가 그 위를 덮는다.
 * 움직임 줄이기 설정이면 미끄러지지 않고 바로 숨고 나타난다.
 */
export function AutoHideHeader({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    const root = document.documentElement;
    let hidden = false;
    let last = window.scrollY;
    let frame = 0;

    const setOffset = () =>
      root.style.setProperty("--site-header-offset", hidden ? "0px" : `${header.offsetHeight}px`);
    const setHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      header.toggleAttribute("data-hidden", next);
      setOffset();
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y <= header.offsetHeight) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < THRESHOLD) return;
      setHidden(y > last);
      last = y;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // 키보드로 들어온 뒤에는 숨김 상태도 풀어 둔다(보이는 것은 아래 클래스가 먼저 처리한다).
    const showForKeyboard = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(":focus-visible"))
        setHidden(false);
    };

    setOffset();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", setOffset);
    header.addEventListener("focusin", showForKeyboard);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", setOffset);
      header.removeEventListener("focusin", showForKeyboard);
      root.style.removeProperty("--site-header-offset");
    };
  }, []);

  /*
   * 키보드 포커스가 헤더 안에 있으면 숨김 클래스를 끄고 미끄러지지 않고 바로 보인다. 자바스크립트로 풀면
   * 늦어서, 브라우저가 링크를 아직 화면 밖으로 보고 페이지를 화면 절반만큼 위로 스크롤해 버린다.
   */
  return (
    <header
      ref={ref}
      className={`sticky top-0 z-50 transition-transform duration-300 ease-out has-focus-visible:transition-none data-hidden:not-has-focus-visible:-translate-y-full motion-reduce:transition-none ${className}`}
    >
      {children}
    </header>
  );
}
