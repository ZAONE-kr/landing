import { POST_COLUMN } from "@/components/post/layout";
import { formatNoticeDate } from "@/sanity/lib/notices";

/*
 * 글 맨 위의 칩(사업소식·사업보고) → 제목 → 게시일. 셋 다 꼭 있는 자리다(디자이너 메모 "필수영역").
 * 1024 시안은 제목을 좌우 80px 더 안쪽(704px)에서 줄을 바꾼다. 375 시안이 아직 없어 모바일 글자는 인사이트 상세의
 * 375 크기(제목 Title-M-B)에 맞췄다.
 * 칩은 ZAONE LAB 카드 태그와 같은 얇은 테두리 알약이다(zaone-lab/_components/ApplicationsSection.tsx).
 */
export function NoticeHeader({
  category,
  title,
  publishedAt,
}: {
  category: string;
  title: string;
  publishedAt: string | null;
}) {
  return (
    <header
      className={`${POST_COLUMN} flex flex-col items-center gap-md pt-4xl text-center lg:gap-xl lg:pt-6xl`}
    >
      <p className="rounded-full border-[0.648px] border-text-primary px-sm py-xs text-detail-ss-m text-text-primary lg:px-md lg:text-detail-s-m">
        {category}
      </p>
      <h1 className="w-full text-title-m-b text-balance text-text-primary lg:px-6xl lg:text-heading-s-b">
        {title}
      </h1>
      {publishedAt && (
        <time dateTime={publishedAt} className="text-body-xs-m text-text-tertiary lg:text-body-s-m">
          {formatNoticeDate(publishedAt)}
        </time>
      )}
    </header>
  );
}
