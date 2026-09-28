export function ImperfectionSection() {
  return (
    <section className="px-lg py-3xl lg:p-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[51.25rem] lg:gap-5xl">
        <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
          완전하지 않다는 것은
          <br />
          아직 다른 가능성이 남아 있다는 뜻입니다.
        </h2>
        <div className="flex flex-col gap-xl text-body-s-m text-text-secondary lg:text-body-sm-m">
          <p>
            저마다 다른 모양과 쓰임, 아직 정해지지 않은 상태와 서로 다른 가능성.
            <br />
            우리가 산업에서 남겨진 물질에 매료된 이유도 여기에 있습니다. 하나의 쓰임으로만 설명할 수
            없습니다.
            <br />
            새로운 사람과 환경을 만나면 또 다른 쓰임과 관계가 시작됩니다.
          </p>
          {/* 모바일 시안만 "만듭니다." 뒤에서 줄을 바꾼다. */}
          <p>
            자원(ZAONE)은 산업 현장에서 사용 가치를 찾지 못해 버려진 자원을 다시 사회와 교육의
            장으로 연결합니다. 자원을 더 오래 사용하고 환경의 부담을 줄이는 동시에, 정해진 답보다
            질문과 탐구가 시작될 수 있는 열린 배움의 환경을 만듭니다.
            <br className="lg:hidden" /> 용도가 정해져 있지 않은 재료는 만져보고, 비교하고, 연결하며
            각자 다른 방식으로 탐구하게 합니다. 같은 재료도 누구의 손에 놓이느냐에 따라 전혀 다른
            쓰임이 됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
