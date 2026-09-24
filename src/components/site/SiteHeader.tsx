"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { LANGS } from "@/content/i18n";
import { SITE } from "@/content/site-i18n";
import { LINKS } from "@/lib/links";
import { useExperience } from "@/store/experience";
import styles from "./SiteHeader.module.css";

/**
 * Header of the main landing: wordmark, primary navigation for the consumer,
 * the quiet B2B route, language switch and the single outbound "Entrar".
 * No form, no session: entering always means leaving for the Marketplace.
 */
export function SiteHeader() {
  const lang = useExperience((s) => s.lang);
  const setLang = useExperience((s) => s.setLang);
  const menuOpen = useExperience((s) => s.menuOpen);
  const toggleMenu = useExperience((s) => s.toggleMenu);
  const pathname = usePathname();
  const t = SITE[lang].nav;

  const items = [
    { href: "/vinos", label: t.wines },
    { href: "/como-funciona", label: t.how },
    { href: "/bodegas", label: t.wineries },
    { href: "/historia", label: t.history },
  ];

  useEffect(() => {
    toggleMenu(false);
  }, [pathname, toggleMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && toggleMenu(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen, toggleMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo className={styles.logo} />

        <nav className={styles.nav} aria-label={t.menu}>
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="underline-anim" aria-current={pathname === it.href ? "true" : undefined}>
              {it.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <a href={LINKS.bodegas} className={`${styles.b2b} underline-anim`}>
            {t.b2b}
          </a>
          <div className={styles.langs} role="group" aria-label="Idioma">
            {LANGS.map((code) => (
              <button key={code} type="button" className="underline-anim" aria-current={lang === code ? "true" : undefined} onClick={() => setLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a href={LINKS.appEnter} className={styles.enter}>
            {t.enter}
          </a>
          <button type="button" className={styles.burger} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => toggleMenu()}>
            <span className={styles.burgerLines} aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="sr-only">{menuOpen ? t.close : t.menu}</span>
          </button>
        </div>
      </div>

      <div id="site-menu" className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className={styles.drawerNav} aria-label={t.menu}>
          <Link href="/" className={styles.drawerLink}>
            {t.home}
          </Link>
          {items.map((it, i) => (
            <Link key={it.href} href={it.href} className={styles.drawerLink} style={{ transitionDelay: `${0.08 + i * 0.06}s` }}>
              {it.label}
            </Link>
          ))}
        </nav>
        <div className={styles.drawerFoot}>
          <a href={LINKS.bodegas} className="underline-anim">
            {t.b2b}
          </a>
          <div className={styles.langs}>
            {LANGS.map((code) => (
              <button key={code} type="button" className="underline-anim" aria-current={lang === code ? "true" : undefined} onClick={() => setLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a href={LINKS.appEnter} className={styles.enter}>
            {t.enter}
          </a>
        </div>
      </div>
    </header>
  );
}
