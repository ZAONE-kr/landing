import Image, { type StaticImageData } from "next/image";

import communityImage from "@/assets/give-and-use/project-community-space.jpg";
import employeeImage from "@/assets/give-and-use/project-employee-workshop.jpg";
import futureImage from "@/assets/give-and-use/project-future-education.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { Button } from "@/components/ui/Button";
import { linkTargetProps } from "@/lib/links";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { SOCIAL_PROJECTS } from "@/sanity/sections/giveAndUse";

// 기본 카드 세 장의 코드 사진(카드의 _key로 찾는다). 운영자가 사진을 올린 카드는 그 사진을 쓴다.
const CODE_PHOTOS: Record<string, StaticImageData> = {
  "project-future": futureImage,
  "project-community": communityImage,
  "project-employee": employeeImage,
};

/*
 * 모바일은 소개 글 아래에 노란 면(bg-highlight)을 깔고 사진을 화면 끝까지 채운다.
 * 데스크톱은 흰 바탕에 소개 글(왼쪽)과 프로젝트 목록(오른쪽 440px)을 나란히 놓는다.
 * 1440보다 넓으면 1440 시안 폭(1280px)에 묶는다.
 * 데스크톱에서는 목록이 스크롤되는 동안 소개 글이 화면 위에 붙어 있다(레고 재단 "How we work" 방식).
 * 붙는 높이는 80px이고, 올려서 헤더가 다시 나타나 있는 동안은 헤더 높이만큼 더 내려가 가리지 않는다.
 * 소개 글은 카드 목록이 끝나는 곳에서 멈춰 문의 버튼 옆까지 내려오지 않는다.
 * 그래서 버튼은 목록 열 밖, 소개 글과 목록을 묶은 줄 아래에 둔다.
 * 모바일 시안에는 문의 버튼이 없어 데스크톱에만 둔다.
 * 글·버튼·카드는 Studio에서 고친다. 제목의 줄바꿈은 기본값에 담아 두었고(Enter로 고칠 수 있다), 본문은 자동으로 나뉜다.
 */
export async function SocialProjectsSection() {
  const { title, intro, lead, button, cards } = await loadSection(SOCIAL_PROJECTS);

  return (
    <section className="lg:px-6xl lg:py-7xl">
      <div className="mx-auto lg:max-w-[80rem]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6xl">
          <div className="flex flex-col gap-xl px-xl pt-5xl pb-xl motion-reduce:transition-none lg:sticky lg:top-[calc(var(--spacing-6xl)+var(--site-header-offset,0px))] lg:flex-1 lg:gap-4xl lg:p-0 lg:transition-[top] lg:duration-300 lg:ease-out">
            <h2 className="pr-2xl text-title-m-b whitespace-pre-line text-text-primary lg:pr-0 lg:text-title-lm-b">
              {title}
            </h2>
            <p className="text-body-s-m text-text-secondary lg:text-body-sm-m">{intro}</p>
          </div>

          <div className="flex flex-col gap-3xl bg-bg-highlight px-xl pt-3xl pb-xl lg:w-[27.5rem] lg:shrink-0 lg:gap-6xl lg:bg-transparent lg:p-0">
            <p className="text-title-s-b text-text-primary lg:text-body-l-b">{lead}</p>
            <ul className="flex flex-col gap-5xl">
              {cards.map((project) => {
                const uploaded = toCroppedImage(project.photo);
                const codePhoto = CODE_PHOTOS[project._key];
                return (
                  <li key={project._key} className="flex flex-col gap-2xl">
                    <div className="relative -mx-xl aspect-[3/2] lg:mx-0 lg:w-[360px]">
                      {uploaded ? (
                        <SanityImage
                          image={uploaded}
                          alt=""
                          sizes="(min-width: 1024px) 360px, 100vw"
                        />
                      ) : (
                        codePhoto && (
                          <Image
                            src={codePhoto}
                            alt=""
                            fill
                            placeholder="blur"
                            sizes="(min-width: 1024px) 360px, 100vw"
                            className="object-cover"
                          />
                        )
                      )}
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
                );
              })}
            </ul>
          </div>
        </div>

        {/* 목록 열과 같은 폭으로 오른쪽에 붙여 목록 아래에 오게 한다. */}
        <div className="hidden lg:mt-6xl lg:ml-auto lg:block lg:w-[27.5rem]">
          <Button
            href={button.href}
            {...linkTargetProps(button.href)}
            className="px-6xl py-xl text-body-sm-b"
          >
            {button.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
