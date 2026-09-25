import type { Metadata } from "next";
import { TechnologyPage } from "@/components/pages/SimplePages";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/tecnologia",
  title: SITE.es.pages.tech.title,
  description:
    "Trazabilidad registrada lote a lote por cada bodega, tokens de botella en la red Stellar y una billetera protegida con la biometría de tu teléfono, sin frase semilla. Qué datos guardamos y cuáles no.",
});

export default function Page() {
  return <TechnologyPage />;
}
