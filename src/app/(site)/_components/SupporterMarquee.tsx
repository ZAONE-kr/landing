import Image, { type StaticImageData } from "next/image";

import amorepacific from "@/assets/supporters/amorepacific.png";
import beautifulStore from "@/assets/supporters/beautiful-store.png";
import childfundKorea from "@/assets/supporters/childfund-korea.jpg";
import dauning from "@/assets/supporters/dauning.png";
import fursysGroup from "@/assets/supporters/fursys-group.png";
import huggies from "@/assets/supporters/huggies.png";
import hyundaiTransys from "@/assets/supporters/hyundai-transys.png";
import hyundai from "@/assets/supporters/hyundai.png";
import nhn from "@/assets/supporters/nhn.png";
import rootImpact from "@/assets/supporters/root-impact.png";
import samsungMedicalCenter from "@/assets/supporters/samsung-medical-center.jpg";
import seoul from "@/assets/supporters/seoul.png";
import worldVision from "@/assets/supporters/world-vision.jpg";
import yuhanKimberly from "@/assets/supporters/yuhan-kimberly.png";
import { SanityImage } from "@/components/post/SanityImage";
import { toCroppedImage } from "@/sanity/lib/image";
import { loadSection } from "@/sanity/lib/sections";
import { HOME_SUPPORTERS, type Supporter } from "@/sanity/sections/home";

type CodeLogo = {
  src: StaticImageData;
  // 206×80 칸 안에서 로고를 놓은 자리 [left, top, width, height](px, 데스크톱 시안).
  // 모바일 시안은 정확히 절반 크기라 %로 바꿔 두 화면에 같이 쓴다.
  box: [number, number, number, number];
};

/*
 * 기본 기관 열네 곳의 코드 로고와 놓은 자리(카드의 _key로 찾는다). 로고마다 눈대중으로 맞춘 자리다. 기관 이름·순서·개수는
 * Studio의 "함께하는 기관 로고"에서 고치고, 운영자가 올린 로고는 여백을 이미 둔 206:80 비율 이미지라 칸 안에 통째로 보인다.
 */
const CODE_LOGOS: Record<string, CodeLogo> = {
  "samsung-medical-center": { src: samsungMedicalCenter, box: [0, 14, 206, 53] },
  "yuhan-kimberly": { src: yuhanKimberly, box: [18, -45, 170, 170] },
  "beautiful-store": { src: beautifulStore, box: [23, 21, 160, 38] },
  "childfund-korea": { src: childfundKorea, box: [26, 17, 155, 47] },
  seoul: { src: seoul, box: [30, 16, 146, 44] },
  "world-vision": { src: worldVision, box: [27, 8, 160, 59] },
  "root-impact": { src: rootImpact, box: [3, 21, 200, 39] },
  huggies: { src: huggies, box: [34.5, 14, 141, 53] },
  amorepacific: { src: amorepacific, box: [8, 23, 190, 34] },
  nhn: { src: nhn, box: [38, 25, 130, 31] },
  "fursys-group": { src: fursysGroup, box: [3, 22, 200, 37] },
  "hyundai-transys": { src: hyundaiTransys, box: [3, 25, 200, 31] },
  hyundai: { src: hyundai, box: [13, 28.35, 180, 24.3] },
  dauning: { src: dauning, box: [28, 15, 150, 51] },
};

function SupporterList({ supporters, inert }: { supporters: Supporter[]; inert?: boolean }) {
  return (
    <ul inert={inert} className="flex shrink-0 gap-lg pr-lg lg:gap-4xl lg:pr-4xl">
      {supporters.map((supporter) => {
        const uploaded = toCroppedImage(supporter.photo);
        const code = CODE_LOGOS[supporter._key];
        return (
          <li
            key={supporter._key}
            className="relative h-10 w-[103px] shrink-0 overflow-hidden lg:h-20 lg:w-[206px]"
          >
            {uploaded ? (
              <SanityImage
                image={uploaded}
                alt={supporter.name}
                sizes="(min-width: 1024px) 206px, 103px"
                fit="contain"
              />
            ) : (
              code && (
                <div
                  className="absolute"
                  style={{
                    left: `${(code.box[0] / 206) * 100}%`,
                    top: `${(code.box[1] / 80) * 100}%`,
                    width: `${(code.box[2] / 206) * 100}%`,
                    height: `${(code.box[3] / 80) * 100}%`,
                  }}
                >
                  <Image
                    src={code.src}
                    alt={supporter.name}
                    fill
                    sizes="(min-width: 1024px) 206px, 103px"
                    className="object-cover"
                  />
                </div>
              )
            )}
          </li>
        );
      })}
    </ul>
  );
}

// 목록을 두 벌 이어 붙여 무한으로 흘린다. 두 번째 벌은 inert로 스크린리더에서 뺀다.
export async function SupporterMarquee() {
  const { cards } = await loadSection(HOME_SUPPORTERS);

  return (
    <section aria-label="함께하는 기관" className="overflow-hidden py-xl pl-lg lg:pl-6xl">
      <div className="flex w-max motion-safe:animate-supporters-marquee">
        <SupporterList supporters={cards} />
        <SupporterList supporters={cards} inert />
      </div>
    </section>
  );
}
