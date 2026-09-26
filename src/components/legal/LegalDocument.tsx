import type { ReactNode } from "react";

// 이용약관·개인정보 처리방침 공용 틀. 시안 없이 기존 토큰으로만 짠다.
// 본문 글자 크기와 색은 여기서 정하고, 조항의 <p>는 그대로 물려받는다.
export function LegalDocument({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="px-xl py-5xl lg:px-5xl lg:py-7xl">
      <article className="mx-auto flex max-w-[50rem] flex-col gap-3xl lg:gap-5xl">
        <h1 className="text-title-m-b text-text-primary lg:text-title-l-b">{title}</h1>
        <div className="flex flex-col gap-3xl text-body-xs-m text-text-secondary lg:gap-4xl lg:text-body-s-m">
          {children}
        </div>
      </article>
    </main>
  );
}

// level 3은 개인정보 처리방침 "4."의 하위 항목 "1)~8)"에 쓴다.
export function LegalSection({
  title,
  level = 2,
  children,
}: {
  title: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  if (level === 3) {
    return (
      <section className="mt-lg flex flex-col gap-sm lg:mt-xl">
        <h3 className="text-body-xs-b text-text-primary lg:text-body-s-b">{title}</h3>
        {children}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-sm">
      <h2 className="text-body-s-b text-text-primary lg:text-title-s-b">{title}</h2>
      {children}
    </section>
  );
}

// Tailwind preflight가 목록 기호를 지우므로 다시 켠다.
// 항목 안에 목록을 넣을 때는 className="mt-xs"로 위 글과 띄운다.
type ListProps = { className?: string; children: ReactNode };

export function NumberedList({ className = "", children }: ListProps) {
  return <ol className={`flex list-decimal flex-col gap-xs pl-xl ${className}`}>{children}</ol>;
}

export function BulletList({ className = "", children }: ListProps) {
  return <ul className={`flex list-disc flex-col gap-xs pl-xl ${className}`}>{children}</ul>;
}
