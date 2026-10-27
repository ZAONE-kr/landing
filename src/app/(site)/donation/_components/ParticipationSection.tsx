import { loadSection } from "@/sanity/lib/sections";
import { DONATION_PARTICIPATION } from "@/sanity/sections/donation";

/*
 * 가는 선(bg-overlay, 375 1px·1024 1.5px) 위에 소제목과 설명. 모바일은 위아래, 데스크톱은 두 개씩 한 줄에 놓는다.
 * 글은 모바일 600px, 데스크톱 864px(1024 시안 폭)에 묶어 가운데 둔다. 항목 수는 Studio에서 바꿀 수 있다.
 */
export async function ParticipationSection() {
  const { title, cards } = await loadSection(DONATION_PARTICIPATION);

  return (
    <section className="px-xl pt-3xl pb-5xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[54rem] lg:gap-6xl">
        <h2 className="text-title-m-b text-text-primary lg:text-title-lm-b">{title}</h2>
        <ul className="grid gap-4xl lg:grid-cols-2">
          {cards.map((card) => (
            <li
              key={card._key}
              className="flex flex-col gap-s border-t border-bg-overlay pt-xl lg:gap-sm lg:border-t-[1.5px] lg:pt-2xl"
            >
              <h3 className="text-detail-m-sb text-text-primary lg:text-title-m-b">{card.title}</h3>
              <p className="text-body-s-m text-text-secondary lg:text-body-sm-r lg:text-text-primary">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
