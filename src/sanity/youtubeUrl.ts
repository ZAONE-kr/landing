/*
 * 유튜브 주소에서 영상 ID를 꺼낸다. Studio의 YouTube 블록(주소 검사·미리보기 썸네일)과, 나중에 사이트에서 영상을
 * 넣을 때 함께 쓴다. 다른 패키지를 불러오지 않아 양쪽에서 가볍고, node로 바로 돌려 볼 수 있다.
 */

// 영상 ID는 영문·숫자·_·- 11자다.
const VIDEO_ID = /^[\w-]{11}$/;
// watch?v=ID와 /shorts·/embed·/live/ID 주소를 쓰는 곳. URL이 호스트를 소문자로 바꿔 준다.
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);
const ID_PATHS = new Set(["shorts", "embed", "live"]);
// 쿠키를 덜 남기는 퍼가기 주소. /embed/ID만 있다.
const NOCOOKIE_HOSTS = new Set(["youtube-nocookie.com", "www.youtube-nocookie.com"]);

/*
 * 영상 하나를 가리키는 유튜브 주소면 영상 ID, 아니면 null. youtube.com/watch?v=ID(다른 값이 더 붙어도 된다), youtu.be/ID,
 * youtube.com/shorts·embed·live/ID, youtube-nocookie.com/embed/ID를 받는다. 재생목록·채널·다른 사이트는 null이다.
 * 호스트를 목록과 똑같이 비교해 youtube.com.evil.com 같은 주소는 받지 않는다.
 */
export function parseYouTubeId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const segments = url.pathname.split("/").filter(Boolean);
  let id: string | null = null;
  if (url.hostname === "youtu.be") {
    if (segments.length === 1) id = segments[0];
  } else if (YOUTUBE_HOSTS.has(url.hostname)) {
    if (segments.length === 1 && segments[0] === "watch") id = url.searchParams.get("v");
    else if (segments.length === 2 && ID_PATHS.has(segments[0])) id = segments[1];
  } else if (NOCOOKIE_HOSTS.has(url.hostname)) {
    if (segments.length === 2 && segments[0] === "embed") id = segments[1];
  }
  // 재생목록 퍼가기 주소(/embed/videoseries)도 11자라 따로 뺀다.
  return id !== null && id !== "videoseries" && VIDEO_ID.test(id) ? id : null;
}

// 미리보기 그림(320×180, 16:9). 공개된 영상이면 늘 있다. hqdefault는 4:3이라 위아래에 검은 띠가 생긴다.
export function youTubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}
