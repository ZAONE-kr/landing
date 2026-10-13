import { defineField, defineType } from "sanity";

import { parseYouTubeId, youTubeThumbnailUrl } from "@/sanity/youtubeUrl";

/*
 * 본문 도구 막대의 Insert YouTube 버튼 아이콘. 아이콘이 없으면 일반 블록 아이콘이 붙어 Insert Image 옆에서 구분이 안 된다.
 * @sanity/icons는 pnpm이 sanity 안에만 둬서 앱 코드에서 불러올 수 없어, 같은 크기(25)·선 굵기(1.2)로 직접 그린다.
 */
function YouTubeIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <rect x="4.5" y="7.5" width="16" height="10" rx="3" stroke="currentColor" strokeWidth={1.2} />
      <path d="M11 10.5v4l3.5-2-3.5-2Z" fill="currentColor" />
    </svg>
  );
}

/*
 * 본문에 넣는 유튜브 영상. 주소만 저장하고, 사이트가 주소에서 영상 ID를 꺼내 영상을 넣는다(youtubeUrl.ts).
 * 주소 칸은 url 타입이 아닌 string이다. url 타입은 기본 주소 검사(영어 메시지)를 규칙마다 붙여서, 주소를 잘못 넣으면
 * 같은 잘못이 영어와 한국어로 겹쳐 보인다. parseYouTubeId가 http(s)인지와 유튜브 주소 모양을 함께 본다.
 */
export const youtubeType = defineType({
  name: "youtube",
  title: "YouTube",
  type: "object",
  icon: YouTubeIcon,
  // 주소 칸 하나뿐이라 큰 창 대신 블록 옆 작은 창에서 고친다.
  options: { modal: { type: "popover" } },
  fields: [
    defineField({
      name: "url",
      title: "유튜브 주소",
      type: "string",
      description:
        "유튜브에서 영상 아래 공유 버튼을 눌러 복사한 주소를 붙여 넣어요. 영상은 본문 폭에 맞춰 보여요.",
      placeholder: "https://youtu.be/…",
      validation: (rule) => [
        rule.required().error("유튜브 영상 주소를 붙여 넣어 주세요."),
        rule.custom((value) =>
          !value || parseYouTubeId(value)
            ? true
            : "영상 하나를 가리키는 유튜브 주소가 아니에요. 영상의 공유 버튼으로 복사한 주소(https://youtu.be/…)를 붙여 넣어 주세요. 재생목록·채널 주소는 넣을 수 없어요.",
        ),
      ],
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare: ({ url }) => {
      const id = typeof url === "string" ? parseYouTubeId(url) : null;
      return id
        ? { title: "YouTube 영상", subtitle: url, imageUrl: youTubeThumbnailUrl(id) }
        : { title: "YouTube 영상", subtitle: "주소를 넣거나 고쳐 주세요." };
    },
  },
});
