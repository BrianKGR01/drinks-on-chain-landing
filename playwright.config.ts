import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the production build (`next build && next start`), never
// against a `next dev` the user may be running on 3001.
const PORT = Number(process.env.E2E_PORT ?? 3121);
// Stand-in for the backend (e2e/stub-api.mjs): `/api/v1/*` of the site is rewritten to it by the
// real proxy, with the signed headers. Most tests intercept the API in the browser (page.route).
const API_PORT = Number(process.env.E2E_API_PORT ?? 3122);
// Test-only value: the proxy signs with it and the stand-in checks the signature.
const PROXY_SHARED_SECRET = "e2e-proxy-secret-0123456789abcdef";
// Locally the installed Chrome; in CI the Chromium that Playwright installs.
const channel = process.env.CI ? undefined : "chrome";
const env = { ...(process.env as Record<string, string>), E2E_API_PORT: String(API_PORT), PROXY_SHARED_SECRET };

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
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
      url: `http://127.0.0.1:${API_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `pnpm build && pnpm exec next start --port ${PORT}`,
      // API_ORIGIN must exist at build time for /lista-de-espera to offer the form.
      env: { ...env, API_ORIGIN: `http://127.0.0.1:${API_PORT}` },
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
  ],
});
