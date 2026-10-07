import { defineArrayMember, defineField, defineType } from "sanity";

import { ZAONE_LAB_FIELD_TAGS_ID, ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 카드 하나에 붙일 수 있는 태그 수와 태그 하나의 글자 수. 이보다 많거나 길면 카드 아래 태그 줄이 너무 길어진다.
const MAX_TAGS = 6;
const MAX_TAG_LENGTH = 20;

const TITLE = "ZAONE LAB 카드 태그";

/*
 * ZAONE LAB 적용 현장 카드 6개의 태그만 담는 문서. 카드(사진·제목·설명·개수·순서)는 코드에 있다.
 * 문서는 하나뿐이고 ID가 종류 이름과 같다. 새로 만들기·삭제·복제는 sanity.config.ts에서 막고,
 * Studio 왼쪽 목록에는 structure.ts가 이 문서 하나만 보여 준다.
 * Studio에 한국어 로캘이 없어 버튼은 영어로 나오고, 제목·설명·검증 메시지만 한국어다. 메시지에
 * { "ko-KR": ... } 객체를 주면 영어 문구를 찾다가 "Unknown validation error"가 보여서 한국어 문자열을 그대로 쓴다.
 */
export const zaoneLabFieldTagsType = defineType({
  name: ZAONE_LAB_FIELD_TAGS_ID,
  title: TITLE,
  type: "document",
  // 화면에만 쓰는 묶음이라 저장되는 값은 그대로다.
  fieldsets: [
    {
      name: "cards",
      title: "카드별 태그",
      description:
        "카드의 사진·제목·설명은 사이트 코드에 있어 여기서는 태그만 바꿀 수 있어요. 끌어서 순서를 바꾸고, 다 고치면 Publish를 누르세요. 게시 직후 첫 새로고침에는 이전 태그가 보일 수 있고, 다시 새로고침하면 바뀐 태그가 보여요.",
    },
  ],
  fields: ZAONE_LAB_FIELDS.map((field) =>
    defineField({
      name: field.key,
      title: field.title,
      description: `${field.description.replaceAll("\n", " ")} (태그 ${MAX_TAGS}개까지, 한 태그에 ${MAX_TAG_LENGTH}자까지)`,
      type: "array",
      fieldset: "cards",
      of: [
        defineArrayMember({
          type: "string",
          placeholder: "예: 워크숍",
          // 규칙마다 메시지를 따로 주려고 나눈다. .error()는 그 규칙에 걸린 조건 전체에 붙는다.
          validation: (rule) => [
            rule.required().error("빈 태그예요. 글자를 쓰거나 이 태그를 지워 주세요."),
            rule.max(MAX_TAG_LENGTH).error(`태그는 ${MAX_TAG_LENGTH}자까지 쓸 수 있어요.`),
            rule.custom((value) => {
              if (!value) return true; // 빈 태그는 위 required가 잡는다.
              if (value.trim() === "") return "공백만 있는 태그예요. 지우거나 글자를 써 주세요.";
              if (value !== value.trim()) return "태그 앞뒤의 공백을 지워 주세요.";
              return true;
            }),
          ],
        }),
      ],
      // 같은 카드에 같은 태그를 둘 수 없어 항목 메뉴의 "복제"를 뺀다. 끌어서 순서 바꾸기는 기본으로 켜져 있다.
      options: { disableActions: ["duplicate"] },
      // 문서를 처음 열었을 때 채워 둘 태그(지금 사이트에 보이는 태그). 처음 고치는 순간 이 값으로 초안이 생긴다.
      initialValue: [...field.tags],
      validation: (rule) => [
        rule.max(MAX_TAGS).error(`태그는 ${MAX_TAGS}개까지 넣을 수 있어요.`),
        rule.unique().error("같은 태그가 두 번 들어 있어요. 하나를 지워 주세요."),
      ],
    }),
  ),
  // 제목으로 쓸 글자 필드가 없어 이름을 직접 준다. 없으면 문서 머리글이 "Untitled"가 된다.
  preview: {
    prepare: () => ({ title: TITLE }),
  },
});
