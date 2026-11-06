import type { Mixpanel } from "mixpanel-browser";

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

/*
 * 첫 화면 용량을 늘리지 않게 SDK는 화면이 뜬 뒤 따로 받는다.
 * 화면 녹화(session replay) 모듈은 SDK에 넣지 않은 판을 쓰고, 녹화하기로 뽑힌 방문에서만 Mixpanel CDN에서 받는다.
 */
export function startAnalytics(token: string) {
  /*
   * README가 안내하는 src/loaders/loader-module-with-async-modules는 녹화 모듈 파일 이름이 빌드 전 자리표시자
   * (__MP_RECORDER_FILENAME__)로 남아 CDN에서 받지 못한다. 이름이 채워진 빌드본(dist)을 쓴다.
   */
  starting ??= import("mixpanel-browser/dist/mixpanel-with-async-modules.cjs.js").then(
    ({ default: mixpanel }) => {
      mixpanel.init(token, {
        // 주소 경로가 바뀔 때만 페이지 조회로 센다. CONTACT의 ?type=처럼 같은 페이지 안에서 바뀌는 값은 세지 않는다.
        autocapture: { pageview: "url-with-path" },
        /*
         * 방문의 절반을 녹화한다(사용자 결정, 방문자가 많지 않아 넉넉히). 녹화는 사람이 Mixpanel 화면에서 보는 기능이라
         * Claude·ChatGPT 커넥터로는 볼 수 없다.
         * SDK 기본값은 화면 글자를 모두 *로, 사진·영상을 회색 상자로 바꿔 녹화해서 무엇을 보는지 알아볼 수 없다.
         * 이 사이트의 글·사진은 누구나 보는 공개 내용이라 그대로 녹화하고, 방문자가 쓰는 입력칸만 가린다(기본값 유지).
         */
        record_sessions_percent: 50,
        record_mask_all_text: false,
        record_block_selector: "",
      });
      client = mixpanel;
    },
  );
  return starting;
}

// SDK를 받기 전이거나 켜지 않은 환경(로컬·미리보기 배포)에서는 아무것도 보내지 않는다.
export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string>) {
  client?.track(name, properties);
}
