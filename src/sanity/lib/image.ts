/*
 * Sanity 이미지 필드를 쿼리에서 펼친 모양(queries.ts의 mainImage 투영). 사진 파일이 없으면 url이 null이다.
 * crop·hotspot은 운영자가 Studio에서 정한 자르기 영역과 꼭 보여야 할 곳이다. 원본 크기에 대한 0~1 비율이고,
 * 한 번도 고치지 않은 사진은 null이다.
 */
export type SanityImageSource = {
  url: string | null;
  lqip: string | null;
  width: number | null;
  height: number | null;
  crop: { top: number; bottom: number; left: number; right: number } | null;
  hotspot: { x: number; y: number; width: number; height: number } | null;
};

/*
 * 틀에 맞춰 잘라 보여 줄 사진. src는 운영자의 자르기 영역만 남긴 Sanity CDN 주소이고, 폭은 next-sanity의 Image가
 * 화면에 맞춰 붙인다. 틀 비율이 화면마다 달라(목록 카드는 데스크톱 277~416×280, 모바일 120×124) 사진을 미리 한
 * 비율로 자르지 않고 object-cover로 채우되, hotspot이 잘려 나가지 않게 objectPosition으로 그쪽을 남긴다.
 * aspectRatio는 자른 사진의 가로/세로 비율로, 틀을 덮을 때 실제로 그려지는 폭(sizes)을 셈하는 데 쓴다.
 * width는 자른 사진의 실제 폭(px)이다. 원래 비율로 보이는 본문 사진이 이보다 크게 늘어나지 않게 한다.
 */
export type CroppedImage = {
  src: string;
  blurDataURL?: string;
  objectPosition: string;
  aspectRatio: number;
  width: number;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// 비율을 CSS 퍼센트로. 소수점 둘째 자리면 충분하다.
function toPercent(ratio: number): string {
  return `${Math.round(ratio * 10000) / 100}%`;
}

export function toCroppedImage(image: SanityImageSource | null): CroppedImage | null {
  if (!image?.url || !image.width || !image.height) return null;
  const { width, height, crop, hotspot } = image;
  const left = crop?.left ?? 0;
  const right = crop?.right ?? 0;
  const top = crop?.top ?? 0;
  const bottom = crop?.bottom ?? 0;
  const keptWidth = 1 - left - right;
  const keptHeight = 1 - top - bottom;
  if (keptWidth <= 0 || keptHeight <= 0) return null;

  const rect = {
    left: Math.round(width * left),
    top: Math.round(height * top),
    width: Math.max(1, Math.round(width * keptWidth)),
    height: Math.max(1, Math.round(height * keptHeight)),
  };
  const url = new URL(image.url);
  if (rect.width < width || rect.height < height) {
    url.searchParams.set("rect", `${rect.left},${rect.top},${rect.width},${rect.height}`);
  }

  // hotspot은 원본 기준이라 자른 사진 기준으로 옮긴다. 퍼센트 object-position은 사진의 그 지점을 틀의 같은
  // 비율 지점에 맞춰서, 가운데(50%)면 가운데를 남기고 가장자리 쪽이면 그 가장자리를 남긴다.
  const x = hotspot ? clamp01((hotspot.x - left) / keptWidth) : 0.5;
  const y = hotspot ? clamp01((hotspot.y - top) / keptHeight) : 0.5;

  return {
    src: url.href,
    blurDataURL: image.lqip ?? undefined,
    objectPosition: `${toPercent(x)} ${toPercent(y)}`,
    aspectRatio: rect.width / rect.height,
    width: rect.width,
  };
}

/*
 * 링크 공유 그림(1200×630). 카카오톡·페이스북 등은 사진을 제 비율로 다시 잘라 보여서, 운영자가 정한 중심점을 기준으로
 * 미리 잘라 둔다(Sanity 이미지 CDN의 focalpoint 자르기). 공유 미리보기가 WebP·AVIF를 못 읽는 곳이 있어 JPG로 받는다.
 */
export function toOpenGraphImage(source: SanityImageSource | null) {
  const image = toCroppedImage(source);
  if (!image) return null;
  const [x, y] = image.objectPosition.split(" ").map((value) => parseFloat(value) / 100);
  const url = new URL(image.src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("crop", "focalpoint");
  url.searchParams.set("fp-x", x.toFixed(4));
  url.searchParams.set("fp-y", y.toFixed(4));
  url.searchParams.set("fm", "jpg");
  return { url: url.href, width: 1200, height: 630 };
}
