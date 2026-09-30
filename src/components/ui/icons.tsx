import type { ComponentProps } from "react";

// Figma Iconly/Sharp/Light 아이콘. 색은 currentColor라 text-icon-*로, 크기는 size-*로 정한다.
type IconProps = ComponentProps<"svg">;

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "square",
  "aria-hidden": true,
} as const;

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.5} {...STROKE_PROPS} {...props}>
      <circle cx="10.9985" cy="10.7888" r="8.03854" />
      <path d="M16.4872 16.7083L21.0407 21.25" />
    </svg>
  );
}

// Figma에서는 Iconly "Scan" 틀 안에 선 SVG 하나를 세 번 겹쳐 놓았다. 그 좌표 그대로 합쳤다.
export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.5} {...STROKE_PROPS} {...props}>
      <path d="M20 5.965H4M20 11.965H4M20 17.965H4" />
    </svg>
  );
}

// 20px·32px·36px 시안은 같은 도형을 키운 것이라 viewBox 하나로 모두 그린다.
export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" strokeWidth={1.2} {...STROKE_PROPS} {...props}>
      <path d="M15.7502 10.0001L3.75 10.0001" />
      <path d="M11.2085 4.97961L16.2502 9.99961L11.2085 15.0204" />
    </svg>
  );
}
