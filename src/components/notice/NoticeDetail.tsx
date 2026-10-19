import { POST_COLUMN } from "@/components/post/layout";
import { PostBody } from "@/components/post/PostBody";
import { PostPoster } from "@/components/post/PostPoster";
import type { NoticeCategory } from "@/sanity/lib/notices";

import { type Notice, toAttachments } from "./notice";
import { NoticeAttachments } from "./NoticeAttachments";
import { NoticeHeader } from "./NoticeHeader";
import { OtherNoticesSection } from "./OtherNoticesSection";

/*
 * 사업소식·사업보고 상세(Figma "[1017] CONTACT 작업중" 1555:5653, 1024만 있음). 두 종류가 같은 화면이고 칩 글자만 다르다.
 * 칩·제목·게시일 → 구분선 → 첨부파일 → 본문 → 포스터 → 다른 소식 살펴보기. 칩·제목·게시일만 꼭 있는 자리이고,
 * 첨부파일·본문 사진·포스터는 있을 때만 보인다(디자이너 메모). 본문과 포스터는 인사이트 상세와 같은 컴포넌트다.
 * 1024 시안 간격: 게시일 → 80 → 구분선 → 40 → 첨부파일 → 64 → 본문 → 64 → 포스터 → 120 → 다른 소식.
 */
export function NoticeDetail({ category, notice }: { category: NoticeCategory; notice: Notice }) {
  return (
    <main>
      <article className="pb-3xl lg:pb-7xl">
        <NoticeHeader
          category={category.title}
          title={notice.title?.trim() || "제목 없음"}
          publishedAt={notice.publishedAt}
        />
        {/* 시안의 구분선은 두께 없는 선이라 위아래 간격을 선 자리에서 잰다. 선 두께(1px)만큼 아래 간격을 줄인다. */}
        <hr className={`${POST_COLUMN} mt-4xl -mb-px border-border-strong lg:mt-6xl`} />
        <NoticeAttachments
          attachments={toAttachments(notice.attachments)}
          className="mt-xl lg:mt-3xl"
        />
        {notice.body && <PostBody value={notice.body} className="mt-4xl lg:mt-5xl" />}
        <PostPoster image={notice.posterImage} />
      </article>
      <OtherNoticesSection type={category.type} older={notice.older} newer={notice.newer} />
    </main>
  );
}
