import {
  buttonField,
  cardsField,
  defineSectionType,
  photoField,
  textField,
  textListField,
} from "@/sanity/fields";
import { apiVersion } from "@/sanity/env";
import {
  LAB_APPLICATIONS,
  LAB_EXPERIENCE_CTA,
  LAB_HERO,
  LAB_LEARNERS,
  LAB_MATERIAL_PLAY,
  LAB_QUESTION,
  LAB_RESPONSIBILITY,
} from "@/sanity/sections/lab";
import { ZAONE_LAB_FIELD_TAGS_ID, type ZaoneLabFieldTags } from "@/sanity/zaoneLabFields";

const IMAGE_ALT = "사진 설명";
const IMAGE_ALT_HELP =
  "눈이 불편한 방문자에게 읽어 주는 글이에요. 사진에 무엇이 보이는지 적어 주세요.";

// 코드에 사진이 들어 있는 기본 카드. 이 카드는 사진을 올리지 않아도 되고, 새로 더한 카드는 올려야 한다.
const DEFAULT_CARD_KEYS: readonly string[] = LAB_APPLICATIONS.defaults.cards.map(
  (card) => card._key,
);

export const labSectionTypes = [
  defineSectionType(LAB_HERO, [textField({ name: "title", title: "질문", max: 80 })]),
  defineSectionType(LAB_QUESTION, [
    textField({ name: "intro", title: "첫 문단", max: 260, rows: 4 }),
    textField({ name: "lead", title: "굵은 문장", max: 180, rows: 3 }),
    textField({ name: "body", title: "둘째 문단", max: 700, rows: 8 }),
  ]),
  defineSectionType(LAB_MATERIAL_PLAY, [
    textField({ name: "title", title: "제목", max: 80 }),
    textField({ name: "first", title: "첫 문단", max: 220, rows: 4 }),
    textField({ name: "second", title: "둘째 문단", max: 420, rows: 6 }),
    textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(LAB_LEARNERS, [
    textField({ name: "lead", title: "굵은 문장", max: 220, rows: 4 }),
    textField({ name: "body", title: "본문", max: 560, rows: 8 }),
  ]),
  defineSectionType(LAB_RESPONSIBILITY, [
    textField({ name: "title", title: "제목", max: 200, rows: 3 }),
    textField({ name: "body", title: "본문", max: 200, rows: 4 }),
    textField({ name: "imageAlt", title: IMAGE_ALT, description: IMAGE_ALT_HELP, max: 100 }),
  ]),
  defineSectionType(
    LAB_APPLICATIONS,
    [
      textField({ name: "title", title: "섹션 제목", max: 90, lineBreaks: true }),
      cardsField({
        title: "카드",
        min: 2,
        max: 8,
        defaults: LAB_APPLICATIONS.defaults.cards,
        member: {
          name: "labCard",
          title: "카드",
          previewTitle: "title",
          fields: [
            textField({ name: "title", title: "카드 제목", max: 30 }),
            textField({ name: "description", title: "카드 설명", max: 110, rows: 3 }),
            textListField({
              name: "tags",
              title: "태그",
              description: "카드 아래에 알약 모양으로 나와요. 비워 두면 태그 줄이 사라져요.",
              max: 6,
              maxLength: 20,
            }),
            photoField({
              required: (card) => !card?._key || !DEFAULT_CARD_KEYS.includes(card._key),
              description:
                "비워 두면 지금 사이트의 사진을 그대로 써요. 새로 더한 카드는 꼭 올려야 해요. 사진을 올린 뒤 점을 끌어 꼭 보여야 할 곳에 놓으세요.",
            }),
          ],
        },
      }),
    ],
    // 예전 "카드 태그" 문서를 게시해 둔 적이 있으면, 새 문서를 처음 열 때 그 태그를 카드에 채워 넣는다.
    async (_params, { getClient }) => {
      const legacy = await getClient({ apiVersion }).fetch<ZaoneLabFieldTags | null>(
        `*[_id == $id][0]`,
        { id: ZAONE_LAB_FIELD_TAGS_ID },
      );
      if (!legacy) return {};
      return {
        cards: LAB_APPLICATIONS.defaults.cards.map((card) => {
          const tags = legacy[card._key as keyof ZaoneLabFieldTags];
          return {
            _type: "labCard",
            _key: card._key,
            title: card.title,
            description: card.description,
            tags: Array.isArray(tags) ? tags : card.tags,
          };
        }),
      };
    },
  ),
  defineSectionType(LAB_EXPERIENCE_CTA, [
    textField({ name: "title", title: "제목", max: 40 }),
    textField({ name: "body", title: "소개 글", max: 120, rows: 3 }),
    buttonField({ name: "programsButton", title: "첫째 버튼 (왼쪽·위)" }),
    buttonField({ name: "inquiryButton", title: "둘째 버튼 (오른쪽·아래)" }),
  ]),
];
