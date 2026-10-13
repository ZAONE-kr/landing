import { defineArrayMember, defineField, defineType } from "sanity";

import { checkTyping } from "./postFields";

/*
 * 블로그 글 본문 편집기. 세 카테고리(인사이트·사업소식·사업보고)가 같은 편집기를 쓴다.
 * 문단 모양·꾸밈 이름은 디자이너의 편집기 표(Figma 1493:10831)와 같은 영어로 둔다. 한국어 로캘이 없어 다른 버튼도
 * 영어이고, i18nTitleKey를 주지 않아 나중에 로캘이 생겨도 이 이름 그대로 보인다. value는 Sanity 기본값과 같게 둬야
 * 꾸밈 아이콘·단축키(⌘B·⌘I·⌘U)가 붙고, # 제목·> 인용·- 목록 같은 마크다운식 입력도 그대로 된다.
 * 사진·유튜브처럼 문단과 따로 놓이는 블록은 block의 of(문장 안에 넣는 것)가 아니라 이 배열의 of에 둔다.
 */

// 대체 텍스트는 화면 낭독기가 한 번에 읽기 좋은 길이, 캡션은 본문 폭에서 두 줄쯤.
export const IMAGE_ALT_MAX_LENGTH = 125;
const IMAGE_CAPTION_MAX_LENGTH = 100;

// 링크 주소 앞의 scheme(https:, mailto: 등). 있으면 허용하는 scheme인지는 uri 규칙이 본다.
const SCHEME = /^[a-z][a-z\d+.-]*:/i;

export const postBodyType = defineType({
  name: "postBody",
  title: "본문",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // 첫 번째가 새 문단의 기본 모양이라 Normal을 맨 앞에 둔다. 상세 페이지 제목이 h1이라 사이트는 Heading 1을 h2로 그린다.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            // 기본 링크처럼 글자 옆 작은 창에서 고친다. 이름이 link, 필드가 href여야 글자를 고르고 주소를 붙여 넣으면
            // 링크가 바로 걸린다.
            options: { modal: { type: "popover" } },
            fields: [
              defineField({
                name: "href",
                title: "링크 주소",
                type: "url",
                description:
                  "웹 주소(https://…), 메일(mailto:hello@zaone.org), 전화(tel:070-4124-8887), 사이트 안 주소(/about)를 넣을 수 있어요.",
                // url 타입의 기본 주소 검사(http·https만)는 아래 uri 규칙이 대신한다. 상대 주소를 허용하면 Sanity가
                // "about"이나 "www.…"처럼 앞이 빠진 주소도 통과시켜서 custom 규칙으로 막는다.
                validation: (rule) => [
                  rule.required().error("링크 주소를 넣어 주세요. 링크가 필요 없으면 지워 주세요."),
                  rule
                    .uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true })
                    .error(
                      "https://, mailto:, tel:로 시작하는 주소나 /로 시작하는 사이트 안 주소만 넣을 수 있어요.",
                    ),
                  rule.custom((value) => {
                    if (!value) return true;
                    if (value !== value.trim()) return "주소 앞뒤의 공백을 지워 주세요.";
                    if (SCHEME.test(value)) return true;
                    if (value.startsWith("//")) return "주소 앞에 https:를 붙여 주세요.";
                    if (value.startsWith("/") || value.startsWith("#")) return true;
                    return "주소 앞에 https://를 붙여 주세요. 사이트 안 주소라면 /로 시작해 주세요(예: /about).";
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Image",
      options: {
        hotspot: {
          // 시안의 본문 사진은 1024·375 모두 16:10 틀(1024×640)에 맞춰 잘려 있다. 사이트가 원래 비율로 보이기로
          // 하면 이 미리보기만 바꾼다.
          previews: [{ title: "본문 사진 틀 (1024×640)", aspectRatio: 1024 / 640 }],
        },
      },
      fields: [
        defineField({
          name: "alt",
          title: "대체 텍스트",
          type: "string",
          description: "사진을 설명하는 대체텍스트를 넣어주세요",
          validation: (rule) => [
            rule
              .max(IMAGE_ALT_MAX_LENGTH)
              .warning(`대체 텍스트가 ${IMAGE_ALT_MAX_LENGTH}자를 넘어요. 듣기 좋게 줄여 주세요.`),
            rule.custom(checkTyping),
          ],
        }),
        // 아직 사이트 디자인은 없다. 예전 사이트 사업소식은 12개 중 9개가 사진 아래에 찍은 사람을 적었다.
        defineField({
          name: "caption",
          title: "캡션",
          type: "string",
          description: "사진 하단에 캡션이 필요한 경우 입력해주세요",
          validation: (rule) => [
            rule
              .max(IMAGE_CAPTION_MAX_LENGTH)
              .warning(`캡션이 ${IMAGE_CAPTION_MAX_LENGTH}자를 넘어요. 줄여 주세요.`),
            rule.custom(checkTyping),
          ],
        }),
      ],
      // 사진 없이 대체 텍스트·캡션만 남은 블록을 잡는다. 블록이 있으면 값이 있는 것이라 required 없이도 돈다.
      validation: (rule) => rule.assetRequired().error("사진을 올리거나 이 블록을 지워 주세요."),
      // 제목이 비면 Studio가 영어 "Untitled"를 띄워서, 캡션이 없으면 "사진"이라고 쓴다.
      preview: {
        select: { media: "asset", caption: "caption", alt: "alt" },
        prepare: ({ media, caption, alt }) => ({
          media,
          title: caption || "사진",
          subtitle: alt ? `대체 텍스트: ${alt}` : undefined,
        }),
      },
    }),
    defineArrayMember({ type: "youtube" }),
  ],
});
