import Image, { type StaticImageData } from "next/image";

import hanMyungsuPhoto from "@/assets/about/board/han-myungsu.png";
import jeonMinkyungPhoto from "@/assets/about/board/jeon-minkyung.png";
import kimJungtaePhoto from "@/assets/about/board/kim-jungtae.png";
import leeSooyoungPhoto from "@/assets/about/board/lee-sooyoung.png";
import leeTaeinPhoto from "@/assets/about/board/lee-taein.png";

type BoardMember = {
  name: string;
  // 줄을 바꿀 자리는 \n으로 적는다.
  role: string;
  bio: string;
  // 배경을 지운 PNG다. 회색 카드 위에 시안과 같은 자리·크기로 놓는다.
  photo: StaticImageData;
  // 시안에서 사진을 놓은 자리(모바일, 데스크톱). 카드 폭(left·width)과 높이(top)에 대한 비율이다.
  photoClassName: string;
};

const MEMBERS: BoardMember[] = [
  {
    name: "이수영",
    role: "이사 · CVO",
    bio: "사단법인 자원(ZAONE)을 설립하였으며, 조직의 비전과 사업을 총괄합니다.",
    photo: leeSooyoungPhoto,
    photoClassName:
      "top-[28.2%] left-[-9.4%] w-[148.1%] lg:top-[27.1%] lg:left-[-2.6%] lg:w-[137.8%]",
  },
  {
    name: "김정태",
    role: "이사 · MYSC CEO",
    bio: "사회혁신과 임팩트 투자 분야의 관점에서 자원의 사회적 가치, 사업의 확장 가능성, 지속가능한 조직 운영 방향을 함께 살핍니다.",
    photo: kimJungtaePhoto,
    photoClassName:
      "top-[28.6%] left-[-14.4%] w-[153.1%] lg:top-[27.1%] lg:left-[-5.9%] lg:w-[142.3%]",
  },
  {
    name: "이태인",
    role: "이사 · 제주한라대학교\n사회복지학과 교수",
    bio: "사회복지의 관점에서 자원의 활동이 아동과 지역사회, 복지 현장에 어떤 의미를 갖는지 살피고 조직의 공공성과 사회적 역할을 함께 검토합니다.",
    photo: leeTaeinPhoto,
    photoClassName: "top-[26.7%] left-[25%] w-[74.8%] lg:top-[25.2%] lg:left-[37.8%] lg:w-[61.2%]",
  },
  {
    name: "한명수",
    role: "이사 · 우아한형제들 CCO",
    bio: "브랜드와 커뮤니케이션의 관점에서 자원의 미션이 사회와 어떻게 관계 맺고, 더 많은 사람들에게 전달될 수 있을지 함께 살핍니다.",
    photo: hanMyungsuPhoto,
    photoClassName: "top-[32.4%] left-[0.6%] w-[135%] lg:top-[30.6%] lg:left-[7.9%] lg:w-[110.2%]",
  },
  {
    name: "전민경",
    role: "감사 · 사단법인 온율 변호사",
    bio: "공익법인의 재무·회계 투명성을 점검합니다. 아동의 권리와 사회복지 영역에 대한 전문성을 바탕으로 자원의 공익성과 책임성을 함께 살핍니다.",
    photo: jeonMinkyungPhoto,
    photoClassName:
      "top-[18.6%] left-[-18.3%] w-[159.1%] lg:top-[21%] lg:left-[-4.1%] lg:w-[129.8%]",
  },
];

/*
 * 마우스를 올리거나 포커스하면(키보드, 모바일은 탭) 소개 면이 0.25초에 걸쳐 덮인다.
 * 소개 면은 보이지 않을 때도 화면 낭독기가 읽는다. 이름은 앞면과 겹치므로 소개 면에서는 숨긴다.
 * 소개 면의 노란 그라데이션(#ffffbf)은 Figma에서 변수 없이 쓴 색이다. 시안은 같은 그라데이션을
 * 카드보다 긴 면에 깔아서, 노란색이 모바일은 카드 높이의 84%, 데스크톱은 88%에서 끝난다.
 * 소개 글은 시안에서 텍스트 스타일 없이 크기를 정했다(모바일 13px, 데스크톱 24px).
 */
function ProfileCard({ member, id }: { member: BoardMember; id: string }) {
  return (
    <article
      tabIndex={0}
      aria-labelledby={id}
      className="group/profile relative isolate h-[210px] w-40 overflow-hidden rounded-md bg-bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:aspect-[392/480] lg:h-auto lg:w-full lg:rounded-lg"
    >
      {/* 사진이 이 그라데이션 위에 올라가서 얼굴은 어두워지지 않는다. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[67.5%] bg-linear-to-b from-bg-overlay-a80 to-transparent opacity-75"
      />
      {/* 소개 면이 덮일 때 사진도 같이 흐려진다. 사진이 남아 있으면 둥근 모서리 끝에 한 줄로 비친다. */}
      <Image
        src={member.photo}
        alt=""
        sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 260px"
        className={`absolute h-auto max-w-[none] transition-opacity duration-250 ease-out group-hover/profile:opacity-0 group-focus/profile:opacity-0 ${member.photoClassName}`}
      />
      <div className="relative flex flex-col p-sm text-text-inverse lg:p-[30px]">
        <h3 id={id} className="text-title-s-b lg:text-heading-mm-b">
          {member.name}
        </h3>
        {/*
         * 모바일 시안은 직함을 한 줄로 두어 긴 직함이 카드 끝에 닿는다. 코드는 안쪽 여백 안에서 줄을 바꾼다.
         * 둘째 줄은 짧아서 왼쪽에 놓이므로 가운데의 사진 머리와 겹치지 않는다.
         */}
        <p className="text-detail-ss-m whitespace-pre-line lg:text-body-m-m">{member.role}</p>
      </div>

      <div className="absolute inset-0 flex flex-col gap-[6.67px] bg-bg-muted bg-linear-to-b from-[#ffffbf] to-bg-highlight/20 to-84% p-md opacity-0 transition-opacity duration-250 ease-out group-hover/profile:opacity-100 group-focus/profile:opacity-100 lg:gap-md lg:to-88% lg:p-[30px]">
        <p aria-hidden className="text-detail-s-b text-text-primary lg:text-body-l-b">
          {member.name}
        </p>
        {/* 모바일은 Body-XS_M에서 크기만 13px로 줄였다. max-lg로 묶어야 lg의 텍스트 토큰을 덮지 않는다. */}
        <p className="text-body-xs-m text-text-secondary max-lg:text-[0.8125rem] lg:text-body-m-m lg:leading-[1.6] lg:tracking-[-0.02em]">
          {member.bio}
        </p>
      </div>
    </article>
  );
}

// 데스크톱은 한 줄에 세 장씩 놓고 남는 카드는 가운데로 모은다. 모바일은 가로로 넘겨 본다.
export function BoardSection() {
  return (
    <section className="bg-bg-subtle px-lg pt-5xl pb-2xl lg:bg-bg-default lg:px-5xl lg:py-7xl 2xl:px-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[75rem] lg:items-center lg:gap-6xl">
        <div className="flex flex-col gap-xl lg:max-w-[51.25rem] lg:gap-2xl lg:text-center">
          <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
            조직의 방향을 함께 결정하고,
            <br />
            책임 있게 운영합니다.
          </h2>
          {/* 시안은 "공익을 위해" 뒤에서 줄을 바꾸는데, 375에서는 이 두 낱말만 한 줄에 남아서 640부터 바꾼다. */}
          <p className="text-body-s-m text-text-secondary lg:text-body-sm-r">
            사단법인 자원(ZAONE)은 서로 다른 전문성을 가진 이사회와 감사가 조직의 운영을 함께
            살핍니다. 이사회는 자원의 미션과 중장기 방향을 검토하고, 조직의 자원이 공익을 위해
            <br className="hidden sm:inline" /> 책임 있게 사용되도록 주요 사업과 자원의 사용에 관한
            의사결정에 참여합니다.
          </p>
        </div>

        {/* 모바일 목록은 좌우 여백 밖으로 펴서 넘겨 보고, 포커스 링이 잘리지 않게 위아래로 4px 띄운다. */}
        <ul className="-mx-lg -my-1 flex snap-x snap-mandatory scroll-px-lg scrollbar-none gap-s overflow-x-auto px-lg py-1 lg:m-0 lg:w-full lg:snap-none lg:flex-wrap lg:justify-center lg:gap-x-sm lg:gap-y-6xl lg:overflow-visible lg:p-0">
          {MEMBERS.map((member, index) => (
            <li key={member.name} className="shrink-0 snap-start lg:w-[calc((100%-1.5rem)/3)]">
              <ProfileCard member={member} id={`board-member-${index}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
