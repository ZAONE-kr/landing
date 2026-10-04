import { type CSSProperties, Fragment } from "react";

import { ScrollHighlight } from "./ScrollHighlight";

// 하이라이트가 지나가는 글. null은 모바일 시안에서만 줄을 바꾸는 자리다.
type Runs = (string | null)[];

const SUB: Runs = ["ZAONE은 재사용량만으로 프로젝트의 변화를", null, "설명하지 않습니다."];
const BODY: Runs[] = [
  [
    "자원의 전환량과 폐기 감소, 자원을 바라보는 기업의",
    null,
    "인식과 의사결정 변화를 함께 기록합니다.",
  ],
  [
    "교육 재료로 전환된 이후에는 참여자의 인식과 역량, 행동이 어떻게 달라지는지 측정합니다. 기업이 투입한 자원과 활동이 실제로 어떤 환경·교육적 변화를 만들었는지 확인할 수 있도록 데이터를 축적합니다.",
  ],
];

// 문단마다 낱말 목록으로 나누고, 위 문단부터 이어지는 순서를 매긴다.
type Token = { word: string; index: number } | "br";

function tokenize(paragraphs: Runs[]) {
  let index = 0;
  const tokenized = paragraphs.map((runs) =>
    runs.flatMap((run): Token[] =>
      run === null
        ? ["br"]
        : run
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => ({ word, index: index++ })),
    ),
  );
  return { paragraphs: tokenized, total: index };
}

const {
  paragraphs: [SUB_TOKENS, ...BODY_TOKENS],
  total: WORD_TOTAL,
} = tokenize([SUB, ...BODY]);

/*
 * 낱말 i는 진행도 --p가 i/n·(1-w)에서 그 뒤 w만큼 지나는 동안 text-secondary에서 text-quaternary로 바뀐다.
 * w는 낱말 8개 분량(최대 0.3)이라 밝아지는 경계가 열 낱말쯤에 걸쳐 부드럽게 번진다(레고 재단은 6개).
 */
const WORD_CLASS =
  "text-[color-mix(in_srgb,var(--color-text-quaternary)_calc(clamp(0,(var(--p)-var(--i)/var(--n)*(1-var(--w)))/var(--w),1)*100%),var(--color-text-secondary))]";

/*
 * 낱말 사이 공백은 낱말 밖에 두되, 모바일 줄바꿈 뒤의 공백은 다음 낱말 안에 넣는다. 데스크톱에서 숨긴 <br>
 * 옆에 공백만 따로 있으면 화면 낭독기가 그 공백을 빼고 읽어 "변화를설명하지"처럼 낱말이 붙는다.
 */
function HighlightWords({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, position) => {
    if (token === "br") return <br key={position} className="lg:hidden" />;

    const afterBreak = tokens[position - 1] === "br";
    return (
      <Fragment key={position}>
        {position > 0 && !afterBreak && " "}
        <span style={{ "--i": token.index } as CSSProperties} className={WORD_CLASS}>
          {afterBreak ? ` ${token.word}` : token.word}
        </span>
      </Fragment>
    );
  });
}

/*
 * 제목은 흰색 그대로 두고, 아래 한 줄과 본문 두 문단이 스크롤에 따라 한 낱말씩 밝아진다
 * (1024 시안 965:8439 → 965:8674). 375 시안은 아래 한 줄만 처음부터 밝은 색으로 그려 두었지만,
 * 데스크톱과 같게 본문과 함께 밝아지게 한다.
 * 가운데 정렬이라 마지막 줄에 낱말 하나만 남으면 눈에 띈다. text-pretty로 줄을 고르게 나눈다
 * (375·1024 이상은 시안과 같은 줄이고, 360px 안팎과 태블릿 폭에서만 달라진다).
 */
export function MeasureChangeSection() {
  return (
    <section className="bg-bg-strong px-xl py-3xl lg:px-6xl lg:py-7xl">
      <ScrollHighlight
        words={WORD_TOTAL}
        className="mx-auto flex max-w-[37.5rem] flex-col gap-2xl text-center text-pretty lg:max-w-[54rem] lg:gap-3xl"
      >
        <div className="flex flex-col gap-sm">
          <h2 className="text-detail-m-sb text-text-inverse lg:text-title-mm-sb">
            사회문제는 하나의 성과지표만으로
            <br className="hidden lg:inline" /> 설명하기
            <br className="lg:hidden" /> 어려울 만큼 복잡하게 연결되어 있습니다.
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
