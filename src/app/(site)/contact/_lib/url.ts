import { useSyncExternalStore } from "react";

/*
 * CONTACT 페이지는 고른 카드(type)와 공지 탭·쪽(notice·noticePage)을 주소에 둔다. 주소가 곧 상태라서 새로고침하거나
 * 공지 글에서 뒤로 오면 그 상태로 다시 열린다.
 * 페이지가 정적이라 서버 HTML은 주소 없이(기본 상태로) 그리고, 브라우저가 주소를 읽어 그 자리에서 바꾼다.
 * Next의 useSearchParams는 Suspense가 서버 HTML을 통째로 갈아 끼워서, 그사이 #contact-form·#notices로 가던 스크롤이
 * 가끔 사라진다. 그래서 주소를 직접 읽는다(useSyncExternalStore는 화면을 갈아 끼우지 않고 고친다).
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

// 주소의 쿼리 값 하나. 서버와 첫 화면에서는 null이다.
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

/*
 * 주소의 쿼리를 바꾸고 이 값을 읽는 화면을 다시 그린다. 기록을 쌓지 않아서(replaceState) 뒤로 가기가 탭을 하나씩
 * 되돌리지 않는다. #는 방금 쓴 섹션으로 바꿔 새로고침했을 때 그 자리로 간다.
 */
export function replaceSearchParams(updates: Record<string, string | null>, hash: `#${string}`) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  url.hash = hash;
  window.history.replaceState(null, "", url);
  listeners.forEach((listener) => listener());
}

// 같은 페이지의 섹션으로 부드럽게 옮긴다. 움직임 줄이기 설정이면 바로 옮긴다.
export function scrollToSection(target: HTMLElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}
