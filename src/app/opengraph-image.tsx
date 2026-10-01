import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* Default share image for every route that does not bring its own (see src/lib/og.tsx). */
export const alt = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: "TARIJA · VALLE DE CINTI · BOLIVIA", title: "DRINKS ON CHAIN", tagline: SITE_TAGLINE });
}
