"use client";

import { Button } from "@/components/ui/Button";

// TODO: 구독 저장처(스티비·메일침프 등)와 성공·실패 화면이 정해지면
// Server Action + useActionState로 연결한다. 지금은 제출해도 아무 일도 일어나지 않는다.
export function NewsletterForm() {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex w-[300px] items-center gap-2xl rounded-full bg-bg-default py-s pr-s pl-lg outline-offset-2 outline-border-focus has-[input:focus-visible]:outline-2 lg:w-[500px] lg:py-sm lg:pr-sm lg:pl-2xl"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        이메일
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="이메일을 입력해주세요"
        className="min-w-0 flex-1 bg-transparent text-body-xs-m text-text-primary outline-none placeholder:text-text-secondary lg:text-body-sm-m"
      />
      <Button
        type="submit"
        className="px-xl py-sm text-body-xs-b lg:px-2xl lg:py-md lg:text-body-sm-b"
      >
        구독하기
      </Button>
    </form>
  );
}
