/**
 * Origin of a waiting-list sign-up (`source` of `POST /v1/public/waitlist`): the `?src=` of the
 * link the visitor arrived with, e.g. the QR of an event (`?src=tarija-2026`) or a shared link
 * (`?src=amigo`). It is remembered for the browser session, so it survives a walk through the
 * site before reaching the form. Only `[a-z0-9-]{1,40}` is ever kept or sent.
 */

export const SOURCE_PARAM = "src";
export const SOURCE_KEY = "doc-waitlist-src";
/** Source carried by the links people share from the confirmation. */
export const SHARE_SOURCE = "amigo";

const SOURCE_RE = /^[a-z0-9-]{1,40}$/;

/** A valid source in canonical form (trimmed, lower case), or null. */
export function parseSource(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim().toLowerCase();
  return SOURCE_RE.test(value) ? value : null;
}

function stored(): string | null {
  try {
    const raw = window.sessionStorage.getItem(SOURCE_KEY);
    if (raw === null) return null;
    const value = parseSource(raw);
    // A value that is not valid (edited by hand, an older format) is dropped.
    if (value === null) window.sessionStorage.removeItem(SOURCE_KEY);
    return value;
  } catch {
    return null;
  }
}

/**
 * Reads `?src=` of a query string and remembers it for the session. The latest link wins: a valid
 * value replaces the stored one, and a value that is not valid removes it (the origin of that
 * visit is unknown). Without the parameter the stored value stays. Returns the source in force.
 */
export function captureSource(search: string): string | null {
  const params = new URLSearchParams(search);
  if (!params.has(SOURCE_PARAM)) return stored();
  const value = parseSource(params.get(SOURCE_PARAM));
  try {
    if (value) window.sessionStorage.setItem(SOURCE_KEY, value);
    else window.sessionStorage.removeItem(SOURCE_KEY);
  } catch {
    /* storage unavailable: the source of this page's own URL still counts */
  }
  return value;
}

/** Source to send with a sign-up made on the current page. */
export function currentSource(): string | null {
  return captureSource(window.location.search);
}
