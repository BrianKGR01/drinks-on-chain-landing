import { expect, test, type Page } from "@playwright/test";
import { E2E_MARKETPLACE } from "./env";
import { pastGate, seriousViolations, settle, trackErrors } from "./support";

// O2-WEB-1: with NEXT_PUBLIC_URL_APP (this build, see playwright.config.ts) every link to the
// Marketplace is shown and leads to it: "Explorar los vinos" → /catalogo, "Verifica una botella"
// and "¿Escaneaste una botella?" → /b, "Entrar" and "Marketplace" → its home.
// e2e/sin-marketplace.spec.ts covers the build without the variable.

// Same width as the header's switch to the menu button (SiteHeader.module.css).
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1200;

test.describe("con NEXT_PUBLIC_URL_APP", () => {
  test.beforeEach(async ({ context }) => pastGate(context));

  test("la portada lleva al catálogo, al visor y al Marketplace", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Explorar los vinos" })).toHaveAttribute("href", `${E2E_MARKETPLACE}/catalogo`);
    const scanned = main.getByRole("link", { name: /¿Escaneaste una botella\?/ });
    await expect(scanned).toHaveAttribute("href", `${E2E_MARKETPLACE}/b`);
    await expect(scanned).toContainText("Abre el visor con el código de la etiqueta");
    await expect(main.getByRole("link", { name: "Ver todo en el Marketplace" })).toHaveAttribute("href", `${E2E_MARKETPLACE}/catalogo`);
    // The wines of the home are the showcase of this site: each card opens its own wine there.
    const cards = main.getByRole("link", { name: /^Conocer: / });
    await expect(cards).toHaveCount(4);
    for (const href of await cards.evaluateAll((links) => links.map((a) => a.getAttribute("href")))) expect(href).toMatch(/^\/vinos\?v=[a-z0-9-]+$/);

    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Marketplace", exact: true })).toHaveAttribute("href", E2E_MARKETPLACE);
    await expect(footer.getByRole("link", { name: "Verifica una botella", exact: true })).toHaveAttribute("href", `${E2E_MARKETPLACE}/b`);
    expect(errors).toEqual([]);
  });

  test("«Entrar» lleva al Marketplace desde la cabecera o el menú", async ({ page }) => {
    await page.goto("/como-funciona");
    if (isMobile(page)) {
      await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
      const menu = page.getByRole("dialog", { name: "Menú" });
      await expect(menu.getByRole("link", { name: "Entrar", exact: true })).toHaveAttribute("href", E2E_MARKETPLACE);
      const verify = menu.getByRole("link", { name: "Verifica una botella →" });
      await expect(verify).toHaveAttribute("href", `${E2E_MARKETPLACE}/b`);
      await expect(verify).toBeInViewport({ ratio: 1 });
      await settle(page, 800);
      expect(await seriousViolations(page)).toEqual([]);
    } else {
      await expect(page.getByRole("banner").getByRole("link", { name: "Entrar", exact: true })).toHaveAttribute("href", E2E_MARKETPLACE);
    }
    await expect(page.getByRole("main").getByRole("link", { name: "Explorar los vinos" })).toHaveAttribute("href", `${E2E_MARKETPLACE}/catalogo`);
  });

  test("/vinos ofrece adquirir en el catálogo y abre el vino de ?v=", async ({ page }) => {
    const title = page.getByRole("main").getByRole("heading", { level: 2 });
    await page.goto("/vinos");
    const first = await title.textContent();
    // Chaguaya is not the first wine of the list: `?v=` chose it.
    await page.goto("/vinos?v=chaguaya");
    await expect(title).not.toHaveText(first ?? "");
    await expect(page.getByRole("link", { name: "Adquirir", exact: true })).toHaveAttribute("href", `${E2E_MARKETPLACE}/catalogo`);
  });

  test("una tarjeta de vino de la portada abre ese vino en /vinos", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("main").getByRole("link", { name: /^Conocer: / }).first();
    const href = await card.getAttribute("href");
    const name = (await card.getAttribute("aria-label"))?.replace(/^Conocer: /, "") ?? "";
    await card.click();
    await expect(page).toHaveURL(href ?? "/vinos");
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText(name);
  });

  test("/b/{código} redirige al visor del Marketplace", async ({ request }) => {
    test.skip(test.info().project.name !== "escritorio", "no browser involved: one project is enough");
    const res = await request.get("/b/K7Q2-M9XD", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toBe(`${E2E_MARKETPLACE}/b/K7Q2-M9XD`);
    // The code never changes the path of the Marketplace.
    const odd = await request.get(`/b/${encodeURIComponent("a/../b")}`, { maxRedirects: 0 });
    expect(odd.headers().location).toBe(`${E2E_MARKETPLACE}/b/a%2F..%2Fb`);
  });

  test("en inglés", async ({ page }) => {
    await page.goto("/");
    if (isMobile(page)) {
      await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
      await page.getByRole("dialog", { name: "Menú" }).getByRole("button", { name: "EN", exact: true }).click();
      await page.getByRole("dialog", { name: "Menu" }).getByRole("button", { name: "Close" }).click();
    } else {
      await page.getByRole("banner").getByRole("button", { name: "EN", exact: true }).click();
    }
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Verify a bottle", exact: true })).toHaveAttribute("href", `${E2E_MARKETPLACE}/b`);
    await expect(page.getByRole("main").getByRole("link", { name: "See everything in the Marketplace" })).toHaveAttribute("href", `${E2E_MARKETPLACE}/catalogo`);
  });
});
