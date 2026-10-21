import type { ReactNode } from "react";

import { loadSection } from "@/sanity/lib/sections";
import { LAB_LEARNERS, LAB_QUESTION } from "@/sanity/sections/lab";

// 굵은 문장과 본문. 데스크톱은 둘 다 폭이 820px로 글 폭(864px)보다 조금 좁다.
const LEAD_CLASS =
  "text-title-s-b text-balance text-text-primary lg:max-w-[51.25rem] lg:text-title-m-b";
const BODY_CLASS = "text-body-s-m lg:text-body-sm-r";

/*
 * 사진 없이 글만 있는 섹션. 글은 모바일 600px, 데스크톱 864px(1024·1440 시안)에 묶어 가운데 둔다.
 * 문단 사이는 모두 24px이다.
 */
function TextSection({ children }: { children: ReactNode }) {
  return (
    <section className="px-xl pt-5xl pb-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-xl lg:max-w-[54rem]">
        {children}
      </div>
    </section>
  );
}

// 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 화면 너비에 맞춰 흐른다.
export async function QuestionSection() {
  const { intro, lead, body } = await loadSection(LAB_QUESTION);

  return (
    <TextSection>
      <p className={`${BODY_CLASS} text-text-secondary`}>{intro}</p>
      <h2 className={LEAD_CLASS}>{lead}</h2>
      <p className={`${BODY_CLASS} text-text-secondary lg:max-w-[51.25rem]`}>{body}</p>
    </TextSection>
  );
}

// 데스크톱 시안은 본문을 한 단계 푸른 회색으로 쓴다(#4c556f, Figma에서 변수 없이 쓴 값). 모바일은 text-secondary다.
export async function LearnersSection() {
  const { lead, body } = await loadSection(LAB_LEARNERS);

  return (
    <TextSection>
      <h2 className={LEAD_CLASS}>{lead}</h2>
      <p className={`${BODY_CLASS} text-text-secondary lg:max-w-[51.25rem] lg:text-[#4c556f]`}>
        {body}
      </p>
    </TextSection>
  );
}
