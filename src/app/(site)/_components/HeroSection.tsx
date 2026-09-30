import Image from "next/image";

import heroImage from "@/assets/home/hero-glacier-child.jpg";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="flex flex-col lg:h-[680px] lg:flex-row">
      <div className="relative h-[280px] overflow-hidden lg:h-auto lg:flex-1">
        <Image
          src={heroImage}
          alt="빙하 앞 바위에 서 있는 아이의 뒷모습"
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 1024px) 59vw, 100vw"
          className="object-cover object-[50%_63%] lg:object-center"
        />
      </div>

      {/*
       * 데스크톱 글은 1440 시안 그대로 둔다. 글 칸이 41.32%로 좁아지면 시안의 줄(가장 긴 줄 391px)이
       * 들어가지 않으므로, 1280 아래에서는 글 칸 너비를 528px로 지키고 사진을 줄인다.
       */}
      <div className="bg-bg-brand-soft px-lg py-2xl lg:w-[41.32%] lg:min-w-[33rem] lg:overflow-hidden lg:px-5xl lg:py-6xl">
        <div className="mx-auto flex max-w-[37.5rem] flex-col items-center gap-4xl lg:mx-0 lg:max-w-full lg:items-start">
          <div className="flex w-full flex-col gap-lg lg:gap-2xl">
            <h1 className="text-body-l-eb text-text-primary lg:text-heading-m-eb">
              지금의 선택이
              <br />
              다음 세대가 살아갈
              <br />
              환경을 만듭니다
            </h1>
            <div className="text-body-s-m text-text-secondary lg:text-body-sm-m">
              <p>
                기후위기는 먼 미래의 이야기가 아닙니다.
                <br />
                오늘 우리가 자원을 만들고 사용하고 버리는 방식이,{" "}
                <br className="hidden lg:inline" />
                아이들이 살아갈 환경을 결정하고 있습니다.
              </p>
              {/* 375 시안과 1440 시안은 여기서 줄을 바꾸고, 640 시안은 한 줄로 둔다. */}
              <p>
                ZAONE은 이 문제를 다른 시각에서 바라보고, <br className="sm:hidden lg:inline" />
                새로운 변화를 만들어가고 있습니다.
              </p>
            </div>
          </div>
          <Button href="/about" className="px-4xl py-md text-detail-s-b 2xl:text-title-s-b">
            ZAONE이 만드는 변화 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
