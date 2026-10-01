"use client";

import { useState } from "react";
import { LINKS } from "@/lib/links";
import type { Lang } from "@/lib/scene-contract";
import { WAITLIST_SHARE_URL } from "@/lib/waitlist-meta";
import styles from "./Waitlist.module.css";

const COPY = {
  es: {
    title: "Pásalo a quien le guste el buen vino",
    share: "Compartir",
    whatsapp: "Enviar por WhatsApp",
    copy: "Copiar enlace",
    copied: "Enlace copiado.",
    copyFailed: "No se pudo copiar. Copia este enlace:",
    shareTitle: "Drinks on Chain · Lista de espera",
    shareText: "Me apunté a la lista de espera de Drinks on Chain: vinos y singanis de altura de Bolivia con trazabilidad verificable. Apúntate aquí:",
  },
  en: {
    title: "Pass it on to someone who enjoys good wine",
    share: "Share",
    whatsapp: "Send on WhatsApp",
    copy: "Copy link",
    copied: "Link copied.",
    copyFailed: "It could not be copied. Copy this link:",
    shareTitle: "Drinks on Chain · Waiting list",
    shareText: "I joined the Drinks on Chain waiting list: high-altitude wines and singanis from Bolivia with verifiable traceability. Join here:",
  },
} as const;

const canShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

/**
 * Sharing from the confirmation. The link is the canonical address of the list with `?src=amigo`,
 * so sign-ups that come from it are counted as such. With the Web Share API (phones) one button
 * opens the system sheet; without it, a WhatsApp link and "copy link".
 */
export function WaitlistShare({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  // Only rendered after a sign-up, on the client: `navigator` can be read while rendering.
  const [native, setNative] = useState(canShare);
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  const share = async () => {
    try {
      await navigator.share({ title: c.shareTitle, text: c.shareText, url: WAITLIST_SHARE_URL });
    } catch (e) {
      // Closing the sheet is not an error; anything else falls back to the links.
      if (!(e instanceof DOMException && e.name === "AbortError")) setNative(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WAITLIST_SHARE_URL);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className={styles.share}>
      <p className={styles.doneLabel}>{c.title}</p>
      <div className={styles.shareActions}>
        {native ? (
          <button type="button" className={styles.submit} onClick={share}>
            {c.share}
          </button>
        ) : (
          <>
            <a href={LINKS.whatsappShare(`${c.shareText} ${WAITLIST_SHARE_URL}`)} target="_blank" rel="noopener noreferrer" className={styles.submit}>
              {c.whatsapp}
            </a>
            <button type="button" className={styles.ghost} onClick={copy}>
              {c.copy}
            </button>
          </>
        )}
      </div>
      <p className={styles.shareStatus} role="status" aria-live="polite" aria-atomic="true">
        {status === "copied" ? c.copied : null}
        {status === "failed" ? (
          <>
            {c.copyFailed} <span className={styles.shareUrl}>{WAITLIST_SHARE_URL}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
