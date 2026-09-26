// TODO: 영상 원본(Figma 레이어 "ZAONE_편집본")을 받으면 <video autoPlay muted loop playsInline poster>로 채운다.
// 저장 위치는 파일 크기를 보고 정한다(10MB 이하면 public/videos/, 넘으면 외부 저장소).
export function BrandVideoSection() {
  return <section aria-label="ZAONE 소개 영상" className="aspect-video w-full bg-bg-strong" />;
}
