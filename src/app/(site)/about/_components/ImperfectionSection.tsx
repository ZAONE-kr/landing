import { loadSection } from "@/sanity/lib/sections";
import { ABOUT_IMPERFECTION } from "@/sanity/sections/about";

// 데스크톱 글은 864px 폭에 두고, 시안처럼 둘째 문단만 820px로 좁힌다. 글은 Studio에서 고치고 줄은 자동으로 나뉜다.
export async function ImperfectionSection() {
  const { title, first, second } = await loadSection(ABOUT_IMPERFECTION);

  return (
    <section className="px-lg py-3xl lg:px-6xl lg:py-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[54rem] lg:gap-4xl">
        <h2 className="text-title-m-b text-balance whitespace-pre-line text-text-primary lg:text-title-l-b">
          {title}
        </h2>
        <div className="flex flex-col gap-xl text-body-s-m text-text-secondary lg:text-body-sm-r">
          <p>{first}</p>
          <p className="lg:max-w-[51.25rem]">{second}</p>
        </div>
      </div>
    </section>
  );
}
