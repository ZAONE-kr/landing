import type { ReactNode } from "react";

// 데스크톱 시안에서만 줄을 바꾸는 자리. 모바일은 흘려 둔다.
const DESKTOP_BR = "hidden lg:inline";

// 굵은 문장과 본문. 데스크톱은 둘 다 폭이 820px로 글 폭(864px)보다 조금 좁다.
const LEAD_CLASS = "text-title-s-b text-text-primary lg:max-w-[51.25rem] lg:text-title-m-b";
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

export function QuestionSection() {
  return (
    <TextSection>
      <p className={`${BODY_CLASS} text-text-secondary`}>
        AI는 지식과 정답에 접근하는 비용을 빠르게 낮추고 있습니다.
        <br className={DESKTOP_BR} /> 그런데 우리는 여전히 이미 답이 있는 문제를 더 빨리, 더
        정확하게 풀기 위해 많은 시간과 자원을 사용합니다.
      </p>
      <h2 className={LEAD_CLASS}>
        이제 교육의 중심에는 인간이 무엇을 질문하고
        <br className={DESKTOP_BR} /> 무엇을 가치 있게 여길지 스스로 정하는 일이 놓여야 합니다.
      </h2>
      <p className={`${BODY_CLASS} text-text-secondary lg:max-w-[51.25rem]`}>
        놀이하고, 의심하고, 자기 질문을 만들고, 다른 사람과 관계 맺으며 판단하는 경험은 기술이
        대신할 수 없는 인간의 영역입니다. ZAONE LAB은 특히 아동기를 그 가능성이 가장 선명하게
        드러나는 시기로 봅니다. 어린이를 가르침의 대상이 아니라 생각하고 선택하고 세계와 관계 맺는
        한 사람으로 대할 때, 교육은 기술을 따라가는 일이 아니라 어떤 인간성과 어떤 사회를 만들어갈
        것인지 묻는 일이 됩니다.
      </p>
    </TextSection>
  );
}

// 데스크톱 시안은 본문을 한 단계 푸른 회색으로 쓴다(#4c556f, Figma에서 변수 없이 쓴 값). 모바일은 text-secondary다.
export function LearnersSection() {
  return (
    <TextSection>
      <h2 className={LEAD_CLASS}>
        ZAONE LAB의 학습자는 어린이와 교육자에 한정되지 않습니다.
        <br /> 기업의 실무자, 예술가, 지역의 시민, 그리고 호기심 있는 사람이라면 누구나 이곳의
        학습자가 될 수 있습니다.
      </h2>
      <p className={`${BODY_CLASS} text-text-secondary lg:max-w-[51.25rem] lg:text-[#4c556f]`}>
        ZAONE LAB은 이런 만남을 팀과 조직의 학습에도 가져옵니다. 어린이는 ‘원래 이렇게 한다’는
        규칙과 위계에 덜 매여 있습니다. 필요한 사람과 재료를 자유롭게 연결하고, 해보면서 방법을
        찾아갑니다. 구성원이 직접 재료를 다루며 고정된 역할과 방식에서 벗어나 협력하는 훈련을
        설계하기도 하고, 때로는 놀이와 아동기를 왜 조직의 중요한 의제로 다뤄야 하는지 리더십과 함께
        살펴봅니다.
      </p>
    </TextSection>
  );
}
