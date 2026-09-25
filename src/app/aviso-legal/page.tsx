import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/LegalPage";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/aviso-legal",
  title: SITE.es.footer.legalNotice,
  description:
    "Aviso legal de Drinks on Chain: editor, alojamiento, propiedad intelectual, datos personales y consumo responsable. Venta prohibida a menores de 18 años.",
});

export default function Page() {
  return <LegalPage />;
}
