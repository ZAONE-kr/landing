import { defineArrayMember, defineField, defineType } from "sanity";

import { ZAONE_LAB_FIELD_TAGS_ID, ZAONE_LAB_FIELDS } from "@/sanity/zaoneLabFields";

// 카드 하나에 붙일 수 있는 태그 수와 태그 하나의 글자 수. 이보다 많거나 길면 카드 아래 태그 줄이 너무 길어진다.
const MAX_TAGS = 6;
const MAX_TAG_LENGTH = 20;

const TITLE = "ZAONE LAB 카드 태그";

// 공백과 너비 없는 공백(붙여 넣을 때 섞여 들어온다)만으로 된 태그, 그리고 글자 사이에 섞인 너비 없는 공백.
// 섞여 있으면 똑같아 보이는 두 태그를 같은 태그로 잡지 못하고 글자 수에도 들어간다.
const BLANK = /^[\s\u200B-\u200D\u2060\uFEFF]*$/;
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/;

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
      // Studio 버튼은 영어라(한국어 로캘 없음) 버튼 이름을 그대로 적는다.
      description:
        "카드의 사진·제목·설명은 사이트 코드에 있어 여기서는 태그만 바꿀 수 있어요. 새 태그는 목록 아래 Add item으로 넣고, 지울 때는 태그 오른쪽 ⋯ 메뉴의 Remove를 누르고, 순서는 태그 왼쪽 손잡이를 끌어서 바꿔요. 고친 내용은 바로 저장(Saved)되지만 사이트에는 오른쪽 아래 Publish를 눌러야 나가요. Publish는 고친 것이 있을 때만 눌려요. 게시한 뒤에는 이 창을 몇 초 열어 두세요. 사이트를 새로고침하면 처음 한 번은 이전 태그가 보일 수 있고, 한 번 더 새로고침하면 바뀐 태그가 보여요. 그래도 그대로면 늦어도 한 시간 안에 바뀌어요.",
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
          // 검증 패널에 "카드 이름 / 태그"로 보인다(없으면 영어 "String").
          title: "태그",
          placeholder: "예: 워크숍",
          // 규칙마다 메시지를 따로 주려고 나눈다. .error()는 그 규칙에 걸린 조건 전체에 붙는다.
          validation: (rule) => [
            rule.required().error("빈 태그예요. 글자를 쓰거나 이 태그를 지워 주세요."),
            rule.max(MAX_TAG_LENGTH).error(`태그는 ${MAX_TAG_LENGTH}자까지 쓸 수 있어요.`),
            rule.custom((value) => {
              if (!value) return true; // 빈 태그는 위 required가 잡는다.
              if (BLANK.test(value)) return "공백만 있는 태그예요. 지우거나 글자를 써 주세요.";
              if (ZERO_WIDTH.test(value))
                return "보이지 않는 글자가 섞여 있어요. 태그를 지우고 다시 입력해 주세요.";
              if (value !== value.trim()) return "태그 앞뒤의 공백을 지워 주세요.";
              // macOS 파일 이름 등에서 붙여 넣으면 한글 자모가 나뉘어 들어와, 글자 수가 늘고 같은 태그도 못 찾는다.
              if (value !== value.normalize("NFC")) return "글자를 지우고 다시 입력해 주세요.";
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
