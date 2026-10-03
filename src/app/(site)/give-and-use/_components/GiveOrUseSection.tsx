import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

type Side = "give" | "use";

type Panel = {
  side: Side;
  title: [string, string];
  description: string;
  checks: string[];
  faqHref: string;
  buttons: { label: string; href: string; variant: "solid" | "inverse" }[];
  buttonClassName: string;
  // 데스크톱에서 접혔을 때 아래에 크게 놓이는 영문 낱말.
  word: string;
  className: {
    panel: string;
    title: string;
    description: string;
    checks: string;
    check: string;
    faqLink: string;
    word: string;
  };
};

// TODO: 문의·신청 버튼이 갈 곳을 아직 받지 못해 문의하기 페이지로 보낸다. 폼이나 주소를 받으면 바꾼다.
const PANELS: Panel[] = [
  {
    side: "give",
    title: ["휴면자원을", "가지고 있다면"],
    description:
      "생산 과정에서 발생한 부산물, 규격 외 용품, 불량, 재고 등 휴면자원을 공급할 수 있습니다. 자원의 종류와 상태, 수량, 발생 주기를 확인한 뒤 교육 재료로 활용할 수 있는지 검토하고 운송 방식을 협의합니다.",
    checks: [
      "휴면자원의 검토와 공급에는 별도의 비용이 들지 않습니다.",
      "관련 법령과 기준에 따라 현물기부로 처리하여 기부금 영수증을 발급할 수 있습니다.",
    ],
    faqHref: "#how-to-give",
    buttons: [{ label: "휴면자원 공급 문의하기", href: "/contact", variant: "solid" }],
    buttonClassName: "px-2xl py-md text-body-xs-b lg:px-6xl lg:py-xl lg:text-body-sm-b",
    word: "GIVE",
    // 배경 #eaf2ff는 Figma의 bg/brand-soft2다. 파란색 primitive 이름 정리 후 토큰이 생기면 바꾼다.
    // 데스크톱 시안은 본문을 text-primary로 한 단계 진하게 쓴다.
    // 접힌 낱말 색 #cddaf0은 Figma에서 변수 없이 쓴 값이다.
    className: {
      panel: "bg-[#eaf2ff] lg:pr-3xl lg:pl-6xl",
      title: "text-text-primary",
      description: "text-text-secondary lg:text-text-primary",
      checks: "bg-bg-overlay-a8",
      check: "text-text-tertiary",
      faqLink: "text-text-brand",
      word: "text-[#cddaf0]",
    },
  },
  {
    side: "use",
    title: ["휴면자원을", "사용하고 싶다면"],
    description:
      "학교와 교육·돌봄기관, 복지기관, 도서관·문화공간은 기관 단위 멤버십을 통해 ZAONE LAB을 이용할 수 있습니다. 재료를 직접 탐색하고 선택해 수업, 놀이, 탐구, 제작, 워크숍에 활용합니다.",
    // 첫 줄은 375 시안("운영되며 유료입니다")과 1024 시안이 다르다. 나중에 만든 1024 시안을 따른다.
    checks: [
      "멤버십은 기관 단위로 운영되는 유료 서비스입니다.",
      "재료를 교육적으로 활용할 수 있도록 교사·기관 대상 교육과 훈련 프로그램을 운영합니다.",
    ],
    faqHref: "#how-to-use",
    buttons: [
      { label: "기관 멤버십 신청하기", href: "/contact", variant: "solid" },
      { label: "교육·훈련 프로그램 보기", href: "/zaone-lab", variant: "inverse" },
    ],
    buttonClassName: "px-xl py-md text-body-xs-b lg:w-[316px] lg:px-6xl lg:py-xl lg:text-body-sm-b",
    word: "USE",
    // 모바일 점검 목록 배경(neutral-950 32%)과 접힌 낱말 색 #1e3f89는 Figma에서 변수 없이 쓴 값이다.
    className: {
      panel: "bg-bg-navy lg:pr-6xl lg:pl-3xl",
      title: "text-text-inverse",
      description: "text-text-inverse",
      checks: "bg-[rgb(18_27_36/0.32)]",
      check: "text-text-quaternary",
      faqLink: "text-text-inverse",
      word: "text-[#1e3f89]",
    },
  },
];

/*
 * 모바일은 두 면을 위아래로 다 펼친다. 데스크톱은 한 면만 펼치고, 다른 면은 제목과 큰 영문 낱말만 남긴다.
 * 접힌 면 폭은 1024 시안 322px에서 1440 시안 480px까지 화면 폭에 비례해 늘고, 펼친 면이 나머지를 채운다.
 * 섹션 높이(816px)는 두 상태 중 더 긴 쪽(사용 면을 펼친 시안)에 맞춰 두어 펼치는 면이 바뀌어도 그대로다.
 */
function GiveOrUsePanel({ panel, expanded }: { panel: Panel; expanded: boolean }) {
  const { className } = panel;
  const desktopHidden = expanded ? "" : "lg:hidden";

  return (
    <div
      className={`relative flex flex-col items-center gap-2xl overflow-hidden px-xl py-3xl lg:gap-5xl lg:pt-7xl lg:pb-6xl ${expanded ? "lg:flex-1" : "lg:w-[clamp(20.125rem,calc(38vw-4.195rem),30rem)] lg:shrink-0"} ${className.panel}`}
    >
      <div className="flex w-full flex-col gap-xl lg:gap-2xl">
        <h2 className={`text-title-m-b lg:text-body-l-eb ${className.title}`}>
          {panel.title[0]}
          <br className="hidden lg:inline" /> {panel.title[1]}
        </h2>
        <div className={`flex flex-col gap-xl ${desktopHidden}`}>
          <p className={`text-body-s-m lg:text-body-sm-r ${className.description}`}>
            {panel.description}
          </p>
          <ul
            className={`flex flex-col gap-2.5 rounded-md p-md lg:rounded-none lg:bg-transparent lg:py-0 lg:pr-0 lg:pl-sm ${className.checks}`}
          >
            {panel.checks.map((check) => (
              <li key={check} className="flex items-center gap-sm">
                <CheckIcon className="size-5 shrink-0 text-icon-secondary lg:size-6" />
                <span className={`text-body-xs-m lg:text-body-s-m ${className.check}`}>
                  {check}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-sm">
              <CheckIcon className="size-5 shrink-0 text-icon-secondary lg:size-6" />
              <Link
                href={panel.faqHref}
                className={`text-detail-ss-m underline lg:text-body-s-m ${className.faqLink}`}
              >
                자주묻는 질문 보러가기
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 모바일에서 버튼 줄(334px)이 글 폭(327px)보다 넓어 좌우로 조금 나간다(375 시안). 더 좁으면 줄을 바꾼다. */}
      <div
        className={`-mx-s flex flex-wrap justify-center gap-s lg:mx-0 lg:flex-col lg:items-center lg:gap-xl ${desktopHidden}`}
      >
        {panel.buttons.map((button) => (
          <Button
            key={button.label}
            href={button.href}
            variant={button.variant}
            className={panel.buttonClassName}
          >
            {button.label}
          </Button>
        ))}
      </div>

      {!expanded && (
        <p
          aria-hidden
          className={`absolute top-[560px] left-3xl hidden font-display text-[6.875rem] leading-[1.4] tracking-[-2.4041px] lg:block ${className.word}`}
        >
          {panel.word}
        </p>
      )}
    </div>
  );
}

// TODO: 펼치는 면을 바꾸는 인터랙션은 디자인 요청을 받아 붙인다. 지금은 1024 시안처럼 공급 면을 펼쳐 둔다.
export function GiveOrUseSection({ active = "give" }: { active?: Side }) {
  return (
    <section className="flex flex-col lg:min-h-[51rem] lg:flex-row">
      {PANELS.map((panel) => (
        <GiveOrUsePanel key={panel.side} panel={panel} expanded={panel.side === active} />
      ))}
    </section>
  );
}
