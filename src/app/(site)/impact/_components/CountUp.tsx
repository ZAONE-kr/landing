"use client";

import { useEffect, useRef } from "react";

// 숫자가 이만큼(높이 대비) 화면에 들어오면 세기 시작한다. 다 들어오는 순간이라 0이 멈춰 보이는 틈이 없다.
// 1이 아닌 것은 소수 픽셀 위치에서 비율이 1에 못 미쳐 시작하지 않는 일을 막으려는 것이다.
const VISIBLE = 0.99;

// 0에서 수치까지 세는 시간(초). 처음에 빠르고 끝에 느리게(cubic ease-out) 바뀐다.
const DURATION = 1.6;

// "52.6%"를 앞 글자, 수, 뒤 글자로 나눈다. 소수 자리 수와 천 단위 쉼표는 원래 글을 따른다.
function parse(value: string) {
  const match = /\d[\d,]*(?:\.\d+)?/.exec(value);
  if (!match) return null;

  const [number] = match;
  const decimals = number.split(".")[1]?.length ?? 0;
  const format = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: number.includes(","),
  });
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + number.length);
  const target = Number(number.replaceAll(",", ""));
  return (progress: number) => `${prefix}${format.format(target * progress)}${suffix}`;
}

/*
 * 수치가 화면에 다 들어오면 0부터 세어 올라간다. 한 번 센 뒤에는 그대로 둔다.
 * 서버 HTML(자바스크립트 전·없음)과 움직임 줄이기 설정은 처음부터 수치 그대로다. 열었을 때 이미 화면에 다
 * 보이거나 지나간 위치면(새로고침 등) 세지 않는다. 숫자를 찾지 못하는 글이면 그대로 보여 준다.
 * 화면 낭독기는 세는 도중의 글 대신 숨긴 수치를 읽는다.
 * 숫자 너비가 낱자마다 달라 뒤 글자(%, 톤)가 조금씩 흔들린다. 고정폭 숫자(tabular-nums)로 바꾸면 흔들리지
 * 않지만, 다 센 수치의 글자 간격이 시안과 달라져서 쓰지 않았다.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const display = parse(value);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !element ||
      !display ||
      reduceMotion.matches ||
      element.getBoundingClientRect().bottom <= window.innerHeight
    )
      return;

    let frame = 0;
    let startTime = 0;
    const step = (time: number) => {
      startTime ||= time;
      const t = Math.min((time - startTime) / 1000 / DURATION, 1);
      element.textContent = t < 1 ? display(1 - (1 - t) ** 3) : value;
      frame = t < 1 ? requestAnimationFrame(step) : 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < VISIBLE) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: VISIBLE },
    );
    // 움직임 줄이기로 바뀌면 세던 중이어도 바로 수치를 보여 준다.
    const finish = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.textContent = value;
    };

    element.textContent = display(0);
    observer.observe(element);
    reduceMotion.addEventListener("change", finish);
    return () => {
      finish();
      reduceMotion.removeEventListener("change", finish);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
