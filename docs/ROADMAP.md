# Roadmap interno · `drinks-on-chain-landing`

Landing principal del ecosistema (dominio raíz). Este archivo es el detalle fino de lo que falta para dar por terminado el sitio; la planificación general vive en la carpeta `docs/` del ecosistema (`02-plan-landing-ecosistema.md`, `03-roadmap-frontend.md` §Sistema 0 y `07-roadmap-landing-principal.md`).

Convenciones: trabajo en `dev`, Conventional Commits, PR `dev → main` al cerrar. Una casilla se marca (`- [x]`) cuando el cambio está commiteado en `dev`, con la fecha al lado.

## Hecho antes de este roadmap

- [x] M0 · Fundaciones (Next 16, TypeScript estricto, Tailwind 4, tokens, tipografías, barrera de edad, cabecera, pie, ES/EN, variables de entorno, Vercel) · 24-09-2026
- [x] M1 · Inicio en primera versión (héroe con mapa, Cómo funciona, Vinos, Bodegas, Qué garantizamos, franja B2B) · 24-09-2026
- [x] M2 · Rutas `/vinos`, `/como-funciona`, `/bodegas`, `/tecnologia`, `/historia`, `/contacto`, `/aviso-legal`, `/privacidad`, `/b/[codigo]`, 404 · 24-09-2026

## 1 · Correcciones reportadas (25-09-2026)

- [x] 1.1 La página no se desplaza mientras la barrera de edad está visible (rueda, táctil y teclado), también antes de hidratar. · 25-09-2026
- [x] 1.2 Al pulsar "Entrar" la página queda arriba del todo: siempre se ve el héroe, nunca una sección intermedia; el navegador no restaura un desplazamiento anterior. · 25-09-2026
- [x] 1.3 La barrera se apoya sobre el mapa del héroe (dibujándose detrás de un velo de papel), como en el sitio de bodegas. · 25-09-2026
- [x] 1.4 Transición de la barrera al héroe: el velo se levanta, el mapa queda en su sitio, la vid con las uvas se dibuja y el texto del héroe aparece. · 25-09-2026
- [x] 1.5 Sección "Las bodegas" del inicio: el botón "Conocer las bodegas" y el enlace "Cómo unirse" son visibles (compartían la clase de entrada del héroe y se quedaban con opacidad 0). · 25-09-2026

## 2 · Marca y contenido

- [x] 2.1 Solo Drinks on Chain en pie, contacto y aviso legal (sin otra razón social). · 25-09-2026
- [x] 2.2 La sección "Las bodegas" y `/bodegas` muestran la red de prueba (catálogo de `08-datos-de-prueba.md`) con su estado (Socia, En conversación, Referencia) en lugar de listar productores reales como si fueran socios. · 25-09-2026
- [x] 2.3 Enlaces de parcela hacia el sitio de bodegas con la ruta nueva `/valles/[valle]/[parcela]`. · 25-09-2026
- [x] 2.4 Revisión de textos ES/EN: ortografía, inglés natural y términos del producto acordado (un NFT por botella, pase de canje que caduca en horas, puntos de canje, ventana de canje con aviso por correo, billetera que crea y custodia la plataforma, pago en bolivianos, anclaje del hash al cerrar el lote); fuera las promesas de precio ("precio de bodega", "precio menor en preventa") y las passkeys; privacidad sin "recuerda tu idioma". `<html lang>` sigue al idioma elegido · 27-09-2026

## 3 · SEO técnico

- [x] 3.1 `sitemap.ts` con todas las rutas públicas (sin `/b/[codigo]`). · 25-09-2026
- [x] 3.2 `robots.ts` con el sitemap y sin rutas privadas. · 25-09-2026
- [x] 3.3 `opengraph-image` por defecto (papel, oro, wordmark) y `metadataBase`. · 25-09-2026
- [x] 3.4 Título, descripción y OG propios en cada ruta; `alternates.canonical`. · 25-09-2026

## 4 · Seguridad

- [x] 4.1 Cabeceras en `next.config.ts`: CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. · 25-09-2026
- [x] 4.2 Decisión registrada: CSP sin nonce (el sitio es estático y sin datos de usuario; el nonce obligaría a renderizar cada página en el servidor). `script-src 'self' 'unsafe-inline'`, sin orígenes externos. · 25-09-2026

## 5 · Rendimiento y accesibilidad

- [x] 5.1 Fuentes autoalojadas (`next/font` descarga y sirve Cormorant y EB Garamond desde el propio dominio) — verificar que no hay peticiones a Google Fonts. · 25-09-2026
- [ ] 5.2 Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad en `/`; corregir lo que baje. **Accesibilidad cumplida** (100). Rendimiento mejorado el 27-09-2026 (la portada ya puntúa, previsualizaciones en canvas, menos JavaScript), pero **sin llegar a 90 de forma estable** en esta máquina: ver mediciones y cuello de botella.
- [x] 5.3 Navegación por teclado: foco visible, orden lógico, barrera de edad con foco atrapado, enlace "Saltar al contenido". · 25-09-2026
- [x] 5.4 `prefers-reduced-motion` respetado en la barrera, la transición y el héroe. · 25-09-2026

## 6 · Analítica

- [x] 6.1 Vercel Web Analytics (`@vercel/analytics`), sin cookies. **Acción manual pendiente**: activar "Web Analytics" en el panel del proyecto en Vercel. · 25-09-2026

## 7 · Cierre

- [x] 7.1 `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` sin errores. · 25-09-2026
- [x] 7.2 Prueba manual en móvil y escritorio, sin errores de consola. · 25-09-2026
- [ ] 7.3 PR `dev → main` con capturas.

## O0-WEB-1 · Cierre del Sistema 0 (27-09-2026)

- [x] Node 22 (`.nvmrc`, `engines`), `packageManager` como en los repos de la organización y script `typecheck` (`next typegen && tsc --noEmit`) · 27-09-2026
- [x] Enlaces: valores locales por defecto Marketplace `localhost:3005` y bodegas `localhost:3000` (`src/lib/links.ts`, `.env.example`) · 27-09-2026
- [x] Pruebas de humo con Playwright (`e2e/`, escritorio y móvil): portada sin errores de consola, barrera de edad (entrar, contenido bloqueado sin confirmar, idioma), navegación, cambio ES/EN, `/vinos`, `/bodegas`, `/como-funciona`, `/tecnologia`, 404 y axe sin violaciones serias · 27-09-2026
- [x] CI (`.github/workflows/ci.yml`): lint, typecheck, build y Playwright (Chromium) en push y PR a `dev` y `main`; informe como artefacto si falla · 27-09-2026
- [x] Rendimiento: `MapPreview` en canvas (antes ~1.500 nodos SVG por mapa), datos de la portada, `/vinos` y `/bodegas` preparados en el servidor (los textos de las zonas y las historias de las bodegas, ~50 kB comprimidos, ya no viajan como JavaScript), wordmark de la barrera visible desde el primer pintado · 27-09-2026
- [x] Accesibilidad: aviso del pie con contraste AA (3,9:1 → 6:1) y botón "Entrar" de la barrera con área real de 200 × 60 px · 27-09-2026
- [ ] Variables `NEXT_PUBLIC_URL_*` en el proyecto de Vercel (las crea la coordinación): `NEXT_PUBLIC_URL_BODEGAS` ya; `NEXT_PUBLIC_URL_APP` cuando exista el Marketplace

## O1b · Lista de espera de consumidores (01-10-2026)

Contrato: `plan/contratos/o1b-lista-de-espera.md` (ecosistema). Pedido durante el evento de Tarija.

- [x] Proxy firmado `/api/v1/*` (`src/proxy.ts`, `src/lib/api-proxy.ts`): reescribe a `${API_ORIGIN}/v1/*` con `X-DOC-Client-IP` y firma HMAC (`PROXY_SHARED_SECRET`); sin `API_ORIGIN` no reescribe y el formulario lo avisa con un correo de contacto. `.env.example` y CSP (`frame-src 'none'`; `connect-src` y `form-action` siguen en `'self'`) · 01-10-2026
- [x] Página `/lista-de-espera` (ES/EN, metadatos y OG propios, sitemap): titular, tres motivos y formulario (nombre, correo, WhatsApp y ciudad opcionales, interés, mayoría de edad, consentimiento con privacidad, campo trampa); 422 por campo, 429 con el tiempo de espera, error de red y API no disponible · 01-10-2026
- [x] `?src=` → `source` (validado `[a-z0-9-]{1,40}`, guardado en `sessionStorage` al navegar; uno no válido se quita) · 01-10-2026
- [x] Confirmación "Estás en la lista" con el número de orden, qué pasa después y compartir (Web Share API; si no, WhatsApp y copiar enlace) con `?src=amigo` · 01-10-2026
- [x] Llamadas a la acción: botón en el héroe, sección "Sé de los primeros" antes del pie, entrada en el menú, la cabecera y el pie; "Ya somos N" desde 25 personas · 01-10-2026
- [x] Barrera de edad rápida en la página de la lista (`data-gate-quick`): del QR al formulario con un toque · 01-10-2026
- [x] `/privacidad` y aviso legal dicen qué datos recoge la lista de espera, para qué y cómo pedir que se borren · 01-10-2026
- [x] Pruebas e2e (`e2e/lista-de-espera.spec.ts`, `e2e/api-proxy.spec.ts`, sustituto de la API en `e2e/stub-api.mjs`): recorrido en frío por el proxy firmado, éxito con posición, 422, 429, red, sin API, `?src=`, compartir, ES/EN, 360 px, axe sin violaciones serias, y que la portada no descarga el JavaScript del formulario · 01-10-2026
- [x] La cabecera pasa al botón de menú por debajo de 1200 px (antes 1024): con cinco entradas no cabía junto al wordmark · 01-10-2026
- [ ] Captcha real (Turnstile) cuando existan las claves y el backend lo exija (`WAITLIST_CAPTCHA_REQUIRED`): hoy, campo trampa y límites
- [ ] Prueba de punta a punta en producción (una inscripción real, verla en el Backoffice) y códigos QR: la hace la coordinación

### Mediciones del 01-10-2026 (Lighthouse 12.8, móvil, `next start` local con la barrera de edad en frío)

Misma máquina y método que el 27-09 (benchmarkIndex 740–930: con el multiplicador por defecto, 4×, la simulación penaliza de más; 2× es el que pide la guía de calibración para esta CPU).

| Página | 4× | 2× | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|---|
| `/lista-de-espera` | 78 · 76 · 70 | 91 · 91 | 100 | 96 | 100 |
| `/` (con el botón del héroe y la sección nueva) | — | 85 · 84 (27-09: 72 · 78 · 81) | 100 | 96 | 100 |

`/lista-de-espera` a 4×: FCP 1,4–1,9 s, LCP 3,6–3,7 s, TBT 440–740 ms, CLS 0–0,02 (el desplazamiento es el del texto de la barrera al llegar la fuente, igual que en el resto del sitio). "Buenas prácticas" pierde puntos solo por el 404 local de `/_vercel/insights/script.js`.

El JavaScript del formulario (un fragmento de 19,7 kB, 7,2 kB comprimido) solo se descarga en `/lista-de-espera`: los enlaces hacia ella no se precargan y una prueba e2e comprueba que la portada no lo pide. La portada solo añade la línea "Ya somos N" (una petición a `/api/v1/public/waitlist/stats` cuando la sección se acerca a la pantalla, nunca en la carga inicial).

## Correcciones tras la revisión del cliente (25-09-2026)

- [x] `/vinos` en móvil: las flechas ya no se salen de la pantalla junto a "Adquirir" y "Descubrir" · 25-09-2026
- [x] Vercel Web Analytics activado por el cliente; las visitas llegan (`/view` → 200) · 25-09-2026
- [x] Menú móvil igual al del sitio de bodegas (pantalla completa, "Cerrar", indicador dorado, Escape y foco) · 25-09-2026

## Mediciones (Lighthouse 12, móvil, build de producción local, 25-09-2026)

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | Notas |
|---|---|---|---|---|---|
| `/` | sin puntuar | 100 | 96 | 100 | Lighthouse no obtiene el LCP con la barrera animada; CLS 0 |
| `/bodegas` | 69 | 100 | 96 | 100 | LCP 3,9 s, TBT 800 ms (dos mapas SVG detallados) |
| `/como-funciona` | 77 | 100 | 96 | 100 | LCP 4,2 s, TBT 300 ms |

"Buenas prácticas" pierde puntos solo por el 404 local de `/_vercel/insights/script.js`, que existe únicamente en Vercel. Siguiente paso de rendimiento: medir en el despliegue de Vercel (compresión y CDN reales), aligerar los SVG de `/bodegas` (sin árboles ni casas en miniaturas) y revisar el LCP del héroe.

## Mediciones del 27-09-2026 (Lighthouse 12.8, móvil, `next start` local, 3 ejecuciones)

Máquina: i5-7200U de 2 núcleos con la CPU al 76–100 % por otros procesos (benchmarkIndex de Lighthouse 580–1.080). Con el multiplicador por defecto (4×) la simulación trata esta CPU como una de gama alta y penaliza de más; la guía de calibración de Lighthouse pide un multiplicador menor para un benchmarkIndex por debajo de ~1.300, así que se midió también con 2×. Las cifras varían mucho entre ejecuciones (una ejecución de `/como-funciona` dio 26 con un FCP de 11 s por la carga de la máquina).

| Página | Antes 4× | Después 4× | Antes 2× | Después 2× |
|---|---|---|---|---|
| `/` | sin puntuar 2 de 3 (NO_LCP), 66 | 57 · 62 · 79 | sin puntuar 3 de 3 | 72 · 78 · 81 |
| `/como-funciona` | 51 · 56 · 79 | 58 · 76 (+ 26 atípico) | 82 · 84 · 93 | 81 · 88 · 90 |
| `/bodegas` | 58 · 67 · 70 | 68 · 68 · 71 | 48 · 53 · 85 | 84 · 86 · 91 |

Accesibilidad 100, SEO 100 y buenas prácticas 96 (solo el 404 local de `/_vercel/insights/script.js`) en todas.

**Qué cambió**: la portada ya tiene LCP (el wordmark de la barrera; antes todo el contenido entraba con un fundido de opacidad desde 0 hecho en el compositor, y Chrome no lo reporta). `/bodegas` pasa de ~1.700 a ~350 nodos y su TBT baja. La portada ya no descarga el fragmento de 140 kB (48 kB comprimidos) con los textos de las zonas.

**Cuello de botella**: el LCP simulado (3,3–4,4 s). En local todo llega antes del primer pintado, así que la simulación de Lighthouse (Lantern) cuenta en el camino del LCP todos los bytes pedidos hasta entonces: las cuatro fuentes precargadas (168 kB: Cormorant y EB Garamond, redonda y cursiva, que ya se usan en el primer pintado de la barrera) y el marco de React/Next (≈115 kB comprimidos), más su evaluación en una CPU saturada. Para bajar de ahí haría falta quitar una familia o sus cursivas (cambio de diseño) o no hidratar la barrera. Siguiente paso: medir con PageSpeed Insights sobre el despliegue de Vercel (la cuota diaria de la API estaba agotada el 27-09) o en una máquina sin carga, antes de decidir cambios de diseño.

## O2-WEB-1 · Enlaces al Marketplace real (02-10-2026)

Contrato: `plan/contratos/o2-erp-confiable.md` §12 y §17.

- [x] `links.ts` con `buildLinks`: catálogo (`/catalogo`), visor y "Verifica una botella" (`/b`), "Entrar" y "Marketplace" desde `NEXT_PUBLIC_URL_APP` · 02-10-2026
- [x] Sin la variable en producción ningún enlace lleva a una ruta inexistente (antes: `/como-funciona/entrar`, `/como-funciona/b/…`, `/como-funciona/coleccion/…`): "Explorar los vinos" → `/vinos`, "¿Escaneaste una botella?" y `/b/{código}` → `/como-funciona#escanear`; "Entrar", "Marketplace", "Verifica una botella" y "Adquirir" no se muestran · 02-10-2026
- [x] "Verifica una botella" en el pie y en el menú (ES/EN); las tarjetas de vino de la portada abren su vino en `/vinos?v=` · 02-10-2026
- [x] e2e en dos builds (`pnpm e2e`): con y sin `NEXT_PUBLIC_URL_APP`; lógica de los enlaces en `e2e/links.spec.ts`; axe sin violaciones serias · 02-10-2026
- [ ] `NEXT_PUBLIC_URL_APP` en el proyecto de Vercel cuando el Marketplace tenga URL pública (la crea la coordinación)
- [ ] Red de bodegas desde `GET /v1/public/wineries` (ORG-11), como ya hace el sitio de bodegas: aquí sigue en `src/content`. Pendiente de un paquete compartido (hoy habría que copiar la validación, la caché y la unión con el contenido) y de decidir si la portada debe pedir la API
- [ ] "Entrar" debería llevar a la pantalla de acceso del Marketplace cuando exista (hoy, a su portada)
- [ ] Contraste AA en `/vinos` (anterior a esta tarea; axe lo marca como serio y la página no estaba en las pruebas de axe): la lista de vinos inactivos al 50 % de opacidad, "Descubrir" y "Adquirir" en `--accent` en lugar de `--accent-deep`, y el aviso al pie

## Fuera de este roadmap

- Dominio real y redirecciones `www` / `.com` (M5, pendiente de compra).
- Extraer el contenido compartido a `@doc/content` (Etapa 0 del roadmap global).
