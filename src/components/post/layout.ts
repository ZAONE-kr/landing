/*
 * 블로그 글(인사이트·사업소식·사업보고) 상세 페이지의 폭. 1024 시안 기준이다.
 * - 글자·영상·대표이미지는 가운데 칸에 놓인다. 1024 시안은 좌우 80px(칸 864px), 375 시안은 24px이고, 칸은 화면이
 *   넓어져도 864px을 넘지 않는다.
 * - 본문 사진은 모바일에서 좌우 여백 없이 화면 폭을 꽉 채우고, 1024부터는 가운데 칸에 맞춘다(1024 시안 변경, 2026-10-15).
 */
export const POST_COLUMN =
  "mx-auto w-[min(54rem,calc(100%-3rem))] lg:w-[min(54rem,calc(100%-10rem))]";

export const POST_IMAGE_WIDTH = "mx-auto w-full lg:w-[min(54rem,calc(100%-10rem))]";
