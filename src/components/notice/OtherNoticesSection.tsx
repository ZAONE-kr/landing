import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { NOTICE_LIST_HREF } from "@/lib/links";
import {
  formatNoticeDate,
  noticeHref,
  type NoticeRow,
  type NoticeType,
} from "@/sanity/lib/notices";

/*
 * 글 아래 "다른 소식 살펴보기"(노란 바탕). 같은 종류에서 바로 앞뒤 글 한 줄씩과 공지사항 목록 버튼이다.
 * 이전 글은 이 글보다 먼저 게시된 글, 다음 글은 나중에 게시된 글이다. 없는 쪽은 줄째 빼고, 둘 다 없으면 버튼만 남긴다.
 * 1024 시안: 위아래·좌우 80, 제목 Title-LM-B 36 → 40 → 줄(구분 Body-S-M, 제목 Title-S-SB 20, 날짜 Body-S-M, 사이 16),
 * 줄 사이 위아래 20에 구분선 → 64 → 버튼(인사이트 상세의 목록 버튼과 같다). 375 시안이 아직 없어 모바일은 인사이트
 * 상세의 "다음 인사이트" 섹션 크기를 따르고, 줄은 구분·날짜를 위에, 제목을 아래에 둔다.
 */
export function OtherNoticesSection({
  type,
  older,
  newer,
}: {
  type: NoticeType;
  older: NoticeRow | null;
  newer: NoticeRow | null;
}) {
  const rows = [
    { label: "이전 글", notice: older },
    { label: "다음 글", notice: newer },
  ].filter((row): row is { label: string; notice: NoticeRow } => row.notice !== null);

  return (
    <section className="bg-bg-highlight px-xl py-3xl lg:p-6xl">
      <div className="mx-auto flex max-w-[54rem] flex-col items-center gap-3xl lg:gap-5xl">
        {rows.length > 0 && (
          <div className="flex w-full flex-col gap-xl lg:gap-3xl">
            <h2 className="text-title-s-b text-text-primary lg:text-title-lm-b">
              다른 소식 살펴보기
            </h2>
            <ul>
              {rows.map(({ label, notice }) => (
                <li
                  key={label}
                  className="border-border-strong not-first:mt-md not-first:border-t not-first:pt-md lg:not-first:mt-lg lg:not-first:pt-lg"
                >
                  <Link
                    href={noticeHref(type, notice.slug)}
                    className="group grid grid-cols-[1fr_auto] gap-x-md gap-y-xs rounded-s [grid-template-areas:'label_date'_'title_title'] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus lg:grid-cols-[auto_1fr_auto] lg:items-center lg:[grid-template-areas:'label_title_date']"
                  >
                    <span className="text-body-xs-m text-text-tertiary [grid-area:label] lg:text-body-s-m">
                      {label}
                    </span>
                    <span className="text-body-s-sb text-text-secondary underline-offset-4 [grid-area:title] group-hover:underline lg:text-title-s-sb">
                      {notice.title?.trim() || "제목 없음"}
                    </span>
                    <time
                      dateTime={notice.publishedAt}
                      className="text-body-xs-m text-text-tertiary [grid-area:date] lg:text-body-s-m"
                    >
                      {formatNoticeDate(notice.publishedAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          href={NOTICE_LIST_HREF[type]}
          className="w-[200px] px-xl py-md text-body-xs-b lg:w-[316px] lg:px-6xl lg:py-xl lg:text-body-sm-b"
        >
          공지사항 목록 보기
        </Button>
      </div>
    </section>
  );
}
