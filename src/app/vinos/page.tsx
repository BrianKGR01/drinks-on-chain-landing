import type { Metadata } from "next";
import { WinesPage } from "@/components/pages/WinesPage";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/vinos",
  title: "Vinos",
  description:
    "Vinos y singanis de Tarija y el Valle de Cinti que hoy puedes seguir y adquirir: añadas, precios de bodega, lotes en preventa y botellas listas para retirar.",
});

export default async function Page({ searchParams }: PageProps<"/vinos">) {
  const { v } = await searchParams;
  return <WinesPage initialSlug={typeof v === "string" ? v : undefined} />;
}
