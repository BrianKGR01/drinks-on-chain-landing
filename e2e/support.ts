import AxeBuilder from "@axe-core/playwright";
import type { BrowserContext, Page } from "@playwright/test";

/** Same key as `GATE_KEY` in src/store/experience.ts. */
const GATE_KEY = "doc-age-ok";

/**
 * Console errors, uncaught exceptions and failed requests of this site.
 * Ignored: browser-extension noise (wallet providers inject scripts) and the
 * Vercel Web Analytics script, which only exists on Vercel.
 */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  const noise = /chrome-extension:|moz-extension:|MetaMask|ethereum|_vercel\/insights/i;
  page.on("pageerror", (e) => !noise.test(`${e.message} ${e.stack ?? ""}`) && errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = `${m.text()} ${m.location().url}`;
    if (noise.test(text) || m.text().startsWith("Failed to load resource")) return;
    errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() < 400 || noise.test(r.url())) return;
    errors.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });
  return errors;
}

/** Skips the age gate, as a visitor who already confirmed in this session. */
export async function pastGate(context: BrowserContext) {
  await context.addInitScript((key) => {
    try {
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable */
    }
  }, GATE_KEY);
}

/** Axe (WCAG 2.1 A and AA): only the serious and critical violations fail a test. */
export async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")) }));
}

/** Waits until entrance animations settle, so contrast is measured on final colours. */
export async function settle(page: Page, ms = 2500) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(ms);
}
