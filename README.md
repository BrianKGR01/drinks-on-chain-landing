# Drinks on Chain — Landing principal

Sitio del dominio raíz del ecosistema Drinks on Chain. Público primario: el consumidor. Presenta qué es Drinks on Chain, cómo funciona (escanea · descubre · adquiere · retira), los vinos de la red y las bodegas, y envía a las aplicaciones: el Marketplace (`app.`) para explorar y comprar, y el sitio de las bodegas (`bodegas.`) para el público B2B.

Este sitio **no autentica a nadie**: no tiene sesión, cookies de identidad ni formularios de credenciales. "Entrar" siempre lleva al Marketplace.

Plan y roadmap: `../docs/02-plan-landing-ecosistema.md` y `../docs/07-roadmap-landing-principal.md`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 + CSS Modules · zustand (idioma, barrera de edad, menú). Tipografías Cormorant Garamond y EB Garamond vía `next/font`. Sin WebGL: el mapa es un dibujo SVG generado desde la geometría compartida (`MapPreview`).

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
  store/experience.ts  idioma, barrera de edad, menú
docs/                  créditos de imágenes y fuentes del contenido (copias)
```

## Contenido compartido

`src/content/{villages,zones,images,parcels,i18n}.ts` y `public/images/**` son copias del repositorio `drinks-on-chain-front`. Hasta que exista el paquete `@doc/content` (Etapa 0 del roadmap global), cualquier corrección de contenido se hace primero allí y se vuelve a copiar aquí.

## Flujo de trabajo en Git

`main` estable, trabajo diario en `dev`, PR `dev → main` al cerrar cada hito del roadmap. Conventional Commits (`feat(home): …`, `fix(header): …`, `docs: …`, `chore: …`).
