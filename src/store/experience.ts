"use client";

import { create } from "zustand";
import type { Lang } from "@/lib/scene-contract";

/**
 * Site-wide UI state for the main landing. Kept deliberately small: language,
 * whether the age gate was passed, and the mobile menu. Named `useExperience`
 * so the components shared with the bodegas site work unchanged.
 */
interface ExperienceState {
  lang: Lang;
  entered: boolean;
  menuOpen: boolean;
  setLang: (lang: Lang) => void;
  enter: () => void;
  toggleMenu: (open?: boolean) => void;
}

const GATE_KEY = "doc-age-ok";

export const useExperience = create<ExperienceState>((set) => ({
  lang: "es",
  entered: false,
  menuOpen: false,
  setLang: (lang) => set({ lang }),
  enter: () => {
    try {
      window.localStorage.setItem(GATE_KEY, String(Date.now()));
    } catch {
      /* storage unavailable */
    }
    set({ entered: true });
  },
  toggleMenu: (open) => set((s) => ({ menuOpen: open ?? !s.menuOpen })),
}));

/** True when the visitor confirmed their age in the last 30 days. */
export function hasRecentAgeConfirmation(): boolean {
  try {
    const raw = window.localStorage.getItem(GATE_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
