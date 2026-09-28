import Image from "next/image";

import creativityImage from "@/assets/about/creativity-child-workshop.jpg";

// 배너는 다른 섹션보다 좌우 여백이 좁아(데스크톱 40px) 화면 폭을 따라 넓어진다.
// 사진을 어둡게 덮는 50% 검정은 Figma에서 변수 없이 쓴 값이다.
export function CreativityQuestionSection() {
  return (
    <section className="px-lg lg:px-3xl">
      <div className="relative isolate mx-auto flex h-[200px] max-w-[37.5rem] flex-col items-center justify-center gap-sm overflow-hidden rounded-sm text-center text-text-inverse lg:h-[440px] lg:max-w-full lg:rounded-lg">
        <Image
          src={creativityImage}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 100vw, 600px"
          className="-z-10 object-cover lg:object-[50%_56%]"
        />
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
