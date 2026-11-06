import type { Mixpanel, OverridedMixpanel } from "mixpanel-browser";

/*
 * Mixpanel 기록. 대표가 Claude·ChatGPT에 Mixpanel 커넥터를 붙여 "이번 달 후원 버튼 몇 번 눌렸어?"처럼 물어볼 수 있게
 * 하려고 넣었다(GA는 비개발자가 붙일 수 있는 원격 커넥터가 없다). GA4는 옛 기록을 잇기 위해 그대로 둔다.
 *
 * 페이지 조회·클릭·스크롤·폼 제출은 autocapture가 알아서 모은다. 입력한 글자는 모으지 않는다.
 * 그중 대표가 자주 물을 세 가지만 이름을 붙여 따로 남긴다. 자동 클릭 기록만으로는 어느 클릭이 후원 버튼인지
 * AI가 헷갈릴 수 있어서다. 이름은 Mixpanel 화면과 AI 답에 그대로 나오므로 한글로 둔다.
 */
export const ANALYTICS_EVENTS = {
  donate: "후원 버튼 클릭",
  inquiry: "문의 접수",
  newsletter: "뉴스레터 구독",
} as const;

type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/*
 * 이 속성이 붙은 링크·버튼을 누르면 그 값의 이벤트를 남긴다(src/app/(site)/_components/MixpanelAnalytics.tsx).
 * 후원 버튼 주소는 Studio에서 바뀔 수 있어, 주소 대신 버튼에 표시를 붙인다.
 */
export const TRACK_EVENT_ATTRIBUTE = "data-track-event";

let client: Mixpanel | null = null;
let starting: Promise<void> | null = null;

// 첫 화면 용량을 늘리지 않게 SDK는 화면이 뜬 뒤 따로 받는다. 화면 녹화(session replay)가 빠진 가벼운 판을 쓴다.
export function startAnalytics(token: string) {
  starting ??= import("mixpanel-browser/src/loaders/loader-module-core").then((module) => {
    // 이 경로의 타입 선언에는 default가 빠져 있어(실제로는 있다) 본 패키지의 타입을 붙인다.
    const mixpanel = module.default as unknown as OverridedMixpanel;
    mixpanel.init(token, {
      // 주소 경로가 바뀔 때만 페이지 조회로 센다. CONTACT의 ?type=처럼 같은 페이지 안에서 바뀌는 값은 세지 않는다.
      autocapture: { pageview: "url-with-path" },
    });
    client = mixpanel;
  });
  return starting;
}

// SDK를 받기 전이거나 켜지 않은 환경(로컬·미리보기 배포)에서는 아무것도 보내지 않는다.
export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string>) {
  client?.track(name, properties);
}
