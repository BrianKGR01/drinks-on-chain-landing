# Drinks on Chain — Landing principal

Sitio del dominio raíz del ecosistema Drinks on Chain. Público primario: el consumidor. Presenta qué es Drinks on Chain, cómo funciona (escanea · descubre · adquiere · retira), los vinos de la red y las bodegas, y envía a las aplicaciones: el Marketplace (`app.`) para explorar y comprar, y el sitio de las bodegas (`bodegas.`) para el público B2B.

Este sitio **no autentica a nadie**: no tiene sesión, cookies de identidad ni formularios de credenciales. "Entrar" siempre lleva al Marketplace.

Plan y roadmap: `../docs/02-plan-landing-ecosistema.md` y `../docs/07-roadmap-landing-principal.md`. Avance fino: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 + CSS Modules · zustand (idioma, barrera de edad, menú). Tipografías Cormorant Garamond y EB Garamond vía `next/font` (autoalojadas). Sin WebGL: el mapa del héroe es un canvas y las vistas previas son SVG, generados desde la geometría compartida (`MapCanvas`, `MapPreview`). Vercel Web Analytics sin cookies (hay que activarlo en el panel del proyecto).

La barrera de edad es un velo de papel sobre el mapa del héroe, que se dibuja debajo; mientras está visible la página no se desplaza ni recibe foco, y al entrar el velo se levanta sobre el héroe.

## Scripts

```bash
pnpm dev --port 3001
pnpm build
pnpm lint
pnpm exec tsc --noEmit
```

## Variables de entorno

Copia `.env.example` a `.env.local`. Los enlaces a los otros sitios nunca se escriben en el código:

| Variable | Uso | Desarrollo |
|---|---|---|
| `NEXT_PUBLIC_URL_APP` | Marketplace (`app.`) | `http://localhost:3002` |
| `NEXT_PUBLIC_URL_BODEGAS` | Sitio de las bodegas (`bodegas.`) | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Origen canónico (metadatos, sitemap, robots) | sin definir: Vercel en producción, `localhost:3001` |

## Estructura

```
src/
  app/                 /, /vinos, /como-funciona, /bodegas, /tecnologia, /historia, /contacto, /aviso-legal, /privacidad, /b/[codigo] (redirige al visor)
  components/
    site/              SiteHeader, SiteFooter, MapPreview (SVG del mapa)
    home/              secciones de la página de inicio
    intro/             barrera de edad y ornamentos (compartidos con el sitio de bodegas)
    pages/             páginas editoriales (compartidas) y páginas propias (SimplePages)
    brand/, ui/        wordmark, fotografías a tinta, ilustraciones
  content/             textos ES/EN del sitio (site-i18n), y contenido compartido copiado del sitio de bodegas (villages, zones, images, i18n)
  lib/links.ts         enlaces salientes por variable de entorno
  lib/site.ts          origen canónico y metadatos por página (SEO)
  store/experience.ts  idioma, barrera de edad, menú
docs/                  créditos de imágenes y fuentes del contenido (copias)
```

## Contenido compartido

`src/content/{villages,zones,images,parcels,i18n}.ts`, `src/content/network.ts`, `src/content/data/*.json` (la red de prueba de bodegas y puntos de recojo) y `public/images/**` son copias del repositorio `drinks-on-chain-front`. Hasta que exista el paquete `@doc/content` (Etapa 0 del roadmap global), cualquier corrección de contenido se hace primero allí y se vuelve a copiar aquí.

## Seguridad

Cabeceras en `next.config.ts`: CSP sin nonce (sitio estático, sin datos de usuario), `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y HSTS en producción.

## Flujo de trabajo en Git

`main` estable, trabajo diario en `dev`, PR `dev → main` al cerrar cada hito del roadmap. Conventional Commits (`feat(home): …`, `fix(header): …`, `docs: …`, `chore: …`).
