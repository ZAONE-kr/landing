import type { Metadata } from "next";
import localFont from "next/font/local";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

// 라틴 전용 폰트(글리프 641개). 한글은 globals.css의 --font-display 스택에서 Pretendard로 넘어간다.
const axiforma = localFont({
  src: "./fonts/Axiforma-Book.woff2",
  weight: "300",
  style: "normal",
  variable: "--font-axiforma",
});

const title = "자원(ZAONE) - 휴면자원을 놀이로";
const description =
  "자원(ZAONE)은 생산공장 상의 휴면자원을 어린이를 위한 놀이 소재로 전환합니다. 자원은 폐기물의 개념을 바꿉니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zaone.org"),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "자원(ZAONE)",
    title,
    description,
    locale: "ko_KR",
  },
  verification: {
    google: "Ub2YfK6Tu8y1acSPadWYlytbjpxoTNjO7HVH1PY3Ybo",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={axiforma.variable}>
      <body>{children}</body>
    </html>
  );
}
