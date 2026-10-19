"use client";

import Link from "next/link";
import { type KeyboardEvent, useRef } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { NOTICE_CATEGORIES, type NoticeType } from "@/sanity/lib/notices";
import { BUSINESS_NEWS } from "@/sanity/postCategories";

import type { NoticeLists } from "../_lib/notices";
import { replaceSearchParams, useSearchParam } from "../_lib/url";

// 상세 페이지의 "공지사항 목록 보기"가 이 자리로 온다(src/lib/links.ts의 NOTICE_LIST_HREF).
const SECTION_ID = "notices";
// 주소의 notice 값. NOTICE_LIST_HREF와 같아야 한다.
const TAB_PARAM: Record<NoticeType, string> = { businessNews: "news", businessReport: "report" };
// 몇 번째 쪽인지. 공지 글에서 뒤로 오면 보던 쪽으로 돌아온다.
const PAGE_PARAM = "noticePage";

// 한 쪽의 글 수(사용자 요청: 5개가 넘으면 쪽을 나눈다)와 한 번에 보이는 쪽 번호 수(시안 1~5).
const NOTICES_PER_PAGE = 5;
const PAGE_LINKS = 5;

/*
 * 공지사항(노란 바탕). 사업소식·사업보고 탭, 5개씩 나눈 글 목록, 쪽 번호다. 글은 상세 페이지로 이어진다.
 * 탭과 쪽은 주소의 notice(news·report)와 noticePage다. 없으면 사업소식 첫 쪽이다.
 * 1024 시안: 위아래·좌우 80, 제목 묶음 → 64 → 탭 → 40 → 목록(줄 사이 위아래 20에 구분선) → 64 → 쪽 번호.
 * 375 시안이 없어 모바일은 사업소식 상세의 "다른 소식 살펴보기"처럼 줄의 날짜를 위에, 제목을 아래에 둔다.
 */
export function NoticeSection({ lists }: { lists: NoticeLists }) {
  const tabParam = useSearchParam("notice");
  const tab =
    NOTICE_CATEGORIES.find(({ type }) => TAB_PARAM[type] === tabParam)?.type ?? BUSINESS_NEWS.type;
  const page = Number.parseInt(useSearchParam(PAGE_PARAM) ?? "", 10) || 1;
  const tabRefs = useRef<Partial<Record<NoticeType, HTMLButtonElement | null>>>({});

  const items = lists[tab];
  const pageCount = Math.max(1, Math.ceil(items.length / NOTICES_PER_PAGE));
  // 주소의 쪽이 글 수보다 크면(글이 지워졌거나 주소를 고쳐 씀) 마지막 쪽을 보인다.
  const current = Math.min(Math.max(page, 1), pageCount);
  const visible = items.slice((current - 1) * NOTICES_PER_PAGE, current * NOTICES_PER_PAGE);
  // 쪽 번호는 다섯 개씩 묶어 지금 쪽이 든 묶음을 보인다(1~5, 6~10 …).
  const firstLink = Math.floor((current - 1) / PAGE_LINKS) * PAGE_LINKS + 1;
  const pageLinks = Array.from(
    { length: Math.min(PAGE_LINKS, pageCount - firstLink + 1) },
    (_, index) => firstLink + index,
  );

  const selectTab = (next: NoticeType) =>
    replaceSearchParams({ notice: TAB_PARAM[next], [PAGE_PARAM]: null }, `#${SECTION_ID}`);

  const goTo = (next: number) =>
    replaceSearchParams(
      { notice: TAB_PARAM[tab], [PAGE_PARAM]: next > 1 ? String(next) : null },
      `#${SECTION_ID}`,
    );

  // 탭 목록 키보드: 왼쪽·오른쪽 화살표로 옆 탭을 고르고 포커스를 옮긴다(WAI-ARIA 탭 패턴).
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = NOTICE_CATEGORIES.findIndex(({ type }) => type === tab);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next =
      NOTICE_CATEGORIES[(index + step + NOTICE_CATEGORIES.length) % NOTICE_CATEGORIES.length].type;
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id={SECTION_ID}
      aria-labelledby={`${SECTION_ID}-title`}
      className="bg-bg-highlight px-xl py-5xl lg:p-6xl"
    >
      <div className="mx-auto flex max-w-[37.5rem] flex-col gap-3xl lg:max-w-[54rem] lg:gap-5xl">
        <div className="flex flex-col gap-sm text-text-primary">
          <h2 id={`${SECTION_ID}-title`} className="text-title-m-b lg:text-title-l-b">
            공지사항
          </h2>
          <p className="text-body-xs-m lg:text-body-sm-r">
            ZAONE의 사업소식과 사업보고를 확인하세요
          </p>
        </div>

        <div className="flex flex-col gap-xl lg:gap-3xl">
          <div role="tablist" aria-label="공지 종류" className="flex gap-xl lg:gap-2xl">
            {NOTICE_CATEGORIES.map(({ type, title }) => {
              const selected = type === tab;
              return (
                <button
                  key={type}
                  ref={(node) => {
                    tabRefs.current[type] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${SECTION_ID}-tab-${type}`}
                  aria-selected={selected}
                  aria-controls={`${SECTION_ID}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(type)}
                  onKeyDown={handleTabKey}
                  className="flex cursor-pointer flex-col gap-[0.1875rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                >
                  {/*
                   * 고른 탭은 굵은 글자(Title-M-B), 나머지는 보통 글자(Body-M-M)이고 같은 36px 줄에 놓인다(시안).
                   * 밑줄(2px)은 시안처럼 글자 아래 39~41px에 긋고, 탭 높이는 40px로 둔다.
                   */}
                  <span
                    className={`flex h-9 items-center whitespace-nowrap ${selected ? "text-title-s-b text-text-primary lg:text-title-m-b" : "text-body-sm-m text-text-secondary lg:text-body-m-m"}`}
                  >
                    {title}
                  </span>
                  <span
                    aria-hidden
                    className={`-mb-px h-0.5 w-full ${selected ? "bg-border-default" : "bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${SECTION_ID}-panel`}
            aria-labelledby={`${SECTION_ID}-tab-${tab}`}
          >
            {visible.length === 0 ? (
              // 시안에 빈 목록 모양이 없어 임시 문구다.
              <p className="py-3xl text-center text-body-s-m text-text-tertiary lg:py-5xl">
                아직 올라온 글이 없습니다.
              </p>
            ) : (
              // 줄 사이 구분선은 위아래 간격(모바일 16, 데스크톱 20)의 가운데에 온다. 시안의 선은 높이가 0이라 선 두께만큼
              // 아래 간격을 줄인다.
              <ul>
                {visible.map((item) => (
                  <li
                    key={item.id}
                    className="border-border-strong not-first:mt-md not-first:border-t not-first:pt-[calc(var(--spacing-md)-1px)] lg:not-first:mt-lg lg:not-first:pt-[calc(var(--spacing-lg)-1px)]"
                  >
                    <Link
                      href={item.href}
                      className="group flex flex-col gap-xs rounded-s focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus lg:flex-row lg:items-center lg:gap-md"
                    >
                      <span className="order-2 text-body-s-sb text-text-secondary underline-offset-4 group-hover:underline lg:order-none lg:flex-1 lg:text-title-s-sb">
                        {item.title}
                      </span>
                      <time
                        dateTime={item.dateTime}
                        className="order-1 text-body-xs-m whitespace-nowrap text-text-tertiary lg:order-none lg:text-body-s-m"
                      >
                        {item.date}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {pageCount > 1 && (
          <nav aria-label="공지사항 쪽 번호" className="flex items-center justify-center gap-md">
            {/* 끝 쪽의 화살표 모양은 시안에 없어 흐리게만 했다. */}
            <button
              type="button"
              aria-label="이전 쪽"
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
              className="cursor-pointer text-icon-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:text-text-quaternary"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
            <ol className="flex items-center gap-sm">
              {pageLinks.map((number) => {
                const selected = number === current;
                return (
                  <li key={number}>
                    <button
                      type="button"
                      aria-label={`${number}쪽`}
                      aria-current={selected ? "page" : undefined}
                      onClick={() => goTo(number)}
                      className={`flex w-[1.875rem] cursor-pointer justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${selected ? "bg-bg-navy text-title-s-sb text-text-inverse" : "text-body-sm-r text-text-tertiary hover:text-text-primary"}`}
                    >
                      {number}
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              aria-label="다음 쪽"
              disabled={current === pageCount}
              onClick={() => goTo(current + 1)}
              className="cursor-pointer text-icon-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:text-text-quaternary"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
