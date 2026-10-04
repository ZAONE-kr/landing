import Image, { type StaticImageData } from "next/image";

import communityImage from "@/assets/give-and-use/project-community-space.jpg";
import employeeImage from "@/assets/give-and-use/project-employee-workshop.jpg";
import futureImage from "@/assets/give-and-use/project-future-education.jpg";
import { Button } from "@/components/ui/Button";

type Project = {
  title: string;
  description: string;
  image: StaticImageData;
};

const PROJECTS: Project[] = [
  {
    title: "미래세대를 위한 교육 프로젝트",
    description:
      "휴면자원을 활용해 어린이가 직접 만지고, 질문하고, 탐구하는 교육 프로그램을 기획합니다. 기업·재단의 사회공헌 목적, 대상 연령, 지역과 운영 기간에 맞춰 프로그램을 설계할 수 있습니다.",
    image: futureImage,
  },
  {
    title: "지역사회를 위한 교육·문화 프로그램",
    description:
      "도서관, 문화시설, 커뮤니티 공간 등 지역의 일상적인 장소에서 휴면자원을 경험할 수 있는 프로그램과 공간 프로젝트를 만듭니다. 지역의 공공기관·재단·기업과 함께 지역 특성과 대상에 맞는 방식으로 기획할 수 있습니다.",
    image: communityImage,
  },
  {
    title: "임직원·고객이 참여하는 사회공헌",
    description:
      "임직원이나 고객이 휴면자원을 직접 경험하고 사회문제와 연결해볼 수 있는 참여형 워크숍과 캠페인을 기획합니다. 일회성 체험에 그치지 않고 실제 교육·지역사회 활동과 연결되는 구조로 설계할 수 있습니다.",
    image: employeeImage,
  },
];

/*
 * 모바일은 소개 글 아래에 노란 면(bg-highlight)을 깔고 사진을 화면 끝까지 채운다.
 * 데스크톱은 흰 바탕에 소개 글(왼쪽)과 프로젝트 목록(오른쪽 440px)을 나란히 놓는다.
 * 1440보다 넓으면 1440 시안 폭(1280px)에 묶는다.
 * 데스크톱에서는 목록이 스크롤되는 동안 소개 글이 화면 위에 붙어 있다(레고 재단 "How we work" 방식).
 * 붙는 높이는 80px이고, 올려서 헤더가 다시 나타나 있는 동안은 헤더 높이만큼 더 내려가 가리지 않는다.
 * 소개 글은 카드 목록이 끝나는 곳에서 멈춰 문의 버튼 옆까지 내려오지 않는다.
 * 그래서 버튼은 목록 열 밖, 소개 글과 목록을 묶은 줄 아래에 둔다.
 * 모바일 시안에는 문의 버튼이 없어 데스크톱에만 둔다.
 */
export function SocialProjectsSection() {
  return (
    <section className="lg:px-6xl lg:py-7xl">
      <div className="mx-auto lg:max-w-[80rem]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6xl">
          <div className="flex flex-col gap-xl px-xl pt-5xl pb-xl motion-reduce:transition-none lg:sticky lg:top-[calc(var(--spacing-6xl)+var(--site-header-offset,0px))] lg:flex-1 lg:gap-4xl lg:p-0 lg:transition-[top] lg:duration-300 lg:ease-out">
            <h2 className="pr-2xl text-title-m-b text-text-primary lg:pr-0 lg:text-title-lm-b">
              휴면자원으로
              <br /> 사회공헌 프로젝트를
              <br /> 만듭니다.
            </h2>
            <p className="text-body-s-m text-text-secondary lg:text-body-sm-m">
              ZAONE은 제조기업에서 공급받은 휴면자원을 활용해 기업·재단·공공기관과
              교육·문화·지역사회 프로젝트를 기획하고 운영합니다. 자사에서 발생한 휴면자원으로
              기업만의 사회공헌 프로젝트를 만들 수도 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3xl bg-bg-highlight px-xl pt-3xl pb-xl lg:w-[27.5rem] lg:shrink-0 lg:gap-6xl lg:bg-transparent lg:p-0">
            {/* 375 시안은 이 문장을 327px에 넘치게 끊어 두어 줄이 어색하게 바뀐다. 모바일은 흘려 둔다. */}
            <p className="text-title-s-b text-text-primary lg:text-body-l-b">
              환경, 미래세대, 지역사회를 함께 다루는 사회공헌이 필요하다면, 휴면자원을 매개로
              ZAONE과 프로젝트를 설계할 수 있습니다.
            </p>
            <ul className="flex flex-col gap-5xl">
              {PROJECTS.map((project) => (
                <li key={project.title} className="flex flex-col gap-2xl">
                  <div className="relative -mx-xl aspect-[3/2] lg:mx-0 lg:w-[360px]">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-sm">
                    <h3 className="text-detail-m-sb text-text-primary lg:text-title-mm-sb">
                      {project.title}
                    </h3>
                    <p className="text-body-s-m text-text-secondary lg:text-body-sm-r lg:text-text-primary">
                      {project.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 목록 열과 같은 폭으로 오른쪽에 붙여 목록 아래에 오게 한다. */}
        {/* TODO: 문의 버튼이 갈 곳을 아직 받지 못해 문의하기 페이지로 보낸다. */}
        <div className="hidden lg:mt-6xl lg:ml-auto lg:block lg:w-[27.5rem]">
          <Button href="/contact" className="px-6xl py-xl text-body-sm-b">
            사회공헌 프로젝트 문의하기
          </Button>
        </div>
      </div>
    </section>
  );
}
