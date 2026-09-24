/**
 * Outbound links to the other sites of the ecosystem. Never hard-code a host:
 * the root domain is not bought yet, and each environment points elsewhere.
 */
const APP = process.env.NEXT_PUBLIC_URL_APP ?? "http://localhost:3002";
const BODEGAS = process.env.NEXT_PUBLIC_URL_BODEGAS ?? "http://localhost:3000";

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
  bodegasParcel: (village: string, parcel: string) => join(BODEGAS, `/parcelas/${village}/${parcel}`),
} as const;
