import Image, { type StaticImageData } from "next/image";

import forumAudienceImage from "@/assets/donation/work-forum-audience.jpg";
import materialYardImage from "@/assets/donation/work-material-yard.jpg";
import { loadSection } from "@/sanity/lib/sections";
import { DONATION_WORK } from "@/sanity/sections/donation";

import { BalancedLines } from "./BalancedLines";
import { PanOnScroll } from "./PanOnScroll";

type Backdrop = {
  image: StaticImageData;
  // 사진 틀의 위치와 크기. 데스크톱 시안은 사진을 섹션보다 크게 놓고 일부만 보이게 했다(섹션 대비 비율로 옮겼다).
  frameClassName: string;
  // 모바일 시안의 사진 위치(--pan-x). 0이면 사진 왼쪽 끝, 1이면 오른쪽 끝이 틀에 맞는다.
  mobilePositionClassName: string;
  sizes: string;
};

/*
 * 흑백 사진 위에 검정이 위 90%에서 아래 60%로 옅어지는 막을 덮는다. 막은 시안처럼 사진 틀 전체에 걸린다.
 * 사진 파일은 단체가 준 컬러 원본을 흑백으로 바꿔 저장했다. Figma의 사진은 같은 원본을 흑백으로 바꿔 1024px로 줄인
 * 사본이라 그대로 쓰면 데스크톱에서 늘어나 흐려진다. 어두운 막에 가려 압축 흔적이 안 보여서 품질 50으로 보낸다.
 */
const BACKDROPS: Record<"first" | "third", Backdrop> = {
  // 1024 시안: 1399×933 틀을 (-1, -195)에 둔다. 375 시안: 697×465 틀을 왼쪽 114px 잘라 둔다(남는 폭의 35.4%).
  first: {
    image: materialYardImage,
    frameClassName:
      "inset-0 lg:inset-auto lg:-top-[33.39%] lg:-left-[0.11%] lg:h-[159.76%] lg:w-[136.65%]",
    mobilePositionClassName: "[--pan-x:0.354]",
    sizes: "(min-width: 1024px) 137vw, 186vw",
  },
  // 1024 시안: 1111×741 틀을 (-50, -62)에 둔다. 375 시안: 743×495 틀을 왼쪽 301px 잘라 둔다(남는 폭의 81.8%).
  third: {
    image: forumAudienceImage,
    frameClassName:
      "inset-0 lg:inset-auto lg:-top-[11.57%] lg:-left-[4.88%] lg:h-[138.25%] lg:w-[108.5%]",
    mobilePositionClassName: "[--pan-x:0.818]",
    sizes: "(min-width: 1024px) 109vw, 198vw",
  },
};

/*
 * 사진 틀 안에서 사진을 옮기는 칸. 모바일은 틀 높이에 사진 비율(두 사진 모두 3:2)로 폭을 잡아 틀보다 넓게 두고,
 * 남는 폭(사진 폭 - 틀 폭, 100cqw는 틀 폭)에 --pan-x를 곱한 만큼 왼쪽으로 밀어 시안 위치에 둔다.
 * 스크롤 진행도(--pan, 기본 0.5)가 0에서 1로 가는 동안 그 위치에서 오른쪽 50px → 왼쪽 50px로 모두 100px 오간다.
 * 진행도는 PanOnScroll이 모바일에서만 넣고, 데스크톱과 움직임 줄이기 설정은 시안 위치에 멈춘다.
 * 사진 끝이 틀 안으로 들어와 빈 곳이 보이지 않게 남는 폭 안으로 묶는다. 틀이 사진보다 넓은 화면(640 안팎)은
 * 칸이 틀 폭에 맞춰져 옮길 거리가 없다. 데스크톱은 칸이 틀을 그대로 채운다.
 */
const MOVER_CLASS =
  "absolute inset-y-0 left-0 aspect-[3/2] min-w-full [--pan:0.5] translate-x-[clamp(100cqw_-_100%,var(--pan-x)_*_(100cqw_-_100%)_-_(var(--pan)_-_0.5)_*_100px,0px)] lg:right-0 lg:aspect-auto lg:translate-x-0";

function BackdropImage({ backdrop }: { backdrop: Backdrop }) {
  return (
    <PanOnScroll
      className={`${MOVER_CLASS} ${backdrop.mobilePositionClassName} max-lg:will-change-transform`}
    >
      <Image
        src={backdrop.image}
        alt=""
        fill
        placeholder="blur"
        quality={50}
        sizes={backdrop.sizes}
        className="object-cover"
      />
    </PanOnScroll>
  );
}

type WorkBlockProps = { label: string; lead: string; body: string; backdrop?: Backdrop };

/*
 * '우리가 하는 일' 한 면. 사진 면은 흰 글씨, 사진이 없는 면은 회색 바탕에 어두운 글씨다. 사진 면은 아래 여백이 더 크다.
 * 글은 모바일 600px, 데스크톱 864px(1024 시안 폭)에 묶어 가운데 둔다. 굵은 문장은 기본값의 줄바꿈을 따르고,
 * 본문은 Enter마다 문단을 나눈 뒤 폭에 맞춰 흐른다. 데스크톱 본문은 시안의 가장 긴 줄(685px)에 맞춰 폭을 묶는다.
 */
function WorkBlock({ label, lead, body, backdrop }: WorkBlockProps) {
  const text = backdrop
    ? { label: "text-text-quaternary", lead: "text-text-inverse", body: "text-text-inverse" }
    : { label: "text-text-secondary", lead: "text-text-primary", body: "text-text-secondary" };

  return (
    <section
      className={`relative isolate overflow-hidden px-xl pt-5xl lg:px-6xl lg:pt-7xl ${backdrop ? "pb-7xl lg:pb-[10rem]" : "bg-bg-muted pb-6xl lg:pb-7xl"}`}
    >
      {backdrop && (
        <div aria-hidden className={`@container absolute -z-10 ${backdrop.frameClassName}`}>
          <BackdropImage backdrop={backdrop} />
          <div className="absolute inset-0 bg-linear-to-b from-[rgb(0_0_0/0.9)] to-[rgb(0_0_0/0.6)]" />
        </div>
      )}

      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl lg:max-w-[54rem]">
        <p className={`text-body-s-m lg:text-body-s-sb ${text.label}`}>{label}</p>
        <div className="flex flex-col gap-lg lg:gap-sm">
          <h2 className={`text-body-sm-b text-balance lg:text-title-mm-sb ${text.lead}`}>
            <BalancedLines text={lead} />
          </h2>
          <div
            className={`flex flex-col gap-sm text-body-s-m lg:max-w-[43rem] lg:text-body-sm-r ${text.body}`}
          >
            {body
              .split("\n")
              .filter((paragraph) => paragraph.trim())
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 세 면은 순서가 정해져 있다(사진 면, 회색 면, 사진 면). 글은 Studio에서 고치고 사진은 코드에 있다.
// 두 사진 면의 사진은 모바일에서 스크롤하면 옆으로 조금 흐른다.
export async function WorkSection() {
  const { label, first, second, third } = await loadSection(DONATION_WORK);

  return (
    <>
      <WorkBlock label={label} {...first} backdrop={BACKDROPS.first} />
      <WorkBlock label={label} {...second} />
      <WorkBlock label={label} {...third} backdrop={BACKDROPS.third} />
    </>
  );
}
