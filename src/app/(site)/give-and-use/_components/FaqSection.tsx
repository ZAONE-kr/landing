import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

import { FaqDisclosure } from "./FaqDisclosure";

export type FaqStep = {
  title: string;
  // 줄바꿈(\n)은 시안의 줄 위치 그대로다(모바일·데스크톱 같다).
  description: string;
};

export type Faq = {
  question: ReactNode;
  answer: ReactNode;
  steps?: FaqStep[];
  link?: { label: string; href: string };
};

export type FaqCta = {
  title: string;
  button: { label: string; href: string };
  image: StaticImageData;
  // 사진 틀. 모바일은 배너를 덮고, 데스크톱은 시안의 틀 크기·위치를 따른다.
  imageBoxClassName: string;
  imageClassName?: string;
  sizes: string;
};

/*
 * 공급 과정 단계. 모바일은 160px 칸 두 줄(375 시안)이고 화면이 넓어지면 칸이 늘어난다.
 * 데스크톱은 240px 칸을 864px 안에 세 개씩 놓는다(1024 시안). 단계 수가 바뀌어도 줄이 이어진다.
 * 번호(Axiforma 24·36px)는 Figma 텍스트 스타일이 없는 크기라 값을 직접 쓴다.
 */
function FaqSteps({ steps }: { steps: FaqStep[] }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-[7px] gap-y-3xl lg:mt-md lg:grid-cols-[repeat(auto-fill,15rem)] lg:gap-x-xl lg:gap-y-4xl">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-1">
          <span className="font-display text-[1.5rem] leading-[1.4] font-light tracking-[-0.8px] text-text-quaternary lg:text-[2.25rem]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-body-s-b text-text-secondary lg:text-title-s-b">{step.title}</span>
          <span className="text-detail-ss-m whitespace-pre-line text-text-tertiary lg:text-detail-m-m">
            {step.description}
          </span>
        </li>
      ))}
    </ol>
  );
}

// 시안의 구분선은 높이가 0이라 간격에 더해지지 않는다. 선 두께(1px)만큼 위 여백을 줄인다.
// 열린 질문에만 있는 질문 아래 간격과 아래 여백(16px)은 답변 쪽에 넣어 함께 접는다(시안 status=open).
function FaqItem({ faq }: { faq: Faq }) {
  return (
    <li className="not-first:border-t not-first:border-border-strong not-first:pt-[calc(var(--spacing-md)-1px)] lg:not-first:pt-[calc(var(--spacing-2xl)-1px)]">
      <FaqDisclosure question={faq.question}>
        <div className="flex flex-col gap-md py-md">
          <p className="text-body-s-m text-text-tertiary lg:text-body-sm-r">{faq.answer}</p>
          {faq.steps && <FaqSteps steps={faq.steps} />}
          {faq.link && (
            <Link
              href={faq.link.href}
              className="self-start text-body-s-sb text-text-link underline lg:text-title-s-sb"
            >
              {faq.link.label}
            </Link>
          )}
        </div>
      </FaqDisclosure>
    </li>
  );
}

// 사진 위에 검정 50%를 덮는다(Figma에서 변수 없이 쓴 값). 1440보다 넓으면 1440 시안 폭(1360px)에 묶는다.
// 375에서 긴 제목(290px)이 한 줄에 들어가도록 좌우 여백은 16px만 둔다.
function FaqCtaBanner({ cta }: { cta: FaqCta }) {
  return (
    <div className="px-xl pb-xl lg:px-3xl lg:pb-3xl">
      <div className="relative isolate mx-auto flex h-[200px] max-w-[85rem] flex-col items-center justify-center gap-sm overflow-hidden rounded-sm px-md text-center lg:h-[440px] lg:gap-2xl lg:rounded-lg">
        <div className={`absolute -z-10 ${cta.imageBoxClassName}`}>
          <Image
            src={cta.image}
            alt=""
            fill
            placeholder="blur"
            sizes={cta.sizes}
            className={`object-cover ${cta.imageClassName ?? ""}`}
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(0_0_0/0.5)]" />
        <p className="text-title-s-b text-text-inverse lg:text-heading-s-b">{cta.title}</p>
        <Button
          href={cta.button.href}
          variant="inverse"
          className="px-xl py-sm text-body-xs-b lg:px-5xl lg:py-lg lg:text-body-sm-b"
        >
          {cta.button.label}
        </Button>
      </div>
    </div>
  );
}

/*
 * 질문 목록은 데스크톱에서 864px(1024·1440 시안)로 가운데에 둔다. 모바일은 화면 폭을 그대로 쓴다.
 * 질문 사이 선은 위아래 간격(모바일 16px, 데스크톱 32px)의 가운데에 온다.
 */
export function FaqSection({
  id,
  eyebrow,
  faqs,
  cta,
  className,
}: {
  id: string;
  eyebrow: string;
  faqs: Faq[];
  cta: FaqCta;
  className: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <div className="flex flex-col items-center gap-3xl px-xl py-3xl lg:gap-6xl lg:px-6xl lg:py-7xl">
        <div className="flex flex-col items-center gap-sm text-center lg:gap-md">
          {/* 밑줄(1.2px)은 시안처럼 글줄 아래쪽에 겹쳐 긋는다. */}
          <p className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[100%_1.2px] bg-position-[0_21px] bg-no-repeat font-display text-display-s-b text-text-brand lg:bg-position-[0_26px] lg:text-display-m-b">
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="text-title-m-b text-text-primary lg:text-title-l-b">
            자주 묻는 질문
          </h2>
        </div>
        <ul className="flex w-full max-w-[54rem] flex-col gap-md lg:gap-2xl">
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} />
          ))}
        </ul>
      </div>
      <FaqCtaBanner cta={cta} />
    </section>
  );
}
