import { NextStudio } from "next-sanity/studio";

import { revalidateSanityTags } from "@/sanity/lib/actions";
import { SanityLive } from "@/sanity/lib/live";

import config from "../../../../sanity.config";

// Studio는 브라우저에서만 그려지므로 HTML 껍데기는 빌드 때 한 번만 만든다.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function AdminPage() {
  return (
    <>
      <NextStudio config={config} />
      {/*
       * 게시하는 곳(Studio)에서 알림을 받아 캐시를 무효화한다. 사이트 페이지에는 두지 않는다(live.ts).
       * 연결이 다시 시작되거나(restart) 서버가 연결을 닫을 때(goaway) 화면을 새로 고치는 기본 동작은 끈다.
       * 새로 고치면 Studio가 다시 마운트되어 고치던 내용이 흐트러진다. welcome은 연결 기록만 남기는 동작이라 함께 끈다.
       */}
      <SanityLive
        action={revalidateSanityTags}
        onRestart={false}
        onGoAway={false}
        onWelcome={false}
      />
    </>
  );
}
