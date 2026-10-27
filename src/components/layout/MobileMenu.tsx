"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

/*
 * TODO: 열린 상태의 시안이 없어, 테스트하며 페이지를 오가기 편하도록 임시로 만든 메뉴다.
 * 시안이 나오면 모양과 움직임을 다시 만든다.
 * - 오른쪽에서 미끄러져 들어오고(0.3초), 어두운 바탕·닫기 버튼·Esc·메뉴 링크로 닫힌다.
 * - 열려 있는 동안 페이지 스크롤을 막고 Tab은 패널 안에서만 돈다. 닫히면 메뉴 버튼으로 포커스를 돌린다.
 * - 화면이 1024 이상으로 넓어지면 데스크톱 메뉴가 나오므로 닫는다.
 * 패널이 헤더 안에 있어 헤더가 숨을 때 걸리는 transform이 fixed의 기준을 헤더로 바꾼다. 열려 있는 동안은
 * 스크롤을 막아 헤더가 숨지 않으므로 화면 전체를 덮는다.
 */
export function MobileMenu({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const button = buttonRef.current;
    if (!open || !panel || !button) return;

    const root = document.documentElement;
    const focusables = panel.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const outside = !panel.contains(document.activeElement);
      if (event.shiftKey && (outside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    root.style.overflow = "hidden";
    first.focus({ preventScroll: true });
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      root.style.removeProperty("overflow");
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
      if (panel.contains(document.activeElement)) button.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="text-icon-primary lg:hidden"
      >
        <MenuIcon className="size-6" />
      </button>

      {/*
       * 닫힐 때는 미끄러져 나가는 0.3초 동안 보이다가 숨는다. inert라 그동안 눌리지 않는다.
       * 열릴 때는 전환 없이 바로 보여야 한다. 전환이 걸리면 첫 순간은 아직 숨은 상태라 닫기 버튼에 포커스를 줄 수 없다.
       */}
      <div
        id={panelId}
        inert={!open}
        className={`fixed inset-0 z-10 overflow-hidden lg:hidden ${open ? "visible" : "invisible transition-[visibility] duration-300 motion-reduce:transition-none"}`}
      >
        <div
          aria-hidden
          onClick={close}
          className={`absolute inset-0 bg-bg-overlay transition-opacity duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal
          aria-label="메뉴"
          className={`absolute inset-y-0 right-0 flex w-[min(20rem,85%)] flex-col overflow-y-auto bg-bg-default transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* 닫기 버튼이 헤더의 메뉴 버튼과 같은 자리에 오도록 헤더와 같은 여백을 준다. */}
          <div className="flex justify-end p-xl">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={close}
              className="text-icon-primary"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav aria-label="주요 메뉴" className="px-xl">
            <ul className="flex flex-col gap-lg font-display text-display-m-b text-text-tertiary">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={close}
                    className="link-underline aria-[current=page]:text-text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-xl">
            <Button
              href="/donation"
              variant="outline"
              onClick={close}
              className="w-full px-md py-sm text-body-s-m"
            >
              후원하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
