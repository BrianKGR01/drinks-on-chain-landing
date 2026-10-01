# Drinks on Chain — Landing principal

Sitio del dominio raíz del ecosistema Drinks on Chain. Público primario: el consumidor. Presenta qué es Drinks on Chain, cómo funciona (escanea · descubre · adquiere · canjea), los vinos de la red y las bodegas, y envía a las aplicaciones: el Marketplace (`app.`) para explorar y comprar, y el sitio de las bodegas (`bodegas.`) para el público B2B.

Este sitio **no autentica a nadie**: no tiene sesión, cookies de identidad ni formularios de credenciales. "Entrar" siempre lleva al Marketplace. Su único formulario es el de la **lista de espera** de consumidores (`/lista-de-espera`).

Plan y roadmap: `../docs/02-plan-landing-ecosistema.md` y `../docs/07-roadmap-landing-principal.md`. Avance fino: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 + CSS Modules · zustand (idioma, barrera de edad, menú). Tipografías Cormorant Garamond y EB Garamond vía `next/font` (autoalojadas). Sin WebGL: el mapa del héroe y las vistas previas de los valles son canvas dibujados desde la geometría compartida (`MapCanvas`, `MapPreview`). Vercel Web Analytics sin cookies (hay que activarlo en el panel del proyecto).

La barrera de edad es un velo de papel sobre el mapa del héroe, que se dibuja debajo; mientras está visible la página no se desplaza ni recibe foco, y al entrar el velo se levanta sobre el héroe.

## Scripts

Node 22 (`.nvmrc`) y pnpm 10.

```bash
pnpm dev          # http://localhost:3001
pnpm build
pnpm lint
pnpm typecheck    # next typegen + tsc --noEmit
pnpm e2e          # Playwright: build de producción en el puerto 3121 (E2E_PORT para cambiarlo)
```

La primera vez: `pnpm exec playwright install chromium`. Las pruebas de humo (`e2e/smoke.spec.ts`) cubren la portada sin errores de consola, la barrera de edad, la navegación, el cambio ES/EN, las rutas principales y axe (sin violaciones serias) en escritorio y móvil. `e2e/lista-de-espera.spec.ts` cubre la lista de espera (ver más abajo) y `e2e/api-proxy.spec.ts` la lógica del proxy firmado. Playwright arranca además `e2e/stub-api.mjs` (puerto 3122, `E2E_API_PORT`), un sustituto del backend al que apunta `API_ORIGIN` durante las pruebas: casi todas interceptan la API en el navegador (`page.route`), y el recorrido en frío pasa de verdad por el proxy y comprueba la firma. La CI (`.github/workflows/ci.yml`) corre lint, typecheck, build y Playwright en cada push y PR a `dev` y `main`; si falla, el informe queda como artefacto.

## Variables de entorno

Copia `.env.example` a `.env.local`. Los enlaces a los otros sitios nunca se escriben en el código:

| Variable | Uso | Desarrollo |
|---|---|---|
| `NEXT_PUBLIC_URL_APP` | Marketplace (`app.`) | `http://localhost:3005` |
| `NEXT_PUBLIC_URL_BODEGAS` | Sitio de las bodegas (`bodegas.`) | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Origen canónico (metadatos, sitemap, robots, enlace que se comparte desde la lista de espera) | sin definir: Vercel en producción, `localhost:3001` |
| `API_ORIGIN` | **De servidor** (sin `NEXT_PUBLIC_`). Origen de la API del backend: `src/proxy.ts` reescribe `/api/v1/*` a `${API_ORIGIN}/v1/*`. Sin definir, `/api/v1` responde 404 y `/lista-de-espera` avisa de que el envío no está disponible y da un correo de contacto. La página lo lee al compilar: cambiarlo exige un nuevo despliegue | `http://localhost:4000` |
| `PROXY_SHARED_SECRET` | **De servidor**. El mismo valor que en el backend del entorno: firma la IP real del visitante (`X-DOC-Client-IP`, HMAC-SHA256) para los límites por IP. Sin definir no se firma y el backend ve la IP de Vercel | sin definir |

## Lista de espera

`/lista-de-espera` (ES/EN, metadatos y `opengraph-image` propios, en el sitemap) inscribe consumidores con `POST /v1/public/waitlist` y `type: "CONSUMER"` (contrato `plan/contratos/o1b-lista-de-espera.md` del ecosistema). Llegan a ella el botón del héroe, la sección "Sé de los primeros" de la portada, el menú y el pie.

- **Proxy firmado**: el navegador solo llama a `/api/v1/*` de este sitio (`credentials: "omit"`, `X-Client-App: PUBLIC`); `src/proxy.ts` lo reescribe a la API con `X-DOC-Client-IP`, `X-DOC-Proxy-Timestamp` y `X-DOC-Proxy-Signature`. Es el mismo proxy del sitio de bodegas (`src/lib/api-proxy.ts`, `api-origin.ts`, `public-api.ts`).
- **Formulario** (`src/components/waitlist/`): nombre, correo, WhatsApp y ciudad opcionales, qué te interesa, "Soy mayor de 18 años" y consentimiento con el texto de privacidad; campo trampa `website`. Los errores 422 se marcan en su campo, el 429 dice cuánto esperar (`Retry-After`) y los fallos de red o de la API conservan lo escrito. Sin captcha: el lanzamiento es con campo trampa y límites en el backend.
- **Origen** (`src/lib/waitlist-source.ts`): `?src=` de cualquier página se guarda en `sessionStorage` y se envía como `source` (solo `[a-z0-9-]{1,40}`, en minúsculas; uno no válido no se envía y borra el guardado). El QR de un evento apunta a `/lista-de-espera?src=tarija-2026`.
- **Confirmación**: "Estás en la lista" con el número de orden (`position`) y compartir: Web Share API si existe; si no, WhatsApp y "Copiar enlace". El enlace compartido es el canónico con `?src=amigo`.
- **"Ya somos N"** (`GET /v1/public/waitlist/stats`): solo desde 25 personas y solo si la API responde; se pide cuando la línea se acerca a la pantalla.
- **Barrera de edad**: en las páginas marcadas con `data-gate-quick` (esta) muestra "Entrar" de inmediato y se levanta en ~0,6 s, para que quien llega desde un QR esté en el formulario con un toque.
- **Rendimiento**: los enlaces a la lista no se precargan (`WAITLIST_LINK` en `src/lib/links.ts`), así el JavaScript del formulario solo se descarga en su página.

## Estructura

```
src/
  app/                 /, /lista-de-espera, /vinos, /como-funciona, /bodegas, /tecnologia, /historia, /contacto, /aviso-legal, /privacidad, /b/[codigo] (redirige al visor)
  proxy.ts             /api/v1/* → API del backend, con la IP del visitante firmada
  components/
    site/              SiteHeader, SiteFooter, MapCanvas y MapPreview (mapas en canvas)
    home/              secciones de la página de inicio
    intro/             barrera de edad y ornamentos (compartidos con el sitio de bodegas)
    pages/             páginas editoriales (compartidas) y páginas propias (SimplePages)
    waitlist/          lista de espera: página, formulario, compartir, "Ya somos N", captura de ?src=
    brand/, ui/        wordmark, fotografías a tinta, ilustraciones
  content/             textos ES/EN del sitio (site-i18n), y contenido compartido copiado del sitio de bodegas (villages, zones, images, i18n)
  lib/links.ts         enlaces salientes por variable de entorno
  lib/site.ts          origen canónico y metadatos por página (SEO); lib/og.tsx, imágenes para compartir
  lib/api-proxy.ts     proxy firmado (con api-origin.ts); lib/public-api.ts, cliente de /api/v1
  lib/waitlist*.ts     inscripción, cifras, origen (?src=) y metadatos de la lista de espera
  store/experience.ts  idioma, barrera de edad, menú
docs/                  créditos de imágenes y fuentes del contenido (copias)
```

## Contenido compartido

`src/content/{villages,zones,images,parcels,i18n}.ts`, `src/content/network.ts`, `src/content/data/*.json` (la red de prueba de bodegas y puntos de recojo) y `public/images/**` son copias del repositorio `drinks-on-chain-front`. Hasta que exista el paquete `@doc/content` (Etapa 0 del roadmap global), cualquier corrección de contenido se hace primero allí y se vuelve a copiar aquí.

## Seguridad

Cabeceras en `next.config.ts`: CSP sin nonce (sitio estático y sin sesión), `frame-ancestors 'none'`, `frame-src 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y HSTS en producción. La API es del mismo origen (`/api/v1`), así que `connect-src` y `form-action` siguen en `'self'` y el origen del backend nunca llega al navegador. `API_ORIGIN` y `PROXY_SHARED_SECRET` son variables de servidor: nunca `NEXT_PUBLIC_`, nunca en el repositorio.

Datos personales: solo los recoge la lista de espera, con consentimiento; `/privacidad` y el aviso legal lo explican.

## Flujo de trabajo en Git

`main` estable, trabajo diario en `dev`, PR `dev → main` al cerrar cada hito del roadmap. Conventional Commits (`feat(home): …`, `fix(header): …`, `docs: …`, `chore: …`).
