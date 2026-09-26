import Link from "next/link";
import type { ComponentProps } from "react";

// hover 색은 Figma 시안에 없어 기존 토큰에서 골랐다. 디자이너 확인이 필요하다.
const VARIANT_CLASS = {
  // 차콜에서 브랜드 네이비로 바뀐다.
  solid: "bg-bg-strong text-text-inverse hover:bg-bg-navy",
  // Figma 테두리가 안쪽 선이라 크기에 더해지지 않게 inset ring으로 그린다. hover 때 안이 채워진다.
  outline:
    "text-text-primary inset-ring-[1.2px] inset-ring-border-default hover:bg-bg-strong hover:text-text-inverse",
  inverse: "bg-bg-default text-text-primary hover:bg-bg-soft",
};

/*
 * 크기를 바꾸지 않고 색으로만 반응한다(0.25초, ease-out). 키보드 포커스는 포커스 링으로 보이고,
 * 링은 전환 없이 바로 나타나도록 transition에서 뺀다.
 * 안의 아이콘은 group-hover/button으로 반응할 수 있다. 크기와 글자는 쓰는 곳에서 className으로 준다.
 */
const BASE_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap transition-[color,background-color] duration-250 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus";

type Variant = keyof typeof VARIANT_CLASS;

type ButtonProps =
  | ({ href: string; variant?: Variant } & Omit<ComponentProps<typeof Link>, "href">)
  | ({ href?: undefined; variant?: Variant } & ComponentProps<"button">);

export function Button({ variant = "solid", className = "", ...props }: ButtonProps) {
  const classes = `${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`;

  if (props.href !== undefined) {
    return <Link {...props} className={classes} />;
  }
  return <button type="button" {...props} className={classes} />;
}
