import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

// Studio는 브라우저에서만 그려지므로 HTML 껍데기는 빌드 때 한 번만 만든다.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function AdminPage() {
  return <NextStudio config={config} />;
}
