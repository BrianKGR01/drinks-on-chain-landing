/**
 * Outbound links to the other sites of the ecosystem. Never hard-code a host:
 * the root domain is not bought yet, and each environment points elsewhere.
 */
const PROD = process.env.NODE_ENV === "production";
/** Marketplace: not deployed yet, so production falls back to the explainer page of this site. */
const APP = process.env.NEXT_PUBLIC_URL_APP ?? (PROD ? "/como-funciona" : "http://localhost:3005");
/** Bodegas site on Vercel until the root domain exists. */
const BODEGAS = process.env.NEXT_PUBLIC_URL_BODEGAS ?? (PROD ? "https://drinks-on-chain-bodegas.vercel.app" : "http://localhost:3000");

const join = (base: string, path = "") => `${base.replace(/\/$/, "")}${path}`;

/** General contact address of Drinks on Chain (the one of the legal notice). */
export const CONTACT_EMAIL = "contacto@drinksonchain.bo";

/** Consumer waiting list of this site. */
export const WAITLIST_PATH = "/lista-de-espera";
/**
 * Props of every `<Link>` to the list. Not prefetched: a prefetch would download the form's
 * JavaScript on the pages that only link to it (the home, and every page through the header).
 */
export const WAITLIST_LINK = { href: WAITLIST_PATH, prefetch: false } as const;

export const LINKS = {
  /** Marketplace home (browse without an account). */
  app: join(APP),
  /** Single sign-up / sign-in screen of the Marketplace. */
  appEnter: join(APP, "/entrar"),
  /** Bottle viewer: the physical QR points here. */
  appBottle: (code: string) => join(APP, `/b/${encodeURIComponent(code)}`),
  /** A collection / wine in the Marketplace. */
  appWine: (slug: string) => join(APP, `/coleccion/${slug}`),
  /** Bodegas site (the etched map). */
  bodegas: join(BODEGAS),
  bodegasJoin: join(BODEGAS, "/unirse"),
  bodegasProfile: (slug: string) => join(BODEGAS, `/bodegas/${slug}`),
  bodegasParcel: (village: string, parcel: string) => join(BODEGAS, `/valles/${village}/${parcel}`),
  /** WhatsApp's share sheet with a prepared message (the person picks the chat). */
  whatsappShare: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
} as const;
