"use client";

import Link from "next/link";
import { DiscoverFooter } from "@/components/pages/DiscoverFooter";
import { PageShell } from "@/components/pages/PageShell";
import { MapPreview } from "@/components/site/MapPreview";
import { SITE } from "@/content/site-i18n";
import { VILLAGES } from "@/content/villages";
import { CONTACT_EMAIL, LINKS } from "@/lib/links";
import type { Lang, Localized } from "@/lib/scene-contract";
import { useExperience } from "@/store/experience";
import styles from "./Editorial.module.css";
import simple from "./SimplePages.module.css";

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

/** The test network as the wineries page shows it, prepared on the server (see app/bodegas/page.tsx). */
export interface WineryDirectory {
  wineries: Array<{ id: string; slug: string; name: string; status: string; town: string }>;
  status: Record<Lang, Record<string, string>>;
  testNotice: Localized;
}

export function WineriesPage({ directory }: { directory: WineryDirectory }) {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  const p = t.pages.wineries;
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
            <MapPreview village={v} title={v.name[lang]} className={simple.mapSvg} />
            <figcaption>
              <span>{v.name[lang]}</span>
              <span>{v.parcels.length} {lang === "es" ? "zonas" : "zones"}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ul className={simple.wineryGrid}>
        {directory.wineries.map((w) => (
          <li key={w.id}>
            <a href={LINKS.bodegasProfile(w.slug)}>{w.name}</a>
            <span className={simple.wineryMeta}>
              {directory.status[lang][w.status]} · {w.town}
            </span>
          </li>
        ))}
      </ul>
      <p className={simple.networkNote}>{directory.testNotice[lang]}</p>
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
        <h3 id="lista-de-espera">{p.waitlistTitle}</h3>
        <p>{p.waitlist[0]}</p>
        <p>{p.waitlist[1]}</p>
        <p>
          {p.waitlist[2]} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          <Link href="/aviso-legal" className="underline-anim">
            {t.footer.legalNotice}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
