import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/pages/SimplePages";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/como-funciona",
  title: SITE.es.pages.how.title,
  description: `${SITE.es.pages.how.intro} Escanea, descubre, adquiere y retira tus botellas.`,
});

export default function Page() {
  return <HowItWorksPage />;
}
