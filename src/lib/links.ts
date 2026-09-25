/**
 * Outbound links to the other sites of the ecosystem. Never hard-code a host:
 * the root domain is not bought yet, and each environment points elsewhere.
 */
const PROD = process.env.NODE_ENV === "production";
/** Marketplace: not deployed yet, so production falls back to the explainer page of this site. */
const APP = process.env.NEXT_PUBLIC_URL_APP ?? (PROD ? "/como-funciona" : "http://localhost:3002");
/** Bodegas site on Vercel until the root domain exists. */
const BODEGAS = process.env.NEXT_PUBLIC_URL_BODEGAS ?? (PROD ? "https://drinks-on-chain-bodegas.vercel.app" : "http://localhost:3000");

const join = (base: string, path = "") => `${base.replace(/\/$/, "")}${path}`;

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
} as const;
