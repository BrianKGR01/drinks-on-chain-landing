import type { Metadata } from "next";
import { LinkHub } from "@/components/pages/LinkHub";
import { LINK_HUB_PATH } from "@/lib/links";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: LINK_HUB_PATH,
  title: "Enlaces",
  description:
    "Todo Drinks on Chain en una página: el sitio, el mapa de las bodegas, las listas de espera, la verificación de una botella y el pitch.",
});

export default function Page() {
  return <LinkHub />;
}
