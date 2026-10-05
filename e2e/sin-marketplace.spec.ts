import { expect, test, type Page } from "@playwright/test";
import { pastGate, seriousViolations, settle, trackErrors } from "./support";

// O2-WEB-1: build without NEXT_PUBLIC_URL_APP (playwright.sin-marketplace.config.ts), which is
// what production runs while the Marketplace has no public URL. No link leads nowhere: the ones
// that name the Marketplace are not shown, and the rest lead to the page of this site that
// answers the same question.

// Same width as the header's switch to the menu button (SiteHeader.module.css).
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1200;

test.describe("sin NEXT_PUBLIC_URL_APP", () => {
  test.beforeEach(async ({ context }) => pastGate(context));

  test("la portada no enlaza al Marketplace y sus llamadas llevan a páginas de este sitio", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Explorar los vinos" })).toHaveAttribute("href", "/vinos");
    const scanned = main.getByRole("link", { name: /¿Escaneaste una botella\?/ });
    await expect(scanned).toHaveAttribute("href", "/como-funciona#escanear");
    // No viewer to open: the hint does not promise one.
    await expect(scanned).toContainText("Mira qué cuenta el código de la etiqueta");
    await expect(main.getByRole("link", { name: "Ver todos los vinos" })).toHaveAttribute("href", "/vinos");
    await expect(page.getByRole("link", { name: /Marketplace/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Verifica una botella" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Entrar", exact: true })).toHaveCount(0);

    // Nothing on the page points at a path that does not exist (the old fallback built /como-funciona/…).
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.filter((h) => h.startsWith("/como-funciona/") || h.includes("localhost:3005"))).toEqual([]);

    // The footer keeps the rest of the network.
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Para bodegas" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Puntos de canje" })).toHaveAttribute("href", /\/puntos-de-recojo$/);
    expect(errors).toEqual([]);
  });

  test("«Explorar los vinos» y «¿Escaneaste una botella?» llegan a su página", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: "Explorar los vinos" }).click();
    await expect(page).toHaveURL("/vinos");
    await expect(page.getByRole("heading", { name: /Vinos/ }).first()).toBeVisible();
    // No Marketplace to buy in: the showcase keeps "Descubrir" only.
    await expect(page.getByRole("link", { name: "Adquirir", exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Descubrir", exact: true })).toBeVisible();

    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: /¿Escaneaste una botella\?/ }).click();
    await expect(page).toHaveURL("/como-funciona#escanear");
    await expect(page.getByRole("main").getByRole("link", { name: "Explorar los vinos" })).toHaveAttribute("href", "/vinos");
    expect(errors).toEqual([]);
  });

  test("la cabecera y el menú no ofrecen «Entrar» ni el visor", async ({ page }) => {
    await page.goto("/como-funciona");
    if (isMobile(page)) {
      await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
      const menu = page.getByRole("dialog", { name: "Menú" });
      await expect(menu.getByRole("link", { name: "Para bodegas y puntos de canje →" })).toBeVisible();
      await expect(menu.getByRole("link", { name: "Entrar", exact: true })).toHaveCount(0);
      await expect(menu.getByRole("link", { name: /botella/ })).toHaveCount(0);
      await settle(page, 800);
      expect(await seriousViolations(page)).toEqual([]);
    } else {
      const banner = page.getByRole("banner");
      await expect(banner.getByRole("link", { name: "Lista de espera" })).toBeVisible();
      await expect(banner.getByRole("link", { name: "Entrar", exact: true })).toHaveCount(0);
    }
  });

  test("/b/{código} lleva a la explicación del código, no a un 404", async ({ page, request }) => {
    const res = await request.get("/b/K7Q2-M9XD", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toBe("/como-funciona#escanear");
    await page.goto("/b/K7Q2-M9XD");
    await expect(page).toHaveURL("/como-funciona#escanear");
    await expect(page.getByRole("heading", { name: "Escanea" })).toBeVisible();
  });

  test("axe sin violaciones serias en la portada", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    expect(await seriousViolations(page)).toEqual([]);
  });
});
