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

type Supporter = {
  name: string;
  src: StaticImageData;
  // 206×80 칸 안에서 로고를 놓은 자리 [left, top, width, height](px, 데스크톱 시안).
  // 모바일 시안은 정확히 절반 크기라 %로 바꿔 두 화면에 같이 쓴다.
  box: [number, number, number, number];
};

const SUPPORTERS: Supporter[] = [
  { name: "삼성서울병원", src: samsungMedicalCenter, box: [0, 14, 206, 53] },
  { name: "유한킴벌리", src: yuhanKimberly, box: [18, -45, 170, 170] },
  { name: "아름다운가게", src: beautifulStore, box: [23, 21, 160, 38] },
  { name: "초록우산", src: childfundKorea, box: [26, 17, 155, 47] },
  { name: "서울특별시", src: seoul, box: [30, 16, 146, 44] },
  { name: "월드비전", src: worldVision, box: [27, 8, 160, 59] },
  { name: "루트임팩트", src: rootImpact, box: [3, 21, 200, 39] },
  { name: "하기스", src: huggies, box: [34.5, 14, 141, 53] },
  { name: "아모레퍼시픽", src: amorepacific, box: [8, 23, 190, 34] },
  { name: "NHN", src: nhn, box: [38, 25, 130, 31] },
  { name: "퍼시스 그룹", src: fursysGroup, box: [3, 22, 200, 37] },
  { name: "현대트랜시스", src: hyundaiTransys, box: [3, 25, 200, 31] },
  { name: "현대", src: hyundai, box: [13, 28.35, 180, 24.3] },
  { name: "다우닝", src: dauning, box: [28, 15, 150, 51] },
];

function SupporterList({ inert }: { inert?: boolean }) {
  return (
    <ul inert={inert} className="flex shrink-0 gap-lg pr-lg lg:gap-4xl lg:pr-4xl">
      {SUPPORTERS.map(({ name, src, box: [left, top, width, height] }) => (
        <li
          key={name}
          className="relative h-10 w-[103px] shrink-0 overflow-hidden lg:h-20 lg:w-[206px]"
        >
          <div
            className="absolute"
            style={{
              left: `${(left / 206) * 100}%`,
              top: `${(top / 80) * 100}%`,
              width: `${(width / 206) * 100}%`,
              height: `${(height / 80) * 100}%`,
            }}
          >
            <Image
              src={src}
              alt={name}
              fill
              sizes="(min-width: 1024px) 206px, 103px"
              className="object-cover"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// 목록을 두 벌 이어 붙여 무한으로 흘린다. 두 번째 벌은 inert로 스크린리더에서 뺀다.
export function SupporterMarquee() {
  return (
    <section aria-label="함께하는 기관" className="overflow-hidden py-xl pl-lg lg:pl-6xl">
      <div className="flex w-max motion-safe:animate-supporters-marquee">
        <SupporterList />
        <SupporterList inert />
      </div>
    </section>
  );
}
