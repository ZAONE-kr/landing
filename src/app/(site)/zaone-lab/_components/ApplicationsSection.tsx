import Image, { type StaticImageData } from "next/image";

import artistsImage from "@/assets/zaone-lab/field-artists.jpg";
import companiesImage from "@/assets/zaone-lab/field-companies.jpg";
import curiousPeopleImage from "@/assets/zaone-lab/field-curious-people.jpg";
import librariesImage from "@/assets/zaone-lab/field-libraries.jpg";
import localOperatorsImage from "@/assets/zaone-lab/field-local-operators.jpg";
import teachersImage from "@/assets/zaone-lab/field-teachers.jpg";

import { FadeUpOnView } from "./FadeUpOnView";

type Field = {
  title: string;
  // 줄바꿈(\n)은 1024·375 시안의 줄 위치다. 1440 시안은 한 줄이라 그 폭부터는 공백으로 흘린다.
  description: string;
  tags: string[];
  image: StaticImageData;
  // 사진 틀(3:2)을 사진 칸(240px 높이)에 세로로 놓는 위치. 1440 시안은 카드마다 위치를 따로 잡았다.
  imageClassName: string;
};

// 모바일·1024 시안은 대부분 사진 가운데를 보여 준다.
const CENTER = "top-1/2 -translate-y-1/2";

/*
 * TODO: 이 카드 목록(사진·제목·설명·태그, 카드 개수와 순서)은 운영자가 Sanity에서 추가·수정·삭제(CRUD)할 수
 * 있게 바꿀 수 있다. 그때 이 배열을 Sanity 쿼리 결과로 바꾸고, 카드마다 잡아 둔 사진 위치(imageClassName)는
 * Sanity 이미지 hotspot으로 옮긴다. 카드 수가 홀수여도 줄이 깨지지 않고, 글이 길어지면 카드가 늘어난다.
 */
const FIELDS: Field[] = [
  {
    title: "교사와 교육기관",
    description: "0세부터 청소년까지, 재료와 놀이를 수업과 교육환경에 적용합니다.",
    tags: ["교사연수", "워크숍", "교육환경 설계"],
    image: teachersImage,
    imageClassName: `${CENTER} 2xl:top-[-50px] 2xl:translate-y-0`,
  },
  {
    title: "기업과 조직",
    description: "놀이와 아동의 관점으로 익숙한\n문제를 다시 보고 협업하는 방법을 훈련합니다.",
    tags: ["임직원 교육", "ESG/CSR 연계 프로그램"],
    image: companiesImage,
    imageClassName: `${CENTER} 2xl:top-[-60px] 2xl:translate-y-0`,
  },
  {
    title: "도서관과 지역의 장소",
    description: "재료가 일상적으로 사용되는 교육 프로그램과 공간환경을 함께 설계합니다.",
    tags: ["도서관", "커뮤니티센터", "돌봄기관", "공공 공간"],
    image: librariesImage,
    imageClassName: `${CENTER} 2xl:top-[-80px] 2xl:translate-y-0`,
  },
  {
    title: "예술가와 디자이너",
    description: "재료의 물성과 표현 방법을 함께 연구하고 교육과 작업의 새로운 형식을 만듭니다.",
    tags: ["재료 연구", "공동 워크숍"],
    image: artistsImage,
    imageClassName: CENTER,
  },
  {
    title: "지역에서 함께 운영하는 사람들",
    description:
      "재료를 선별하고 손질하고 준비하는 일을 교육현장을 유지하는 지속적인 역할로 만듭니다.",
    tags: ["발달장애인", "시니어", "지역의 협력자"],
    image: localOperatorsImage,
    // 모바일·1024 시안은 사진 위쪽(목재 판을 다루는 손)을 보여 준다.
    imageClassName: "top-0 2xl:top-[-100px]",
  },
  {
    title: "호기심 있는 사람과 커뮤니티",
    description: "아직 이름 붙이지 않은 질문을 가지고 LAB에 들어올 수 있습니다.",
    tags: ["개인", "모임", "팀", "커뮤니티"],
    image: curiousPeopleImage,
    imageClassName: CENTER,
  },
];

/*
 * 위는 사진 칸(240px), 아래는 흰 글 칸이다. 카드 높이는 모바일 440px, 데스크톱 480px이고, 글이 길면 늘어난다.
 * 태그는 글 칸 아래에 붙는다. 태그 테두리 0.648px은 Figma 값이다.
 * 사진 틀은 폭이 424px 이상이라 카드가 그보다 좁은 375에서는 사진이 조금 확대되고 오른쪽이 잘린다(375 시안).
 * 마우스를 올리거나 포커스하면(키보드, 모바일은 탭) 다른 페이지 카드처럼 사진이 천천히 살짝 커진다.
 * 링크가 없는 카드라 About 이사 카드처럼 카드 자체가 포커스를 받고, 화면 낭독기는 제목을 카드 이름으로 읽는다.
 */
function FieldCard({ field, id }: { field: Field; id: string }) {
  return (
    <article
      tabIndex={0}
      aria-labelledby={id}
      className="group/card flex h-full min-h-[27.5rem] flex-col overflow-hidden rounded-md bg-bg-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:min-h-[30rem]"
    >
      <div className="relative h-60 shrink-0 overflow-hidden">
        {/* 사진 칸 가운데를 기준으로 커지도록, 칸에 맞춘 요소를 키운다(사진 틀은 칸보다 크고 카드마다 위치가 다르다). */}
        <div className="absolute inset-0 transition-transform duration-600 ease-out motion-safe:group-hover/card:scale-[1.03] motion-safe:group-focus/card:scale-[1.03]">
          <div
            className={`absolute left-0 aspect-[3/2] w-[max(26.5rem,100%)] ${field.imageClassName}`}
          >
            <Image
              src={field.image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1440px) 632px, (min-width: 1024px) calc(50vw - 88px), (min-width: 648px) 600px, (min-width: 472px) calc(100vw - 48px), 424px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-sm px-xl py-lg lg:pt-2xl lg:pb-3xl">
        <div className="flex flex-1 flex-col gap-xs lg:gap-s">
          <h3 id={id} className="text-title-s-b text-text-primary lg:text-title-m-b">
            {field.title}
          </h3>
          <p className="text-detail-s-m whitespace-pre-line text-text-secondary lg:text-detail-m-m 2xl:whitespace-normal">
            {field.description}
          </p>
        </div>
        <ul className="flex flex-wrap gap-s">
          {field.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border-[0.648px] border-text-primary px-md py-xs text-detail-xs-m text-text-primary"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/*
 * 카드는 모바일에서 한 줄에 하나, 데스크톱에서 두 개씩 놓는다. 1440보다 넓으면 1440 시안 폭(1280px)에 묶는다.
 * 카드마다 화면에 들어오면 아래에서 올라오며 나타난다(FadeUpOnView). 데스크톱은 한 줄의 두 카드가 함께 움직인다.
 * 모바일 제목 색 #22293f는 Figma에서 변수 없이 쓴 값이다. 데스크톱 시안의 #111524는 text-primary와 거의 같아
 * 토큰을 쓴다.
 */
export function ApplicationsSection() {
  return (
    <section className="bg-bg-surface px-xl py-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[80rem] lg:gap-6xl">
        <h2 className="text-title-m-b text-[#22293f] lg:text-title-l-b lg:text-text-primary">
          교육현장에서 조직, 지역의 장소까지
          <br /> ZAONE LAB의 실험은 다르게 적용됩니다.
        </h2>
        <ul className="grid gap-md lg:grid-cols-2 lg:gap-y-2xl">
          {FIELDS.map((field, index) => (
            <li key={field.title}>
              <FadeUpOnView className="h-full">
                <FieldCard field={field} id={`lab-field-${index}`} />
              </FadeUpOnView>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
