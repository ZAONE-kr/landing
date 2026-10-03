import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

import { GiveOrUseScroll } from "./GiveOrUseScroll";
import { ScrollToLink } from "./ScrollToLink";

type Panel = {
  side: "give" | "use";
  title: [string, string];
  description: string;
  checks: string[];
  // 같은 페이지의 자주 묻는 질문 섹션 id.
  faqHref: `#${string}`;
  buttons: { label: string; href: string; variant: "solid" | "inverse" }[];
  buttonClassName: string;
  // 데스크톱에서 접혔을 때 아래에 크게 놓이는 영문 낱말.
  word: string;
  className: {
    panel: string;
    // 데스크톱에서 펼친 내용과 큰 낱말의 투명도, 접혔을 때 내용을 누르지 못하게 하는 조건.
    content: string;
    word: string;
    title: string;
    description: string;
    checks: string;
    check: string;
    faqLink: string;
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
      panel: "bg-[#eaf2ff] lg:w-(--give-width) lg:shrink-0 lg:pr-3xl lg:pl-6xl",
      content: "lg:opacity-(--give-fade) lg:group-data-[active=use]/split:pointer-events-none",
      word: "text-[#cddaf0] lg:opacity-(--use-fade)",
      title: "text-text-primary",
      description: "text-text-secondary lg:text-text-primary",
      checks: "bg-bg-overlay-a8",
      check: "text-text-tertiary",
      faqLink: "text-text-brand",
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
      panel: "bg-bg-navy lg:min-w-0 lg:flex-1 lg:pr-6xl lg:pl-3xl",
      content: "lg:opacity-(--use-fade) lg:group-data-[active=give]/split:pointer-events-none",
      word: "text-[#1e3f89] lg:opacity-(--give-fade)",
      title: "text-text-inverse",
      description: "text-text-inverse",
      checks: "bg-[rgb(18_27_36/0.32)]",
      check: "text-text-quaternary",
      faqLink: "text-text-inverse",
    },
  },
];

/*
 * 모바일은 두 면을 위아래로 다 펼친다. 데스크톱은 섹션이 화면에 고정된 동안 스크롤에 따라 공급 면(1024 시안)에서
 * 사용 면(1024 831:8890, 1440 831:9441 시안)으로 펼친 면이 점점 바뀐다. 고정과 진행도는 GiveOrUseScroll이 맡는다.
 * 펼친 내용은 펼쳤을 때의 폭으로 고정해 두어 면 폭이 바뀌어도 줄이 다시 나뉘지 않고, 좁아지는 면에서 잘린다.
 */
function GiveOrUsePanel({ panel }: { panel: Panel }) {
  const { className } = panel;

  return (
    <div
      data-side={panel.side}
      className={`relative flex flex-col gap-xl overflow-hidden px-xl py-3xl lg:gap-2xl lg:pt-7xl lg:pb-6xl ${className.panel}`}
    >
      <h2 className={`text-title-m-b lg:text-body-l-eb ${className.title}`}>
        {panel.title[0]}
        <br className="hidden lg:inline" /> {panel.title[1]}
      </h2>

      <div
        className={`flex flex-col items-center gap-2xl lg:w-(--content-width) lg:shrink-0 lg:gap-5xl ${className.content}`}
      >
        <div className="flex w-full flex-col gap-xl">
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
              <ScrollToLink
                href={panel.faqHref}
                className={`text-detail-ss-m underline lg:text-body-s-m ${className.faqLink}`}
              >
                자주묻는 질문 보러가기
              </ScrollToLink>
            </li>
          </ul>
        </div>

        {/* 모바일에서 버튼 줄(334px)이 글 폭(327px)보다 넓어 좌우로 조금 나간다(375 시안). 더 좁으면 줄을 바꾼다. */}
        <div className="-mx-s flex flex-wrap justify-center gap-s lg:mx-0 lg:flex-col lg:items-center lg:gap-xl">
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
      </div>

      {/* 1440 사용 면 시안의 GIVE는 100px이지만, 1024 시안과 USE에 맞춰 110px로 둔다. */}
      <p
        aria-hidden
        className={`pointer-events-none absolute top-[560px] left-3xl hidden font-display text-[6.875rem] leading-[1.4] tracking-[-2.4041px] lg:block ${className.word}`}
      >
        {panel.word}
      </p>
    </div>
  );
}

/*
 * 데스크톱 폭 계산(섹션 폭 = 100cqw):
 * - 접힌 면은 1024 시안 322px에서 1440 시안 480px까지 화면 폭에 비례해 늘고 그 뒤로는 480px이다.
 * - 공급 면은 진행도 0에서 (섹션 폭 - 접힌 폭), 1에서 접힌 폭이다. 사용 면이 나머지를 채운다.
 * - 펼친 내용 폭은 펼친 면 폭에서 좌우 여백(80 + 40px)을 뺀 값이다.
 * - 펼친 내용은 진행도 앞 절반에 사라지고, 다른 면 내용은 뒤 절반에 나타난다.
 * 섹션 높이(816px)는 두 상태 중 더 긴 쪽(사용 면을 펼친 시안)에 맞춰 두어 전환 중에도 그대로다.
 */
export function GiveOrUseSection() {
  return (
    <GiveOrUseScroll className="group/split @container flex flex-col [--collapsed:clamp(20.125rem,calc(38cqw-4.195rem),30rem)] [--content-width:calc(100cqw-var(--collapsed)-7.5rem)] [--give-fade:clamp(0,calc(1-2*var(--p)),1)] [--give-width:calc(var(--collapsed)+(100cqw-2*var(--collapsed))*(1-var(--p)))] [--p:0] [--use-fade:clamp(0,calc(2*var(--p)-1),1)] lg:min-h-[51rem] lg:flex-row">
      {PANELS.map((panel) => (
        <GiveOrUsePanel key={panel.side} panel={panel} />
      ))}
    </GiveOrUseScroll>
  );
}
