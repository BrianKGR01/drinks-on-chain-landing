import { WAITLIST_PATH } from "./links";
import { SHARE_SOURCE, SOURCE_PARAM } from "./waitlist-source";
import { SITE_NAME, siteUrl } from "./site";

/** Metadata of `/lista-de-espera` (server) and the link people share from the confirmation. */
export const WAITLIST_TITLE = "Lista de espera";
export const WAITLIST_DESCRIPTION =
  "Vinos y singanis de altura de Bolivia con trazabilidad verificable, de la parcela a la copa. Apúntate a la lista de espera y sé de los primeros en entrar a la preventa.";
export const WAITLIST_OG_ALT = `${SITE_NAME} · Lista de espera: sé de los primeros en la preventa`;

/** Canonical address of the list with the origin of a shared link (`?src=amigo`). */
export const WAITLIST_SHARE_URL = `${siteUrl(WAITLIST_PATH)}?${SOURCE_PARAM}=${SHARE_SOURCE}`;
