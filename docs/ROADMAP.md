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
- [ ] 2.4 Revisión de textos ES/EN. (Los textos nuevos están en ES y EN; falta la revisión completa de los existentes.)

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
- [ ] 5.2 Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad en `/`; corregir lo que baje. **Accesibilidad cumplida** (100 en `/`, `/bodegas`, `/como-funciona`); rendimiento pendiente (ver mediciones).
- [x] 5.3 Navegación por teclado: foco visible, orden lógico, barrera de edad con foco atrapado, enlace "Saltar al contenido". · 25-09-2026
- [x] 5.4 `prefers-reduced-motion` respetado en la barrera, la transición y el héroe. · 25-09-2026

## 6 · Analítica

- [x] 6.1 Vercel Web Analytics (`@vercel/analytics`), sin cookies. **Acción manual pendiente**: activar "Web Analytics" en el panel del proyecto en Vercel. · 25-09-2026

## 7 · Cierre

- [x] 7.1 `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` sin errores. · 25-09-2026
- [x] 7.2 Prueba manual en móvil y escritorio, sin errores de consola. · 25-09-2026
- [ ] 7.3 PR `dev → main` con capturas.

## Correcciones tras la revisión del cliente (25-09-2026)

- [x] `/vinos` en móvil: las flechas ya no se salen de la pantalla junto a "Adquirir" y "Descubrir" · 25-09-2026
- [x] Vercel Web Analytics activado por el cliente; las visitas llegan (`/view` → 200) · 25-09-2026

## Mediciones (Lighthouse 12, móvil, build de producción local, 25-09-2026)

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | Notas |
|---|---|---|---|---|---|
| `/` | sin puntuar | 100 | 96 | 100 | Lighthouse no obtiene el LCP con la barrera animada; CLS 0 |
| `/bodegas` | 69 | 100 | 96 | 100 | LCP 3,9 s, TBT 800 ms (dos mapas SVG detallados) |
| `/como-funciona` | 77 | 100 | 96 | 100 | LCP 4,2 s, TBT 300 ms |

"Buenas prácticas" pierde puntos solo por el 404 local de `/_vercel/insights/script.js`, que existe únicamente en Vercel. Siguiente paso de rendimiento: medir en el despliegue de Vercel (compresión y CDN reales), aligerar los SVG de `/bodegas` (sin árboles ni casas en miniaturas) y revisar el LCP del héroe.

## Fuera de este roadmap

- Dominio real y redirecciones `www` / `.com` (M5, pendiente de compra).
- Extraer el contenido compartido a `@doc/content` (Etapa 0 del roadmap global).
