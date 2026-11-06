import { SITE_URL, siteOpenGraph } from "@/app/shared-metadata";
import { loadSection } from "@/sanity/lib/sections";
import { COMMON_FOOTER } from "@/sanity/sections/common";

/*
 * 검색 엔진에 단체와 글을 알려 주는 구조화 데이터(JSON-LD, schema.org).
 * Next 안내(node_modules/next/dist/docs/01-app/02-guides/json-ld.md)대로 페이지에 script로 넣는다.
 * 글 제목 같은 운영자 입력이 script를 닫지 못하게 <를 <로 바꾼다.
 * 확인은 구글 리치 결과 테스트(https://search.google.com/test/rich-results)로 한다.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}

const SITE_NAME = siteOpenGraph.siteName;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/*
 * 홈에만 둔다. 단체 정보(Organization)는 구글이 로고·연락처로, 네이버가 연관 채널(sameAs의 SNS)로 읽는다.
 * 사이트 이름(WebSite)은 홈에 있어야 구글 검색 결과에 주소 대신 이름으로 나온다.
 * 연락처·SNS 주소는 푸터와 같은 Studio 값이라, 운영자가 푸터를 고치면 함께 바뀐다.
 */
export async function SiteJsonLd() {
  const footer = await loadSection(COMMON_FOOTER);

  return (
    <JsonLd
      data={{
        "@graph": [
          {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name: SITE_NAME,
            alternateName: "ZAONE",
            legalName: footer.organization,
            url: SITE_URL,
            logo: `${SITE_URL}/icon.png`,
            email: footer.email,
            telephone: footer.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: footer.address,
              addressCountry: "KR",
            },
            sameAs: [footer.instagramUrl, footer.youtubeUrl],
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            alternateName: "ZAONE",
            url: `${SITE_URL}/`,
            publisher: { "@id": ORGANIZATION_ID },
          },
        ],
      }}
    />
  );
}

/*
 * 글 상세(인사이트·ABOUT 상세 글·사업소식·사업보고). 구글이 글의 날짜와 대표 사진을 바르게 읽게 한다.
 * publishedAt은 Studio의 게시일(YYYY-MM-DD), updatedAt은 Sanity가 기록한 마지막 수정 시각이다.
 * 게시일 칸이 없는 글(ABOUT 상세 글)이나 대표 사진이 없는 글(사업소식·사업보고)은 그 항목을 뺀다.
 */
export function ArticleJsonLd({
  path,
  title,
  image,
  publishedAt,
  updatedAt,
}: {
  path: string;
  title: string;
  image?: string;
  publishedAt?: string | null;
  updatedAt: string;
}) {
  return (
    <JsonLd
      data={{
        "@type": "Article",
        headline: title,
        url: new URL(path, SITE_URL).href,
        ...(image && { image: [image] }),
        ...(publishedAt && { datePublished: publishedAt }),
        dateModified: updatedAt,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      }}
    />
  );
}
