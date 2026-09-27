import type { Metadata } from "next";
import { WineriesPage, type WineryDirectory } from "@/components/pages/SimplePages";
import { NETWORK_COPY, WINERIES } from "@/content/network";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/bodegas",
  title: SITE.es.pages.wineries.title,
  description: SITE.es.wineries.text,
});

/** Names and labels only: the winery stories and lots stay on the server. */
const DIRECTORY: WineryDirectory = {
  wineries: WINERIES.map((w) => ({ id: w.id, slug: w.slug, name: w.name, status: w.status, town: w.town })),
  status: { es: NETWORK_COPY.es.status, en: NETWORK_COPY.en.status },
  testNotice: { es: NETWORK_COPY.es.testNotice, en: NETWORK_COPY.en.testNotice },
};

export default function Page() {
  return <WineriesPage directory={DIRECTORY} />;
}
