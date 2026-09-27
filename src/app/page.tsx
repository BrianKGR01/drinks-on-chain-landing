import type { Metadata } from "next";
import { Home, type FeaturedWine, type NetworkSummary } from "@/components/home/Home";
import { IMAGES } from "@/content/images";
import { NETWORK_COPY, WINERIES } from "@/content/network";
import { getParcelContent } from "@/content/parcels";
import { SITE } from "@/content/site-i18n";
import { VILLAGES } from "@/content/villages";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ path: "/", description: SITE.es.hero.lead });

const FEATURED = ["t02", "t07", "t13", "c01"] as const;

/**
 * Prepared at build time: the home needs a few names and labels, while the
 * zone texts and winery stories they come from weigh ~50 kB compressed as
 * client JavaScript.
 */
function featuredWines(): FeaturedWine[] {
  return FEATURED.flatMap((id) => {
    const village = VILLAGES.find((v) => v.parcels.some((p) => p.id === id));
    const parcel = village?.parcels.find((p) => p.id === id);
    if (!village || !parcel) return [];
    const es = getParcelContent(village, parcel, "es").wine;
    const en = getParcelContent(village, parcel, "en").wine;
    const photo = IMAGES.wines[id];
    return [
      {
        id,
        slug: parcel.slug,
        kind: es.kind,
        name: { es: es.name, en: en.name },
        parcelName: parcel.name,
        villageName: village.name,
        altitude: parcel.altitude,
        photo: photo ? { src: photo.src, alt: photo.alt } : undefined,
      },
    ];
  });
}

function networkSummary(): NetworkSummary {
  return {
    wineries: WINERIES.map((w) => ({ id: w.id, slug: w.slug, name: w.name, status: w.status })),
    status: { es: NETWORK_COPY.es.status, en: NETWORK_COPY.en.status },
    testNotice: { es: NETWORK_COPY.es.testNotice, en: NETWORK_COPY.en.testNotice },
  };
}

export default function Page() {
  return <Home featured={featuredWines()} network={networkSummary()} />;
}
