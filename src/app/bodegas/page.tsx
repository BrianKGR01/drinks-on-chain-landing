import type { Metadata } from "next";
import { WineriesPage } from "@/components/pages/SimplePages";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/bodegas",
  title: SITE.es.pages.wineries.title,
  description: SITE.es.wineries.text,
});

export default function Page() {
  return <WineriesPage />;
}
