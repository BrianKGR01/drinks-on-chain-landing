/**
 * Outbound links to the other sites of the ecosystem. Never hard-code a host:
 * the root domain is not bought yet, and each environment points elsewhere.
 *
 * The Marketplace has no public URL yet: without `NEXT_PUBLIC_URL_APP` in production
 * every link to it either becomes a page of this site that answers the same question
 * (`wines`, `scan`) or is `null`, and the components do not show it. No button leads
 * nowhere.
 */

const join = (base: string, path = "") => `${base.replace(/\/+$/, "")}${path}`;

/** A usable base URL (`http(s)://…`), or null: an empty or malformed variable counts as absent. */
export function siteBase(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw || !/^https?:\/\/[^/\s]+/i.test(raw)) return null;
  return raw.replace(/\/+$/, "");
}

/** General contact address of Drinks on Chain (the one of the legal notice). */
export const CONTACT_EMAIL = "contacto@drinksonchain.bo";

/** Consumer waiting list of this site. */
export const WAITLIST_PATH = "/lista-de-espera";
/**
 * Props of every `<Link>` to the list. Not prefetched: a prefetch would download the form's
 * JavaScript on the pages that only link to it (the home, and every page through the header).
 */
export const WAITLIST_LINK = { href: WAITLIST_PATH, prefetch: false } as const;

/** Where this site explains the bottle viewer while the Marketplace cannot be linked. */
export const SCAN_HELP_PATH = "/como-funciona#escanear";
/** The wines of this site (`?v=` opens one of them). */
export const WINES_PATH = "/vinos";

export interface SiteUrls {
  /** S2 Marketplace (`NEXT_PUBLIC_URL_APP`); null while it has no public URL. */
  app: string | null;
  /** Bodegas site (the etched map). */
  bodegas: string;
}

/** Links for the hosts of one environment (injectable in tests). */
export function buildLinks(urls: SiteUrls) {
  const app = siteBase(urls.app);
  const catalog = app ? join(app, "/catalogo") : null;
  const verify = app ? join(app, "/b") : null;
  return {
    /** Marketplace home, or null while the Marketplace has no public URL. */
    app: app ? join(app) : null,
    /** "Entrar": the Marketplace is where a consumer's account lives. Null without it. */
    appEnter: app ? join(app) : null,
    /** Marketplace catalogue, or null. */
    catalog,
    /** "Explorar los vinos": the catalogue of the Marketplace, or the wines of this site. */
    wines: catalog ?? WINES_PATH,
    /** "Verifica una botella": the public viewer of a bottle or lot code (`/b`), or null. */
    verify,
    /** "¿Escaneaste una botella?": the viewer, or the explanation of this site. */
    scan: verify ?? SCAN_HELP_PATH,
    /** Viewer of one code (the physical QR points here), or null. */
    appBottle: (code: string) => (app ? join(app, `/b/${encodeURIComponent(code)}`) : null),
    /** Page of one winery in the Marketplace, or null. */
    appWinery: (slug: string) => (app ? join(app, `/bodegas/${encodeURIComponent(slug)}`) : null),
    /** One wine of this site's showcase. */
    wine: (slug: string) => `${WINES_PATH}?v=${encodeURIComponent(slug)}`,
    /** Bodegas site (the etched map). */
    bodegas: join(urls.bodegas),
    bodegasJoin: join(urls.bodegas, "/unirse"),
    bodegasPickup: join(urls.bodegas, "/puntos-de-recojo"),
    bodegasProfile: (slug: string) => join(urls.bodegas, `/bodegas/${slug}`),
    bodegasParcel: (village: string, parcel: string) => join(urls.bodegas, `/valles/${village}/${parcel}`),
    /** WhatsApp's share sheet with a prepared message (the person picks the chat). */
    whatsappShare: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  } as const;
}

const PROD = process.env.NODE_ENV === "production";

export const LINKS = buildLinks({
  // `??`, not `||`: an empty variable switches the Marketplace links off, also in development.
  app: process.env.NEXT_PUBLIC_URL_APP ?? (PROD ? null : "http://localhost:3005"),
  // Bodegas site on Vercel until the root domain exists.
  bodegas: siteBase(process.env.NEXT_PUBLIC_URL_BODEGAS) ?? (PROD ? "https://drinks-on-chain-bodegas.vercel.app" : "http://localhost:3000"),
});

/** True when a link leaves this site (a plain `<a>`), false for a path of this site. */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
