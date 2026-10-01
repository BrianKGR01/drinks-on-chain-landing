import type { Metadata } from "next";
import { WaitlistPage } from "@/components/waitlist/WaitlistPage";
import { readApiOrigin } from "@/lib/api-origin";
import { WAITLIST_PATH } from "@/lib/links";
import { pageMetadata } from "@/lib/site";
import { WAITLIST_DESCRIPTION, WAITLIST_OG_ALT, WAITLIST_TITLE } from "@/lib/waitlist-meta";

export const metadata: Metadata = pageMetadata({
  path: WAITLIST_PATH,
  title: WAITLIST_TITLE,
  description: WAITLIST_DESCRIPTION,
  image: { url: `${WAITLIST_PATH}/opengraph-image`, alt: WAITLIST_OG_ALT },
});

export default function Page() {
  // Same check as the `/api/v1` proxy in src/proxy.ts: without an API the form says so instead of failing.
  return <WaitlistPage apiReady={readApiOrigin() !== null} />;
}
