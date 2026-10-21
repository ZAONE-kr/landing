import Image, { type StaticImageData } from "next/image";

import cupFactoryImage from "@/assets/impact/stat-cup-factory.jpg";
import greenTilesImage from "@/assets/impact/stat-green-tiles.jpg";
import materialRollImage from "@/assets/impact/stat-material-roll.jpg";
import orangeCarpetImage from "@/assets/impact/stat-orange-carpet.jpg";
import { SanityImage } from "@/components/post/SanityImage";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { IMPACT_STATS } from "@/sanity/sections/impact";

import { CountUp } from "./CountUp";

type CodePhoto = {
  image: StaticImageData;
  // 사진 위에 덮는 색. 모두 Figma에서 변수 없이 쓴 값이다.
  overlayClassName: string;
  imageClassName?: string;
};

/*
 * 기본 카드 일곱 장 중 사진이 있는 네 장의 코드 사진과 색(카드의 _key로 찾는다). 글·순서·개수는 Studio의
 * "수치 카드"에서 고치고, 운영자가 사진을 올린 카드는 그 사진을 쓴다. 사진도 없는 카드는 흰 면이다.
 */
const CODE_PHOTOS: Record<string, CodePhoto> = {
  // 데스크톱 시안은 사진을 섹션을 덮는 크기보다 11% 키워 두었다(1145×644 틀).
  "stat-34": {
    image: orangeCarpetImage,
    overlayClassName: "bg-[rgb(68_25_12/0.5)]",
    imageClassName: "lg:scale-[1.11]",
  },
  // 모바일 시안은 사진 오른쪽(심지가 보이는 쪽)을 보여 준다.
  "stat-49": {
    image: materialRollImage,
    overlayClassName: "bg-[rgb(62_56_51/0.5)]",
    imageClassName: "object-[96%_50%] lg:object-center",
  },
  // 왼쪽이 짙은 검정 그라데이션. 시안의 사진 틀(375: 740px, 1024: 1024px 폭)에 걸린 값을
  // 화면에 보이는 구간으로 옮겼다.
  "stat-526": {
    image: cupFactoryImage,
    overlayClassName:
      "bg-linear-to-r from-[rgb(0_0_0/0.71)] to-[rgb(0_0_0/0.49)] lg:from-[rgb(0_0_0/0.81)] lg:to-[rgb(0_0_0/0.4)] lg:to-[97.27%]",
  },
  "stat-867": { image: greenTilesImage, overlayClassName: "bg-[rgb(0_0_0/0.2)]" },
};

// 운영자가 올린 사진 위에 덮는 색. 흰 글씨가 읽히도록 어둡게 한다.
const UPLOADED_OVERLAY = "bg-[rgb(0_0_0/0.4)]";

/*
 * 흰 면의 큰 숫자는 text-primary 위에 아래쪽부터 text-brand가 번지는 그라데이션 글자다.
 * 시안은 숫자 상자를 375에서 320px, 1024에서 글 폭(864px)으로 잡고 각도를 그 비율에 맞춰 두었다.
 * 모바일 상자가 글 폭(최대 600px)을 따라 넓어지면 파란 부분이 아래로 밀려 거의 검게 보여서 320px에 묶는다.
 */
const GRADIENT_VALUE_CLASS =
  "max-w-[20rem] bg-[linear-gradient(173.57deg,transparent_22.73%,var(--color-text-brand)_64.14%),linear-gradient(var(--color-text-primary),var(--color-text-primary))] bg-clip-text text-transparent lg:max-w-full lg:bg-[linear-gradient(176.91deg,transparent_22.73%,var(--color-text-brand)_64.14%),linear-gradient(var(--color-text-primary),var(--color-text-primary))]";

const TEXT_CLASS = {
  plain: {
    value: GRADIENT_VALUE_CLASS,
    lead: "text-text-primary",
    body: "text-text-secondary lg:text-text-primary",
    source: "text-text-tertiary",
  },
  photo: {
    value: "text-text-inverse",
    lead: "text-text-inverse",
    body: "text-text-inverse",
    source: "text-text-inverse lg:text-text-quaternary",
  },
};

/*
 * 흰 면과 사진 면이 섞여 나온다. 사진은 섹션을 덮도록 가운데를 자른다(16:9, 컵 공장만 3:2).
 * 글은 모바일 600px, 데스크톱 864px(1024 시안 폭)에 묶어 가운데 둔다. 1440 시안은 없다.
 * 큰 숫자는 화면에 들어오면 0부터 세어 올라간다(CountUp).
 * 글은 Studio에서 고치고 줄은 자동으로 나뉜다(시안의 수동 줄바꿈은 두지 않는다).
 */
export async function ImpactStatsSection() {
  const { cards } = await loadSection(IMPACT_STATS);

  return cards.map((card) => {
    const uploaded = toCroppedImage(card.photo);
    const codePhoto = uploaded ? undefined : CODE_PHOTOS[card._key];
    const hasPhoto = !!uploaded || !!codePhoto;
    const text = TEXT_CLASS[hasPhoto ? "photo" : "plain"];

    return (
      <section
        key={card._key}
        className="relative isolate overflow-hidden px-xl pt-5xl pb-3xl lg:px-6xl lg:py-7xl"
      >
        {uploaded && (
          <>
            <SanityImage
              image={uploaded}
              alt=""
              sizes="(min-width: 820px) 100vw, 820px"
              className="-z-10"
            />
            <div aria-hidden className={`absolute inset-0 -z-10 ${UPLOADED_OVERLAY}`} />
          </>
        )}
        {codePhoto && (
          <>
            <Image
              src={codePhoto.image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 820px) 100vw, 820px"
              className={`-z-10 object-cover ${codePhoto.imageClassName ?? ""}`}
            />
            <div aria-hidden className={`absolute inset-0 -z-10 ${codePhoto.overlayClassName}`} />
          </>
        )}

        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[54rem] lg:gap-3xl">
          <h2 className="flex flex-col gap-xs lg:gap-sm">
            <span
              className={`font-display-bold text-display-xl-b lg:text-display-xxl-b ${text.value}`}
            >
              <CountUp value={card.value} />
            </span>
            <span
              className={`text-detail-m-sb lg:max-w-[36rem] lg:text-title-s-b lg:text-balance ${text.lead}`}
            >
              {card.lead}
            </span>
          </h2>
          <div className="flex flex-col gap-sm lg:gap-md">
            <p className={`text-body-s-m lg:text-body-sm-r ${text.body}`}>{card.body}</p>
            <p className={`text-detail-ss-m lg:text-detail-m-m ${text.source}`}>{card.source}</p>
          </div>
        </div>
      </section>
    );
  });
}
