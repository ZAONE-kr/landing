import {
  defineArrayMember,
  defineField,
  getPublishedId,
  type SlugValue,
  type SortOrdering,
  type SortOrderingItem,
  type ValidationContext,
} from "sanity";

import { apiVersion } from "@/sanity/env";
import { formatFileSize } from "@/sanity/fileSize";
import { normalizeSlug, SLUG_MAX_LENGTH, slugify } from "@/sanity/slug";

/*
 * 세 카테고리(인사이트·사업소식·사업보고) 글이 함께 쓰는 필드·정렬·미리보기. 문서마다 필드를 상세 페이지에 보이는
 * 순서대로 놓는다: 제목 → 주소 → 게시일 → (인사이트: 대표이미지·프로젝트명·파트너) → (사업소식·사업보고: 첨부파일)
 * → 본문 → 포스터이미지.
 * 검사 메시지는 한국어 문자열로 쓴다. { "ko-KR": … } 객체는 "Unknown validation error"가 된다(zaoneLabFieldTags.ts).
 */

// 대체 텍스트는 화면 낭독기가 한 번에 읽기 좋은 길이. 본문 사진(postBody.ts)도 같은 상한을 쓴다.
export const IMAGE_ALT_MAX_LENGTH = 125;

// 첨부파일 표시 이름. 상세 페이지 첨부 칸(1024 시안 756px)에서 한 줄에 40자쯤 들어간다.
const ATTACHMENT_TITLE_MAX_LENGTH = 40;

// 인사이트 목록 카드(416px)는 제목을 세 줄까지 보인다. 한 줄에 18자쯤 들어가지만 낱말 단위로 줄을 바꿔서(break-keep)
// 줄마다 몇 자씩 비므로 45자를 넘으면 넘칠 수 있다.
const TITLE_MAX_LENGTH = 45;

// 공백과 보이지 않는 서식 문자(너비 없는 공백 등. 붙여 넣을 때 섞여 들어온다)만 있는 값. required는 " "도 값으로 본다.
export const BLANK = /^[\s\p{Cf}]*$/u;
// 보이지 않는 서식 문자. 주소에 섞이면 똑같아 보이는 다른 주소가 된다.
const INVISIBLE = /\p{Cf}/u;

/*
 * 사람이 쓰는 글자 칸에 함께 거는 검사. 비어 있으면 넘긴다(꼭 써야 하는지는 required가 본다).
 * macOS 파일 이름 등에서 붙여 넣으면 한글 자모가 나뉘어 들어와(NFD) Windows 화면에서 글자가 풀려 보일 수 있다.
 */
export function checkTyping(value: string | undefined): true | string {
  if (!value) return true;
  if (BLANK.test(value)) return "공백만 들어 있어요. 글자를 써 주세요.";
  if (value !== value.normalize("NFC"))
    return "한글 자모가 나뉘어 들어왔어요. 지우고 다시 입력해 주세요.";
  return true;
}

// 오늘 날짜(서울, YYYY-MM-DD). toISOString()은 UTC라 오전 9시 전에는 어제가 나와서 9시간을 더한다. 한국은 서머타임이 없다.
function todayInSeoul(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/*
 * 주소 검사. 규칙 하나에 모은다. slug 타입은 기본 검사(값 모양·같은 주소 확인)를 규칙마다 붙여서, 규칙을 나누면 같은
 * 주소 확인이 규칙 수만큼 돌고 영어 메시지가 겹쳐 보인다. 같은 주소 확인은 기본 검사(영어 메시지)를 끄고(isUnique)
 * 같은 조건으로 여기서 한다: 같은 카테고리의 다른 글(게시본·초안)이 이 주소를 쓰는지.
 */
async function checkSlug(
  value: SlugValue | undefined,
  context: ValidationContext,
): Promise<true | string> {
  const slug = value?.current;
  if (!slug) return "주소가 비어 있어요. 제목을 쓴 뒤 Generate를 눌러 주세요.";
  if (INVISIBLE.test(slug))
    return "보이지 않는 글자가 섞여 있어요. 주소를 지우고 Generate를 다시 눌러 주세요.";
  if (slug !== slug.normalize("NFC"))
    return "한글 자모가 나뉘어 들어왔어요. 주소를 지우고 Generate를 다시 눌러 주세요.";
  if (slug !== normalizeSlug(slug)) {
    const suggestion = slugify(slug);
    return suggestion
      ? `주소는 띄어쓰기가 불가능합니다. 이렇게 고쳐 주세요: ${suggestion}`
      : "주소에 글자나 숫자가 없어요. 한글·영문·숫자로 다시 써 주세요.";
  }
  if (Array.from(slug).length > SLUG_MAX_LENGTH) return `주소는 최대 ${SLUG_MAX_LENGTH}자입니다. `;
  const { document } = context;
  if (!document) return true;
  const taken = await context
    .getClient({ apiVersion })
    .fetch<boolean>(
      "defined(*[_type == $type && !sanity::versionOf($id) && slug.current == $slug][0]._id)",
      { type: document._type, id: getPublishedId(document._id), slug },
      { perspective: "raw", signal: context.signal, tag: "validation.slug-is-unique" },
    );
  return taken ? "중복된 주소입니다. " : true;
}

// 본문에 보이는 것이 하나라도 있는지. 빈 줄만 남거나 공백만 쓴 본문은 required를 지나가서 따로 본다.
function hasBodyContent(blocks: unknown[]): boolean {
  return blocks.some((block) => {
    if (typeof block !== "object" || block === null) return false;
    if (!("_type" in block) || block._type !== "block") return true; // Image·YouTube 블록
    return (
      "children" in block &&
      Array.isArray(block.children) &&
      block.children.some((child) => typeof child?.text === "string" && !BLANK.test(child.text))
    );
  });
}

export const titleField = defineField({
  name: "title",
  title: "제목",
  type: "string",
  description: `최대 ${TITLE_MAX_LENGTH}자만 입력해주세요.`,
  validation: (rule) => [
    rule.required().error("제목을 써 주세요."),
    rule
      .max(TITLE_MAX_LENGTH)
      .warning(`제목이 ${TITLE_MAX_LENGTH}자를 넘어요. 목록 카드에서 뒷부분이 잘릴 수 있어요.`),
    rule.custom(checkTyping),
  ],
});

export const slugField = defineField({
  name: "slug",
  title: "주소",
  type: "slug",
  description: `제목을 쓴 뒤 Generate를 누르면 제목으로 만들어져요. 제목을 바꿔도 주소는 저절로 바뀌지 않아요. 직접 고칠 때는 한글·영문 소문자·숫자를 하이픈(-)으로 이어 ${SLUG_MAX_LENGTH}자까지 써주세요.`,
  options: {
    source: "title",
    // 기본 함수는 한글을 모두 지워서, 한글 제목이면 Generate가 칸을 비운다.
    slugify: (source) => slugify(source),
    // 같은 주소 확인은 checkSlug가 한국어 메시지로 한다.
    isUnique: () => true,
  },
  validation: (rule) => rule.custom(checkSlug),
});

export const publishedAtField = defineField({
  name: "publishedAt",
  title: "게시일",
  type: "date",
  description: "게시일을 입력해주세요.",
  // 함수로 줘야 글을 만드는 날의 날짜가 들어간다. 값으로 주면 Studio를 연 날로 굳는다.
  initialValue: () => todayInSeoul(),
  validation: (rule) => [
    rule.required().error("게시일을 골라 주세요."),
    rule
      .custom((value) =>
        !value || value <= todayInSeoul()
          ? true
          : "오늘보다 뒤 날짜예요. 맞는 날짜인지 확인해 주세요.",
      )
      .warning(),
  ],
});

export const bodyField = defineField({
  name: "body",
  title: "본문",
  type: "postBody",
  description:
    "본문을 작성해주세요. 이미지와 유튜브 영상의 경우 Insert Image·Insert YouTube 버튼을 눌러 추가해주세요.",
  validation: (rule) => [
    rule.required().error("본문을 써 주세요."),
    rule.custom((blocks) =>
      !Array.isArray(blocks) || hasBodyContent(blocks) ? true : "본문에 내용을 써 주세요.",
    ),
  ],
});

/*
 * 사업소식·사업보고 본문. 예전 사이트 사업보고는 본문 없이 결산 공시 파일(PDF·엑셀)만 올렸으므로, 첨부파일이 있으면
 * 비워 둘 수 있다. 둘 다 없으면 화면에 제목만 남아 막는다.
 */
export const noticeBodyField = defineField({
  ...bodyField,
  description:
    "본문을 작성해주세요. 첨부파일만 올리는 글이면 비워 둬도 돼요. 이미지와 유튜브 영상의 경우 Insert Image·Insert YouTube 버튼을 눌러 추가해주세요.",
  validation: (rule) =>
    rule.custom((blocks, context) => {
      if (Array.isArray(blocks) && hasBodyContent(blocks)) return true;
      const attachments = context.document?.attachments;
      return Array.isArray(attachments) && attachments.length > 0
        ? true
        : "본문을 쓰거나 첨부파일을 올려 주세요.";
    }),
});

/*
 * 사업소식·사업보고의 첨부파일. 올린 순서대로 제목·게시일 아래 칸에 놓이고, 누르면 내려받는다.
 * 파일 종류는 막지 않는다(PDF·엑셀·한글 등). 파일은 Sanity 자산 CDN에 올라가 주소만 알면 누구나 받을 수 있다.
 * 글에서 지워도 파일은 Media에 남으니, 내려야 하는 파일은 Media에서도 지워야 한다.
 */
export const attachmentsField = defineField({
  name: "attachments",
  title: "첨부파일",
  type: "array",
  description:
    "내려받을 파일(PDF·엑셀·한글 등)을 올려 주세요. 올린 순서대로 보이고, 끌어서 순서를 바꿀 수 있어요.",
  of: [
    defineArrayMember({
      type: "file",
      title: "파일",
      fields: [
        defineField({
          name: "title",
          title: "표시 이름",
          type: "string",
          description: "화면에 보일 이름이에요. 비워 두면 올린 파일 이름이 그대로 보여요.",
          validation: (rule) => [
            rule
              .max(ATTACHMENT_TITLE_MAX_LENGTH)
              .warning(
                `표시 이름이 ${ATTACHMENT_TITLE_MAX_LENGTH}자를 넘어요. 화면에서 여러 줄로 넘어갈 수 있어요.`,
              ),
            rule.custom(checkTyping),
          ],
        }),
      ],
      // 파일 없이 표시 이름만 남은 항목을 잡는다. 항목이 있으면 값이 있는 것이라 required 없이도 돈다.
      validation: (rule) => rule.assetRequired().error("파일을 올리거나 이 항목을 지워 주세요."),
      // 제목이 비면 Studio가 영어 "Untitled"를 띄워서, 표시 이름이 없으면 파일 이름을 쓴다.
      preview: {
        select: { title: "title", filename: "asset.originalFilename", size: "asset.size" },
        prepare: ({
          title,
          filename,
          size,
        }: {
          title?: string;
          filename?: string;
          size?: number;
        }) => ({
          title: title?.trim() || filename?.normalize("NFC") || "파일",
          subtitle: [title?.trim() && filename?.normalize("NFC"), formatFileSize(size)]
            .filter(Boolean)
            .join(" · "),
        }),
      },
    }),
  ],
});

/*
 * 본문 아래 포스터. 원래 비율 그대로 폭만 고정해 보인다(인사이트 상세 시안, 사업소식·사업보고 상세 시안 같음).
 * 포스터는 행사 이름·날짜 같은 정보를 그림 속 글자로 담아서, 화면 낭독기가 읽을 글을 따로 받는다.
 */
export const posterImageField = defineField({
  name: "posterImage",
  title: "포스터이미지",
  type: "image",
  description: "본문 아래에 보이는 포스터 이미지가 있으면 올려 주세요.",
  fields: [
    defineField({
      name: "alt",
      title: "대체 텍스트",
      type: "string",
      description:
        "포스터에 적힌 내용(행사 이름·날짜·장소 등)을 화면 낭독기가 읽을 수 있게 짧게 써 주세요.",
      validation: (rule) => [
        rule
          .max(IMAGE_ALT_MAX_LENGTH)
          .warning(`대체 텍스트가 ${IMAGE_ALT_MAX_LENGTH}자를 넘어요. 듣기 좋게 줄여 주세요.`),
        rule.custom(checkTyping),
      ],
    }),
  ],
  // 포스터는 없어도 되지만, 파일 없이 대체 텍스트만 남으면 화면에 빈 자리가 생긴다.
  validation: (rule) =>
    rule.custom((value) =>
      !value || value.asset
        ? true
        : "포스터 파일이 없어요. 포스터를 올리거나, 쓰지 않으면 대체 텍스트를 지워 주세요.",
    ),
});

// 게시일 최신순(같은 날이면 나중에 만든 글이 위). Studio 목록의 기본 정렬이다(structure.ts).
export const NEWEST_FIRST: SortOrderingItem[] = [
  { field: "publishedAt", direction: "desc" },
  { field: "_createdAt", direction: "desc" },
];

// 목록 오른쪽 위 정렬 메뉴. Studio가 "Sort by 게시일 최신순"처럼 앞에 영어를 붙이고, 뒤에 Last edited·Created를 더한다.
export const POST_ORDERINGS: SortOrdering[] = [
  { title: "게시일 최신순", name: "publishedAtDesc", by: NEWEST_FIRST },
  {
    title: "게시일 오래된순",
    name: "publishedAtAsc",
    by: [
      { field: "publishedAt", direction: "asc" },
      { field: "_createdAt", direction: "asc" },
    ],
  },
  { title: "제목순", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
];

// 목록에는 제목과 게시일을 보인다. 제목이 비면 Studio가 영어 "Untitled"를 띄워서 한국어로 바꾼다.
export const POST_PREVIEW = {
  select: { title: "title", publishedAt: "publishedAt" },
  prepare: ({ title, publishedAt }: { title?: string; publishedAt?: string }) => ({
    title: title || "제목 없음",
    subtitle: publishedAt,
  }),
};
