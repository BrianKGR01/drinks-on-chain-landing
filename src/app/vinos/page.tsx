import type { Metadata } from "next";
import { WinesPage, type WineEntry } from "@/components/pages/WinesPage";
import { IMAGES } from "@/content/images";
import { getParcelContent, grapeOf, wineKindOf } from "@/content/parcels";
import { VILLAGES } from "@/content/villages";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/vinos",
  title: "Vinos",
  description:
    "Vinos y singanis de Tarija y el Valle de Cinti que hoy puedes seguir y adquirir: añadas, precios, lotes en preventa y botellas listas para canjear.",
});

/** The showcase needs names and specifications only: the long zone texts stay on the server. */
const WINES: WineEntry[] = VILLAGES.flatMap((village) =>
  village.parcels.map((parcel) => {
    const es = getParcelContent(village, parcel, "es").wine;
    const en = getParcelContent(village, parcel, "en").wine;
    const photo = IMAGES.wines[parcel.id];
    return {
      id: parcel.id,
      slug: parcel.slug,
      villageSlug: village.slug,
      villageName: village.name,
      parcelName: parcel.name,
      altitude: parcel.altitude,
      kind: wineKindOf(parcel.id),
      grape: grapeOf(parcel.id),
      name: { es: es.name, en: en.name },
      specifications: { es: es.specifications, en: en.specifications },
      photo: photo ? { src: photo.src, alt: photo.alt, credit: photo.credit } : undefined,
    };
  }),
);

export default async function Page({ searchParams }: PageProps<"/vinos">) {
  const { v } = await searchParams;
  return <WinesPage wines={WINES} initialSlug={typeof v === "string" ? v : undefined} />;
}
