import Image, { type StaticImageData } from "next/image";

import hanMyungsuPhoto from "@/assets/about/board/han-myungsu.png";
import jeonMinkyungPhoto from "@/assets/about/board/jeon-minkyung.png";
import kimJungtaePhoto from "@/assets/about/board/kim-jungtae.png";
import leeSooyoungPhoto from "@/assets/about/board/lee-sooyoung.png";
import leeTaeinPhoto from "@/assets/about/board/lee-taein.png";

import { SanityImage } from "@/components/post/SanityImage";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_BOARD, type BoardMember } from "@/sanity/sections/about";

import { BoardCardList } from "./BoardCardList";

type CodePhoto = {
  // 배경을 지운 PNG다. 회색 카드 위에 시안과 같은 자리·크기로 놓는다.
  photo: StaticImageData;
  // 시안에서 사진을 놓은 자리. 모바일은 카드 폭(left·width)과 높이(top)에 대한 비율이고,
  // 데스크톱은 카드 크기가 고정(306×420)이라 시안의 px 값 그대로다.
  className: string;
};

/*
 * 기본 카드 다섯 장의 코드 사진과 놓은 자리(카드의 _key로 찾는다). 이름·직함·소개·순서·개수는 Studio의 "이사회·감사"에서
 * 고친다. 운영자가 올린 사진은 카드와 같은 비율의 투명 PNG라 카드를 꽉 채워 보여 주고(자리를 따로 정하지 않는다),
 * 올리지 않은 기본 카드는 이 사진을 쓴다.
 */
const CODE_PHOTOS: Record<string, CodePhoto> = {
  "lee-sooyoung": {
    photo: leeSooyoungPhoto,
    className: "top-[28.2%] left-[-9.4%] w-[148.1%] lg:top-[110px] lg:left-[-48px] lg:w-[540px]",
  },
  "kim-jungtae": {
    photo: kimJungtaePhoto,
    className: "top-[28.6%] left-[-14.4%] w-[153.1%] lg:top-[112px] lg:left-[-78px] lg:w-[558px]",
  },
  "lee-taein": {
    photo: leeTaeinPhoto,
    className: "top-[26.7%] left-[25%] w-[74.8%] lg:top-[118px] lg:left-[72px] lg:w-[240px]",
  },
  "han-myungsu": {
    photo: hanMyungsuPhoto,
    className: "top-[32.4%] left-[0.6%] w-[135%] lg:top-[142px] lg:left-[-10px] lg:w-[432px]",
  },
  "jeon-minkyung": {
    photo: jeonMinkyungPhoto,
    className: "top-[18.6%] left-[-18.3%] w-[159.1%] lg:top-[92px] lg:left-[-78px] lg:w-[509px]",
  },
};

/*
 * 마우스를 올리거나 포커스하면(키보드, 모바일은 탭) 소개 면이 0.25초에 걸쳐 덮인다.
 * 소개 면은 보이지 않을 때도 화면 낭독기가 읽는다. 이름은 앞면과 겹치므로 소개 면에서는 숨긴다.
 * 소개 면의 노란 그라데이션(#ffffbf)은 Figma에서 변수 없이 쓴 색이다. 모바일 시안은 같은 그라데이션을
 * 카드보다 긴 면에 깔아서 노란색이 카드 높이의 84%에서 끝나고, 데스크톱 시안은 카드에 깔아 52.357%에서 끝난다.
 * 모바일 소개 글은 시안에서 텍스트 스타일 없이 크기를 정했다(13px). 데스크톱은 Body-SM-M이다.
 */
function ProfileCard({ member, id }: { member: BoardMember; id: string }) {
  const uploaded = toCroppedImage(member.photo);
  const codePhoto = CODE_PHOTOS[member._key];
  const photoFade =
    "transition-opacity duration-250 ease-out group-hover/profile:opacity-0 group-focus/profile:opacity-0";

  return (
    <article
      tabIndex={0}
      aria-labelledby={id}
      className="group/profile relative isolate h-[210px] w-40 overflow-hidden rounded-md bg-bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:h-[420px] lg:w-[306px] lg:rounded-lg"
    >
      {/* 사진이 이 그라데이션 위에 올라가서 얼굴은 어두워지지 않는다. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[67.5%] bg-linear-to-b from-bg-overlay-a80 to-transparent opacity-75 lg:h-[66.19%]"
      />
      {/* 소개 면이 덮일 때 사진도 같이 흐려진다. 사진이 남아 있으면 둥근 모서리 끝에 한 줄로 비친다. */}
      {uploaded ? (
        <SanityImage
          image={uploaded}
          alt=""
          sizes="(min-width: 1024px) 306px, 160px"
          className={photoFade}
        />
      ) : (
        codePhoto && (
          <Image
            src={codePhoto.photo}
            alt=""
            sizes="(min-width: 1024px) 560px, 260px"
            className={`absolute h-auto max-w-[none] ${photoFade} ${codePhoto.className}`}
          />
        )
      )}
      <div className="relative flex flex-col p-sm text-text-inverse lg:p-2xl">
        <h3 id={id} className="text-title-s-b lg:text-title-lm-b">
          {member.name}
        </h3>
        {/*
         * 모바일 시안은 직함을 한 줄로 두어 긴 직함이 카드 끝에 닿는다. 코드는 안쪽 여백 안에서 줄을 바꾼다.
         * 둘째 줄은 짧아서 왼쪽에 놓이므로 가운데의 사진 머리와 겹치지 않는다.
         */}
        <p className="text-detail-ss-m whitespace-pre-line lg:text-body-sm-m">{member.role}</p>
      </div>

      <div className="absolute inset-0 flex flex-col gap-[6.67px] bg-bg-muted bg-linear-to-b from-[#ffffbf] to-bg-highlight/20 to-84% p-md opacity-0 transition-opacity duration-250 ease-out group-hover/profile:opacity-100 group-focus/profile:opacity-100 lg:gap-md lg:to-[52.357%] lg:p-2xl">
        <p aria-hidden className="text-detail-s-b text-text-primary lg:text-title-mm-sb">
          {member.name}
        </p>
        {/* 모바일은 Body-XS_M에서 크기만 13px로 줄였다. max-lg로 묶어야 lg의 텍스트 토큰을 덮지 않는다. */}
        <p className="text-body-xs-m text-text-secondary max-lg:text-[0.8125rem] lg:text-body-sm-m">
          {member.bio}
        </p>
      </div>
    </article>
  );
}

/*
 * 데스크톱은 한 줄에 세 장씩 놓고 남는 카드는 가운데로 모은다. 카드 폭이 306px로 고정이라 목록 폭을
 * 세 장(942px)에 묶어서, 1440처럼 넓은 화면에서도 네 장씩 놓이지 않게 한다. 모바일은 가로로 넘겨 본다.
 */
// 제목·소개·카드는 Studio에서 고친다. 제목의 줄바꿈은 기본값에 담아 두었고(Enter로 고칠 수 있다), 소개는 자동으로 나뉜다.
export async function BoardSection() {
  const { title, intro, cards } = await loadSection(ABOUT_BOARD);

  return (
    <section className="bg-bg-subtle px-lg pt-5xl pb-2xl lg:bg-bg-default lg:px-3xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[75rem] lg:items-center lg:gap-6xl">
        <div className="flex flex-col gap-xl lg:max-w-[51.25rem] lg:gap-2xl lg:text-center">
          <h2 className="text-title-m-b whitespace-pre-line text-text-primary lg:text-title-l-b">
            {title}
          </h2>
          <p className="text-body-s-m text-text-secondary lg:text-body-sm-r">{intro}</p>
        </div>

        <BoardCardList>
          {cards.map((member, index) => (
            <li key={member._key} className="shrink-0 snap-start">
              <ProfileCard member={member} id={`board-member-${index}`} />
            </li>
          ))}
        </BoardCardList>
      </div>
    </section>
  );
}
