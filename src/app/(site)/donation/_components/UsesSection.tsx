import Image, { type StaticImageData } from "next/image";

import forumScreeningImage from "@/assets/donation/use-forum-screening.jpg";
import labSpaceImage from "@/assets/donation/use-lab-space.jpg";
import particleboardImage from "@/assets/donation/use-particleboard-stack.jpg";
import { coverScale, SanityImage } from "@/components/post/SanityImage";
import { type CroppedImage, toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { DONATION_USES, type DonationStat, type DonationUse } from "@/sanity/sections/donation";

import { BalancedLines } from "./BalancedLines";

type CodePhoto = { image: StaticImageData; className?: string };

/*
 * 기본 카드 세 장의 코드 사진(카드의 _key로 찾는다). 운영자가 사진을 올린 카드는 그 사진을 쓴다.
 * 자르는 위치는 시안 값이다. 시안이 사진 틀을 2% 안팎 키워 둔 곳(lab 375, stories 375)은 그대로 덮었다.
 * 시안의 lab 사진 아래에는 다른 사진(히어로후보 5)이 깔려 있지만 완전히 가려져 넣지 않았다.
 */
const CODE_PHOTOS: Record<string, CodePhoto> = {
  // 1024: 600px 정사각 틀에서 원본 왼쪽 133px을 잘라 둔다. 375: 틀을 4% 키우고 아래쪽에 맞춘다.
  materials: {
    image: particleboardImage,
    className: "scale-[1.043] object-[50%_100%] lg:scale-100 lg:object-[43.5%_50%]",
  },
  // 1024: 원본 왼쪽 108px을 잘라 둔다.
  lab: { image: labSpaceImage, className: "lg:object-[33.75%_50%]" },
  // 1024: 틀을 7% 키우고 원본 왼쪽 171px을 잘라 둔다.
  stories: { image: forumScreeningImage, className: "lg:scale-[1.07] lg:object-[44%_50%]" },
};

// 숫자(1,000·5.2 등)와 그 밖의 글자를 나눈다. 숫자는 Axiforma로 크게, 단위 글자는 Pretendard로 작게 그린다.
function splitValue(value: string) {
  return value
    .split(/(\d[\d,.]*)/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ text, isNumber: /^\d/.test(text) }));
}

/*
 * 수치가 하나면 크게, 여럿이면 한 줄에 나란히 작게 놓는다. 이름의 줄바꿈은 기본값에 담아 둔 시안의 줄이다.
 * 숫자 크기는 Figma에서 스타일 없이 쓴 값이라 직접 적는다: 하나일 때 375 36px(Display-LL-B)·1024 50px(Display-XL-B),
 * 여럿일 때 375 28px·1024 32px. 1024 시안의 셋째 카드만 28px인데 여럿일 때 크기를 하나로 맞췄다.
 */
function StatList({ stats }: { stats: DonationStat[] }) {
  const single = stats.length === 1;

  return (
    <dl className={single ? "flex flex-col" : "flex justify-between gap-sm"}>
      {stats.map((stat) => (
        <div key={stat._key} className="flex flex-col gap-s lg:gap-sm">
          <dt className="text-detail-xs-sb whitespace-pre-line text-text-tertiary lg:text-body-s-sb">
            {stat.label}
          </dt>
          <dd
            className={`flex items-center whitespace-nowrap text-text-primary ${single ? "gap-s" : "gap-xs"}`}
          >
            {splitValue(stat.value).map((part, index) =>
              part.isNumber ? (
                <span
                  key={index}
                  className={`font-display-bold leading-[1.4] font-bold tracking-[-0.8px] ${single ? "text-[2.25rem] lg:text-[3.125rem] lg:leading-[1.3]" : "text-[1.75rem] lg:text-[2rem]"}`}
                >
                  {part.text}
                </span>
              ) : (
                <span
                  key={index}
                  className={
                    single
                      ? "text-title-m-b lg:text-title-mm-b"
                      : "text-title-s-b lg:text-title-mm-b"
                  }
                >
                  {part.text}
                </span>
              ),
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/*
 * 운영자가 올린 사진이 그려지는 폭. 사진이 틀보다 가로로 길면 틀 높이가 폭을 정한다. 데스크톱 틀은 1024에서
 * 580×600이고 화면이 넓어지면 가로로 길어지는데, 가장 좁은 틀(1024) 기준으로 넉넉히 받는다.
 */
function uploadedSizes(image: CroppedImage): string {
  const desktop = coverScale(image, 580 / 600);
  const mobile = coverScale(image, 375 / 246);
  return `(min-width: 1024px) ${Math.ceil(59 * desktop)}vw, ${Math.ceil(100 * mobile)}vw`;
}

/*
 * 카드 한 장. 모바일은 글 아래에 사진을 화면 폭(375:246)으로 둔다. 데스크톱은 사진(600px 높이)과 글이 나란히 놓이고,
 * 사진이 왼쪽·오른쪽으로 번갈아 화면 끝에 붙는다. 사진 칸은 1024 시안의 폭(580px, 첫 카드만 600px 정사각)을
 * 화면 폭에 대한 비율로 늘리고, 글은 480px에 묶는다(1440 시안은 없다).
 * 첫 카드는 데스크톱에서 위 여백 없이 제목 섹션에 붙고, 마지막 카드는 모바일에서 아래 여백 없이 사진이 끝에 붙는다.
 */
function UseCard({ card, index, last }: { card: DonationUse; index: number; last: boolean }) {
  const first = index === 0;
  const imageOnLeft = index % 2 === 0;
  const uploaded = toCroppedImage(card.photo);
  const codePhoto = uploaded ? undefined : CODE_PHOTOS[card._key];

  return (
    <article
      className={`flex flex-col gap-xl px-xl pt-2xl lg:items-center lg:gap-4xl lg:px-0 lg:py-6xl ${last ? "pb-0" : "pb-2xl"} ${first ? "lg:pt-0" : ""} ${imageOnLeft ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      {/* 화면 끝 쪽 여백(40px)은 글 칸에 둔다. 카드에 두면 사진 칸 비율이 여백을 뺀 폭을 기준으로 줄어든다. */}
      <div className={`lg:min-w-0 lg:flex-1 ${imageOnLeft ? "lg:pr-3xl" : "lg:pl-3xl"}`}>
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-4xl lg:mx-0 lg:max-w-[30rem] lg:gap-6xl">
          <div className="flex flex-col gap-md lg:gap-xl">
            <h3 className="text-title-s-b text-balance text-text-primary lg:text-title-lm-b">
              <BalancedLines text={card.title} />
            </h3>
            <p className="text-body-xs-m text-text-secondary lg:text-body-sm-r lg:text-text-primary">
              {card.body}
            </p>
          </div>
          {card.stats.length > 0 && <StatList stats={card.stats} />}
        </div>
      </div>

      <div
        className={`relative -mx-xl aspect-[375/246] overflow-hidden lg:mx-0 lg:aspect-auto lg:h-[600px] lg:shrink-0 ${first ? "lg:w-[58.59%]" : "lg:w-[56.64%]"}`}
      >
        {uploaded && (
          <SanityImage image={uploaded} alt={card.imageAlt} sizes={uploadedSizes(uploaded)} />
        )}
        {codePhoto && (
          <Image
            src={codePhoto.image}
            alt={card.imageAlt}
            fill
            placeholder="blur"
            sizes="(min-width: 1660px) 59vw, (min-width: 1024px) 963px, 105vw"
            className={`object-cover ${codePhoto.className ?? ""}`}
          />
        )}
      </div>
    </article>
  );
}

// 제목은 흰 바탕, 카드는 회색 바탕이다. 글·수치·사진은 Studio에서 고치고 카드를 더하거나 뺄 수 있다.
export async function UsesSection() {
  const { title, cards } = await loadSection(DONATION_USES);

  return (
    <>
      <section className="px-xl pt-5xl pb-3xl lg:px-6xl lg:pt-7xl lg:pb-6xl">
        <h2 className="mx-auto max-w-[37.5rem] text-center text-body-s-sb text-balance text-text-primary lg:max-w-[54rem] lg:text-body-l-b">
          {title}
        </h2>
      </section>
      <div className="bg-bg-surface">
        {cards.map((card, index) => (
          <UseCard key={card._key} card={card} index={index} last={index === cards.length - 1} />
        ))}
      </div>
    </>
  );
}
