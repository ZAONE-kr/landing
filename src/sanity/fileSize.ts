/*
 * 첨부파일 크기 글자(시안 "21MB"). Studio 첨부 목록과 사이트 상세 페이지가 같은 글자를 쓴다.
 * 1024바이트 단위로 센다(Windows 탐색기와 같다). 10MB 아래는 소수 한 자리까지(2.4MB), 그 위는 정수로 보인다.
 * 다른 패키지를 불러오지 않아 양쪽에서 가볍다.
 */
const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

function round(value: number): string {
  return value < 10 ? String(Math.round(value * 10) / 10) : String(Math.round(value));
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / KB))}KB`;
  if (bytes < GB) return `${round(bytes / MB)}MB`;
  return `${round(bytes / GB)}GB`;
}
