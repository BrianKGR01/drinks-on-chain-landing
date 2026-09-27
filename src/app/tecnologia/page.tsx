import type { Metadata } from "next";
import { TechnologyPage } from "@/components/pages/SimplePages";
import { SITE } from "@/content/site-i18n";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/tecnologia",
  title: SITE.es.pages.tech.title,
  description:
    "Trazabilidad registrada lote a lote por cada bodega, un NFT por botella en la red Stellar y una billetera que la plataforma gestiona por ti, sin frase semilla ni criptomonedas. Qué datos guardamos y cuáles no.",
});

export default function Page() {
  return <TechnologyPage />;
}
