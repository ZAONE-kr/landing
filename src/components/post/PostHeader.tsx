import type { CroppedImage } from "@/sanity/lib/image";

import { POST_COLUMN } from "./layout";
import { SanityImage } from "./SanityImage";

/*
 * 글 맨 위의 제목과 대표이미지. 1024 시안은 제목을 좌우 120px 더 안쪽(624px)에서 줄을 바꾸고, 사진은 864×480(12px 둥글림),
 * 375 시안은 327×182(4.55px, 1024 시안을 줄인 값이라 4px로 둠)다. 두 사진은 비율이 같다.
 * 제목은 Sanity 문자열이라 시안처럼 줄을 직접 바꿀 수 없어, 줄 길이를 고르게 나눠(text-balance) 한 단어만 다음 줄로
 * 넘어가지 않게 한다.
 * 대표이미지는 바로 위 제목이 설명하므로 대체 텍스트를 비운다. 화면에서 가장 큰 그림이라 먼저 받는다.
 */
export function PostHeader({ title, image }: { title: string; image: CroppedImage | null }) {
  return (
    <header
      className={`${POST_COLUMN} flex flex-col items-center gap-2xl pt-4xl lg:gap-3xl lg:pt-6xl`}
    >
      <h1 className="w-full text-center text-title-m-b text-balance text-text-primary lg:px-7xl lg:text-heading-s-b">
        {title}
      </h1>
      {image && (
        <div className="relative aspect-[864/480] w-full overflow-hidden rounded-s lg:rounded-md">
          <SanityImage
            image={image}
            alt=""
            sizes="(min-width: 1024px) 864px, calc(100vw - 48px)"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
    </header>
  );
}
