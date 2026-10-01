import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { WAITLIST_OG_ALT } from "@/lib/waitlist-meta";

/* Share image of the waiting list: what people see when the link is passed around. */
export const alt = WAITLIST_OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "DRINKS ON CHAIN · LISTA DE ESPERA",
    title: "SÉ DE LOS PRIMEROS",
    tagline: "Vinos y singanis de altura, con trazabilidad verificable.",
  });
}
