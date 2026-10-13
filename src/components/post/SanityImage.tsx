import { Image } from "next-sanity/image";
import type { ComponentProps } from "react";

import type { CroppedImage } from "@/sanity/lib/image";

type SanityImageProps = {
  image: CroppedImage;
  alt: string;
  sizes: string;
  className?: string;
} & Pick<ComponentProps<typeof Image>, "loading" | "fetchPriority">;

/*
 * 틀을 덮는 사진이 실제로 그려지는 폭은 틀 폭의 몇 배인지. 사진이 틀보다 가로로 길면 틀 높이가 폭을 정해서 틀보다
 * 넓게 그려진다. sizes에 이만큼 곱해야 작은 사진을 받아 늘리지 않는다(인사이트 목록 카드의 imageSizes와 같은 이유).
 */
export function coverScale(image: CroppedImage, frameAspectRatio: number): number {
  return Math.max(1, image.aspectRatio / frameAspectRatio);
}

/*
 * 사진 틀(relative, 크기 지정)을 꽉 채우는 Sanity 사진. 틀 비율에 맞춰 잘리고, 운영자가 정한 중심점이 틀 안에 남는다
 * (src/sanity/lib/image.ts). 크기별 사진은 Sanity 이미지 CDN이 만든다(next-sanity의 로더). 그래서 next.config에
 * 외부 이미지 주소를 열지 않는다.
 */
export function SanityImage({ image, alt, sizes, className = "", ...rest }: SanityImageProps) {
  return (
    <Image
      src={image.src}
      alt={alt}
      fill
      sizes={sizes}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={`object-cover ${className}`}
      style={{ objectPosition: image.objectPosition }}
      {...rest}
    />
  );
}
