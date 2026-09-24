"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/content/site-i18n";
import { LINKS } from "@/lib/links";
import { useExperience } from "@/store/experience";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const lang = useExperience((s) => s.lang);
  const t = SITE[lang];
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.responsible}>{t.footer.responsible}</p>
        </div>
        <nav className={styles.col} aria-label={t.footer.explore}>
          <h2>{t.footer.explore}</h2>
          <Link href="/vinos" className="underline-anim">{t.nav.wines}</Link>
          <Link href="/como-funciona" className="underline-anim">{t.nav.how}</Link>
          <Link href="/bodegas" className="underline-anim">{t.nav.wineries}</Link>
          <Link href="/tecnologia" className="underline-anim">{t.footer.tech}</Link>
          <Link href="/historia" className="underline-anim">{t.nav.history}</Link>
        </nav>
        <nav className={styles.col} aria-label={t.footer.network}>
          <h2>{t.footer.network}</h2>
          <a href={LINKS.app} className="underline-anim">Marketplace</a>
          <a href={LINKS.bodegas} className="underline-anim">{t.footer.forWineries}</a>
          <a href={`${LINKS.bodegas}/puntos-de-recojo`} className="underline-anim">{t.footer.forPickup}</a>
          <Link href="/contacto" className="underline-anim">{t.footer.contact}</Link>
        </nav>
        <nav className={styles.col} aria-label={t.footer.legal}>
          <h2>{t.footer.legal}</h2>
          <Link href="/aviso-legal" className="underline-anim">{t.footer.legalNotice}</Link>
          <Link href="/privacidad" className="underline-anim">{t.footer.privacy}</Link>
          <span className={styles.made}>{t.footer.madeBy}</span>
        </nav>
      </div>
    </footer>
  );
}
