// NEXT_PUBLIC_ 값은 빌드 때 코드에 박힌다. 비어 있으면 Studio가 알아보기 힘든 에러를 내기 전에 여기서 멈춘다.
function assertValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`환경변수 ${name}가 없습니다. .env.local을 확인하세요.`);
  }
  return value;
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

// 2021-03-25 이후라야 Live(syncTags)가 동작하고, 2025-02-19 이후면 기본 perspective가 published다.
export const apiVersion = "2026-10-01";
