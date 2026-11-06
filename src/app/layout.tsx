import type { Metadata } from "next";
import localFont from "next/font/local";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { SITE_URL, siteOpenGraph } from "./shared-metadata";

// 라틴 전용 폰트(글리프 641개). 한글은 globals.css의 --font-display 스택에서 Pretendard로 넘어간다.
const axiforma = localFont({
  src: "./fonts/Axiforma-Book.woff2",
  weight: "300",
  style: "normal",
  variable: "--font-axiforma",
});

// IMPACT 수치(Display-XXL-B·XL-B)에만 쓰는 Bold. Book과 한 벌로 묶으면 모든 페이지가 40KB를 먼저 받아
// 첫 화면 사진이 늦어진다. 그래서 따로 두고 미리 받지 않는다. 수치는 아래쪽에 있어 보일 때쯤 받아져 있다.
// 다른 family라 font-display가 아니라 font-display-bold로 쓴다.
const axiformaBold = localFont({
  src: "./fonts/Axiforma-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-axiforma-bold",
  preload: false,
});

const title = "산업폐기물의 재사용, 배움의 재료가 되다";
const description =
  "자원(ZAONE)은 기업의 생산 과정에서 버려지는 자재를 검토·분류해 교육 현장의 재료로 연결합니다. 산업폐기물의 창의적 재사용을 통해 새로운 배움의 환경을 만듭니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...siteOpenGraph,
    url: "/",
    title,
    description,
  },
  verification: {
    google: "Ub2YfK6Tu8y1acSPadWYlytbjpxoTNjO7HVH1PY3Ybo",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${axiforma.variable} ${axiformaBold.variable}`}>
      <body>{children}</body>
    </html>
  );
}
