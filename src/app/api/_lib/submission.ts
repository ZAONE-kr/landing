import "server-only";

// 문의·뉴스레터 접수가 함께 쓰는 서버 도우미.

// 서울 기준 날짜·시각 조각. 한국은 서머타임이 없다.
export function seoulTime(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    weekday: part("weekday"),
    hour: part("hour"),
    minute: part("minute"),
  };
}

/*
 * 시험 접수인지. 실제 사이트(Vercel production)만 담당자 메일·기록 시트의 본 탭으로 가고, 로컬 개발·미리보기 배포는
 * 개발용 주소와 시트의 "[테스트]" 탭으로 가서 시험 접수가 실제 접수에 섞이지 않는다.
 */
export function isTestSubmission(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

/*
 * 다른 사이트의 페이지가 방문자 브라우저로 접수 주소에 보내는 것을 막는다. Origin이 없는 요청(브라우저 밖)은 어차피
 * 누구나 보낼 수 있어 막지 않는다. 그런 요청도 입력 검사와 숨은 칸은 똑같이 거친다.
 */
export function isCrossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}
