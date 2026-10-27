import { loadSection } from "@/sanity/lib/sections";
import { DONATION_MISSION } from "@/sanity/sections/donation";

/*
 * 가운데 정렬된 한 문장. 데스크톱은 1024 시안처럼 820px 폭에 두고 기본값의 줄바꿈(쉼표 뒤)을 따른다.
 * 모바일 시안은 줄을 손으로 나누지 않고 폭에 맞춰 흐르므로 줄바꿈을 무시한다.
 */
export async function MissionSection() {
  const { text } = await loadSection(DONATION_MISSION);

  return (
    <section className="px-xl py-5xl lg:px-6xl lg:py-7xl">
      <p className="mx-auto max-w-[37.5rem] text-center text-body-s-sb text-text-primary lg:max-w-[51.25rem] lg:text-title-m-b lg:whitespace-pre-line">
        {text}
      </p>
    </section>
  );
}
