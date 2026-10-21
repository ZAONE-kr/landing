import type { ComponentProps } from "react";

// Figma Iconly/Sharp/Light 아이콘. 색은 currentColor라 text-icon-*로, 크기는 size-*로 정한다.
type IconProps = ComponentProps<"svg">;

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "square",
  "aria-hidden": true,
} as const;

// Figma에서는 Iconly "Scan" 틀 안에 선 SVG 하나를 세 번 겹쳐 놓았다. 그 좌표 그대로 합쳤다.
export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.5} {...STROKE_PROPS} {...props}>
      <path d="M20 5.965H4M20 11.965H4M20 17.965H4" />
    </svg>
  );
}

// 임시 모바일 메뉴의 닫기 버튼. Figma에 아직 없어 메뉴 아이콘과 같은 굵기로 그렸다.
export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.5} {...STROKE_PROPS} {...props}>
      <path d="M18 6L6 18M6 6L18 18" />
    </svg>
  );
}

// Figma "check". 20px·24px 시안은 같은 도형을 키운 것이라 viewBox 하나로 모두 그린다.
export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...STROKE_PROPS} {...props}>
      <path d="M4.99992 12.1952L9.90148 17.1045L19.9999 7.00092" />
    </svg>
  );
}

// Iconly "Arrow - Up 2". 20px·32px 시안은 같은 도형을 키운 것이라 viewBox 하나로 모두 그린다.
export function ChevronUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" strokeWidth={2} {...STROKE_PROPS} {...props}>
      <path d="M25.3333 20.6667L16 11.3333L6.66667 20.6667" />
    </svg>
  );
}

// Iconly/Sharp/Outline "Arrow - Left 2"·"Arrow - Right 2". 선이 아니라 채운 도형이라 fill로 그린다.
export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5607 5L9.56066 12L16.5607 19L15.5 20.0607L7.43934 12L15.5 3.93934L16.5607 5Z"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.43934 19L14.4393 12L7.43934 5L8.5 3.93934L16.5607 12L8.5 20.0607L7.43934 19Z"
      />
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

// Iconly/Sharp/Outline "Download". 선이 아니라 채운 도형이라 fill로 그린다. 24px·28px은 같은 도형을 키운 것이다.
export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.125 2.80845L13.125 19.4659H14.875L14.875 2.80845H13.125Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.94141 15.6248L13.9995 20.7054L19.0592 15.625L17.8192 14.3901L13.9997 18.2252L10.1816 14.3901L8.94141 15.6248Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.33362 10.1081H9.47945V11.8581H4.08362V23.4417H23.917V11.8581H18.5211V10.1081H25.667V25.1917H2.33362V10.1081Z"
      />
    </svg>
  );
}
