"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EMAIL_MESSAGE, isEmail } from "@/lib/email";
import { cleanEmail, NEWSLETTER_API_PATH, type NewsletterRequest } from "@/lib/newsletter";

/*
 * 이메일을 구독 라우트 핸들러(src/app/api/newsletter/route.ts)로 보내면 단체 구글 시트의 "뉴스레터 구독" 탭에 쌓인다.
 * 완료·실패는 시안에 없어 브라우저 알림창(alert)으로 알린다(사용자 결정, 2026-10-27). 문구는 Studio에서 고친다.
 * 빈 칸과 골뱅이 빠진 주소는 브라우저 기본 말풍선이 막는다. 브라우저는 "a@b"처럼 도메인에 점이 없는 주소도 받아서,
 * 서버와 같은 규칙으로 한 번 더 걸러 같은 말풍선으로 알린다.
 */
type NewsletterFormProps = {
  label: string;
  placeholder: string;
  button: string;
  doneMessage: string;
  errorMessage: string;
};

export function NewsletterForm({
  label,
  placeholder,
  button,
  doneMessage,
  errorMessage,
}: NewsletterFormProps) {
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = cleanEmail(String(data.get("email") ?? ""));
    if (!isEmail(email)) {
      const input = form.elements.namedItem("email") as HTMLInputElement;
      input.setCustomValidity(EMAIL_MESSAGE);
      input.reportValidity();
      return;
    }

    const body: NewsletterRequest = { email, website: String(data.get("website") ?? "") };
    setSending(true);
    try {
      const response = await fetch(NEWSLETTER_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`구독 접수 실패(${response.status})`);
      // 알림창이 떠 있는 동안에는 쓴 이메일이 보이고, 닫으면 칸이 비워진다.
      window.alert(doneMessage);
      form.reset();
    } catch (error) {
      console.error(error);
      // 다시 누르기만 하면 되도록 쓴 이메일은 그대로 둔다.
      window.alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-[300px] items-center gap-2xl rounded-full bg-bg-default py-s pr-s pl-lg outline-offset-2 outline-border-focus has-[input:focus-visible]:outline-2 lg:w-[500px] lg:py-sm lg:pr-sm lg:pl-2xl"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {label}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        // 형식 안내 말풍선을 띄운 뒤 다시 쓰기 시작하면 지운다. 남아 있으면 브라우저가 계속 보내기를 막는다.
        onInput={(event) => event.currentTarget.setCustomValidity("")}
        className="min-w-0 flex-1 bg-transparent text-body-xs-m text-text-primary outline-none placeholder:text-text-secondary lg:text-body-sm-m"
      />
      {/* 자동 입력 프로그램만 채우는 칸. 사람에게는 보이지 않고 Tab으로도 가지 않는다. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          웹사이트
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {/*
       * Apps Script는 처음 부를 때 몇 초 걸리기도 해서 보내는 동안 글을 바꿔 둔다. 두 번 보내지 않게 aria-disabled로
       * 두고 submit도 무시한다(disabled면 누른 버튼이 포커스를 잃는다).
       */}
      <Button
        type="submit"
        aria-disabled={sending || undefined}
        className="px-xl py-sm text-body-xs-b lg:px-2xl lg:py-md lg:text-body-sm-b"
      >
        {sending ? "구독 중…" : button}
      </Button>
    </form>
  );
}
