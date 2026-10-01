import { getPublic } from "./public-api";

/**
 * Size of the consumer waiting list (`GET /v1/public/waitlist/stats`, cached 60 s by the API),
 * for "Ya somos N". Kept apart from the sign-up code so the home only carries this.
 */

/** Below this the list does not show its size. */
export const MIN_COUNT_SHOWN = 25;

/** Consumers on the list, or null when the number is not worth showing or could not be read. */
export async function waitlistConsumers(): Promise<number | null> {
  const res = await getPublic<{ consumers?: unknown }>("public/waitlist/stats");
  if (!res.ok) return null;
  const n = res.data?.consumers;
  return typeof n === "number" && Number.isInteger(n) && n >= MIN_COUNT_SHOWN ? n : null;
}
