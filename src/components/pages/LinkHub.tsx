"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CONTACT_EMAIL, LINKS, PITCH, SOCIAL, WAITLIST_LINK, isExternal } from "@/lib/links";
import { SITE_TAGLINE } from "@/lib/site";
import { useExperience } from "@/store/experience";
import styles from "./LinkHub.module.css";

/**
 * `/link`: every door of Drinks on Chain on one page, made to be shared in an application or a
 * profile and opened on a phone. A row whose destination does not exist yet is left out.
 */

interface Row {
  title: string;
  note: string;
  href: string | null;
}
interface Group {
  title: string;
  rows: Row[];
}
interface Copy {
  tagline: string;
  about: string;
  groups: Group[];
  contact: string;
  social: string;
}

const COPY: Record<"es" | "en", Copy> = {
  es: {
    tagline: SITE_TAGLINE,
    about: "Trazabilidad y mercado para los vinos y singanis de altura de Bolivia.",
    groups: [
      {
        title: "Presentación",
        rows: [
          { title: "Pitch deck", note: "Problema, solución, tracción y equipo", href: PITCH.deck },
          { title: "Video del pitch", note: "El equipo presenta Drinks on Chain", href: PITCH.video },
        ],
      },
      {
        title: "Para quien disfruta el vino",
        rows: [
          { title: "Sitio principal", note: "Cada botella, con su lugar y su historia", href: "/" },
          { title: "Lista de espera", note: "Sé de los primeros en el Marketplace", href: WAITLIST_LINK.href },
          { title: "Verifica una botella", note: "El pasaporte digital, con el código de la etiqueta", href: LINKS.verify },
          { title: "Marketplace", note: "Vinos y singanis directo de la bodega", href: LINKS.app },
        ],
      },
      {
        title: "Para bodegas",
        rows: [
          { title: "Sitio de las bodegas", note: "El mapa de los valles de altura", href: LINKS.bodegas },
          { title: "Suma tu bodega", note: "Trazabilidad de la parcela a la botella", href: LINKS.bodegasJoin },
          { title: "Lista de espera de bodegas", note: "Reserva tu lugar en el lanzamiento", href: LINKS.bodegasWaitlist },
        ],
      },
    ],
    contact: "Contacto",
    social: "Redes",
  },
  en: {
    tagline: "Every bottle, with its place and its story.",
    about: "Traceability and a marketplace for Bolivia’s high-altitude wines and singanis.",
    groups: [
      {
        title: "Presentation",
        rows: [
          { title: "Pitch deck", note: "Problem, solution, traction and team", href: PITCH.deck },
          { title: "Pitch video", note: "The team presents Drinks on Chain", href: PITCH.video },
        ],
      },
      {
        title: "For wine lovers",
        rows: [
          { title: "Main site", note: "Every bottle, with its place and its story", href: "/" },
          { title: "Waiting list", note: "Be among the first in the Marketplace", href: WAITLIST_LINK.href },
          { title: "Verify a bottle", note: "The digital passport, with the code on the label", href: LINKS.verify },
          { title: "Marketplace", note: "Wines and singanis straight from the winery", href: LINKS.app },
        ],
      },
      {
        title: "For wineries",
        rows: [
          { title: "Wineries site", note: "The map of the high-altitude valleys", href: LINKS.bodegas },
          { title: "Add your winery", note: "Traceability from the plot to the bottle", href: LINKS.bodegasJoin },
          { title: "Wineries waiting list", note: "Save your place at the launch", href: LINKS.bodegasWaitlist },
        ],
      },
    ],
    contact: "Contact",
    social: "Social",
  },
};

type LiveRow = Row & { href: string };

function RowLink({ row, order }: { row: LiveRow; order: number }) {
  const body = (
    <>
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{row.title}</span>
        <span className={styles.rowNote}>{row.note}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true" />
    </>
  );
  const style = { "--i": order } as CSSProperties;
  return isExternal(row.href) ? (
    <a href={row.href} className={styles.row} style={style} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <Link href={row.href} className={styles.row} style={style} prefetch={false}>
      {body}
    </Link>
  );
}

export function LinkHub() {
  const lang = useExperience((s) => s.lang);
  const c = COPY[lang];
  // Entrance order runs through the whole page, not per group.
  const groups = c.groups
    .map((group) => ({ title: group.title, rows: group.rows.filter((row): row is LiveRow => row.href !== null) }))
    .filter((group) => group.rows.length > 0);
  const offset = groups.map((_, i) => groups.slice(0, i).reduce((n, g) => n + g.rows.length, 0));

  return (
    // `data-gate-quick`: opened from a shared link on a phone, the age gate lifts in one tap.
    <main id="content" className={styles.page} data-gate-quick>
      <header className={styles.head}>
        <h1 className={styles.tagline}>{c.tagline}</h1>
        <p className={styles.about}>{c.about}</p>
      </header>

      {groups.map((group, gi) => (
        <section key={group.title} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <ul className={styles.rows}>
            {group.rows.map((row, ri) => (
              <li key={row.title}>
                <RowLink row={row} order={offset[gi] + ri} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className={styles.foot}>
        {SOCIAL.length > 0 ? (
          <ul className={styles.social} aria-label={c.social}>
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="underline-anim" target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p>
          <span className={styles.footLabel}>{c.contact}</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline-anim">
            {CONTACT_EMAIL}
          </a>
        </p>
      </footer>
    </main>
  );
}
