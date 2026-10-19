"use client";

import { type FormEvent, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import {
  DEFAULT_INQUIRY_TYPE,
  INQUIRY_FORMS,
  INQUIRY_TYPES,
  type InquiryField,
  type InquiryFieldName,
  inquiryFields,
  type InquiryRequest,
  type InquiryType,
  type InquiryValues,
  parseInquiryType,
  REQUIRED_MESSAGE,
  validateInquiry,
} from "@/lib/inquiry";

import { replaceSearchParams, scrollToSection, useSearchParam } from "../_lib/url";
import { ChoicesField, ConsentField, TextAreaField, TextField } from "./InquiryFields";

// 다른 페이지의 문의 버튼이 이 자리로 온다(src/lib/links.ts의 CONTACT_FORM_HREF).
const FORM_SECTION_ID = "contact-form";
const INQUIRY_API_PATH = "/api/inquiry";
const CONSENT_MESSAGE = "개인정보 수집·이용에 동의해주세요.";

// 접수 완료는 브라우저 알림창(alert)으로 알린다(사용자 요청). 문구는 기획 명세의 "완료 제목"이다.
const DONE_MESSAGE = "문의가 접수되었습니다.\n입력하신 이메일로 연락드리겠습니다.";

type Status = "idle" | "sending" | "error";

/*
 * 문의 카드(파란 바탕)와 문의 폼(회색 바탕). 주소의 type(supply·project·education·use)이 고른 카드이고, 없으면 첫
 * 카드다. 카드를 누르면 폼이 그 문의로 바뀌고 폼으로 스크롤한다(카드의 ↘ 화살표).
 * 카드를 바꿔도 같은 칸(담당자명·이메일 등)에 쓴 값은 남는다.
 * 1024 시안 기준이고, 375·1440 시안이 아직 없어 모바일은 인사이트 목록처럼 좌우 24px·600px 상한에 카드 두 칸·입력칸 한
 * 줄씩, 1440은 1024와 같은 864px 칸을 가운데 둔다.
 */
export function ContactInquiry() {
  const type = parseInquiryType(useSearchParam("type")) ?? DEFAULT_INQUIRY_TYPE;
  const [values, setValues] = useState<InquiryValues>({});
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<InquiryFieldName, true>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const form = INQUIRY_FORMS[type];
  const errors = validateInquiry(type, values);
  const ready = Object.keys(errors).length === 0 && consent;
  const sending = status === "sending";

  /*
   * 오류는 보내기를 누른 뒤에 모두 보인다. 그 전에는 다 쓰고 나간 칸의 형식 오류(이메일·연락처)만 보여서, Tab으로
   * 지나가기만 해도 "필수 입력 항목"이 줄줄이 뜨지 않게 한다.
   */
  const visibleError = (name: InquiryFieldName) => {
    const error = errors[name];
    if (!error || attempted) return error;
    return touched[name] && error !== REQUIRED_MESSAGE ? error : undefined;
  };

  const setValue = <Name extends InquiryFieldName>(name: Name, value: InquiryValues[Name]) =>
    setValues((previous) => ({ ...previous, [name]: value }));
  const touch = (name: InquiryFieldName) =>
    setTouched((previous) => (previous[name] ? previous : { ...previous, [name]: true }));

  const select = (next: InquiryType) => {
    if (next !== type) {
      setTouched({});
      setAttempted(false);
      if (!sending) setStatus("idle");
    }
    replaceSearchParams({ type: next }, `#${FORM_SECTION_ID}`);
    if (sectionRef.current) scrollToSection(sectionRef.current);
    // 화면 읽기 프로그램이 바뀐 폼 이름을 읽고, 다음 Tab이 첫 입력칸으로 가게 한다.
    titleRef.current?.focus({ preventScroll: true });
  };

  // 빈 칸이나 틀린 칸 중 첫 칸으로 옮긴다. 위에 붙는 헤더에 가리지 않게 화면 가운데로 스크롤한다.
  const focusFirstInvalid = () => {
    const firstName =
      inquiryFields(type).find((field) => errors[field.name])?.name ?? (consent ? null : "consent");
    const element = firstName
      ? formRef.current?.querySelector<HTMLElement>(`[name="${firstName}"]`)
      : null;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    element.focus({ preventScroll: true });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (!ready) {
      setAttempted(true);
      focusFirstInvalid();
      return;
    }

    const body: InquiryRequest = {
      type,
      // 다른 카드에서 쓴 칸은 빼고 이 문의의 칸만 보낸다.
      values: Object.fromEntries(
        inquiryFields(type).map((field) => [
          field.name,
          values[field.name] ?? (field.kind === "choices" ? [] : ""),
        ]),
      ),
      consent: true,
      website: String(new FormData(event.currentTarget).get("website") ?? ""),
    };
    setStatus("sending");
    try {
      const response = await fetch(INQUIRY_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`문의 접수 실패(${response.status})`);
      setValues({});
      setConsent(false);
      setTouched({});
      setAttempted(false);
      setStatus("idle");
      // 알림창이 화면을 멈추는 동안에는 보낸 내용이 보이고, 닫으면 빈 폼이 된다.
      window.alert(DONE_MESSAGE);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const renderField = (field: InquiryField) => {
    switch (field.kind) {
      case "text":
        return (
          <TextField
            key={field.name}
            field={field}
            value={values[field.name] ?? ""}
            error={visibleError(field.name)}
            onChange={(value) => setValue(field.name, value)}
            onBlur={() => touch(field.name)}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            key={field.name}
            field={field}
            value={values[field.name] ?? ""}
            error={visibleError(field.name)}
            onChange={(value) => setValue(field.name, value)}
            onBlur={() => touch(field.name)}
          />
        );
      case "choices":
        return (
          <ChoicesField
            key={field.name}
            field={field}
            value={values[field.name] ?? []}
            error={visibleError(field.name)}
            onChange={(value) => setValue(field.name, value)}
          />
        );
    }
  };

  return (
    <>
      <section
        aria-labelledby="contact-title"
        className="bg-bg-brand-soft2 px-xl pt-5xl pb-3xl lg:px-6xl lg:pt-7xl lg:pb-6xl"
      >
        <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[54rem] lg:gap-5xl">
          {/* 시안의 글 묶음은 높이가 180px로 고정되어 위아래에 6px씩 남는다. */}
          <div className="flex flex-col justify-center gap-md text-text-primary lg:min-h-[11.25rem] lg:gap-xl">
            <h1 id="contact-title" className="text-body-l-eb lg:text-heading-m-eb">
              무엇을 함께할 수 있을까요?
            </h1>
            <p className="text-body-xs-m lg:text-body-sm-r">
              남는 자원의 새로운 쓰임부터 교육과 프로젝트까지
              <br />
              ZAONE과 나누고 싶은 이야기를 선택해주세요.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-sm lg:grid-cols-4">
            {INQUIRY_TYPES.map((cardType) => {
              const selected = cardType === type;
              const [line1, line2] = INQUIRY_FORMS[cardType].cardTitle;
              return (
                <li key={cardType}>
                  {/* hover는 시안에 없어 화살표가 화살표 방향으로 조금 움직이게 했다. */}
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-controls={FORM_SECTION_ID}
                    onClick={() => select(cardType)}
                    className={`group flex size-full min-h-[9rem] cursor-pointer flex-col gap-sm rounded-md p-md text-left transition-colors duration-250 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:h-60 lg:p-xl ${selected ? "bg-bg-navy text-text-inverse" : "bg-bg-default text-text-primary"}`}
                  >
                    <span className="flex-1 text-title-s-b lg:text-title-m-b">
                      {line1}
                      <br />
                      {line2}
                    </span>
                    <ArrowRightIcon
                      className={`size-6 shrink-0 rotate-45 self-end transition-transform duration-250 ease-out group-hover:translate-0.5 motion-reduce:transition-none lg:size-9 ${selected ? "text-icon-inverse" : "text-icon-secondary"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        ref={sectionRef}
        id={FORM_SECTION_ID}
        aria-labelledby={`${FORM_SECTION_ID}-title`}
        className="bg-bg-subtle px-xl pt-3xl pb-5xl lg:px-6xl lg:pt-5xl lg:pb-6xl"
      >
        <div className="mx-auto max-w-[37.5rem] rounded-md bg-bg-default px-lg py-3xl lg:max-w-[54rem] lg:px-7xl lg:py-5xl">
          {/* 시안에 폼 제목이 없어 화면 읽기용으로만 둔다. 카드를 누르면 여기로 포커스가 온다. */}
          <h2 ref={titleRef} id={`${FORM_SECTION_ID}-title`} tabIndex={-1} className="sr-only">
            {form.title}
          </h2>
          <form
            ref={formRef}
            noValidate
            onSubmit={submit}
            className="flex flex-col items-center gap-3xl lg:gap-4xl"
          >
            {form.rows.map((row) => (
              <div
                key={row.map((field) => field.name).join("-")}
                className="flex w-full flex-col gap-3xl lg:flex-row lg:gap-2xl"
              >
                {row.map(renderField)}
              </div>
            ))}
            {/* 시안의 구분선은 높이가 0이라 간격에 더해지지 않는다. 선 두께(1px)만큼 아래 간격을 줄인다. */}
            <hr className="-mb-px w-full border-border-strong" />
            <ConsentField
              checked={consent}
              error={attempted && !consent ? CONSENT_MESSAGE : undefined}
              onChange={setConsent}
            />
            {/* 자동 입력 프로그램만 채우는 칸. 사람에게는 보이지 않고 Tab으로도 가지 않는다. */}
            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
              <label>
                웹사이트
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="flex w-full flex-col items-center gap-md">
              {/*
               * 다 채우기 전에는 시안의 비활성 모양이지만 누를 수 있다. 누르면 빈 칸으로 옮기고 오류를 보인다
               * (disabled·aria-disabled면 키보드로 갈 수 없거나 "사용 불가"로 읽혀서 왜 안 되는지 알 수 없다).
               * 보내는 동안에만 aria-disabled로 두 번 보내기를 막는다(submit도 무시한다).
               */}
              <button
                type="submit"
                aria-disabled={sending || undefined}
                className={`inline-flex w-full max-w-[19.75rem] cursor-pointer items-center justify-center rounded-full py-lg text-body-s-b transition-[color,background-color] duration-250 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:py-xl lg:text-body-sm-b ${ready && !sending ? "bg-bg-strong text-text-inverse hover:bg-bg-navy" : "bg-bg-muted text-text-quaternary"}`}
              >
                {sending ? "보내는 중…" : "문의 보내기"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-center text-body-xs-m text-text-brand">
                  문의를 보내지 못했어요. 잠시 후 다시 시도해주세요.
                  <br />
                  계속 안 되면{" "}
                  <a href="mailto:hello@zaone.org" className="underline">
                    hello@zaone.org
                  </a>
                  로 보내주세요.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
