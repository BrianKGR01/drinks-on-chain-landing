import type { Metadata } from "next";
import { Home } from "@/components/home/Home";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ path: "/", description: SITE.es.hero.lead });

export default function Page() {
  return <Home />;
}
