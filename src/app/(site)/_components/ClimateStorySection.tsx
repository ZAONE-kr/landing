import { loadSection } from "@/sanity/lib/sections";
import { HOME_CLIMATE_STORY } from "@/sanity/sections/home";

// 글은 Studio에서 고친다. 시안의 줄바꿈은 두지 않고 화면 너비에 맞춰 나눈다.
export async function ClimateStorySection() {
  const { first, title, second, third } = await loadSection(HOME_CLIMATE_STORY);

  return (
    <section className="px-lg py-3xl lg:p-7xl">
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[51.25rem] lg:gap-5xl">
        {/* 본문은 375 시안이 Body-S-M(16px), 640 시안이 Body-XS_M(14px)이다. */}
        <p className="text-body-s-m text-text-secondary sm:text-body-xs-m lg:text-body-sm-r">
          {first}
        </p>
        <h2 className="text-title-m-b text-balance whitespace-pre-line text-text-primary lg:text-heading-s-b">
          {title}
        </h2>
        <div className="flex flex-col gap-xl text-body-s-m text-text-secondary sm:text-body-xs-m lg:text-body-sm-r">
          <p>{second}</p>
          <p>{third}</p>
        </div>
      </div>
    </section>
  );
}
