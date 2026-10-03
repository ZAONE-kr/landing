import Image from "next/image";

import heroImage from "@/assets/give-and-use/hero-fabric-texture.jpg";

const MOBILE_BR = "lg:hidden";
const DESKTOP_BR = "hidden lg:inline";

/*
 * 천 사진은 원래 어두워서 시안에 덮는 그라데이션이 없다. 사진 틀은 섹션 높이에 맞춘 원본 비율이라
 * object-cover로 가운데를 자른다(375: 979px, 1024 이상 680px 높이: 1594px 폭).
 * 모바일 높이는 글 길이로 정해지고(375 시안 418px), 데스크톱은 680px에 글을 가운데 둔다
 * (시안은 640px이었으나 요청으로 높임).
 */
export function GiveUseHeroSection() {
  return (
    <section className="relative isolate flex flex-col items-center justify-center gap-xl overflow-hidden px-xl py-5xl text-center lg:h-[680px] lg:gap-2xl lg:px-6xl lg:py-0">
      <Image
        src={heroImage}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="(min-width: 1594px) 100vw, (min-width: 1024px) 1594px, 980px"
        className="-z-10 object-cover"
      />
      <h1 className="text-body-l-eb text-text-inverse lg:text-heading-mm-eb">
        기업의 휴면자원을 발굴해
        <br /> 교육·문화·복지 현장에
        <br className={MOBILE_BR} /> 제공합니다.
      </h1>
      {/* 모바일 시안은 본문을 한 단계 흐린 색(text-quaternary)으로 둔다. */}
      <div className="flex max-w-[54rem] flex-col gap-sm text-body-xs-m text-text-quaternary lg:text-body-sm-r lg:text-text-inverse">
        <p>
          ZAONE은 기업이 보유한 휴면자원 가운데 교육적으로 활용할 수 있는 재료를 검토하고 분류해,
          <br className={DESKTOP_BR} /> 학교와 교육·돌봄기관, 복지기관, 도서관·문화공간 등이 사용할
          수 있도록 제공합니다.
        </p>
        <p>휴면자원의 공급과 사용, 교육과 훈련을 하나의 체계로 운영합니다.</p>
      </div>
    </section>
  );
}
