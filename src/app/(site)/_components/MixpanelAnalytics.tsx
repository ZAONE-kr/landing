"use client";

import { useEffect } from "react";

import { startAnalytics, TRACK_EVENT_ATTRIBUTE, trackEvent } from "@/lib/analytics";

/*
 * 사이트 레이아웃에 한 번 붙어 Mixpanel을 켜고, data-track-event가 붙은 링크·버튼의 클릭을 그 이름으로 남긴다.
 * 후원 버튼은 Donus를 새 탭으로 열어서 이 페이지가 남아 있으므로 기록이 끊기지 않는다.
 */
export function MixpanelAnalytics({ token }: { token: string }) {
  useEffect(() => {
    void startAnalytics(token);

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const name = target
        ?.closest(`[${TRACK_EVENT_ATTRIBUTE}]`)
        ?.getAttribute(TRACK_EVENT_ATTRIBUTE);
      if (name) trackEvent(name as Parameters<typeof trackEvent>[0]);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [token]);

  return null;
}
