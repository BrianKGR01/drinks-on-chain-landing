"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DiscoverFooter } from "@/components/pages/DiscoverFooter";
import { PageShell } from "@/components/pages/PageShell";
import { MapPreview } from "@/components/site/MapPreview";
import { SITE } from "@/content/site-i18n";
import { VILLAGES } from "@/content/villages";
import { ZONES } from "@/content/zones";
import { LINKS } from "@/lib/links";
import { useExperience } from "@/store/experience";
import styles from "./Editorial.module.css";
import simple from "./SimplePages.module.css";

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

export function HowItWorksPage() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const p = t.pages.how;
  return (
    <PageShell eyebrow={p.title}>
      <header className={styles.contactHeader}>
        <span className="small-heading">Drinks on Chain</span>
        <span className="heading-separator" aria-hidden="true" />
        <h2 className={styles.contactTitle}>{p.title}</h2>
        <p className={simple.intro}>{p.intro}</p>
      </header>
      <ol className={simple.steps} id="escanear">
        {t.how.steps.map((s, i) => (
          <li key={s.title}>
            <span className={simple.stepNo}>{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      <section className={simple.faq} aria-label="FAQ">
        {p.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
      <p className={simple.center}>
        <a href={LINKS.app} className={simple.cta}>
          {t.hero.cta}
        </a>
      </p>
      <DiscoverFooter href="/vinos" caption={t.nav.wines} prepend={lang === "es" ? "Descubrir" : "Discover"} />
    </PageShell>
  );
}

export function WineriesPage() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const p = t.pages.wineries;
  const mounted = useMounted();
  const wineries = Array.from(new Set(Object.values(ZONES).flatMap((z) => z.facts.wineries))).filter((w) => !/CENAVIT/i.test(w));
  return (
    <PageShell eyebrow={p.title}>
      <header className={styles.contactHeader}>
        <span className="small-heading">Drinks on Chain</span>
        <span className="heading-separator" aria-hidden="true" />
        <h2 className={styles.contactTitle}>{p.title}</h2>
        <p className={simple.intro}>{p.intro}</p>
      </header>
      <div className={simple.maps}>
        {VILLAGES.map((v) => (
          <figure key={v.id} className={simple.mapCard}>
            {mounted ? <MapPreview village={v} title={v.name[lang]} className={simple.mapSvg} /> : <div className={simple.mapSvg} style={{ aspectRatio: "1" }} />}
            <figcaption>
              <span>{v.name[lang]}</span>
              <span>{v.parcels.length} {lang === "es" ? "zonas" : "zones"}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className={simple.wineryGrid}>
        {wineries.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
      <p className={simple.center}>
        <a href={LINKS.bodegas} className={simple.cta}>
          {p.cta}
        </a>
      </p>
      <DiscoverFooter href="/como-funciona" caption={t.nav.how} prepend={lang === "es" ? "Seguir" : "Next"} />
    </PageShell>
  );
}

export function TechnologyPage() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const p = t.pages.tech;
  return (
    <PageShell eyebrow={p.title}>
      <header className={styles.contactHeader}>
        <span className="small-heading">Drinks on Chain</span>
        <span className="heading-separator" aria-hidden="true" />
        <h2 className={styles.contactTitle}>{p.title}</h2>
      </header>
      <div className={styles.legal}>
        {p.sections.map((s) => (
          <section key={s.h}>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </section>
        ))}
      </div>
      <DiscoverFooter href="/bodegas" caption={t.nav.wineries} prepend={lang === "es" ? "Conocer" : "Meet"} />
    </PageShell>
  );
}

export function PrivacyPage() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const p = t.pages.privacy;
  return (
    <PageShell eyebrow={p.title}>
      <header className={styles.contactHeader}>
        <span className="small-heading">Drinks on Chain</span>
        <span className="heading-separator" aria-hidden="true" />
        <h2 className={styles.contactTitle}>{p.title}</h2>
      </header>
      <div className={styles.legal}>
        <p>{p.p}</p>
        <p>
          <Link href="/aviso-legal" className="underline-anim">
            {t.footer.legalNotice}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
