"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BottleIllustration } from "@/components/ui/InkIllustrations";
import { InkPhoto } from "@/components/ui/InkPhoto";
import { MapCanvas } from "@/components/site/MapCanvas";
import { MapPreview } from "@/components/site/MapPreview";
import { HeroVine } from "@/components/home/HeroVine";
import { VineRows } from "@/components/home/VineRows";
import { IMAGES } from "@/content/images";
import { getParcelContent } from "@/content/parcels";
import { SITE } from "@/content/site-i18n";
import { TARIJA, CINTI, VILLAGES } from "@/content/villages";
import { ZONES } from "@/content/zones";
import { LINKS } from "@/lib/links";
import { useEntered } from "@/lib/use-entered";
import { useExperience } from "@/store/experience";
import styles from "./Home.module.css";

const FEATURED = ["t02", "t07", "t13", "c01"] as const;

const noop = () => () => {};
/** True after hydration; false during SSR and the first client render. */
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const TRUST_ICONS = [
  // seal / ledger
  <svg key="seal" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5l5 4 6-1 2 6 6 2-1 6 4 5-4 5 1 6-6 2-2 6-6-1-5 4-5-4-6 1-2-6-6-2 1-6-4-5 4-5-1-6 6-2 2-6 6 1z" /><path d="M16 24l6 6 11-12" /></svg>,
  // numbered bottles
  <svg key="edition" viewBox="0 0 48 48" aria-hidden="true"><path d="M12 6h6v4h-6zM13 10v6c0 2-4 4-4 8v16c0 1 1 2 2 2h10c1 0 2-1 2-2V24c0-4-4-6-4-8v-6" /><path d="M30 6h6v4h-6zM31 10v6c0 2-4 4-4 8v16c0 1 1 2 2 2h10c1 0 2-1 2-2V24c0-4-4-6-4-8v-6" /><path d="M11 30h10M29 30h10" /></svg>,
  // key + hand
  <svg key="pickup" viewBox="0 0 48 48" aria-hidden="true"><circle cx="17" cy="19" r="8" /><circle cx="17" cy="19" r="2.5" /><path d="M23 24l14 14M31 32l4-4M35 36l4-4" /><path d="M6 40c6-6 12-8 18-4" /></svg>,
];

const ICONS = {
  scan: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 16V8h8M32 8h8v8M40 32v8h-8M16 40H8v-8" />
      <rect x="16" y="16" width="7" height="7" /><rect x="25" y="16" width="7" height="7" /><rect x="16" y="25" width="7" height="7" />
      <path d="M25 25h3v3M32 32h-4" />
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 12c8-4 14-4 16 0 2-4 8-4 16 0v26c-8-4-14-4-16 0-2-4-8-4-16 0z" />
      <path d="M24 12v26M13 20c4-1 7-1 9 0M13 26c4-1 7-1 9 0M26 20c4-1 7-1 9 0M26 26c4-1 7-1 9 0" />
    </svg>
  ),
  acquire: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M20 6h8v4h-8zM21 10v8c0 3-6 5-6 10v13c0 1 1 2 2 2h14c1 0 2-1 2-2V28c0-5-6-7-6-10v-8" />
      <path d="M15 32h18M15 40h18" />
    </svg>
  ),
  pickup: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 26c6-6 12-6 16-2l8 6c3 2 1 6-3 5l-6-2" />
      <path d="M8 34l6 4c4 3 8 3 12 1l14-8c3-2 1-6-3-5l-8 3" />
      <path d="M30 6h10v10H30z" /><path d="M33 9h4M33 12h2" />
    </svg>
  ),
};

export function Home() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const mounted = useMounted();
  const entered = useEntered();

  const featured = FEATURED.map((id) => {
    for (const v of VILLAGES) {
      const p = v.parcels.find((x) => x.id === id);
      if (p) return { village: v, parcel: p, content: getParcelContent(v, p, lang), photo: IMAGES.wines[id] };
    }
    return null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const wineries = Array.from(new Set(Object.values(ZONES).flatMap((z) => z.facts.wineries)))
    .filter((w) => !/CENAVIT/i.test(w))
    .slice(0, 6);

  return (
    <main id="content">
      {/* ------------------------------------------------------------ hero */}
      <section className={`${styles.hero} ${entered ? styles.revealed : ""}`}>
        {/* data-hero-map lets the age gate turn into a translucent veil over this map (see AgeGate.module.css) */}
        <div className={styles.heroStage} data-hero-map aria-hidden="true">
          <div className={styles.heroMap}>
            {mounted ? <MapCanvas village={TARIJA} className={styles.heroCanvas} revealMs={4200} /> : null}
          </div>
        </div>
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroVine} aria-hidden="true">
          <HeroVine draw={entered} />
        </div>
        <div className={styles.heroInner}>
          <p className={`small-heading ${styles.heroEyebrow}`}>{t.hero.eyebrow}</p>
          <h1 className={styles.heroTitle}>{t.hero.title}</h1>
          <p className={styles.heroLead}>{t.hero.lead}</p>
          <div className={styles.heroActions}>
            <a href={LINKS.app} className={styles.ctaPrimary}>
              {t.hero.cta}
            </a>
            <Link href="/como-funciona#escanear" className={styles.ctaQuiet}>
              <span>{t.hero.scanned}</span>
              <small>{t.hero.scannedHint}</small>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- how it works */}
      <section className={styles.section} id="como-funciona">
        <header className={styles.sectionHead}>
          <p className="small-heading">{t.how.eyebrow}</p>
          <h2 className={styles.h2}>{t.how.title}</h2>
        </header>
        <ol className={styles.steps}>
          {t.how.steps.map((s, i) => (
            <li key={s.title} className={styles.step} tabIndex={0}>
              <span className={styles.stepIcon}>{[ICONS.scan, ICONS.discover, ICONS.acquire, ICONS.pickup][i]}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className={styles.more}>
          <Link href="/como-funciona" className="underline-anim">
            {t.how.more}
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------------- wines */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <header className={styles.sectionHead}>
          <p className="small-heading">{t.wines.eyebrow}</p>
          <h2 className={styles.h2}>{t.wines.title}</h2>
        </header>
        <ul className={styles.wines}>
          {featured.map(({ village, parcel, content, photo }) => (
            <li key={parcel.id} className={styles.wine}>
              <div className={styles.wineArt}>
                {photo ? (
                  <InkPhoto src={photo.src} alt={photo.alt[lang]} ratio={0.75} sizes="(max-width: 767px) 70vw, 20vw" />
                ) : (
                  <BottleIllustration kind={content.wine.kind} label={content.wine.name} sublabel={`${parcel.name} · ${parcel.altitude} m`} className={styles.wineBottle} />
                )}
              </div>
              <span className={styles.wineKind}>{content.wine.kind === "singani" ? "Singani" : lang === "es" ? "Vino" : "Wine"}</span>
              <h3 className={styles.wineName}>{content.wine.name}</h3>
              <p className={styles.wineMeta}>
                {parcel.name} · {village.name[lang]} · {parcel.altitude} m
              </p>
              <a href={LINKS.appWine(parcel.slug)} className={styles.wineCta}>
                {t.wines.know} →
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.more}>
          <a href={LINKS.app} className="underline-anim">
            {t.wines.all}
          </a>
        </p>
      </section>

      {/* ------------------------------------------------------ wineries */}
      <section className={styles.section} id="bodegas">
        <div className={styles.wineries}>
          <div className={styles.wineriesMap}>
            {mounted ? <MapPreview village={CINTI} className={styles.wineriesSvg} title={CINTI.name[lang]} /> : <div className={styles.wineriesSvg} style={{ aspectRatio: "1" }} />}
            <span className={styles.mapCaption}>{CINTI.region[lang]}</span>
          </div>
          <div className={styles.wineriesText}>
            <p className="small-heading">{t.wineries.eyebrow}</p>
            <h2 className={styles.h2}>{t.wineries.title}</h2>
            <p className={styles.lead}>{t.wineries.text}</p>
            <ul className={styles.wineryList}>
              {wineries.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className={styles.b2bQuestion}>{t.wineries.b2bQuestion}</p>
            <div className={styles.actions}>
              <a href={LINKS.bodegas} className={styles.ctaPrimary}>
                {t.wineries.cta}
              </a>
              <a href={LINKS.bodegasJoin} className="underline-anim">
                {t.wineries.join}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- trust */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <header className={styles.sectionHead}>
          <p className="small-heading">{t.trust.eyebrow}</p>
        </header>
        <ul className={styles.trust}>
          {t.trust.items.map((it, i) => (
            <li key={it.title} className={styles.trustItem} tabIndex={0}>
              <span className={styles.trustIcon}>{TRUST_ICONS[i]}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ul>
        <p className={styles.more}>
          <Link href="/tecnologia" className="underline-anim">
            {t.trust.more}
          </Link>
        </p>
      </section>

      {/* ----------------------------------------------------------- b2b */}
      <section className={styles.b2b}>
        <VineRows className={styles.b2bRows} />
        <div className={styles.b2bInner}>
          <div>
            <h2>{t.b2b.title}</h2>
            <p>{t.b2b.text}</p>
          </div>
          <a href={LINKS.bodegas} className={styles.ctaOutline}>
            {t.b2b.cta}
          </a>
        </div>
      </section>
    </main>
  );
}
