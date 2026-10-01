import type { Lang } from "@/lib/scene-contract";
import { postPublic, type ApiResult } from "./public-api";

/**
 * Consumer waiting list (contract `o1b-lista-de-espera`): `POST /v1/public/waitlist` with
 * `type: "CONSUMER"`, through this site's `/api/v1` proxy. The server owns the rules (duplicates,
 * limits, honeypot); the client only checks what a person can fix before sending. The size of the
 * list is read in `waitlist-stats.ts`.
 */

export const INTERESTS = ["WINE", "SINGANI", "BOTH"] as const;
export type Interest = (typeof INTERESTS)[number];

/** What the form collects. */
export interface WaitlistSignup {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  interest: Interest;
  locale: Lang;
  source: string | null;
  /** Honeypot: people leave it empty. */
  website: string;
}

export interface WaitlistJoinResponse {
  type: "CONSUMER" | "WINERY";
  position: number;
}

/** Shapes the server checks too; kept in step with the contract. */
export const NAME_MIN = 2;
export const NAME_MAX = 120;
export const CITY_MAX = 80;
export const EMAIL_MAX = 254;
export const PHONE_MAX = 20;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[\d\s+\-()]{7,20}$/;

/** Signs a consumer up. Only called once they ticked both boxes (legal age and consent). */
export function joinWaitlist(signup: WaitlistSignup): Promise<ApiResult<WaitlistJoinResponse>> {
  return postPublic<WaitlistJoinResponse>("public/waitlist", {
    type: "CONSUMER",
    fullName: signup.fullName,
    email: signup.email,
    ...(signup.phone ? { phone: signup.phone } : {}),
    ...(signup.city ? { city: signup.city } : {}),
    interest: signup.interest,
    isAdult: true,
    consent: true,
    locale: signup.locale,
    ...(signup.source ? { source: signup.source } : {}),
    website: signup.website,
  });
}
