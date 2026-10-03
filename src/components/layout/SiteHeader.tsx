import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { MenuIcon, SearchIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { label: "ABOUT", href: "/about" },
  { label: "GIVE & USE", href: "/give-and-use" },
  { label: "IMPACT", href: "/impact" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "ZAONE LAB", href: "/zaone-lab" },
  { label: "PARTNER WITH US", href: "/partner-with-us" },
];

// 1024에서 데스크톱 메뉴로 바뀐다. 데스크톱은 1024 시안의 여백과 간격을 그대로 쓰고,
// 화면이 넓어지면 메뉴 오른쪽의 빈 곳만 늘어난다(1440 시안과 같다).
export function SiteHeader() {
  return (
    <header className="flex items-center gap-sm bg-bg-default p-xl lg:gap-3xl">
      <Link href="/" className="shrink-0">
        {/* 로고 색은 Figma 시안이 bg/strong으로 잡아 두었다. */}
        <Logo className="h-auto w-25 text-bg-strong lg:w-30" />
      </Link>

      <nav aria-label="주요 메뉴" className="hidden flex-1 lg:block">
        <ul className="flex items-center gap-lg font-display text-display-s-b whitespace-nowrap text-text-tertiary">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="link-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-1 items-center justify-end gap-md lg:flex-none lg:gap-xl">
        {/* TODO: 검색 동작 디자인이 나오면 연결한다. */}
        <button type="button" aria-label="검색" className="text-icon-primary">
          <SearchIcon className="size-6" />
        </button>
        <div className="hidden lg:block">
          {/*
           * 새 헤더 시안(1024)의 버튼은 옛 헤더 컴포넌트의 42px 버튼(텍스트 스타일 없음)을 그대로 가져왔다.
           * 코드는 홈 시안이 토큰으로 다시 잡은 버튼(Body-S-M, 53px)을 유지한다.
           */}
          <Button
            href="/donation"
            variant="outline"
            className="w-[150px] px-md py-sm text-body-s-m"
          >
            후원하기
          </Button>
        </div>
        {/* TODO: 모바일 메뉴가 열린 상태의 디자인이 나오면 메뉴 패널과 열고 닫기를 붙인다. */}
        <button type="button" aria-label="메뉴 열기" className="text-icon-primary lg:hidden">
          <MenuIcon className="size-6" />
        </button>
      </div>
    </header>
  );
}
