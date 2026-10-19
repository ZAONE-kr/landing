import { type SanityImageSource, toCroppedImage } from "@/sanity/lib/image";

import { SanityImage } from "./SanityImage";

/*
 * 본문 아래 포스터. 원래 비율 그대로 폭만 고정한다(1024 350px, 375 160px, 8px 둥글림). 인사이트와 사업소식·사업보고
 * 상세 시안이 같다. 포스터가 없으면 그리지 않는다.
 */
export function PostPoster({
  image: source,
}: {
  image: (SanityImageSource & { alt?: string | null }) | null;
}) {
  const image = toCroppedImage(source);
  if (!image) return null;

  return (
    <div
      className="relative mx-auto mt-16 w-[160px] overflow-hidden rounded-sm lg:w-[350px]"
      style={{ aspectRatio: image.aspectRatio }}
    >
      <SanityImage
        image={image}
        alt={source?.alt?.trim() ?? ""}
        sizes="(min-width: 1024px) 350px, 160px"
      />
    </div>
  );
}
