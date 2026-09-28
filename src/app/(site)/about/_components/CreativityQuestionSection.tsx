import Image from "next/image";

import creativityImage from "@/assets/about/creativity-child-workshop.jpg";

// 배너는 다른 섹션보다 좌우 여백이 좁아(데스크톱 40px) 화면 폭을 따라 넓어진다.
// 사진을 어둡게 덮는 50% 검정은 Figma에서 변수 없이 쓴 값이다.
export function CreativityQuestionSection() {
  return (
    <section className="px-lg lg:px-3xl">
      <div className="relative isolate mx-auto flex h-[200px] max-w-[37.5rem] flex-col items-center justify-center gap-sm overflow-hidden rounded-sm text-center text-text-inverse lg:h-[440px] lg:max-w-full lg:rounded-lg">
        {/*
         * 모바일은 배너를 채운다(폭 300.8px 아래로는 높이 200px을 채우도록 틀을 넓힌다).
         * 데스크톱 시안은 사진을 배너보다 6.25% 넓게 두고, 사진 세로 52.9% 지점을 배너 가운데에 맞췄다.
         */}
        <div className="absolute top-1/2 left-1/2 -z-10 aspect-[3000/1996] min-h-full w-[max(100%,18.8rem)] -translate-x-1/2 -translate-y-1/2 lg:left-[-2.5px] lg:w-[106.25%] lg:translate-x-0 lg:translate-y-[-52.9%]">
          <Image
            src={creativityImage}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 106vw, 600px"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(0_0_0/0.5)]" />
        <h2 className="text-title-s-b lg:text-heading-mm-eb">
          창의성은 어떠한 환경에서
          <br />더 잘 드러날까
        </h2>
        <p className="text-body-s-m lg:text-body-m-sb">이 질문에서 ZAONE의 질문이 시작되었습니다</p>
      </div>
    </section>
  );
}
