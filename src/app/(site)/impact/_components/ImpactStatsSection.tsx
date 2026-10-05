import Image, { type StaticImageData } from "next/image";
import { Fragment } from "react";

import cupFactoryImage from "@/assets/impact/stat-cup-factory.jpg";
import greenTilesImage from "@/assets/impact/stat-green-tiles.jpg";
import materialRollImage from "@/assets/impact/stat-material-roll.jpg";
import orangeCarpetImage from "@/assets/impact/stat-orange-carpet.jpg";

import { CountUp } from "./CountUp";

type Stat = {
  value: string;
  // 데스크톱 시안이 줄을 바꾸는 자리로 나눈다. 모바일은 이어서 흘린다.
  lead: string[];
  body: string;
  source: string;
  // 사진 면. 없으면 흰 면이다.
  photo?: {
    image: StaticImageData;
    // 사진 위에 덮는 색. 모두 Figma에서 변수 없이 쓴 값이다.
    overlayClassName: string;
    imageClassName?: string;
  };
};

const STATS: Stat[] = [
  {
    value: "35%",
    lead: [
      "사용법이 정해져 있지 않은 휴면자원 기반 활동에서",
      "아동의 주체성은 평균 35% 향상되었습니다.",
    ],
    body: "경쟁적 입시와 장시간 학습이 일상을 지배하는 한국에서, 여학생 10명 중 3명, 남학생 5명 중 1명 이상이 최근 1년 동안 2주 내내 일상생활을 중단할 정도의 슬픔이나 절망감을 경험했습니다.",
    source: "질병관리청, 2025년 청소년건강행태조사 주요 결과",
  },
  {
    value: "34%",
    lead: [
      "정답과 완성 형태가 정해져 있지 않은 휴면자원",
      "기반 활동에서 아동의 창의성은 평균 34% 향상되었습니다.",
    ],
    body: "한국 학생의 약 80%가 사교육에 참여하고 있으며, OECD는 이런 경쟁적 교육환경이 청소년의 정신건강과 삶의 만족도에 부담을 줄 수 있다고 지적하는 가운데, 아이가 정해진 답 밖에서 자유롭게 시도하고 실패할 시간도 점점 좁아질 수 있습니다.",
    source: "교육부, 초중고 사교육비 조사; OECD, Rejuvenating Korea",
    // 데스크톱 시안은 사진을 섹션을 덮는 크기보다 11% 키워 두었다(1145×644 틀).
    photo: {
      image: orangeCarpetImage,
      overlayClassName: "bg-[rgb(68_25_12/0.5)]",
      imageClassName: "lg:scale-[1.11]",
    },
  },
  {
    value: "49%",
    lead: [
      "정답이 없는 재료를 함께 탐색하고 구성하는 과정에서",
      "아동의 상호협력성은 평균 49% 향상되었습니다.",
    ],
    body: "전 세계 고용주의 61%가 리더십과 사회적 영향력을 핵심 역량으로 꼽았고, AI가 확산될수록 협업을 포함한 인간 중심 역량은 기술과 함께 더 중요해지고 있습니다.",
    source: "World Economic Forum, The Future of Jobs Report 2025",
    // 모바일 시안은 사진 오른쪽(심지가 보이는 쪽)을 보여 준다.
    photo: {
      image: materialRollImage,
      overlayClassName: "bg-[rgb(62_56_51/0.5)]",
      imageClassName: "object-[96%_50%] lg:object-center",
    },
  },
  {
    value: "88톤",
    lead: [
      "ZAONE은 지금까지 약 88톤의 휴면자원을",
      "폐기 경로에서 꺼내 교육·문화·사회적 자원으로 다시 사용했습니다.",
    ],
    // TODO: "비중에 계속 증가해"는 "비중이"의 오타로 보인다. 시안 문구를 그대로 두었다.
    body: "한국의 사업장 배출시설에서는 생산공정 상에서 매년 약 8,400만 톤의 폐기물이 발생하며, 산업 성장과 함께 사업장 폐기물의 비중에 계속 증가해 2020년에는 국가 전체 폐기물의 41.4%를 차지했습니다.",
    source: "환경부, 전국 폐기물 발생 및 처리 현황",
  },
  {
    value: "52.6%",
    lead: [
      "휴면자원을 직접 경험한 임직원은 자사에서 발생하는 폐기물을",
      "사회적 가치로 전환할 수 있는 자원으로 보기 시작했고,",
      "참여자의 52.6%는 폐기물 문제를 제품 설계 단계에서부터 줄여야 한다고 답했습니다.",
    ],
    body: "전 세계 온실가스 배출의 55% 이상은 자원을 채굴하고 가공하는 과정에서 발생하며, 고소득 국가는 저소득 국가보다 1인당 6배 많은 자원을 사용하고 10배 큰 기후영향을 만들어냅니다.",
    source: "UNEP, Global Resources Outlook 2024",
    // 왼쪽이 짙은 검정 그라데이션. 시안의 사진 틀(375: 740px, 1024: 1024px 폭)에 걸린 값을
    // 화면에 보이는 구간으로 옮겼다.
    photo: {
      image: cupFactoryImage,
      overlayClassName:
        "bg-linear-to-r from-[rgb(0_0_0/0.71)] to-[rgb(0_0_0/0.49)] lg:from-[rgb(0_0_0/0.81)] lg:to-[rgb(0_0_0/0.4)] lg:to-[97.27%]",
    },
  },
  {
    value: "86.7%",
    lead: [
      "휴면자원 프로그램에 참여한 임직원의 86.7%는 제조공정에서 남은 재료가",
      "폐기물이 아니라 교육재료로 전환될 수 있다는 가능성을 인식했습니다.",
    ],
    body: "산업폐기물은 대부분 폐기·재활용의 대상으로 관리되고 있지만, 교육·문화·지역사회가 사용할 수 있는 사회적 자원으로 전환하는 경로는 아직 드뭅니다.",
    source: "ZAONE 임팩트 잠재력 오버뷰 2025 (임팩트 리서치랩 측정)",
    photo: { image: greenTilesImage, overlayClassName: "bg-[rgb(0_0_0/0.2)]" },
  },
  {
    value: "63%",
    lead: [
      "휴면자원을 활용한 교육에 60시간 이상 참여한 학습자의",
      "환경행동 역량은 비교집단보다 63% 높게 나타났습니다.",
    ],
    body: "전 세계 중등 교육과정의 69%는 기후변화를 언급하지 않았고, UNESCO는 현재의 기후교육 역시 지식 전달에 치우쳐 행동으로 이어지는 학습이 부족하다고 지적합니다.",
    source:
      "UNESCO, Climate change and sustainability in science and social science secondary school curricula",
  },
];

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
 * 데스크톱에서만 줄을 바꾸는 자리는 공백을 다음 줄 글과 한 덩어리로 둔다. 공백만 따로 있으면 숨긴 <br> 옆에서
 * 화면 낭독기가 그 공백을 빼고 읽어 "활동에서아동의"처럼 낱말이 붙는다.
 */
export function ImpactStatsSection() {
  return STATS.map((stat) => {
    const text = TEXT_CLASS[stat.photo ? "photo" : "plain"];

    return (
      <section
        key={stat.lead[0]}
        className="relative isolate overflow-hidden px-xl pt-5xl pb-3xl lg:px-6xl lg:py-7xl"
      >
        {stat.photo && (
          <>
            <Image
              src={stat.photo.image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 820px) 100vw, 820px"
              className={`-z-10 object-cover ${stat.photo.imageClassName ?? ""}`}
            />
            <div aria-hidden className={`absolute inset-0 -z-10 ${stat.photo.overlayClassName}`} />
          </>
        )}

        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[54rem] lg:gap-3xl">
          <h2 className="flex flex-col gap-xs lg:gap-sm">
            <span
              className={`font-display-bold text-display-xl-b lg:text-display-xxl-b ${text.value}`}
            >
              <CountUp value={stat.value} />
            </span>
            <span className={`text-detail-m-sb lg:text-title-s-b ${text.lead}`}>
              {stat.lead.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 && <br className="hidden lg:inline" />}
                  {index > 0 ? ` ${line}` : line}
                </Fragment>
              ))}
            </span>
          </h2>
          <div className="flex flex-col gap-sm lg:gap-md">
            <p className={`text-body-s-m lg:text-body-sm-r ${text.body}`}>{stat.body}</p>
            <p className={`text-detail-ss-m lg:text-detail-m-m ${text.source}`}>{stat.source}</p>
          </div>
        </div>
      </section>
    );
  });
}
