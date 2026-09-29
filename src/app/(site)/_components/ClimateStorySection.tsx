export function ClimateStorySection() {
  return (
    <section className="px-lg py-3xl lg:p-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[51.25rem] lg:gap-5xl">
        {/* 본문은 375 시안이 Body-S-M(16px), 640 시안이 Body-XS_M(14px)이다. */}
        <p className="text-body-s-m text-text-secondary sm:text-body-xs-m lg:text-body-sm-r">
          2015년, 세계는 지구 온도 상승을 1.5°C 안에서 막기 위해 노력하기로 약속했습니다. 2024년은
          처음으로 한 해 평균기온이 그 기준을 넘어선 해였습니다.
        </p>
        <h2 className="text-title-m-b text-text-primary lg:text-heading-s-b">
          그런데 이 거대한 변화 앞에서,
          <br />
          우리가 주목한 것은
          <br className="lg:hidden" /> 어린 시절이었습니다.
        </h2>
        <div className="flex flex-col gap-xl text-body-s-m text-text-secondary sm:text-body-xs-m lg:text-body-sm-r">
          <p>
            어떤 사람과 시간을 보냈는지, 어떤 공간에서 자랐는지, 무엇을 만지고 가지고 놀았는지,
            자연과 사물을 어떻게 경험했는지. 이런 작은 경험들이 한 사람이 세계를 이해하는 방식에
            오래 남습니다.
          </p>
          <p>
            물건을 소비하고, 사용하고, 버리고, 다시 사용하는 감각도 어린 시절의 경험 속에서
            만들어집니다. 지금 어린 시절을 흔드는 문제는 하나가 아닙니다. 전쟁과 재난으로 일상이
            끊기고, 사는 곳에 따라 배움과 경험의 기회가 달라지기도 합니다. 어린 시절을 지켜야 할
            이유는 그 어느 때보다 많아졌습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
