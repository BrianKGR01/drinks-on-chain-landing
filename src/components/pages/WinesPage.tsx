"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/pages/PageShell";
import { BottleIllustration } from "@/components/ui/InkIllustrations";
import { InkPhoto } from "@/components/ui/InkPhoto";
import { UI } from "@/content/i18n";
import { LINKS } from "@/lib/links";
import type { Lang, Localized } from "@/lib/scene-contract";
import { useExperience } from "@/store/experience";
import styles from "./Wines.module.css";

/** One wine of the showcase, summarised on the server (see app/vinos/page.tsx). */
export interface WineEntry {
  id: string;
  slug: string;
  villageSlug: string;
  villageName: Localized;
  parcelName: string;
  altitude: number;
  kind: "vino" | "singani";
  grape: string;
  name: Localized;
  specifications: Record<Lang, string[]>;
  photo?: { src: string; alt: Localized; credit: string };
}

/**
 * Wine showcase: fixed list on the left, packshot centred, details on the
 * right, "Descubrir" underneath. Arrow keys and the mobile arrows step
 * through the range.
 */
export function WinesPage({ wines, initialSlug }: { wines: WineEntry[]; initialSlug?: string }) {
  const lang = useExperience((s) => s.lang);
  const t = UI[lang];

  const initialIndex = Math.max(
    0,
    wines.findIndex((w) => w.slug === initialSlug),
  );
  const [index, setIndex] = useState(initialIndex);
  const current = wines[index];
  const photo = current.photo;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % wines.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + wines.length) % wines.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wines.length]);

  return (
    <PageShell eyebrow={t.winesTitle} className={styles.page}>
      <div className={styles.content}>
        <ul className={styles.list} aria-label={t.winesTitle}>
          {wines.map((w, i) => (
            <li key={w.id}>
              <button
                type="button"
                className={`${styles.listCta} ${i === index ? styles.listActive : ""}`}
                onClick={() => setIndex(i)}
                aria-current={i === index ? "true" : undefined}
              >
                <span className={styles.listKind}>{w.kind === "singani" ? "Singani" : lang === "es" ? "Vino" : "Wine"}</span>
                {w.name[lang]}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.packshot} key={current.id}>
          {photo ? (
            <InkPhoto
              src={photo.src}
              alt={photo.alt[lang]}
              credit={photo.credit}
              ratio={0.75}
              className={styles.photo}
              sizes="(max-width: 767px) 60vw, 26vw"
            />
          ) : (
            <BottleIllustration
              kind={current.kind}
              label={current.name[lang]}
              sublabel={`${current.parcelName} · ${current.altitude} m`}
              className={styles.bottle}
            />
          )}
        </div>

        <div className={styles.details}>
          <h2 className={styles.title}>{current.name[lang]}</h2>
          <div className={styles.entries}>
            <span>
              {current.parcelName} · {current.villageName[lang]}
            </span>
            <span>{current.grape}</span>
            {current.specifications[lang].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.left}`}
              onClick={() => setIndex((i) => (i - 1 + wines.length) % wines.length)}
              aria-label={t.previous}
            >
              →
            </button>
            <a href={LINKS.appWine(current.slug)} className={styles.discover}>
              {lang === "es" ? "Adquirir" : "Buy"}
            </a>
            <a href={LINKS.bodegasParcel(current.villageSlug, current.slug)} className={styles.discover}>
              {t.discover}
            </a>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => setIndex((i) => (i + 1) % wines.length)}
              aria-label={t.next}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <p className={styles.notice}>
        {lang === "es"
          ? "Consuma con moderación. Venta prohibida a menores de 18 años."
          : "Drink responsibly. Not for sale to anyone under 18."}
      </p>
    </PageShell>
  );
}
