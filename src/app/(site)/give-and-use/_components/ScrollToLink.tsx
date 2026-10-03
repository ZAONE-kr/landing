"use client";

import type { ComponentProps, MouseEvent } from "react";

/*
 * 같은 페이지의 #id로 갈 때 앵커처럼 뚝 넘어가지 않고 window.scrollTo로 부드럽게 스크롤한다.
 * 움직임 줄이기 설정이면 바로 옮긴다. 새 탭 열기(Cmd·Ctrl·휠 클릭)와 JS가 없을 때는 보통 앵커로 동작한다.
 * 주소의 #는 바꾸지 않는다.
 */
export function ScrollToLink({
  href,
  onClick,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: `#${string}` }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior: reduceMotion ? "auto" : "smooth",
    });

    // 앵커처럼 다음 Tab이 옮겨 간 섹션 안에서 시작하도록 포커스를 넘긴다.
    // 섹션 전체에 포커스 링이 그려지지 않게 하고, 포커스가 떠나면 원래대로 돌린다.
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
      target.style.outline = "none";
      target.addEventListener(
        "blur",
        () => {
          target.removeAttribute("tabindex");
          target.style.removeProperty("outline");
        },
        { once: true },
      );
    }
    target.focus({ preventScroll: true });
  };

  return <a href={href} {...props} onClick={handleClick} />;
}
