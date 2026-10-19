import { type ChangeEvent, useId } from "react";

import { type InquiryField, LONG_TEXT_MAX_LENGTH, TEXT_MAX_LENGTH } from "@/lib/inquiry";

/*
 * 문의 폼의 입력칸들. 모양은 Figma 공통 컴포넌트(1470:8238)의 textfield·btn·box를 따른다.
 * 시안에 오류 상태가 없어서, 오류 문구는 입력칸 아래 help text 자리(14px)에 브랜드 색으로 임시로 보인다.
 */

type FieldProps<Value> = {
  value: Value;
  error?: string;
  onChange: (value: Value) => void;
  onBlur?: () => void;
};

// 라벨은 입력칸보다 12px 안쪽에서 시작한다(시안). 오류 문구는 입력칸 왼쪽 끝에 맞춘다.
const LABEL_CLASS = "px-sm text-body-s-b text-text-primary";
const ERROR_CLASS = "text-detail-ss-m text-text-brand";

// 포커스·입력 중에는 테두리만 포커스 색으로 바뀐다(시안 status=focused·typing).
const INPUT_CLASS =
  "w-full rounded-sm border border-border-strong bg-bg-default p-sm text-body-s-m text-text-secondary transition-colors duration-250 ease-out outline-none placeholder:text-text-quaternary focus:border-border-focus";

/*
 * 한 줄 칸. 정해진 모양이 있는 칸(연락처)은 입력할 때마다 그 모양으로 바꾼다(field.format).
 * 바뀐 값을 넣으면 브라우저가 커서를 끝으로 보내서, 커서 앞에 있던 숫자 수만큼 다시 세어 같은 자리에 둔다
 * (번호 가운데를 고칠 때 필요하다).
 */
export function TextField({
  field,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps<string> & { field: Extract<InquiryField, { kind: "text" }> }) {
  const id = useId();
  const errorId = `${id}-error`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!field.format) {
      onChange(input.value);
      return;
    }
    const next = field.format(input.value);
    const caret = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, caret).replace(/\D/g, "").length;
    onChange(next);
    requestAnimationFrame(() => {
      if (document.activeElement !== input) return;
      let position = 0;
      for (let seen = 0; position < next.length && seen < digitsBefore; position += 1) {
        if (/\d/.test(next[position])) seen += 1;
      }
      input.setSelectionRange(position, position);
    });
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-sm">
      <label htmlFor={id} className={LABEL_CLASS}>
        {field.label}
      </label>
      <div className="flex flex-col gap-s">
        <input
          id={id}
          name={field.name}
          type={field.inputType}
          // 연락처는 숫자 자판을 띄운다(휴대폰).
          inputMode={field.inputType === "tel" ? "numeric" : undefined}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          maxLength={TEXT_MAX_LENGTH}
          required
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={INPUT_CLASS}
        />
        {error && (
          <p id={errorId} className={ERROR_CLASS}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

// 여러 줄 칸. 시안 높이(100px)에서 시작해 글이 길어지면 늘어난다. 아래 오른쪽에 글자 수를 보인다.
export function TextAreaField({
  field,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps<string> & { field: Extract<InquiryField, { kind: "textarea" }> }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-sm">
      <label htmlFor={id} className={LABEL_CLASS}>
        {field.label}
      </label>
      <div className="flex flex-col gap-s">
        <textarea
          id={id}
          name={field.name}
          placeholder={field.placeholder}
          maxLength={LONG_TEXT_MAX_LENGTH}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${INPUT_CLASS} field-sizing-content min-h-[6.25rem] resize-none`}
        />
        <div className="flex gap-s">
          <p id={errorId} className={`flex-1 ${ERROR_CLASS}`}>
            {error}
          </p>
          <p aria-hidden className="flex gap-xs text-detail-ss-m whitespace-nowrap">
            <span className="text-text-brand">{value.length}</span>
            <span className="text-text-secondary">/ {LONG_TEXT_MAX_LENGTH}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * 여러 개 고르는 칸(명세: 체크박스·복수 선택). 모바일 두 칸, 데스크톱 세 칸 격자다.
 * 고른 칸은 테두리가 1.6px로 굵어지는데(시안), 크기가 바뀌어 아래가 밀리지 않게 1px 테두리 안쪽에 0.6px를 더 그린다.
 */
export function ChoicesField({
  field,
  value,
  error,
  onChange,
}: FieldProps<string[]> & { field: Extract<InquiryField, { kind: "choices" }> }) {
  const id = useId();
  const errorId = `${id}-error`;
  const toggle = (option: string, checked: boolean) =>
    onChange(
      checked
        ? field.options.filter((item) => item === option || value.includes(item))
        : value.filter((item) => item !== option),
    );

  return (
    <fieldset aria-describedby={error ? errorId : undefined} className="w-full">
      <legend className={`mb-sm ${LABEL_CLASS}`}>{field.label}</legend>
      <div className="grid grid-cols-2 gap-s lg:grid-cols-3">
        {field.options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center justify-center rounded-sm border border-border-strong px-sm py-md text-center text-detail-s-m text-text-secondary transition-colors duration-250 ease-out has-checked:border-border-focus has-checked:bg-bg-brand-soft2 has-checked:text-detail-s-b has-checked:text-text-brand has-checked:inset-ring-[0.6px] has-checked:inset-ring-border-focus has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-border-focus"
          >
            <input
              type="checkbox"
              name={field.name}
              value={option}
              checked={value.includes(option)}
              onChange={(event) => toggle(option, event.target.checked)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={`mt-s ${ERROR_CLASS}`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

/*
 * 개인정보 수집·이용 동의 체크박스와 안내문. 안내문은 기획 명세 문구다(시안의 "수집•이용"·"수집 ・이용"은 명세대로
 * "수집·이용"으로 맞췄다). 체크박스는 시안 box 컴포넌트: 빈 칸은 1.2px 테두리, 고르면 브랜드 색 바탕에 흰 체크.
 */
export function ConsentField({
  checked,
  error,
  onChange,
}: {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex w-full flex-col gap-md">
      <div className="flex flex-col gap-s">
        <label className="flex cursor-pointer items-center gap-sm px-sm">
          <span className="relative flex size-6 shrink-0">
            <input
              id={id}
              type="checkbox"
              name="consent"
              required
              checked={checked}
              onChange={(event) => onChange(event.target.checked)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="peer size-6 cursor-pointer appearance-none rounded-s border-[1.2px] border-icon-secondary checked:border-transparent checked:bg-bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinejoin="round"
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden size-6 text-icon-inverse peer-checked:block"
            >
              <path d="M5.5 10L10.5 15.5L18.5 7" />
            </svg>
          </span>
          <span className="text-body-s-b text-text-primary">
            [필수] 개인정보 수집·이용에 동의합니다.
          </span>
        </label>
        {error && (
          <p id={errorId} className={`px-sm ${ERROR_CLASS}`}>
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-sm rounded-md bg-bg-subtle p-lg lg:p-xl">
        <p className="text-body-s-b text-text-primary">개인정보 수집 및 이용 동의</p>
        <div className="text-body-xs-m text-text-tertiary">
          <p>[자원ZAONE]은 문의 접수와 답변을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
          <ul className="list-disc ps-[1.3125rem]">
            <li>목적: 문의 내용 확인, 상담 및 답변, 문의 처리 이력 관리.</li>
            <li>
              수집 항목: 선택한 문의 유형의 필수 입력 항목, 문의 유형, 접수 일시, 동의 여부 및 동의
              일시.
            </li>
            <li>
              보유·이용 기간: 문의 처리 종료일까지. 처리 목적 달성 시 지체 없이 파기합니다. 관계
              법령에 따라 보존이 필요한 정보는 해당 법령에서 정한 기간 동안 별도 보관합니다. 동의를
              거부할 권리가 있습니다. 다만 필수 항목의 수집·이용에 동의하지 않으면 이 문의 폼으로
              접수할 수 없습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
