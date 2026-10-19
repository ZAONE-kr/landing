import { POST_COLUMN } from "@/components/post/layout";
import { DownloadIcon } from "@/components/ui/icons";

import type { NoticeAttachment } from "./notice";

/*
 * 제목 아래 첨부파일 칸(디자이너 메모 "옵션" — 파일이 없으면 칸째 뺀다). 한 줄이 파일 하나이고 줄 전체를 누르면 내려받는다.
 * 1024 시안: 회색 칸(12px 둥글림, 위아래 24·왼쪽 24·오른쪽 32), 줄 사이 16, 이름 Detail-M-SB 18 → 16 띄고 크기
 * Body-S-M 16, 오른쪽 끝에 28px 내려받기 아이콘. 이름이 길면 크기 앞에서 줄을 바꾼다.
 * 375 시안이 아직 없어 모바일은 같은 배치를 한 단계 작은 글자·간격으로 줄였다.
 */
export function NoticeAttachments({
  attachments,
  className = "",
}: {
  attachments: NoticeAttachment[];
  className?: string;
}) {
  if (attachments.length === 0) return null;

  return (
    <section className={`${POST_COLUMN} ${className}`}>
      <h2 className="sr-only">첨부파일</h2>
      <ul className="flex flex-col gap-sm rounded-sm bg-bg-surface py-md pr-lg pl-md lg:gap-md lg:rounded-md lg:py-xl lg:pr-2xl lg:pl-xl">
        {attachments.map((attachment) => (
          <li key={attachment.key}>
            <a
              href={attachment.href}
              className="group flex items-center gap-md rounded-s focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus lg:gap-xl"
            >
              <span className="flex min-w-0 flex-1 items-center gap-sm lg:gap-md">
                <span className="min-w-0 text-body-s-sb wrap-anywhere text-text-primary underline-offset-4 group-hover:underline lg:text-detail-m-sb">
                  {attachment.name}
                </span>
                {attachment.size && (
                  <span className="shrink-0 text-body-xs-m text-text-tertiary lg:text-body-s-m">
                    {attachment.size}
                  </span>
                )}
              </span>
              <DownloadIcon className="size-6 shrink-0 text-icon-secondary transition-colors group-hover:text-icon-primary lg:size-7" />
              <span className="sr-only">내려받기</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
