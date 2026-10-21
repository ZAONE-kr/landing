import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { linkTargetProps } from "@/lib/links";
import { loadSection } from "@/sanity/lib/sections";
import { GIVE_PANEL, USE_PANEL } from "@/sanity/sections/giveAndUse";

import { GiveOrUseScroll } from "./GiveOrUseScroll";
import { ScrollToLink } from "./ScrollToLink";

type PanelText = {
  title: string;
  description: string;
  checks: string[];
  faqLabel: string;
  buttons: { label: string; href: string }[];
};

type Panel = {
  side: "give" | "use";
  // 같은 페이지의 자주 묻는 질문 섹션 id.
  faqHref: `#${string}`;
  // 버튼의 모양. 글과 주소는 Studio에서 고친 내용(PanelText)에서 같은 순서로 온다.
  buttonVariants: ("solid" | "inverse")[];
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

const PANELS: Panel[] = [
  {
    side: "give",
    faqHref: "#how-to-give",
    buttonVariants: ["solid"],
    buttonClassName: "px-2xl py-md text-body-xs-b lg:px-6xl lg:py-xl lg:text-body-sm-b",
    word: "GIVE",
    // 배경 #eaf2ff는 Figma의 bg/brand-soft2다. 파란색 primitive 이름 정리 후 토큰이 생기면 바꾼다.
    // 데스크톱 시안은 본문을 text-primary로 한 단계 진하게 쓴다.
    // 접힌 낱말 색 #cddaf0은 Figma에서 변수 없이 쓴 값이다.
    className: {
      panel: "bg-[#eaf2ff] lg:w-(--give-width) lg:shrink-0 lg:pr-3xl lg:pl-6xl",
      content: "lg:opacity-(--give-fade) lg:group-data-[active=use]/split:pointer-events-none",
      word: "text-[#cddaf0] lg:opacity-(--give-word-fade)",
      title: "text-text-primary",
      description: "text-text-secondary lg:text-text-primary",
      checks: "bg-bg-overlay-a8",
      check: "text-text-tertiary",
      faqLink: "text-text-brand",
    },
  },
  {
    side: "use",
    faqHref: "#how-to-use",
    buttonVariants: ["solid", "inverse"],
    buttonClassName: "px-xl py-md text-body-xs-b lg:w-[316px] lg:px-6xl lg:py-xl lg:text-body-sm-b",
    word: "USE",
    // 모바일 점검 목록 배경(neutral-950 32%)과 접힌 낱말 색 #1e3f89는 Figma에서 변수 없이 쓴 값이다.
    className: {
      panel: "bg-bg-navy lg:min-w-0 lg:flex-1 lg:pr-6xl lg:pl-3xl",
      content: "lg:opacity-(--use-fade) lg:group-data-[active=give]/split:pointer-events-none",
      word: "text-[#1e3f89] lg:opacity-(--use-word-fade)",
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
function GiveOrUsePanel({ panel, text }: { panel: Panel; text: PanelText }) {
  const { className } = panel;

  return (
    <div
      data-side={panel.side}
      className={`relative flex flex-col gap-xl overflow-hidden px-xl py-3xl lg:gap-2xl lg:pt-7xl lg:pb-6xl ${className.panel}`}
    >
      <h2
        className={`text-title-m-b break-keep lg:max-w-[13rem] lg:text-body-l-eb ${className.title}`}
      >
        {text.title}
      </h2>

      <div
        className={`flex flex-col items-center gap-2xl lg:w-(--content-width) lg:shrink-0 lg:gap-5xl ${className.content}`}
      >
        <div className="flex w-full flex-col gap-xl">
          <p className={`text-body-s-m lg:text-body-sm-r ${className.description}`}>
            {text.description}
          </p>
          <ul
            className={`flex flex-col gap-2.5 rounded-md p-md lg:rounded-none lg:bg-transparent lg:py-0 lg:pr-0 lg:pl-sm ${className.checks}`}
          >
            {text.checks.map((check) => (
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
                {text.faqLabel}
              </ScrollToLink>
            </li>
          </ul>
        </div>

        {/* 모바일에서 버튼 줄(334px)이 글 폭(327px)보다 넓어 좌우로 조금 나간다(375 시안). 더 좁으면 줄을 바꾼다. */}
        <div className="-mx-s flex flex-wrap justify-center gap-s lg:mx-0 lg:flex-col lg:items-center lg:gap-xl">
          {text.buttons.map((button, index) => (
            <Button
              key={button.label}
              href={button.href}
              variant={panel.buttonVariants[index]}
              {...linkTargetProps(button.href)}
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
 * - 두 면 내용이 겹쳐 바뀐다. 공급 내용은 진행도 0~0.6에서 사라지고 사용 내용은 0.4~1에서 나타나서
 *   가운데에 제목만 남는 순간이 없다.
 * - 큰 낱말은 같은 자리의 버튼과 겹치지 않게, USE는 사용 내용이 나타나기 전(0~0.4)에 사라지고
 *   GIVE는 공급 내용이 다 사라진 뒤(0.6~1)에 나타난다.
 * 섹션 높이는 816px(더 긴 쪽인 사용 면 시안)과 화면 높이 중 큰 값이다. 고정된 동안 화면을 다 채워
 * 아래에 멈춘 빈 띠가 보이지 않는다.
 */
export async function GiveOrUseSection() {
  const [give, use] = await Promise.all([loadSection(GIVE_PANEL), loadSection(USE_PANEL)]);
  const texts: PanelText[] = [
    {
      title: give.title,
      description: give.description,
      checks: [give.check1, give.check2],
      faqLabel: give.faqLabel,
      buttons: [give.button],
    },
    {
      title: use.title,
      description: use.description,
      checks: [use.check1, use.check2],
      faqLabel: use.faqLabel,
      buttons: [use.primaryButton, use.secondaryButton],
    },
  ];

  return (
    <GiveOrUseScroll className="group/split @container flex flex-col [--collapsed:clamp(20.125rem,calc(38cqw-4.195rem),30rem)] [--content-width:calc(100cqw-var(--collapsed)-7.5rem)] [--give-fade:clamp(0,calc(1-var(--p)/0.6),1)] [--give-width:calc(var(--collapsed)+(100cqw-2*var(--collapsed))*(1-var(--p)))] [--give-word-fade:clamp(0,calc((var(--p)-0.6)/0.4),1)] [--p:0] [--use-fade:clamp(0,calc((var(--p)-0.4)/0.6),1)] [--use-word-fade:clamp(0,calc(1-var(--p)/0.4),1)] lg:min-h-[max(51rem,100vh)] lg:flex-row">
      {PANELS.map((panel, index) => (
        <GiveOrUsePanel key={panel.side} panel={panel} text={texts[index]} />
      ))}
    </GiveOrUseScroll>
  );
}
