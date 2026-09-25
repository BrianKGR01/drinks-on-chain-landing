"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { LANGS } from "@/content/i18n";
import { SITE } from "@/content/site-i18n";
import { LINKS } from "@/lib/links";
import { useExperience } from "@/store/experience";
import styles from "./MainMenu.module.css";

/**
 * Full-screen menu, the same piece as the bodegas site's: rotated "Cerrar",
 * wordmark, the consumer sections in large type with a sliding gold
 * indicator, and a footer with languages, the secondary pages, the B2B
 * route, "Entrar" and credit. Opened by the header's menu button below
 * desktop widths. Escape, "Cerrar" and any route change close it.
 */
export function MainMenu() {
  const lang = useExperience((s) => s.lang);
  const setLang = useExperience((s) => s.setLang);
  const open = useExperience((s) => s.menuOpen);
  const toggleMenu = useExperience((s) => s.toggleMenu);
  const pathname = usePathname();
  const t = SITE[lang];
  const [hover, setHover] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = [
    { href: "/", label: t.nav.home },
    { href: "/vinos", label: t.nav.wines },
    { href: "/como-funciona", label: t.nav.how },
    { href: "/bodegas", label: t.nav.wineries },
    { href: "/historia", label: t.nav.history },
  ];

  // Escape closes; the page underneath does not scroll; focus moves into the
  // menu and goes back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && toggleMenu(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, toggleMenu]);

  // Close when the route changes.
  useEffect(() => {
    toggleMenu(false);
  }, [pathname, toggleMenu]);

  const currentIndex = items.findIndex((it) => (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href)));
  const indicatorIndex = hover ?? (currentIndex >= 0 ? currentIndex : 0);

  return (
    <div
      id="site-menu"
      className={`${styles.menu} ${open ? styles.shown : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.background} aria-hidden="true" />

      <button ref={closeRef} type="button" className={styles.close} onClick={() => toggleMenu(false)}>
        {t.nav.close}
      </button>

      <div className={styles.logo}>
        <Logo />
      </div>

      <nav className={styles.section} aria-label={t.nav.menu}>
        <span className={styles.indicator} aria-hidden="true">
          <span
            className={styles.thumb}
            style={{ height: `${100 / items.length}%`, transform: `translateY(${indicatorIndex * 100}%)` }}
          />
        </span>
        {items.map((it, i) => (
          <Link
            key={it.href}
            href={it.href}
            className={styles.link}
            style={{ transitionDelay: `${0.15 + i * 0.08}s` }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => toggleMenu(false)}
            aria-current={i === currentIndex ? "page" : undefined}
          >
            {it.label}
          </Link>
        ))}
      </nav>

      <footer className={styles.footer}>
        <div className={styles.langs}>
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className="underline-anim"
              aria-current={lang === code ? "true" : undefined}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <div className={styles.sect}>
          <Link href="/tecnologia" className="underline-anim">
            {t.footer.tech}
          </Link>
          <Link href="/contacto" className="underline-anim">
            {t.footer.contact}
          </Link>
          <Link href="/aviso-legal" className="underline-anim">
            {t.footer.legalNotice}
          </Link>
          <Link href="/privacidad" className="underline-anim">
            {t.footer.privacy}
          </Link>
        </div>
        <div className={styles.sharing}>
          <a href={LINKS.bodegas} className="underline-anim">
            {t.nav.b2b} →
          </a>
          <a href={LINKS.appEnter} className={styles.enter}>
            {t.nav.enter}
          </a>
        </div>
        <p className={styles.made}>{t.footer.madeBy}</p>
      </footer>
    </div>
  );
}
