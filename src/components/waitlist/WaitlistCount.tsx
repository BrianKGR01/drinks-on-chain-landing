"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/content/site-i18n";
import type { Lang } from "@/lib/scene-contract";
import { waitlistConsumers } from "@/lib/waitlist-stats";

/**
 * "Ya somos N": the size of the list, read from `GET /api/v1/public/waitlist/stats` once the line
 * is near the screen. Nothing is shown below 25 people or when the number cannot be read. The
 * line keeps its height either way, so the page does not move when the number arrives.
 */
export function WaitlistCount({ lang, className }: { lang: Lang; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      waitlistConsumers().then((n) => {
        if (!cancelled) setCount(n);
      });
    };
    if (!("IntersectionObserver" in window)) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <p ref={ref} className={className} data-waitlist-count>
      {count === null ? null : SITE[lang].waitlist.count(count.toLocaleString(lang === "es" ? "es-BO" : "en-US"))}
    </p>
  );
}
