"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { LANGS } from "@/content/i18n";
import { SITE } from "@/content/site-i18n";
import { LINKS } from "@/lib/links";
import { useExperience } from "@/store/experience";
import { MainMenu } from "./MainMenu";
import styles from "./SiteHeader.module.css";

/**
 * Header of the main landing: wordmark, primary navigation for the consumer,
 * the quiet B2B route, language switch and the single outbound "Entrar".
 * No form, no session: entering always means leaving for the Marketplace.
 * Below desktop widths the menu button opens the full-screen MainMenu.
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

  return (
    <>
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
      </header>
      <MainMenu />
    </>
  );
}
