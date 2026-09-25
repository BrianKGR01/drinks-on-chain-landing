# Roadmap interno · `drinks-on-chain-landing`

Landing principal del ecosistema (dominio raíz). Este archivo es el detalle fino de lo que falta para dar por terminado el sitio; la planificación general vive en la carpeta `docs/` del ecosistema (`02-plan-landing-ecosistema.md`, `03-roadmap-frontend.md` §Sistema 0 y `07-roadmap-landing-principal.md`).

Convenciones: trabajo en `dev`, Conventional Commits, PR `dev → main` al cerrar. Una casilla se marca (`- [x]`) cuando el cambio está commiteado en `dev`, con la fecha al lado.

## Hecho antes de este roadmap

- [x] M0 · Fundaciones (Next 16, TypeScript estricto, Tailwind 4, tokens, tipografías, barrera de edad, cabecera, pie, ES/EN, variables de entorno, Vercel) · 24-09-2026
- [x] M1 · Inicio en primera versión (héroe con mapa, Cómo funciona, Vinos, Bodegas, Qué garantizamos, franja B2B) · 24-09-2026
- [x] M2 · Rutas `/vinos`, `/como-funciona`, `/bodegas`, `/tecnologia`, `/historia`, `/contacto`, `/aviso-legal`, `/privacidad`, `/b/[codigo]`, 404 · 24-09-2026

## 1 · Correcciones reportadas (25-09-2026)

- [ ] 1.1 La página no se desplaza mientras la barrera de edad está visible (rueda, táctil y teclado), también antes de hidratar.
- [ ] 1.2 Al pulsar "Entrar" la página queda arriba del todo: siempre se ve el héroe, nunca una sección intermedia; el navegador no restaura un desplazamiento anterior.
- [ ] 1.3 La barrera se apoya sobre el mapa del héroe (dibujándose detrás de un velo de papel), como en el sitio de bodegas.
- [ ] 1.4 Transición de la barrera al héroe: el velo se levanta, el mapa queda en su sitio, la vid con las uvas se dibuja y el texto del héroe aparece.
- [ ] 1.5 Sección "Las bodegas" del inicio: el botón "Conocer las bodegas" y el enlace "Cómo unirse" son visibles (compartían la clase de entrada del héroe y se quedaban con opacidad 0).

## 2 · Marca y contenido

- [ ] 2.1 Solo Drinks on Chain en pie, contacto y aviso legal (sin otra razón social).
- [ ] 2.2 La sección "Las bodegas" y `/bodegas` muestran la red de prueba (catálogo de `08-datos-de-prueba.md`) con su estado (Socia, En conversación, Referencia) en lugar de listar productores reales como si fueran socios.
- [ ] 2.3 Enlaces de parcela hacia el sitio de bodegas con la ruta nueva `/valles/[valle]/[parcela]`.
- [ ] 2.4 Revisión de textos ES/EN.

## 3 · SEO técnico

- [ ] 3.1 `sitemap.ts` con todas las rutas públicas (sin `/b/[codigo]`).
- [ ] 3.2 `robots.ts` con el sitemap y sin rutas privadas.
- [ ] 3.3 `opengraph-image` por defecto (papel, oro, wordmark) y `metadataBase`.
- [ ] 3.4 Título, descripción y OG propios en cada ruta; `alternates.canonical`.

## 4 · Seguridad

- [ ] 4.1 Cabeceras en `next.config.ts`: CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- [ ] 4.2 Decisión registrada: CSP sin nonce (el sitio es estático y sin datos de usuario; el nonce obligaría a renderizar cada página en el servidor). `script-src 'self' 'unsafe-inline'`, sin orígenes externos.

## 5 · Rendimiento y accesibilidad

- [ ] 5.1 Fuentes autoalojadas (`next/font` descarga y sirve Cormorant y EB Garamond desde el propio dominio) — verificar que no hay peticiones a Google Fonts.
- [ ] 5.2 Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad en `/`; corregir lo que baje.
- [ ] 5.3 Navegación por teclado: foco visible, orden lógico, barrera de edad con foco atrapado, enlace "Saltar al contenido".
- [ ] 5.4 `prefers-reduced-motion` respetado en la barrera, la transición y el héroe.

## 6 · Analítica

- [ ] 6.1 Vercel Web Analytics (`@vercel/analytics`), sin cookies. **Acción manual**: activar "Web Analytics" en el panel del proyecto en Vercel.

## 7 · Cierre

- [ ] 7.1 `pnpm lint`, `pnpm exec tsc --noEmit` y `pnpm build` sin errores.
- [ ] 7.2 Prueba manual en móvil y escritorio, sin errores de consola.
- [ ] 7.3 PR `dev → main` con capturas.

## Fuera de este roadmap

- Dominio real y redirecciones `www` / `.com` (M5, pendiente de compra).
- Extraer el contenido compartido a `@doc/content` (Etapa 0 del roadmap global).
