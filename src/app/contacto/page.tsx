import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/contacto",
  title: SITE.es.footer.contact,
  description:
    "Escribe a Drinks on Chain: bodegas que quieren trazar sus lotes, licorerías, cavas y restaurantes como puntos de recojo, y prensa.",
});

export default function Page() {
  return <ContactPage />;
}
