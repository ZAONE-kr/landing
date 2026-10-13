/*
 * 본문의 유튜브 영상(16:9). 쿠키를 덜 남기는 youtube-nocookie 주소로 넣는다.
 * 유튜브는 퍼가기 요청에 보낸 곳(Referer)이 없으면 재생을 막아서(오류 153) referrerPolicy를 브라우저 기본값으로 둔다.
 * 영상 ID는 부르는 곳이 parseYouTubeId(src/sanity/youtubeUrl.ts)로 꺼낸다. 꺼내지 못하면 영상 자리를 아예 두지 않는다.
 */
export function YouTubeEmbed({ videoId, className = "" }: { videoId: string; className?: string }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title="YouTube 영상"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className={`aspect-video w-full ${className}`}
    />
  );
}
