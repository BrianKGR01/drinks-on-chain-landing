import { expect, test, type Page } from "@playwright/test";
import { pastGate, seriousViolations, settle, trackErrors } from "./support";

// Smoke tests of the main landing (plan/04 §1, sitios públicos): home without
// console errors, age gate, main navigation, ES/EN switch, key routes and axe
// on the home and an inner page, on desktop and on a phone.

// Same width as the header's switch to the menu button (SiteHeader.module.css).
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1200;

/** Opens the full-screen menu on phones; on desktop the header nav is already there. */
async function openNav(page: Page) {
  if (!isMobile(page)) return page.getByRole("banner").getByRole("navigation");
  await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
  const menu = page.getByRole("dialog", { name: "Menú" });
  await expect(menu).toBeVisible();
  return menu;
}

test.describe("barrera de edad", () => {
  test("la portada carga sin errores y se entra confirmando la edad", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const gate = page.getByRole("dialog", { name: "Confirmación de mayoría de edad" });
    await expect(gate).toBeVisible();
    await expect(gate.getByText("Certifico que tengo la edad legal para el consumo de alcohol en mi país").first()).toBeAttached();

    await gate.getByRole("button", { name: "Entrar" }).click();
    await expect(gate).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: "Cada botella, con su lugar y su historia." })).toBeVisible();

    // Confirmed for the session: a reload does not ask again.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Confirmación de mayoría de edad" })).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("sin confirmar la edad no se accede al contenido", async ({ page }) => {
    await page.goto("/como-funciona");
    const gate = page.getByRole("dialog", { name: "Confirmación de mayoría de edad" });
    await expect(gate).toBeVisible();
    // Everything outside the gate is inert: not focusable, not clickable, and the page does not scroll.
    await expect(page.locator("#content")).toHaveAttribute("inert", "");
    await page.mouse.wheel(0, 1500);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    // A new visit (another session) asks again.
    const other = await page.context().browser()!.newContext();
    const fresh = await other.newPage();
    await fresh.goto(page.url());
    await expect(fresh.getByRole("dialog", { name: "Confirmación de mayoría de edad" })).toBeVisible();
    await other.close();
  });

  test("la barrera cambia de idioma", async ({ page }) => {
    await page.goto("/");
    const gate = page.getByRole("dialog", { name: "Confirmación de mayoría de edad" });
    await gate.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Legal drinking age confirmation" }).getByRole("button", { name: "Enter" })).toBeVisible();
  });
});

test.describe("con la edad confirmada", () => {
  test.beforeEach(async ({ context }) => pastGate(context));

  test("navegación principal", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    for (const [name, path, heading] of [
      ["Vinos", "/vinos", /Vinos/],
      ["Cómo funciona", "/como-funciona", /Cómo funciona/],
      ["Bodegas", "/bodegas", /Bodegas/],
      ["Historia", "/historia", /Historia/],
    ] as const) {
      const nav = await openNav(page);
      await nav.getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test("cambio ES/EN", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    const langs = isMobile(page) ? await openNav(page) : page.getByRole("banner");
    await langs.getByRole("button", { name: "EN", exact: true }).click();
    if (isMobile(page)) await page.getByRole("dialog", { name: "Menu" }).getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Every bottle, with its place and its story." })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "From the vineyard to your table, in four steps" })).toBeAttached();
  });

  for (const [path, heading] of [
    ["/vinos", /Vinos/],
    ["/bodegas", /Bodegas/],
    ["/como-funciona", /Cómo funciona/],
    ["/tecnologia", /Tecnología/],
  ] as const) {
    test(`ruta ${path}`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeAttached();
      expect(errors).toEqual([]);
    });
  }

  test("página inexistente responde 404", async ({ page }) => {
    const res = await page.goto("/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
  });

  test("axe en la portada", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("axe en una página interior", async ({ page }) => {
    await page.goto("/como-funciona");
    await settle(page, 1000);
    expect(await seriousViolations(page)).toEqual([]);
  });
});

test("axe con la barrera de edad", async ({ page }) => {
  await page.goto("/");
  await settle(page, 4500);
  expect(await seriousViolations(page)).toEqual([]);
});
