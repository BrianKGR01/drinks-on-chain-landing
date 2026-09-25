"use client";

import { useSyncExternalStore } from "react";
import { hasRecentAgeConfirmation, useExperience } from "@/store/experience";

const subscribe = (cb: () => void) => useExperience.subscribe(cb);

/**
 * True once the visitor is past the age gate (clicked now, or earlier in
 * this session). Server snapshot is false, so there is no hydration mismatch.
 */
export function useEntered(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => useExperience.getState().entered || hasRecentAgeConfirmation(),
    () => false,
  );
}
