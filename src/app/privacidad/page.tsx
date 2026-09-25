import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/SimplePages";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/privacidad",
  title: SITE.es.pages.privacy.title,
  description: SITE.es.pages.privacy.p,
});

export default function Page() {
  return <PrivacyPage />;
}
