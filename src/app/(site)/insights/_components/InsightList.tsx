"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { InsightCard as InsightCardData, InsightPage } from "@/sanity/lib/insights";

import { InsightCard } from "./InsightCard";

// 목록 끝이 화면 아래 이만큼 앞에 오면 다음 묶음을 부른다. 끝에 완전히 닿기 조금 전에 받아 두어 기다림을 줄인다.
const LOAD_AHEAD = "0px 0px 300px 0px";

type Status = "idle" | "loading" | "error";

async function fetchInsightPage(url: string, signal: AbortSignal): Promise<InsightPage> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`인사이트 목록 요청 실패: ${response.status}`);
  return response.json();
}

/*
 * 서버가 그린 첫 묶음(18개) 뒤로, 목록 끝이 화면에 들어오면 다음 묶음을 받아 붙인다(무한 스크롤).
 * 목록 바로 뒤의 보이지 않는 표시를 IntersectionObserver로 지켜본다. 받는 동안과 실패한 뒤에는 지켜보지 않고,
 * 받은 뒤 표시가 여전히 화면 안이면(큰 화면에서 한 묶음이 화면을 다 못 채움) 새 관찰이 바로 다음 묶음을 부른다.
 * 실패하면 저절로 다시 부르지 않고 "다시 시도" 버튼을 보인다.
 */
export function InsightList({ firstPage }: { firstPage: InsightPage }) {
  const [items, setItems] = useState<InsightCardData[]>(firstPage.items);
  const [nextUrl, setNextUrl] = useState(firstPage.nextUrl);
  const [status, setStatus] = useState<Status>("idle");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  // 받는 중에 페이지를 떠나면 요청을 끊어, 사라진 목록에 결과를 붙이지 않는다.
  useEffect(() => () => requestRef.current?.abort(), []);

  const loadMore = useCallback(() => {
    if (!nextUrl) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus("loading");
    fetchInsightPage(nextUrl, controller.signal).then(
      (page) => {
        // 이어 받는 기준이 앞 묶음의 마지막 글이라 겹치지 않지만, 겹치면 React key가 부딪히므로 한 번 더 거른다.
        setItems((prev) => {
          const shown = new Set(prev.map((item) => item.id));
          return [...prev, ...page.items.filter((item) => !shown.has(item.id))];
        });
        setNextUrl(page.nextUrl);
        setStatus("idle");
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setStatus("error");
      },
    );
  }, [nextUrl]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!nextUrl || status !== "idle" || !sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadMore();
      },
      { rootMargin: LOAD_AHEAD },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextUrl, status, loadMore]);

  if (items.length === 0) {
    return (
      <p className="py-5xl text-center text-body-xs-m text-text-tertiary lg:text-body-s-m">
        아직 게시된 인사이트가 없습니다.
      </p>
    );
  }

  return (
    <>
      <ul
        aria-busy={status === "loading"}
        className="flex flex-col gap-md lg:grid lg:grid-cols-3 lg:gap-x-md lg:gap-y-6xl"
      >
        {items.map((insight) => (
          <li key={insight.id}>
            <InsightCard insight={insight} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} aria-hidden />
      {status === "loading" && (
        <div className="flex justify-center pt-2xl lg:pt-6xl">
          <span
            aria-hidden
            className="size-8 animate-spin rounded-full border-3 border-border-strong border-t-transparent motion-reduce:animate-none"
          />
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center gap-md pt-2xl lg:gap-lg lg:pt-6xl">
          <p className="text-body-xs-m text-text-secondary lg:text-body-s-m">
            인사이트를 더 불러오지 못했습니다.
          </p>
          <Button
            variant="outline"
            onClick={loadMore}
            className="px-2xl py-sm text-detail-s-b lg:px-3xl lg:py-md lg:text-body-s-b"
          >
            다시 시도
          </Button>
        </div>
      )}
      <p role="status" className="sr-only">
        {status === "loading" ? "인사이트를 더 불러오는 중입니다." : ""}
      </p>
    </>
  );
}
