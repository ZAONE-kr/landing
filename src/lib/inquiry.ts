/*
 * CONTACT 페이지의 문의 4종. 카드·폼(브라우저)과 접수 라우트 핸들러·알림 메일(서버)이 이 정의를 함께 쓰고, 입력 검사도
 * 양쪽이 같은 함수로 한다. 그래서 다른 모듈을 불러오지 않는다.
 * 항목·필수 여부·여러 개 고르기는 기획 명세(Figma 1465:7619~7622)를, 라벨·안내 문구·배치는 1024 시안을 따른다.
 * 공급·사용 시안은 카드 선택 표시가 서로 바뀌어 있어서(공급 카드 시안 1465:5994에 사용 폼이 있다) 명세와 폼 내용으로
 * 짝지었다. 명세대로 모든 항목이 필수다. 고르는 칸의 가운뎃점은 시안 글자(・, 앞뒤가 넓다)를 따른다.
 */

export const INQUIRY_TYPES = ["supply", "project", "education", "use"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

// 주소에 type이 없거나 모르는 값이면 첫 카드를 고른다.
export const DEFAULT_INQUIRY_TYPE: InquiryType = "supply";

export function parseInquiryType(value: unknown): InquiryType | null {
  return INQUIRY_TYPES.find((type) => type === value) ?? null;
}

type TextFieldName =
  "organization" | "department" | "name" | "email" | "phone" | "region" | "resource" | "plan";
type ChoiceFieldName = "collaborationAreas" | "educationTargets" | "useTargets";
export type InquiryFieldName = TextFieldName | ChoiceFieldName;

export type InquiryField =
  | {
      kind: "text";
      name: TextFieldName;
      label: string;
      placeholder: string;
      inputType: "text" | "email" | "tel";
      autoComplete?: string;
    }
  | {
      kind: "textarea";
      name: TextFieldName;
      label: string;
      // 메일 표의 라벨. 폼 라벨이 문장이라 짧게 줄인다.
      mailLabel: string;
      placeholder: string;
    }
  | {
      kind: "choices";
      name: ChoiceFieldName;
      label: string;
      options: readonly string[];
    };

export type InquiryForm = {
  type: InquiryType;
  // 메일 제목·본문과 폼 제목(화면 읽기용)에 쓰는 이름.
  title: string;
  // 카드 제목. 시안의 줄바꿈 위치대로 두 줄이다.
  cardTitle: readonly [string, string];
  // 화면에 놓는 순서대로. 한 줄에 둘이면 데스크톱에서 나란히 놓는다.
  rows: readonly (readonly InquiryField[])[];
};

// 한 줄 입력칸의 최대 글자 수. 시안 입력칸 컴포넌트의 글자 수 표시(00 / 100)를 따른다. 표시는 숨겨 둔 상태라 그리지 않는다.
export const TEXT_MAX_LENGTH = 100;
// 여러 줄 입력칸의 최대 글자 수(시안 00 / 500).
export const LONG_TEXT_MAX_LENGTH = 500;
// 이메일 주소의 최대 길이(RFC 5321).
const EMAIL_MAX_LENGTH = 254;

const ORGANIZATION = {
  kind: "text",
  name: "organization",
  label: "기업 또는 기관명",
  placeholder: "기관명을 작성해주세요",
  inputType: "text",
  autoComplete: "organization",
} as const satisfies InquiryField;

const DEPARTMENT = {
  kind: "text",
  name: "department",
  label: "소속/부서",
  placeholder: "소속된 부서를 작성해주세요",
  inputType: "text",
} as const satisfies InquiryField;

const CONTACT_NAME = {
  kind: "text",
  name: "name",
  label: "담당자명",
  placeholder: "담당자 이름을 작성해주세요",
  inputType: "text",
  autoComplete: "name",
} as const satisfies InquiryField;

const EMAIL = {
  kind: "text",
  name: "email",
  label: "이메일",
  placeholder: "abcde@zaone.com",
  inputType: "email",
  autoComplete: "email",
} as const satisfies InquiryField;

const PHONE = {
  kind: "text",
  name: "phone",
  label: "연락처",
  placeholder: "000-0000-0000",
  inputType: "tel",
  autoComplete: "tel",
} as const satisfies InquiryField;

export const INQUIRY_FORMS: Record<InquiryType, InquiryForm> = {
  supply: {
    type: "supply",
    title: "휴면자원 공급 문의",
    cardTitle: ["휴면자원", "공급 문의"],
    rows: [
      [ORGANIZATION],
      [DEPARTMENT, CONTACT_NAME],
      [EMAIL, PHONE],
      [
        {
          kind: "textarea",
          name: "resource",
          label: "자원에 대해 간단히 알려주세요",
          mailLabel: "자원 설명",
          placeholder: "예시) 자동차 시트 샘플을 만들고 남은 가죽이 있습니다.",
        },
      ],
    ],
  },
  project: {
    type: "project",
    title: "프로젝트 협력 문의",
    cardTitle: ["프로젝트", "협력 문의"],
    rows: [
      [ORGANIZATION],
      [DEPARTMENT, CONTACT_NAME],
      [EMAIL, PHONE],
      [
        {
          kind: "choices",
          name: "collaborationAreas",
          label: "관심 있는 협력 분야",
          options: [
            "자원순환",
            "ESG・CSR",
            "임직원 참여",
            "미래세대 교육",
            "브랜드・고객 경험",
            "공간・지역",
            "아직 정해지지 않음",
            "기타",
          ],
        },
      ],
    ],
  },
  education: {
    type: "education",
    title: "교육 프로그램 문의",
    cardTitle: ["교육 프로그램", "문의"],
    rows: [
      [ORGANIZATION, CONTACT_NAME],
      [EMAIL, PHONE],
      [
        {
          kind: "choices",
          name: "educationTargets",
          label: "교육 대상",
          options: [
            "영유아",
            "초등학생",
            "청소년",
            "교사・교육자",
            "임직원",
            "가족・지역주민",
            "미정",
            "기타",
          ],
        },
      ],
    ],
  },
  // Give & Use의 "기관 멤버십 신청하기"가 이 폼으로 온다.
  use: {
    type: "use",
    title: "휴면자원 사용 문의",
    cardTitle: ["휴면자원", "사용 문의"],
    rows: [
      [{ ...ORGANIZATION, label: "기관명" }, CONTACT_NAME],
      [EMAIL, PHONE],
      [
        {
          kind: "text",
          name: "region",
          label: "이용지역",
          placeholder: "시 / 군 / 구를 입력해주세요",
          inputType: "text",
        },
      ],
      [
        {
          kind: "choices",
          name: "useTargets",
          label: "주요 이용 대상",
          options: [
            "영유아",
            "초등학생",
            "청소년",
            "성인",
            "교사・교육자",
            "가족・지역주민",
            "미정",
            "기타",
          ],
        },
      ],
      [
        {
          kind: "textarea",
          name: "plan",
          label: "활용 계획",
          mailLabel: "활용 계획",
          placeholder:
            "예시) 도서관 어린이 프로그램에서 다양한 재료를 지속적으로 사용하고 싶습니다.",
        },
      ],
    ],
  },
};

export function inquiryFields(type: InquiryType): InquiryField[] {
  return INQUIRY_FORMS[type].rows.flat();
}

// 입력값. 여러 문의가 같은 이름의 칸(담당자명 등)을 함께 써서, 카드를 바꿔도 이미 쓴 값이 남는다.
export type InquiryValues = Partial<Record<TextFieldName, string>> &
  Partial<Record<ChoiceFieldName, string[]>>;

export type InquiryErrors = Partial<Record<InquiryFieldName, string>>;

export const REQUIRED_MESSAGE = "필수 입력 항목입니다.";
const CHOICE_REQUIRED_MESSAGE = "하나 이상 골라주세요.";
const EMAIL_MESSAGE = "이메일 주소를 확인해주세요. 예) abcde@zaone.com";
const PHONE_MESSAGE = "숫자와 하이픈(-)으로 입력해주세요. 예) 010-1234-5678";

// 흔한 오타(골뱅이 빠짐, 도메인 점 빠짐, 공백)만 거른다. 실제로 받는 주소인지는 답장해 봐야 안다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 숫자·하이픈·괄호·공백·+(국가 번호)만 쓰고, 숫자는 8~15자(지역번호 없는 대표번호부터 국제번호까지).
const PHONE_PATTERN = /^[\d\s()+-]+$/;

export function checkField(field: InquiryField, values: InquiryValues): string | null {
  if (field.kind === "choices") {
    return (values[field.name]?.length ?? 0) > 0 ? null : CHOICE_REQUIRED_MESSAGE;
  }
  const value = values[field.name]?.trim() ?? "";
  if (!value) return REQUIRED_MESSAGE;
  const maxLength = field.kind === "textarea" ? LONG_TEXT_MAX_LENGTH : TEXT_MAX_LENGTH;
  if (Array.from(value).length > maxLength) return `${maxLength}자까지 입력할 수 있어요.`;
  if (field.name === "email" && (value.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(value)))
    return EMAIL_MESSAGE;
  if (field.name === "phone") {
    const digits = value.replace(/\D/g, "").length;
    if (!PHONE_PATTERN.test(value) || digits < 8 || digits > 15) return PHONE_MESSAGE;
  }
  return null;
}

export function validateInquiry(type: InquiryType, values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  for (const field of inquiryFields(type)) {
    const error = checkField(field, values);
    if (error) errors[field.name] = error;
  }
  return errors;
}

// 접수 라우트 핸들러가 받는 본문(브라우저가 보낸다).
export type InquiryRequest = {
  type: InquiryType;
  values: InquiryValues;
  consent: true;
  // 사람 눈에 안 보이는 칸. 채워져 있으면 자동 입력 프로그램으로 보고 조용히 버린다.
  website?: string;
};

export type Inquiry = { type: InquiryType; values: InquiryValues };

// 보이지 않는 서식 문자(너비 없는 공백 등)와 줄바꿈·탭을 뺀 제어 문자. 붙여 넣을 때 섞여 들어온다.
const INVISIBLE = /[\p{Cf}\p{Cc}]/gu;
const INVISIBLE_EXCEPT_NEWLINE = /(?![\n\t])[\p{Cf}\p{Cc}]/gu;

// 한 줄 칸은 줄바꿈도 공백으로 바꾼다(메일 제목에 들어가는 칸도 있다).
function cleanText(value: string, multiline: boolean): string {
  const normalized = value.normalize("NFC").replace(/\r\n?/g, "\n");
  return multiline
    ? normalized.replace(INVISIBLE_EXCEPT_NEWLINE, "").trim()
    : normalized.replace(/\s+/g, " ").replace(INVISIBLE, "").trim();
}

/*
 * 받은 본문을 다시 검사한다. 누구나 브라우저를 거치지 않고 보낼 수 있으니 화면 검사와 같은 규칙을 서버에서도 건다.
 * 선택한 문의의 칸만 남기고, 고르는 칸은 정해진 보기만 순서대로 남긴다. 모양이 맞지 않으면 null이다.
 */
export function parseInquiryRequest(body: unknown): { inquiry: Inquiry; isBot: boolean } | null {
  if (typeof body !== "object" || body === null) return null;
  const { type: rawType, values: rawValues, consent, website } = body as Record<string, unknown>;
  const type = parseInquiryType(rawType);
  if (!type || consent !== true) return null;
  if (typeof rawValues !== "object" || rawValues === null) return null;
  const input = rawValues as Record<string, unknown>;

  const values: InquiryValues = {};
  for (const field of inquiryFields(type)) {
    const raw = input[field.name];
    if (field.kind === "choices") {
      if (!Array.isArray(raw)) return null;
      values[field.name] = field.options.filter((option) => raw.includes(option));
    } else {
      if (typeof raw !== "string") return null;
      values[field.name] = cleanText(raw, field.kind === "textarea");
    }
  }
  if (Object.keys(validateInquiry(type, values)).length > 0) return null;
  return { inquiry: { type, values }, isBot: typeof website === "string" && website !== "" };
}
