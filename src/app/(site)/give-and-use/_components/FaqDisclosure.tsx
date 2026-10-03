"use client";

import { type ReactNode, useId, useState } from "react";

import { ChevronUpIcon } from "@/components/ui/icons";

/*
 * 질문 하나를 여닫는다. 처음에는 닫혀 있고(시안 status=Default), 질문 줄 전체를 누르면 열린다.
 * 다른 질문은 그대로 두어서 여러 개를 함께 열 수 있다.
 * 높이는 grid 행을 0fr ↔ 1fr로 바꿔 펼치고, 화살표는 닫히면 아래를 향하게 돌린다(0.25초, ease-out).
 * 닫힌 답변은 inert로 포커스와 읽기에서 뺀다. 움직임 줄이기 설정이면 바로 바뀐다.
 */
export function FaqDisclosure({
  question,
  children,
}: {
  question: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <>
      <h3 className="text-detail-m-sb text-text-primary lg:text-title-mm-sb">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center gap-s text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus lg:gap-md"
        >
          <span className="flex-1">{question}</span>
          <ChevronUpIcon
            className={`size-5 shrink-0 text-icon-primary transition-transform duration-250 ease-out motion-reduce:transition-none lg:size-8 ${open ? "" : "rotate-180"}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        {/* 좌우로 4px 넓혀 잘라서, 왼쪽 끝에 붙은 링크의 포커스 링이 잘리지 않게 한다. */}
        <div className="-mx-1 overflow-hidden px-1">{children}</div>
      </div>
    </>
  );
}
