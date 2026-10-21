import { type CSSProperties, Fragment } from "react";

import { loadSection } from "@/sanity/lib/sections";
import { IMPACT_MEASURE_CHANGE } from "@/sanity/sections/impact";

import { ScrollHighlight } from "./ScrollHighlight";

// 문단마다 낱말 목록으로 나누고, 위 문단부터 이어지는 순서를 매긴다.
type Token = { word: string; index: number };

function tokenize(paragraphs: string[]) {
  let index = 0;
  const tokenized = paragraphs.map((text) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((word): Token => ({ word, index: index++ })),
  );
  return { paragraphs: tokenized, total: index };
}

/*
 * 낱말 i는 진행도 --p가 i/n·(1-w)에서 그 뒤 w만큼 지나는 동안 text-secondary에서 text-quaternary로 바뀐다.
 * w는 낱말 8개 분량(최대 0.3)이라 밝아지는 경계가 열 낱말쯤에 걸쳐 부드럽게 번진다(레고 재단은 6개).
 */
const WORD_CLASS =
  "text-[color-mix(in_srgb,var(--color-text-quaternary)_calc(clamp(0,(var(--p)-var(--i)/var(--n)*(1-var(--w)))/var(--w),1)*100%),var(--color-text-secondary))]";

// 낱말 사이 공백은 낱말 밖에 둔다. 낱말을 span으로 나눠도 화면 낭독기가 낱말을 붙여 읽지 않는다.
function HighlightWords({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, position) => (
    <Fragment key={position}>
      {position > 0 && " "}
      <span style={{ "--i": token.index } as CSSProperties} className={WORD_CLASS}>
        {token.word}
      </span>
    </Fragment>
  ));
}

/*
 * 제목은 흰색 그대로 두고, 아래 한 줄과 본문 두 문단이 스크롤에 따라 한 낱말씩 밝아진다
 * (1024 시안 965:8439 → 965:8674). 375 시안은 아래 한 줄만 처음부터 밝은 색으로 그려 두었지만,
 * 데스크톱과 같게 본문과 함께 밝아지게 한다.
 * 가운데 정렬이라 마지막 줄에 낱말 하나만 남으면 눈에 띈다. text-pretty로 줄을 고르게 나눈다.
 * 글은 Studio에서 고치고, 낱말 수는 글에서 다시 센다. 시안의 줄바꿈은 두지 않는다.
 */
export async function MeasureChangeSection() {
  const { title, sub, first, second } = await loadSection(IMPACT_MEASURE_CHANGE);
  const {
    paragraphs: [SUB_TOKENS, ...BODY_TOKENS],
    total: WORD_TOTAL,
  } = tokenize([sub, first, second]);

  return (
    <section className="bg-bg-strong px-xl py-3xl lg:px-6xl lg:py-7xl">
      <ScrollHighlight
        words={WORD_TOTAL}
        className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl text-center text-pretty lg:max-w-[54rem] lg:gap-3xl"
      >
        <div className="flex flex-col gap-sm">
          <h2 className="text-detail-m-sb text-balance text-text-inverse lg:text-title-mm-sb">
            {title}
          </h2>
          <p className="text-body-s-m lg:text-body-sm-r">
            <HighlightWords tokens={SUB_TOKENS} />
          </p>
        </div>
        <div className="flex flex-col gap-sm text-body-s-m lg:gap-md lg:text-body-sm-r">
          {BODY_TOKENS.map((tokens, index) => (
            <p key={index}>
              <HighlightWords tokens={tokens} />
            </p>
          ))}
        </div>
      </ScrollHighlight>
    </section>
  );
}
