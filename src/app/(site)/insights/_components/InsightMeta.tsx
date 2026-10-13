import { POST_COLUMN } from "@/components/post/layout";

/*
 * 대표이미지 아래 프로젝트 명·파트너 줄. 이름 칸 폭은 1024 시안 180px, 375 시안 100px로 고정이고 값이 길면 그 오른쪽에서
 * 줄을 바꾼다. 빈 값(API로 들어온 글)은 줄째 뺀다.
 */
export function InsightMeta({
  projectName,
  partner,
}: {
  projectName: string | null;
  partner: string | null;
}) {
  const rows = [
    { label: "프로젝트 명", value: projectName?.trim() },
    { label: "파트너", value: partner?.trim() },
  ].filter((row) => row.value);
  if (rows.length === 0) return null;

  return (
    <dl className={`${POST_COLUMN} flex flex-col gap-xl pt-3xl lg:pt-6xl`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-start">
          <dt className="w-[100px] shrink-0 text-body-xs-m text-text-tertiary lg:w-[180px] lg:text-body-sm-m">
            {row.label}
          </dt>
          <dd className="min-w-0 text-body-s-b text-text-primary lg:text-title-m-b">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
