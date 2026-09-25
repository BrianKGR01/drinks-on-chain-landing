"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { GlassBottleOrnament } from "@/components/intro/GlassBottleOrnament";
import { VineOrnament } from "@/components/intro/VineOrnament";
import { LetterSplit } from "@/components/ui/LetterSplit";
import { LANGS, UI } from "@/content/i18n";
import { useEntered } from "@/lib/use-entered";
import { useExperience } from "@/store/experience";
import styles from "./AgeGate.module.css";

/** How long the gate stays mounted while its veil lifts (matches AgeGate.module.css). */
const LEAVE_MS = 1700;

/**
 * Full-screen age confirmation. The entrance choreography is pure CSS
 * (animations with per-letter delays), so the gate is legible even before
 * React hydrates; JavaScript is only needed to leave it.
 *
 * On the home the gate is a translucent paper veil over the hero map, which
 * draws itself underneath; "Entrar" lifts the veil and the hero takes over.
 * While the gate is up the document cannot scroll (see `.gate-root` in
 * globals.css), and leaving it always lands at the top of the page.
 */
export function AgeGate() {
  const lang = useExperience((s) => s.lang);
  const setLang = useExperience((s) => s.setLang);
  const enter = useExperience((s) => s.enter);
  const confirmed = useEntered();
  const t = UI[lang];

  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const handleEnter = useCallback(() => {
    if (leaving) return;
    // Land on the hero whatever happened underneath (restored scroll, anchors).
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setLeaving(true);
    // Reveal the hero now so its entrance plays while the veil lifts.
    enter();
    window.setTimeout(() => setGone(true), LEAVE_MS);
  }, [enter, leaving]);

  // Keep the store in sync when a recent confirmation skips the gate.
  useEffect(() => {
    if (confirmed && !useExperience.getState().entered) useExperience.getState().enter();
  }, [confirmed]);

  // While the gate is up the page stays at the top, even if the browser restored a scroll position.
  const visible = !gone && !(confirmed && !leaving);
  useEffect(() => {
    if (!visible || leaving) return;
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      history.scrollRestoration = prev;
    };
  }, [visible, leaving]);

  if (!visible) return null;

  return (
    <div
      className={`gate-root ${styles.intro} ${leaving ? `gate-leaving ${styles.leaving}` : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.ageGateAria}
    >
      <div className={`${styles.ornament} ${styles.ornamentTopLeft}`} aria-hidden="true">
        <VineOrnament flip delay={0.2} />
      </div>
      <div className={`${styles.ornament} ${styles.ornamentBottomRight}`} aria-hidden="true">
        <GlassBottleOrnament delay={0.8} />
      </div>

      <div className={styles.logo}>
        <Logo link={false} />
      </div>

      <div className={styles.content}>
        <p className={styles.contentInner}>
          <LetterSplit text={t.certify} />
        </p>
      </div>

      <button type="button" className={styles.enter} onClick={handleEnter} autoFocus>
        <span className={styles.label}>
          <LetterSplit text={t.enter} />
        </span>
        <span className={styles.icon} aria-hidden="true">
          <span className={styles.bar1} />
          <span className={styles.bar2} />
        </span>
      </button>

      <nav className={styles.nav} aria-label="Idioma y avisos">
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
        <Link href="/aviso-legal" className="underline-anim">
          {t.legalNotice}
        </Link>
      </nav>
    </div>
  );
}
