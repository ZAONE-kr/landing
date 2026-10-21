import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Logo } from "@/components/ui/Logo";
import { loadSection } from "@/sanity/lib/sections";
import { COMMON_FOOTER } from "@/sanity/sections/common";

// TODO: 시안이 없어 갈 곳을 임시로 정했다. 휴면자원·교육 협력은 메인의 같은 역할 카드와
// 맞췄고, 문의 두 개는 폼이나 메일로 바뀔 수 있다. 시안이 나오면 다시 확인한다.
const SERVICE_LINKS = [
  { label: "휴면자원 연결하기", href: "/give-and-use" },
  { label: "교육·공간 협력하기", href: "/zaone-lab" },
  { label: "후원하기", href: "/donation" },
  { label: "일반문의", href: "/contact" },
  { label: "채용문의", href: "/contact" },
];

const PUBLIC_INTEREST_URL =
  "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml";

// 항목 사이에 세로선을 둔다. 좁은 화면에서는 줄이 넘어가고, 세로선은 앞 항목 줄에 남는다(시안과 같다).
function InfoRow({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-xs lg:gap-y-s">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <span aria-hidden className="h-[17.4px] w-[1.4px] rounded-full bg-border-soft" />
          )}
          {item}
        </Fragment>
      ))}
    </div>
  );
}

// 저작권 글, SNS 주소, 단체 정보는 Studio에서 고친다. 바로가기 링크는 코드에 있다.
export async function SiteFooter() {
  const footer = await loadSection(COMMON_FOOTER);

  return (
    <footer className="bg-bg-strong px-lg py-6xl lg:px-7xl">
      <div className="mx-auto flex max-w-[75rem] flex-col gap-[50px]">
        <div className="flex flex-col gap-2xl lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-[300px] flex-col gap-sm lg:gap-[18px]">
            <Logo className="h-auto w-40 text-icon-inverse lg:w-50" />
            <div className="flex flex-col gap-xs text-detail-xs-m text-text-tertiary lg:gap-s lg:text-detail-m-m">
              <p>{footer.copyright}</p>
              <p>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={footer.instagramUrl}
                  className="link-underline"
                >
                  Instagram
                </Link>{" "}
                ·{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={footer.youtubeUrl}
                  className="link-underline"
                >
                  YouTube
                </Link>
              </p>
            </div>
          </div>

          <nav aria-label="바로가기">
            <ul className="flex flex-col gap-md text-body-s-m whitespace-nowrap text-text-inverse lg:gap-[18px] lg:text-detail-m-m">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="h-[1.4px] border-0 bg-border-soft" />

        <div className="flex flex-col gap-xs text-body-xs-m whitespace-nowrap text-text-tertiary lg:gap-s lg:text-detail-m-m">
          <InfoRow
            items={[
              footer.organization,
              footer.representative,
              footer.businessNumber,
              footer.email,
            ]}
          />
          <InfoRow items={[footer.address, footer.phone]} />
          <InfoRow
            items={[
              // 링크는 문서마다 따로 걸고, 밑줄은 가운뎃점까지 이어지게 바깥에 준다(시안과 같다).
              // 이 줄의 링크는 모두 새 창으로 연다.
              <span key="policies" className="underline">
                <Link target="_blank" rel="noopener noreferrer" href="/privacy">
                  개인정보처리방침
                </Link>{" "}
                ·{" "}
                <Link target="_blank" rel="noopener noreferrer" href="/terms">
                  이용약관
                </Link>
              </span>,
              <Link
                key="public-interest"
                target="_blank"
                rel="noopener noreferrer"
                href={PUBLIC_INTEREST_URL}
                className="underline"
              >
                공익위반사항 관리·감독기관 국세청
              </Link>,
            ]}
          />
        </div>
      </div>
    </footer>
  );
}
