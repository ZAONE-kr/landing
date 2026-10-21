import { defineField, defineType, type FieldDefinition } from "sanity";

import type { SectionMeta } from "@/sanity/sections/pages";

/*
 * 섹션 스키마를 만드는 도구. 글 입력칸과 버튼(글+주소) 입력칸이 어느 섹션에서나 같은 검증을 쓰게 한다.
 * Studio에 한국어 로캘이 없어 버튼은 영어로 나오고, 제목·설명·검증 메시지만 한국어다. 메시지에
 * { "ko-KR": ... } 객체를 주면 영어 문구를 찾다가 "Unknown validation error"가 보여서 한국어 문자열을 그대로 쓴다.
 */

// 공백과 너비 없는 공백(붙여 넣을 때 섞여 들어온다). 섞여 있으면 글자 수에 들어가고 똑같아 보이는 글을 못 알아본다.
const ZERO_WIDTH = /[​-‍⁠﻿]/;

// 글 하나에 공통으로 거는 검증. 한글 자모가 나뉜 글자(macOS 파일 이름에서 붙여 넣은 것)는 글자 수가 늘어난다.
function checkText(value: string): true | string {
  if (ZERO_WIDTH.test(value))
    return "보이지 않는 글자가 섞여 있어요. 글을 지우고 다시 입력해 주세요.";
  if (value !== value.trim()) return "글 앞뒤의 공백을 지워 주세요.";
  if (value !== value.normalize("NFC")) return "글을 지우고 다시 입력해 주세요.";
  return true;
}

type TextOptions = {
  name: string;
  title: string;
  description?: string;
  // 이 글자 수를 넘으면 막는다. 모바일에서 줄이 넘치거나 카드 높이가 달라지는 것을 막는 한도다.
  max: number;
  // 여러 줄로 쓰는 글(본문)이면 입력칸 줄 수. 없으면 한 줄 입력칸(제목)이다.
  rows?: number;
  // 제목처럼 시안이 문장 중간에서 줄을 나눈 곳에서만 쓴다. 켜면 Enter로 줄을 바꿀 수 있고, 안 바꾸면 자동으로 나뉜다.
  lineBreaks?: boolean;
};

export function textField({ name, title, description, max, rows, lineBreaks }: TextOptions) {
  return defineField({
    name,
    title,
    description: [
      description,
      lineBreaks
        ? "줄을 바꾸고 싶은 곳에서 Enter를 누르세요. 바꾸지 않으면 화면에 맞춰 자동으로 나뉘어요."
        : "",
      `${max}자까지 쓸 수 있어요.`,
    ]
      .filter(Boolean)
      .join(" "),
    type: rows || lineBreaks ? "text" : "string",
    rows: rows ?? (lineBreaks ? 2 : undefined),
    validation: (rule) => [
      rule.required().error("비워 둘 수 없어요. 글을 써 주세요."),
      rule.max(max).error(`${max}자까지 쓸 수 있어요.`),
      rule.custom((value) => (typeof value === "string" ? checkText(value) : true)),
    ],
  });
}

// 사이트 안 주소는 /로 시작하고, 외부 주소는 https://로 시작한다. //로 시작하면 다른 사이트로 가서 막는다.
const HREF = /^(\/(?!\/)\S*|https?:\/\/\S+)$/i;

type LinkOptions = {
  name: string;
  title: string;
  description?: string;
};

// 주소 입력칸. 사이트 안 주소(/로 시작)나 외부 주소(https://로 시작)만 받는다.
export function hrefField({
  name,
  title,
  description = "사이트 안 페이지는 /contact 처럼 /로 시작하고, 다른 사이트는 https://로 시작해서 주소 전체를 붙여 넣어요. 다른 사이트는 새 탭으로 열려요.",
}: LinkOptions) {
  return defineField({
    name,
    title,
    description,
    type: "string",
    validation: (rule) => [
      rule.required().error("주소를 써 주세요."),
      rule.custom((value) => {
        if (!value) return true;
        const text = checkText(value);
        if (text !== true) return text;
        return HREF.test(value) || "주소가 /로 시작하거나 https://로 시작해야 해요.";
      }),
    ],
  });
}

// 버튼 하나. 글과 주소를 받고, 외부 주소(https://…)는 사이트에서 새 탭으로 열린다(linkTargetProps).
export function buttonField({ name, title, description }: LinkOptions) {
  return defineField({
    name,
    title,
    description,
    type: "object",
    options: { collapsible: false },
    fields: [
      textField({ name: "label", title: "버튼 글", max: 24 }),
      hrefField({ name: "href", title: "연결할 주소" }),
    ],
  });
}

/*
 * 섹션 문서 하나의 스키마. 문서는 하나뿐이고 ID가 종류 이름과 같다. 새로 만들기·삭제·복제는 sanity.config.ts에서
 * 막고, 왼쪽 목록에는 structure.ts가 페이지 폴더 안에 이 문서만 보여 준다. 편집 창 위의 설명은 fieldset 설명으로 둔다.
 * 문서를 처음 열었을 때 입력칸은 사이트에 지금 보이는 내용(defaults)으로 채워진다.
 */
export function defineSectionType<T extends object>(
  section: SectionMeta<T>,
  fields: (FieldDefinition & { name: string })[],
) {
  const defaults = section.defaults as Record<string, unknown>;
  return defineType({
    name: section.id,
    title: section.title,
    type: "document",
    fieldsets: [{ name: "content", title: "내용", description: section.where }],
    fields: fields.map((field) => ({
      ...field,
      fieldset: "content",
      initialValue: defaults[field.name],
    })),
    // 제목으로 쓸 글자 필드가 없어 이름을 직접 준다. 없으면 문서 머리글이 "Untitled"가 된다.
    preview: { prepare: () => ({ title: section.title }) },
  });
}
