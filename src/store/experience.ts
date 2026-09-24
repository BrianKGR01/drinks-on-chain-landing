"use client";

import { create } from "zustand";
import type { Lang } from "@/lib/scene-contract";

/**
 * Site-wide UI state for the main landing: language, whether the age gate
 * was passed, and the mobile menu. Named `useExperience` so the components
 * shared with the bodegas site work unchanged.
 */
interface ExperienceState {
  lang: Lang;
  entered: boolean;
  menuOpen: boolean;
  setLang: (lang: Lang) => void;
  enter: () => void;
  toggleMenu: (open?: boolean) => void;
}

/** Session-scoped: a refresh does not ask again, a new visit does. */
export const GATE_KEY = "doc-age-ok";

export const useExperience = create<ExperienceState>((set) => ({
  lang: "es",
  entered: false,
  menuOpen: false,
  setLang: (lang) => set({ lang }),
  enter: () => {
    try {
      window.sessionStorage.setItem(GATE_KEY, "1");
      document.documentElement.setAttribute("data-age-ok", "1");
    } catch {
      /* storage unavailable */
    }
    set({ entered: true });
  },
  toggleMenu: (open) => set((s) => ({ menuOpen: open ?? !s.menuOpen })),
}));

/** True when the visitor confirmed their age earlier in this browser session. */
export function hasRecentAgeConfirmation(): boolean {
  try {
    return window.sessionStorage.getItem(GATE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Inline script for <head>: marks the document before first paint when the
 * gate was already passed, so CSS can hide it without a flash.
 */
export const AGE_GATE_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${GATE_KEY}")==="1")document.documentElement.setAttribute("data-age-ok","1")}catch(e){}`;
