import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { MenuIcon, SearchIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { label: "ABOUT", href: "/about" },
  { label: "GIVE & TAKE", href: "/give-and-take" },
  { label: "IMPACT", href: "/impact" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "ZAONE LAB", href: "/zaone-lab" },
  { label: "PARTNER WITH US", href: "/partner-with-us" },
];

// 1024에서 데스크톱 메뉴로 바뀐다. 시안 간격(1280 이상)으로는 1024에 들어가지 않아서
// 1279까지는 좌우 여백과 간격을 줄인다.
export function SiteHeader() {
  return (
    <header className="flex items-center gap-sm bg-bg-default p-xl lg:gap-2xl lg:px-lg xl:gap-6xl xl:px-4xl">
      <Link href="/" className="shrink-0">
        <Logo className="h-auto w-25 text-text-primary lg:w-30" />
      </Link>

      <nav aria-label="주요 메뉴" className="hidden flex-1 lg:block">
        <ul className="flex items-center gap-lg font-display text-display-s-b whitespace-nowrap text-text-tertiary xl:gap-2xl">
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
