"use client";

import type { ReactNode } from "react";
import styles from "./PageShell.module.css";

interface PageShellProps {
  /** Small caption shown above the page (e.g. "Historia"). */
  eyebrow: string;
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility with the bodegas site; the header is global here. */
  hideBack?: boolean;
}

/** Common frame of the editorial pages: eyebrow + content. Header and footer come from the layout. */
export function PageShell({ eyebrow, children, className = "" }: PageShellProps) {
  return (
    <main id="content" className={`${styles.page} ${className}`}>
      <h1 className={styles.eyebrow}>{eyebrow}</h1>
      {children}
    </main>
  );
}
