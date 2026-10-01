"use client";

import type { Lang } from "@/lib/scene-contract";
import { useExperience } from "@/store/experience";
import { WaitlistCount } from "./WaitlistCount";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./Waitlist.module.css";

const COPY: Record<
  Lang,
  { eyebrow: string; title: string; lead: string; benefitsLabel: string; benefits: { h: string; p: string }[] }
> = {
  es: {
    eyebrow: "Lista de espera",
    title: "Vinos y singanis de altura, antes de que salgan a la venta.",
    lead: "Botellas de los valles altos de Bolivia con trazabilidad verificable. Apúntate y sé de los primeros en entrar a la preventa.",
    benefitsLabel: "Por qué apuntarte",
    benefits: [
      { h: "Entras primero", p: "Te escribimos antes de abrir la preventa." },
      { h: "Sabes qué hay en la botella", p: "Cada una lleva un código con su parcela, su bodega, su vendimia y su reposo." },
      { h: "Directo de la bodega", p: "Adquieres a quien lo elabora y recoges en un punto de canje." },
    ],
  },
  en: {
    eyebrow: "Waiting list",
    title: "High-altitude wines and singanis, before they go on sale.",
    lead: "Bottles from Bolivia's high valleys with verifiable traceability. Sign up and be among the first into the pre-sale.",
    benefitsLabel: "Why sign up",
    benefits: [
      { h: "You get in first", p: "We write to you before the pre-sale opens." },
      { h: "You know what is in the bottle", p: "Each one carries a code with its parcel, winery, harvest and rest." },
      { h: "Straight from the winery", p: "You buy from the people who make it and collect at a redemption point." },
    ],
  },
};

const FORM_TITLE_ID = "waitlist-form-title";

/**
 * /lista-de-espera — the consumer waiting list. People arrive here from a QR on their phone, so
 * the page is one short column: headline, three reasons and the form. `data-gate-quick` makes the
 * age gate lift without its long choreography (see AgeGate).
 */
export function WaitlistPage({ apiReady }: { apiReady: boolean }) {
  const lang = useExperience((s) => s.lang);
  const c = COPY[lang];

  return (
    <main id="content" className={styles.page} data-gate-quick>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{c.eyebrow}</p>
          <h1 className={styles.title}>{c.title}</h1>
          <p className={styles.lead}>{c.lead}</p>
          {apiReady ? <WaitlistCount lang={lang} className={styles.count} /> : null}
          <ul className={styles.benefits} aria-label={c.benefitsLabel}>
            {c.benefits.map((b) => (
              <li key={b.h}>
                <strong>{b.h}</strong>
                <span>{b.p}</span>
              </li>
            ))}
          </ul>
        </header>

        <section className={styles.panel} aria-labelledby={FORM_TITLE_ID}>
          <WaitlistForm lang={lang} apiReady={apiReady} titleId={FORM_TITLE_ID} />
        </section>
      </div>
    </main>
  );
}
