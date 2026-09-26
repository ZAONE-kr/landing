import Link from "next/link";
import type { ComponentProps } from "react";

const VARIANT_CLASS = {
  solid: "bg-bg-strong text-text-inverse",
  // Figma 테두리가 안쪽 선이라 크기에 더해지지 않게 inset ring으로 그린다.
  outline: "text-text-primary inset-ring-[1.2px] inset-ring-border-default",
  inverse: "bg-bg-default text-text-primary",
};

// hover·키보드 포커스 때 1.125배, 누르는 동안 0.925배. 크기와 글자는 쓰는 곳에서 className으로 준다.
const BASE_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap transition-transform duration-200 ease-out hover:scale-[1.125] focus-visible:scale-[1.125] active:scale-[0.925]";

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
