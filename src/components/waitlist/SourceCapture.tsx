"use client";

import { useEffect } from "react";
import { captureSource } from "@/lib/waitlist-source";

/**
 * Remembers the `?src=` of the link the visitor arrived with (the QR of an event, a shared link)
 * for the browser session, whatever page they land on, so a sign-up made later on
 * `/lista-de-espera` still carries it. Renders nothing; reads the address once, after hydration.
 */
export function SourceCapture() {
  useEffect(() => {
    captureSource(window.location.search);
  }, []);
  return null;
}
