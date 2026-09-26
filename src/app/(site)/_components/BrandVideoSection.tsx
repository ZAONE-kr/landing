"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import posterImage from "@/assets/home/brand-video-poster.jpg";

/*
 * 소리 없는 배경 영상. 원본(1분 57초 브랜드 영상, 맨 앞 검은 화면 1초는 잘라냄)을
 * H.264로 압축했다: 1080p 19MB, 720p 10MB. 1023px 이하는 720p를 받는다.
 * 파일은 Vercel Blob 공개 저장소에 있다. Blob은 30일 캐시를 걸어 주므로, 영상을 바꿀 때는
 * 같은 이름으로 덮어쓰지 말고 새 이름으로 올린 뒤 아래 주소를 바꾼다.
 * TODO: 운영자가 코드 없이 바꿀 수 있도록 Sanity(Mux 등)로 옮길지는
 * 편집 가능 범위가 정해지면 결정한다.
 */
const VIDEO_1080 = "https://egvh4gzenf8xpitx.public.blob.vercel-storage.com/zaone-brand-1080.mp4";
const VIDEO_720 = "https://egvh4gzenf8xpitx.public.blob.vercel-storage.com/zaone-brand-720.mp4";

// 영역이 절반 이상 보이면 재생하고, 벗어나면 멈춘다. 모션 줄이기 설정이면 재생하지 않는다.
const PLAY_THRESHOLD = 0.5;

export function BrandVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion.matches) {
          // 저전력 모드 등에서 자동재생이 막히면 대표 이미지가 그대로 보인다.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: PLAY_THRESHOLD },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // 장식용 영상이라 스크린리더에서는 뺀다.
  return (
    <div aria-hidden className="relative aspect-video w-full overflow-hidden bg-bg-strong">
      {/* 영상이 재생되기 전(preload="none")과 모션 줄이기 설정일 때 보이는 대표 이미지 */}
      <Image src={posterImage} alt="" fill sizes="100vw" className="object-cover" />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 size-full object-cover"
      >
        <source src={VIDEO_1080} type="video/mp4" media="(min-width: 1024px)" />
        <source src={VIDEO_720} type="video/mp4" />
      </video>
    </div>
  );
}
