import { expect, test } from "@playwright/test";
import { buildLinks, isExternal, siteBase } from "../src/lib/links";

/**
 * Unit tests of the links to the other sites (O2-WEB-1), no browser. Pure logic, so they run once.
 */

test.beforeEach(() => {
  test.skip(test.info().project.name !== "escritorio", "pure logic: one project is enough");
});

const BODEGAS = "https://bodegas.example.bo";

test.describe("enlaces a los otros sitios", () => {
  test("con NEXT_PUBLIC_URL_APP, todo lo del Marketplace sale de ella", () => {
    const links = buildLinks({ app: "https://app.example.bo/", bodegas: BODEGAS });
    expect(links.app).toBe("https://app.example.bo");
    expect(links.appEnter).toBe("https://app.example.bo");
    expect(links.catalog).toBe("https://app.example.bo/catalogo");
    expect(links.wines).toBe("https://app.example.bo/catalogo");
    expect(links.verify).toBe("https://app.example.bo/b");
    expect(links.scan).toBe("https://app.example.bo/b");
    expect(links.appBottle("K7Q2-M9XD")).toBe("https://app.example.bo/b/K7Q2-M9XD");
    // The code comes from a URL typed by anyone: it never changes the path.
    expect(links.appBottle("a/../b?x")).toBe("https://app.example.bo/b/a%2F..%2Fb%3Fx");
    expect(links.appWinery("altos-de-calamuchita")).toBe("https://app.example.bo/bodegas/altos-de-calamuchita");
  });

  test("sin la variable, cada enlace se oculta (null) o lleva a la página de este sitio que lo sustituye", () => {
    for (const app of [null, "", "   ", "/como-funciona", "marketplace.example.bo", "javascript:alert(1)"]) {
      const links = buildLinks({ app, bodegas: BODEGAS });
      expect(links.app, String(app)).toBeNull();
      expect(links.appEnter).toBeNull();
      expect(links.catalog).toBeNull();
      expect(links.verify).toBeNull();
      expect(links.appBottle("K7Q2M9XD")).toBeNull();
      expect(links.appWinery("altos-de-calamuchita")).toBeNull();
      expect(links.wines).toBe("/vinos");
      expect(links.scan).toBe("/como-funciona#escanear");
    }
  });

  test("los vinos de la portada llevan al escaparate de este sitio", () => {
    const links = buildLinks({ app: "https://app.example.bo", bodegas: BODEGAS });
    expect(links.wine("valle-de-la-concepcion")).toBe("/vinos?v=valle-de-la-concepcion");
  });

  test("el sitio de las bodegas sigue como estaba", () => {
    const links = buildLinks({ app: null, bodegas: `${BODEGAS}/` });
    expect(links.bodegas).toBe(BODEGAS);
    expect(links.bodegasJoin).toBe(`${BODEGAS}/unirse`);
    expect(links.bodegasPickup).toBe(`${BODEGAS}/puntos-de-recojo`);
    expect(links.bodegasProfile("casa-uriondo")).toBe(`${BODEGAS}/bodegas/casa-uriondo`);
    expect(links.bodegasParcel("valle-de-cinti", "camargo")).toBe(`${BODEGAS}/valles/valle-de-cinti/camargo`);
  });

  test("siteBase solo acepta http(s); isExternal distingue un sitio de una ruta propia", () => {
    expect(siteBase(" https://app.example.bo// ")).toBe("https://app.example.bo");
    expect(siteBase("http://localhost:3005")).toBe("http://localhost:3005");
    expect(siteBase("ftp://app.example.bo")).toBeNull();
    expect(siteBase(undefined)).toBeNull();
    expect(isExternal("https://app.example.bo/b")).toBe(true);
    expect(isExternal("/vinos")).toBe(false);
  });
});
