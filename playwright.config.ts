import { defineConfig, devices } from "@playwright/test";
import { E2E_MARKETPLACE } from "./e2e/env";

// Smoke tests against the production build (`next build && next start`), never
// against a `next dev` the user may be running on 3001.
//
// `NEXT_PUBLIC_URL_APP` is inlined when the site is built, so each of its two states needs
// its own build (one after another: they share `.next`):
//   marketplace      the Marketplace has a public URL: every link to it is shown. Every spec
//                    but the one below.
//   sin-marketplace  no NEXT_PUBLIC_URL_APP, as in production today: its links are hidden or
//                    lead to the page of this site that takes their place
//                    (e2e/sin-marketplace.spec.ts).
// `pnpm e2e` runs both; `pnpm e2e:<variant>` runs one. Each has its own port (E2E_PORT, default
// 3121, and 10 more), so a server left running is never taken for the other build.
type Variant = { offset: number; marketplace: boolean; testMatch?: string[]; testIgnore?: string[] };
const VARIANTS = {
  marketplace: { offset: 0, marketplace: true, testIgnore: ["**/sin-marketplace.spec.ts"] },
  "sin-marketplace": { offset: 10, marketplace: false, testMatch: ["**/sin-marketplace.spec.ts"] },
} satisfies Record<string, Variant>;

// Test-only value: the proxy signs with it and the stand-in checks the signature.
const PROXY_SHARED_SECRET = "e2e-proxy-secret-0123456789abcdef";
// Locally the installed Chrome; in CI the Chromium that Playwright installs.
const channel = process.env.CI ? undefined : "chrome";

export function e2eConfig(variant: keyof typeof VARIANTS) {
  const v: Variant = VARIANTS[variant];
  const port = Number(process.env.E2E_PORT ?? 3121) + v.offset;
  // Stand-in for the backend (e2e/stub-api.mjs): `/api/v1/*` of the site is rewritten to it by the
  // real proxy, with the signed headers. Most tests intercept the API in the browser (page.route).
  const apiPort = Number(process.env.E2E_API_PORT ?? 3122) + v.offset;
  const env = { ...(process.env as Record<string, string>), E2E_API_PORT: String(apiPort), PROXY_SHARED_SECRET };
  return defineConfig({
    testDir: "./e2e",
    testMatch: v.testMatch,
    testIgnore: v.testIgnore,
    outputDir: `test-results/${variant}`,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["github"], ["html", { open: "never", outputFolder: `playwright-report/${variant}` }]] : "list",
    use: {
      baseURL: `http://localhost:${port}`,
      locale: "es-BO",
      trace: "retain-on-failure",
    },
    projects: [
      { name: "escritorio", use: { ...devices["Desktop Chrome"], channel } },
      { name: "movil", use: { ...devices["Pixel 7"], channel } },
    ],
    webServer: [
      {
        command: "node e2e/stub-api.mjs",
        env,
        url: `http://127.0.0.1:${apiPort}/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
      {
        command: `pnpm build && pnpm exec next start --port ${port}`,
        env: {
          ...env,
          // API_ORIGIN must exist at build time for /lista-de-espera to offer the form.
          API_ORIGIN: `http://127.0.0.1:${apiPort}`,
          // Empty = the production of today: the Marketplace has no public URL. An empty value wins over a local .env file.
          NEXT_PUBLIC_URL_APP: v.marketplace ? E2E_MARKETPLACE : "",
        },
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
    ],
  });
}

export default e2eConfig("marketplace");
