import { expect, test, type Page, type Route } from "@playwright/test";
import { pastGate, seriousViolations, settle, trackErrors } from "./support";

// Consumer waiting list (contract o1b-lista-de-espera): /lista-de-espera, its calls on the home
// and the menu. The API is intercepted in the browser (page.route) except in the cold run, which
// goes through the real `/api/v1` proxy to the stand-in of e2e/stub-api.mjs.

const JOIN = "**/api/v1/public/waitlist";
const STATS = "**/api/v1/public/waitlist/stats";
const STUB = `http://127.0.0.1:${process.env.E2E_API_PORT ?? 3122}`;
const SHARE_URL = /\/lista-de-espera\?src=amigo$/;

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1200;

const envelope = (statusCode: number, data: unknown) => ({ success: true, statusCode, timestamp: new Date().toISOString(), path: "/v1/public/waitlist", data });
const failure = (statusCode: number, code: string, message: string, details: { field: string | null; message: string }[] | null) => ({
  success: false,
  statusCode,
  timestamp: new Date().toISOString(),
  path: "/v1/public/waitlist",
  error: { code, message, details },
});

/** Answers every sign-up with a position and keeps the bodies and headers that were sent. */
async function acceptJoins(page: Page, position = 128) {
  const sent: { body: Record<string, unknown>; headers: Record<string, string> }[] = [];
  await page.route(JOIN, async (route: Route) => {
    sent.push({ body: route.request().postDataJSON(), headers: route.request().headers() });
    await route.fulfill({ status: 201, json: envelope(201, { type: "CONSUMER", position }) });
  });
  return sent;
}

async function fillForm(page: Page, { email = "ana@example.com", optional = true } = {}) {
  await page.getByLabel("Nombre y apellido").fill("Ana Quiroga");
  await page.getByLabel("Correo", { exact: true }).fill(email);
  if (optional) {
    await page.getByLabel("WhatsApp (opcional)").fill("+591 70000000");
    await page.getByLabel("Ciudad (opcional)").fill("Tarija");
  }
  await page.getByRole("radio", { name: "Ambos" }).check();
  await page.getByRole("checkbox", { name: "Soy mayor de 18 años." }).check();
  await page.getByRole("checkbox", { name: /Acepto que Drinks on Chain me escriba/ }).check();
}

const submit = (page: Page) => page.getByRole("button", { name: "Unirme a la lista" }).click();
const done = (page: Page) => page.getByRole("heading", { name: "Estás en la lista" });

/** Switches the site to English: in the header on desktop, in the full-screen menu on phones. */
async function switchToEnglish(page: Page) {
  if (!isMobile(page)) {
    await page.getByRole("banner").getByRole("button", { name: "EN", exact: true }).click();
    return;
  }
  await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
  await page.getByRole("dialog", { name: "Menú" }).getByRole("button", { name: "EN", exact: true }).click();
  await page.getByRole("dialog", { name: "Menu" }).getByRole("button", { name: "Close" }).click();
}

test.describe("recorrido en frío desde un QR", () => {
  test("barrera de edad → formulario → inscripción por el proxy firmado, con el origen del QR", async ({ page, request }, info) => {
    const errors = trackErrors(page);
    const email = `frio-${info.project.name}-${info.retry}@example.com`;
    await page.goto("/lista-de-espera?src=tarija-2026");

    // The gate asks first; on this page it shows "Entrar" at once and lifts fast.
    const gate = page.getByRole("dialog", { name: "Confirmación de mayoría de edad" });
    await expect(gate).toBeVisible();
    await expect(page.locator("#content")).toHaveAttribute("inert", "");
    await gate.getByRole("button", { name: "Entrar" }).click();
    await expect(gate).toBeHidden({ timeout: 2000 });

    await expect(page.getByRole("heading", { level: 1, name: "Vinos y singanis de altura, antes de que salgan a la venta." })).toBeVisible();
    await fillForm(page, { email });
    await submit(page);

    await expect(done(page)).toBeVisible();
    await expect(done(page)).toBeFocused();
    await expect(page.getByTestId("waitlist-position")).toHaveText("N.º 7");

    // What reached the API behind the proxy: the body, the signed client IP and no cookies.
    const last = await (await request.get(`${STUB}/__last?email=${encodeURIComponent(email)}`)).json();
    expect(last.body).toEqual({
      type: "CONSUMER",
      fullName: "Ana Quiroga",
      email,
      phone: "+591 70000000",
      city: "Tarija",
      interest: "BOTH",
      isAdult: true,
      consent: true,
      locale: "es",
      source: "tarija-2026",
      website: "",
    });
    expect(last.signed).toBe(true);
    expect(last.clientIp).toBeTruthy();
    expect(last.clientApp).toBe("PUBLIC");
    expect(last.cookie).toBeNull();
    expect(errors).toEqual([]);
  });
});

test.describe("/lista-de-espera", () => {
  test.beforeEach(async ({ context }) => pastGate(context));

  test("inscribe y muestra el número de orden y qué pasa después", async ({ page }) => {
    const errors = trackErrors(page);
    const sent = await acceptJoins(page, 1284);
    await page.goto("/lista-de-espera");
    await fillForm(page, { optional: false });
    // Keyboard: submitting from a field with Enter.
    await page.getByLabel("Nombre y apellido").press("Enter");

    await expect(done(page)).toBeVisible();
    await expect(done(page)).toBeFocused();
    await expect(page.getByText("Tu número de orden")).toBeVisible();
    await expect(page.getByTestId("waitlist-position")).toHaveText("N.º 1.284");
    await expect(page.getByText("Te escribiremos antes de abrir la preventa, al correo que dejaste.")).toBeVisible();
    await expect(page.getByText("No enviamos un correo de confirmación")).toBeVisible();
    // The form is gone: one heading names the panel.
    await expect(page.getByRole("heading", { name: "Apúntate" })).toHaveCount(0);

    // Optional fields left empty are not sent; no origin without ?src=.
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toEqual({
      type: "CONSUMER",
      fullName: "Ana Quiroga",
      email: "ana@example.com",
      interest: "BOTH",
      isAdult: true,
      consent: true,
      locale: "es",
      website: "",
    });
    expect(sent[0].headers["x-client-app"]).toBe("PUBLIC");
    expect(sent[0].headers.cookie).toBeUndefined();
    expect(errors).toEqual([]);

    // At a stand the same phone signs up the next person: an empty form again.
    await page.getByRole("button", { name: "Apuntar a otra persona" }).click();
    await expect(page.getByLabel("Nombre y apellido")).toHaveValue("");
    await expect(page.getByRole("checkbox", { name: "Soy mayor de 18 años." })).not.toBeChecked();
  });

  test("con WhatsApp, la confirmación lo nombra", async ({ page }) => {
    await acceptJoins(page);
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);
    await expect(page.getByText("al correo o al WhatsApp que dejaste")).toBeVisible();
  });

  test("valida en el cliente sin enviar y lleva el foco al primer error", async ({ page }) => {
    const sent = await acceptJoins(page);
    await page.goto("/lista-de-espera");
    await page.getByLabel("Correo", { exact: true }).fill("no-es-un-correo");
    await page.getByLabel("WhatsApp (opcional)").fill("abc");
    await submit(page);

    const name = page.getByLabel("Nombre y apellido");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription("Este campo es obligatorio.");
    await expect(page.getByLabel("Correo", { exact: true })).toHaveAccessibleDescription("Escribe un correo válido, por ejemplo nombre@correo.com.");
    await expect(page.getByLabel("WhatsApp (opcional)")).toHaveAccessibleDescription(/Con el código de tu país.*Escribe un número válido/);
    await expect(page.getByRole("radiogroup", { name: "¿Qué te interesa?" })).toHaveAccessibleDescription("Elige una opción.");
    await expect(page.getByRole("checkbox", { name: "Soy mayor de 18 años." })).toHaveAccessibleDescription("La lista es solo para mayores de 18 años.");
    await expect(page.getByRole("checkbox", { name: /Acepto que Drinks on Chain/ })).toHaveAccessibleDescription("Necesitamos tu conformidad para escribirte.");
    await expect(page.getByRole("status").filter({ hasText: "Revisa los campos marcados." })).toBeVisible();

    // Fixing a field clears its error.
    await name.fill("Ana Quiroga");
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await page.getByRole("checkbox", { name: "Soy mayor de 18 años." }).check();
    await expect(page.getByText("La lista es solo para mayores de 18 años.")).toHaveCount(0);
    expect(sent).toHaveLength(0);
  });

  test("marca en su campo los errores 422 del servidor", async ({ page }) => {
    let calls = 0;
    await page.route(JOIN, (route) => {
      calls++;
      return route.fulfill({
        status: 422,
        json: failure(422, "VALIDATION_ERROR", "Datos no válidos", [
          { field: "email", message: "El correo no es válido" },
          { field: "phone", message: "El teléfono debe tener entre 7 y 20 caracteres" },
          { field: "isAdult", message: "Debes ser mayor de 18 años" },
          { field: "source", message: "El origen no es válido" },
        ]),
      });
    });
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);

    const email = page.getByLabel("Correo", { exact: true });
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription("El correo no es válido");
    await expect(page.getByLabel("WhatsApp (opcional)")).toHaveAccessibleDescription(/El teléfono debe tener entre 7 y 20 caracteres/);
    await expect(page.getByRole("checkbox", { name: "Soy mayor de 18 años." })).toHaveAccessibleDescription("Debes ser mayor de 18 años");
    // A detail about something that is not a field of the form goes to the summary.
    await expect(page.getByRole("status").filter({ hasText: "Revisa los campos marcados. El origen no es válido" })).toBeVisible();
    await expect(done(page)).toHaveCount(0);

    // The data stays and the next attempt is sent.
    await expect(page.getByLabel("Nombre y apellido")).toHaveValue("Ana Quiroga");
    await email.fill("ana@example.org");
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
    await submit(page);
    await expect.poll(() => calls).toBe(2);
  });

  test("429: dice cuánto esperar", async ({ page }) => {
    await page.route(JOIN, (route) =>
      route.fulfill({
        status: 429,
        headers: { "Retry-After": "120" },
        json: failure(429, "TOO_MANY_REQUESTS", "Demasiadas solicitudes", null),
      }),
    );
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);
    await expect(page.getByRole("status").filter({ hasText: "Vuelve a intentarlo en 2 minutos" })).toBeVisible();
    await expect(done(page)).toHaveCount(0);
    await expect(page.getByLabel("Nombre y apellido")).toHaveValue("Ana Quiroga");
  });

  test("error de red: avisa y conserva los datos", async ({ page }) => {
    await page.route(JOIN, (route) => route.abort("internetdisconnected"));
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);
    await expect(page.getByRole("status").filter({ hasText: "No pudimos conectar." })).toBeVisible();
    await expect(page.getByLabel("Correo", { exact: true })).toHaveValue("ana@example.com");
  });

  test("sin API detrás del proxy (sin API_ORIGIN): aviso amable con el correo de contacto", async ({ page }) => {
    // What this site answers on /api/v1 when the proxy has no API_ORIGIN: its own 404 page.
    await page.route(JOIN, (route) => route.fulfill({ status: 404, contentType: "text/html", body: "<!doctype html><title>404</title>" }));
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);
    const status = page.getByRole("status").filter({ hasText: "Ahora mismo no podemos recibir inscripciones." });
    await expect(status).toBeVisible();
    await expect(status.getByRole("link", { name: "contacto@drinksonchain.bo" })).toHaveAttribute("href", "mailto:contacto@drinksonchain.bo");
    await expect(page.getByLabel("Nombre y apellido")).toHaveValue("Ana Quiroga");
  });

  test("una respuesta sin número de orden no se da por buena", async ({ page }) => {
    await page.route(JOIN, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>ok</title>" }));
    await page.goto("/lista-de-espera");
    await fillForm(page);
    await submit(page);
    await expect(page.getByRole("status").filter({ hasText: "No pudimos apuntarte." })).toBeVisible();
    await expect(done(page)).toHaveCount(0);
  });

  test("el campo trampa está fuera de la vista, del tabulador y de la accesibilidad", async ({ page }) => {
    const sent = await acceptJoins(page);
    await page.goto("/lista-de-espera");
    const trap = page.locator('input[name="website"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap).toHaveAttribute("autocomplete", "off");
    await expect(page.locator('[aria-hidden="true"] input[name="website"]')).toHaveCount(1);
    await expect(trap).not.toBeInViewport();
    // Tab from the last field goes past the trap.
    await page.getByRole("checkbox", { name: /Acepto que Drinks on Chain/ }).focus();
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("name"))).not.toBe("website");
    }
    // A bot that fills it is sent as is: the server answers without storing anything.
    await fillForm(page);
    await trap.evaluate((el: HTMLInputElement) => (el.value = "https://spam.example"));
    await submit(page);
    await expect(done(page)).toBeVisible();
    expect(sent[0].body.website).toBe("https://spam.example");
  });

  test("teclados y autocompletado adecuados para el teléfono", async ({ page }) => {
    await page.goto("/lista-de-espera");
    const name = page.getByLabel("Nombre y apellido");
    await expect(name).toHaveAttribute("autocomplete", "name");
    const email = page.getByLabel("Correo", { exact: true });
    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("inputmode", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    const phone = page.getByLabel("WhatsApp (opcional)");
    await expect(phone).toHaveAttribute("type", "tel");
    await expect(phone).toHaveAttribute("inputmode", "tel");
    await expect(phone).toHaveAttribute("autocomplete", "tel");
    await expect(page.getByLabel("Ciudad (opcional)")).toHaveAttribute("autocomplete", "address-level2");
    // The privacy text opens in another tab: what is typed is not lost.
    const privacy = page.getByRole("link", { name: /Privacidad/ }).first();
    await expect(privacy).toHaveAttribute("href", "/privacidad#lista-de-espera");
    await expect(privacy).toHaveAttribute("target", "_blank");
  });

  test.describe("origen de la inscripción (?src=)", () => {
    test("se envía como source", async ({ page }) => {
      const sent = await acceptJoins(page);
      await page.goto("/lista-de-espera?src=tarija-2026");
      await fillForm(page);
      await submit(page);
      await expect(done(page)).toBeVisible();
      expect(sent[0].body.source).toBe("tarija-2026");
    });

    test("se conserva al navegar por el sitio", async ({ page }) => {
      const sent = await acceptJoins(page);
      await page.goto("/?src=Tarija-2026");
      await page.getByRole("main").getByRole("link", { name: "Unirme a la lista" }).first().click();
      await expect(page).toHaveURL("/lista-de-espera");
      await fillForm(page);
      await submit(page);
      await expect(done(page)).toBeVisible();
      expect(sent[0].body.source).toBe("tarija-2026");
    });

    for (const [name, value] of [
      ["con caracteres no permitidos", "no%20v%C3%A1lido!"],
      ["demasiado largo", "a".repeat(41)],
      ["vacío", ""],
    ] as const) {
      test(`no válido (${name}): no se envía y se quita el que hubiera`, async ({ page }) => {
        const sent = await acceptJoins(page);
        await page.goto("/?src=tarija-2026");
        await expect.poll(() => page.evaluate(() => sessionStorage.getItem("doc-waitlist-src"))).toBe("tarija-2026");
        await page.goto(`/lista-de-espera?src=${value}`);
        await expect.poll(() => page.evaluate(() => sessionStorage.getItem("doc-waitlist-src"))).toBeNull();
        await fillForm(page);
        await submit(page);
        await expect(done(page)).toBeVisible();
        expect(sent[0].body).not.toHaveProperty("source");
      });
    }
  });

  test.describe("compartir", () => {
    test("con Web Share API: abre la hoja del sistema con el enlace ?src=amigo", async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(Navigator.prototype, "share", {
          configurable: true,
          value: async (data: unknown) => {
            (window as unknown as { __shared: unknown }).__shared = data;
          },
        });
      });
      await acceptJoins(page);
      await page.goto("/lista-de-espera");
      await fillForm(page);
      await submit(page);
      await expect(done(page)).toBeVisible();

      await page.getByRole("button", { name: "Compartir" }).click();
      const shared = await page.evaluate(() => (window as unknown as { __shared: { title: string; text: string; url: string } }).__shared);
      expect(shared.url).toMatch(SHARE_URL);
      expect(shared.text).toContain("lista de espera de Drinks on Chain");
      await expect(page.getByRole("link", { name: "Enviar por WhatsApp" })).toHaveCount(0);
    });

    test("sin Web Share API: WhatsApp y copiar enlace", async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(Navigator.prototype, "share", { configurable: true, value: undefined });
        Object.defineProperty(Navigator.prototype, "clipboard", {
          configurable: true,
          value: {
            writeText: async (text: string) => {
              (window as unknown as { __copied: string }).__copied = text;
            },
          },
        });
      });
      await acceptJoins(page);
      await page.goto("/lista-de-espera");
      await fillForm(page);
      await submit(page);
      await expect(done(page)).toBeVisible();
      await expect(page.getByRole("button", { name: "Compartir" })).toHaveCount(0);

      const whatsapp = page.getByRole("link", { name: "Enviar por WhatsApp" });
      const href = (await whatsapp.getAttribute("href")) ?? "";
      expect(href.startsWith("https://wa.me/?text=")).toBe(true);
      expect(decodeURIComponent(href.slice("https://wa.me/?text=".length))).toMatch(SHARE_URL);
      await expect(whatsapp).toHaveAttribute("target", "_blank");
      await expect(whatsapp).toHaveAttribute("rel", /noopener/);

      await page.getByRole("button", { name: "Copiar enlace" }).click();
      await expect(page.getByRole("status").filter({ hasText: "Enlace copiado." })).toBeVisible();
      expect(await page.evaluate(() => (window as unknown as { __copied: string }).__copied)).toMatch(SHARE_URL);
    });

    test("si no se puede copiar, muestra el enlace", async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(Navigator.prototype, "share", { configurable: true, value: undefined });
        Object.defineProperty(Navigator.prototype, "clipboard", {
          configurable: true,
          value: { writeText: async () => Promise.reject(new Error("denied")) },
        });
      });
      await acceptJoins(page);
      await page.goto("/lista-de-espera");
      await fillForm(page);
      await submit(page);
      await page.getByRole("button", { name: "Copiar enlace" }).click();
      await expect(page.getByRole("status").filter({ hasText: /No se pudo copiar\. Copia este enlace: .*\/lista-de-espera\?src=amigo/ })).toBeVisible();
    });
  });

  test("en inglés: textos, idioma enviado y confirmación", async ({ page }) => {
    test.slow(); // ends with an axe run
    let calls = 0;
    let body: Record<string, unknown> = {};
    await page.route(JOIN, (route) => {
      body = route.request().postDataJSON();
      return ++calls === 1
        ? route.fulfill({ status: 422, json: failure(422, "VALIDATION_ERROR", "Datos no válidos", [{ field: "email", message: "El correo no es válido" }]) })
        : route.fulfill({ status: 201, json: envelope(201, { type: "CONSUMER", position: 1284 }) });
    });
    await page.goto("/lista-de-espera");
    await switchToEnglish(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1, name: "High-altitude wines and singanis, before they go on sale." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();

    await page.getByLabel("Full name").fill("Ana Quiroga");
    await page.getByLabel("Email", { exact: true }).fill("ana@example.com");
    await page.getByLabel("City (optional)").fill("La Paz");
    await page.getByRole("radio", { name: "Wine" }).check();
    await page.getByRole("checkbox", { name: "I am over 18." }).check();
    await page.getByRole("checkbox", { name: /I agree that Drinks on Chain writes to me/ }).check();
    await page.getByRole("button", { name: "Join the list" }).click();

    // The API writes in Spanish: in English the field gets the form's own message.
    await expect(page.getByLabel("Email", { exact: true })).toHaveAccessibleDescription("Check this field.");
    await expect(page.getByRole("status").filter({ hasText: "Check the highlighted fields." })).toBeVisible();

    await page.getByRole("button", { name: "Join the list" }).click();
    const heading = page.getByRole("heading", { name: "You are on the list" });
    await expect(heading).toBeVisible();
    await expect(page.getByTestId("waitlist-position")).toHaveText("No. 1,284");
    await expect(page.getByText("We will write to you before the pre-sale opens")).toBeVisible();
    expect(body).toMatchObject({ type: "CONSUMER", locale: "en", interest: "WINE", city: "La Paz", isAdult: true, consent: true });
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("axe sin violaciones serias: formulario, errores y confirmación", async ({ page }) => {
    test.slow(); // three axe runs
    await acceptJoins(page);
    await page.goto("/lista-de-espera");
    await settle(page, 600);
    expect(await seriousViolations(page)).toEqual([]);
    await submit(page); // with the client errors on screen
    await expect(page.getByText("Elige una opción.")).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
    await fillForm(page);
    await submit(page);
    await expect(done(page)).toBeVisible();
    await settle(page, 800);
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("Ya somos N: solo desde 25 personas", async ({ page }) => {
    await page.route(STATS, (route) => route.fulfill({ status: 200, json: envelope(200, { consumers: 1284, wineries: 9 }) }));
    await page.goto("/lista-de-espera");
    await expect(page.getByText("Ya somos 1.284 en la lista")).toBeVisible();
  });

  test("metadatos y OG propios, en el sitemap", async ({ page, request }) => {
    await page.goto("/lista-de-espera");
    await expect(page).toHaveTitle("Lista de espera · Drinks on Chain");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /sé de los primeros en entrar a la preventa/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/lista-de-espera$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Lista de espera · Drinks on Chain");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/lista-de-espera\/opengraph-image/);
    const image = await request.get("/lista-de-espera/opengraph-image");
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/lista-de-espera</loc>");
  });
});

test.describe("teléfono de 360 px", () => {
  test.use({ viewport: { width: 360, height: 640 } });
  test.beforeEach(async ({ context }) => {
    test.skip(test.info().project.name !== "movil", "phone layout: the phone project is enough");
    await pastGate(context);
  });

  test("el formulario cabe, se rellena y se envía sin desplazamiento horizontal", async ({ page }) => {
    await acceptJoins(page);
    await page.goto("/lista-de-espera?src=tarija-2026");
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(await fits()).toBe(true);

    // Comfortable targets, and fields at 16px or more so iOS does not zoom on focus.
    for (const field of [page.getByLabel("Nombre y apellido"), page.getByLabel("Correo", { exact: true }), page.getByLabel("WhatsApp (opcional)")]) {
      const box = await field.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(280);
      expect(await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    }
    const button = page.getByRole("button", { name: "Unirme a la lista" });
    expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(48);

    await submit(page); // the errors do not widen the page either
    await expect(page.getByText("Elige una opción.")).toBeVisible();
    expect(await fits()).toBe(true);

    await fillForm(page);
    await button.tap();
    await expect(done(page)).toBeVisible();
    await expect(done(page)).toBeInViewport();
    expect(await fits()).toBe(true);
  });
});

test.describe("llamadas a la acción", () => {
  test.beforeEach(async ({ context }) => pastGate(context));

  test("el héroe y la sección final de la portada llevan a la lista", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const main = page.getByRole("main");
    const hero = main.getByRole("link", { name: "Unirme a la lista" }).first();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("href", "/lista-de-espera");

    const band = page.getByRole("region", { name: "Sé de los primeros" });
    await band.scrollIntoViewIfNeeded();
    await expect(band.getByText("te escribiremos antes de abrir la preventa")).toBeVisible();
    // Fewer than 25 people (the stand-in answers 12): the size of the list is not shown.
    await expect(band.locator("[data-waitlist-count]")).toBeEmpty();
    await band.getByRole("link", { name: "Unirme a la lista" }).click();
    await expect(page).toHaveURL("/lista-de-espera");
    await expect(page.getByRole("heading", { name: "Apúntate" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("la portada dice cuántos somos desde 25 y calla si la API falla", async ({ page }) => {
    await page.route(STATS, (route) => route.fulfill({ status: 200, json: envelope(200, { consumers: 25, wineries: 4 }) }));
    await page.goto("/");
    const band = page.getByRole("region", { name: "Sé de los primeros" });
    await band.scrollIntoViewIfNeeded();
    await expect(band.getByText("Ya somos 25 en la lista")).toBeVisible();

    await page.unroute(STATS);
    await page.route(STATS, (route) => route.fulfill({ status: 500, contentType: "text/html", body: "error" }));
    await page.reload();
    const stats = page.waitForResponse(STATS);
    await page.getByRole("region", { name: "Sé de los primeros" }).scrollIntoViewIfNeeded();
    await stats;
    await expect(page.getByRole("region", { name: "Sé de los primeros" }).locator("[data-waitlist-count]")).toBeEmpty();
    await expect(page.getByRole("region", { name: "Sé de los primeros" }).getByRole("link", { name: "Unirme a la lista" })).toBeVisible();
  });

  test("entrada en el menú", async ({ page }) => {
    await page.goto("/");
    if (isMobile(page)) {
      await page.getByRole("banner").getByRole("button", { name: "Menú" }).click();
      await page.getByRole("dialog", { name: "Menú" }).getByRole("link", { name: "Lista de espera", exact: true }).click();
    } else {
      await page.getByRole("banner").getByRole("navigation").getByRole("link", { name: "Lista de espera", exact: true }).click();
    }
    await expect(page).toHaveURL("/lista-de-espera");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Lista de espera", exact: true })).toHaveAttribute("href", "/lista-de-espera");
  });

  test("la portada no carga el JavaScript del formulario", async ({ page, request }) => {
    const scripts = new Set<string>();
    page.on("response", (r) => {
      if (r.request().resourceType() === "script" && r.url().includes("/_next/")) scripts.add(r.url());
    });
    await page.goto("/");
    await settle(page, 1500);
    const home = [...scripts];
    expect(home.length).toBeGreaterThan(0);
    // A text that only the form's code carries.
    const marker = "waitlist-position";
    for (const url of home) expect((await (await request.get(url)).text()).includes(marker), url).toBe(false);

    scripts.clear();
    await page.goto("/lista-de-espera");
    await settle(page, 500);
    const sources = await Promise.all([...scripts].map(async (url) => (await request.get(url)).text()));
    expect(sources.some((s) => s.includes(marker))).toBe(true);
  });
});
