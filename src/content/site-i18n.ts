import type { Lang } from "@/lib/scene-contract";

/** Copy of the main landing (header, home sections, footer, pages). */
const es = {
  nav: {
    wines: "Vinos",
    how: "Cómo funciona",
    wineries: "Bodegas",
    history: "Historia",
    b2b: "Para bodegas y puntos de venta",
    enter: "Entrar",
    menu: "Menú",
    close: "Cerrar",
    home: "Inicio",
  },
  hero: {
    eyebrow: "Tarija · Valle de Cinti · Bolivia",
    title: "Cada botella, con su lugar y su historia.",
    lead: "Vinos y singanis de los valles altos de Tarija y Cinti, verificados de la parcela a la copa. Adquiérelos a precio de bodega, sigue su elaboración y retíralos cuando quieras.",
    cta: "Explorar los vinos",
    scanned: "¿Escaneaste una botella?",
    scannedHint: "Abre el visor con el código de la etiqueta",
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "Del viñedo a tu mesa, en cuatro pasos",
    steps: [
      { title: "Escanea", text: "Cada botella lleva un código único. Al leerlo ves su parcela, su bodega, su vendimia y su reposo." },
      { title: "Descubre", text: "Recorre el catálogo sin registrarte: añadas, precios de bodega y lotes que aún maduran." },
      { title: "Adquiere", text: "Reserva botellas de un lote en preventa o compra las que ya están listas. Tu cuenta se crea en ese momento, en menos de un minuto." },
      { title: "Retira", text: "Genera un pase con tu teléfono y recoge tus botellas en la bodega o en un punto autorizado." },
    ],
    more: "Ver el recorrido completo",
  },
  wines: {
    eyebrow: "Vinos en la red",
    title: "Lo que hoy puedes seguir y adquirir",
    all: "Ver todo en el Marketplace",
    acquire: "Adquirir",
    know: "Conocer",
    presale: "Preventa",
    ready: "Listo para retirar",
  },
  wineries: {
    eyebrow: "Las bodegas",
    title: "Un mapa dibujado bodega a bodega",
    text: "Cada bodega que trabaja con nosotros tiene su lugar en el mapa: sus parcelas, su altitud, sus suelos y los lotes que registra desde la vendimia hasta el embotellado.",
    b2bQuestion: "¿Tienes una bodega o un viñedo?",
    cta: "Conocer las bodegas",
    join: "Cómo unirse a la red",
  },
  trust: {
    eyebrow: "Qué garantizamos",
    items: [
      { title: "Trazabilidad real", text: "Los datos vienen del cuaderno de la bodega: pesaje, fermentación, crianza o destilación, embotellado. No se pueden reescribir." },
      { title: "Edición limitada", text: "Cada lote emite exactamente tantas botellas como se llenaron. Ni una más." },
      { title: "Retiro seguro", text: "Tu botella es tuya hasta que la recoges. El pase de retiro caduca y se anula al entregarla." },
    ],
    more: "Cómo funciona la tecnología",
  },
  b2b: {
    title: "¿Haces vino o singani? ¿Tienes una licorería o una cava?",
    text: "La red se construye con bodegas que registran sus lotes y puntos que los entregan. Conoce cómo funciona y pide el alta.",
    cta: "Para bodegas y puntos de venta",
  },
  footer: {
    explore: "Explorar",
    network: "La red",
    legal: "Legal",
    tech: "Tecnología",
    contact: "Contacto",
    privacy: "Privacidad",
    legalNotice: "Aviso legal",
    forWineries: "Para bodegas",
    forPickup: "Puntos de venta",
    responsible: "Consuma con moderación. Venta prohibida a menores de 18 años.",
    madeBy: "Hecho por Debro Solutions",
  },
  pages: {
    how: {
      title: "Cómo funciona",
      intro: "Drinks on Chain une la bodega que elabora, el punto que entrega y la persona que descorcha. Así se ve desde tu lado.",
      faq: [
        { q: "¿Qué es un token de botella?", a: "Es el comprobante digital de que una botella concreta de un lote concreto es tuya. Se guarda en tu cuenta sin que tengas que instalar nada ni recordar frases secretas." },
        { q: "¿Tengo que registrarme para mirar?", a: "No. Puedes recorrer todo el catálogo. La cuenta se crea cuando vas a comprar, o antes si tú quieres." },
        { q: "¿Qué pasa si compro en preventa?", a: "Reservas botellas de un lote que aún madura a un precio menor. Sigues su elaboración desde tu cuenta y las retiras cuando la bodega las libera." },
        { q: "¿Dónde retiro?", a: "En la bodega o en un punto autorizado. Al generar el pase ves las direcciones disponibles." },
        { q: "¿Y si no retiro?", a: "La botella sigue siendo tuya y queda en custodia de la bodega. El pase de retiro se genera solo cuando tú lo pides y caduca si no se usa." },
        { q: "¿Cómo se protege mi cuenta?", a: "Con la huella o el rostro de tu teléfono (passkeys) y un segundo dispositivo o correo de recuperación. Nunca guardamos contraseñas de billetera." },
      ],
    },
    wineries: {
      title: "Bodegas",
      intro: "Las bodegas y viñedos de la red, con su sitio en el mapa. El sitio completo, con cada parcela y cada lote, vive en bodegas.",
      cta: "Ir al sitio de las bodegas",
    },
    tech: {
      title: "Tecnología",
      sections: [
        { h: "Trazabilidad", p: "Cada lote se registra paso a paso en el sistema de la bodega. Esos registros alimentan la ficha que ves al escanear y no se pueden modificar después." },
        { h: "Red Stellar", p: "Los tokens de botella se emiten en la red Stellar, una infraestructura pública, rápida y de bajo costo. Puedes verificar cualquier emisión en un explorador público." },
        { h: "Billetera sin frase semilla", p: "Tu cuenta usa una billetera protegida con la biometría de tu dispositivo. No hay frases de doce palabras ni extensiones que instalar; las comisiones de red las asume la plataforma." },
        { h: "Qué datos guardamos", p: "Un correo o teléfono para tu cuenta, tus botellas y tus pases de retiro. No vendemos datos ni usamos rastreo publicitario." },
      ],
    },
    privacy: {
      title: "Privacidad",
      p: "Este sitio no usa cookies de seguimiento ni recoge datos personales. Recuerda en tu navegador que confirmaste tu edad y tu idioma. Las aplicaciones de Drinks on Chain informan de su tratamiento de datos en cada formulario.",
    },
    notFound: { title: "Página no encontrada", back: "Volver al inicio" },
  },
};

const en: typeof es = {
  nav: { wines: "Wines", how: "How it works", wineries: "Wineries", history: "History", b2b: "For wineries and pick-up points", enter: "Enter", menu: "Menu", close: "Close", home: "Home" },
  hero: {
    eyebrow: "Tarija · Cinti Valley · Bolivia",
    title: "Every bottle, with its place and its story.",
    lead: "Wines and singanis from the high valleys of Tarija and Cinti, verified from the parcel to the glass. Buy them at winery price, follow their making and pick them up whenever you want.",
    cta: "Explore the wines",
    scanned: "Scanned a bottle?",
    scannedHint: "Open the viewer with the code on the label",
  },
  how: {
    eyebrow: "How it works",
    title: "From the vineyard to your table, in four steps",
    steps: [
      { title: "Scan", text: "Every bottle carries a unique code. Read it and you see its parcel, its winery, its harvest and its rest." },
      { title: "Discover", text: "Browse the catalogue without signing up: vintages, winery prices and lots still maturing." },
      { title: "Acquire", text: "Reserve bottles of a lot on pre-sale or buy the ones already released. Your account is created right then, in under a minute." },
      { title: "Pick up", text: "Generate a pass on your phone and collect your bottles at the winery or an authorised point." },
    ],
    more: "See the whole journey",
  },
  wines: { eyebrow: "Wines in the network", title: "What you can follow and acquire today", all: "See everything in the Marketplace", acquire: "Acquire", know: "Discover", presale: "Pre-sale", ready: "Ready to pick up" },
  wineries: {
    eyebrow: "The wineries",
    title: "A map drawn winery by winery",
    text: "Every winery working with us has its place on the map: its parcels, altitude, soils and the lots it records from harvest to bottling.",
    b2bQuestion: "Do you own a winery or a vineyard?",
    cta: "Meet the wineries",
    join: "How to join the network",
  },
  trust: {
    eyebrow: "What we guarantee",
    items: [
      { title: "Real traceability", text: "The data comes from the winery's own log: weighing, fermentation, ageing or distillation, bottling. It cannot be rewritten." },
      { title: "Limited edition", text: "Each lot issues exactly as many bottles as were filled. Not one more." },
      { title: "Safe pick-up", text: "Your bottle is yours until you collect it. The pick-up pass expires and is voided on delivery." },
    ],
    more: "How the technology works",
  },
  b2b: { title: "Do you make wine or singani? Do you run a wine shop or a cellar?", text: "The network is built with wineries that record their lots and points that deliver them. Learn how it works and apply.", cta: "For wineries and pick-up points" },
  footer: { explore: "Explore", network: "The network", legal: "Legal", tech: "Technology", contact: "Contact", privacy: "Privacy", legalNotice: "Legal notice", forWineries: "For wineries", forPickup: "Pick-up points", responsible: "Drink responsibly. Not for sale to under-18s.", madeBy: "Made by Debro Solutions" },
  pages: {
    how: {
      title: "How it works",
      intro: "Drinks on Chain connects the winery that makes, the point that delivers and the person who uncorks. This is how it looks from your side.",
      faq: [
        { q: "What is a bottle token?", a: "The digital proof that one specific bottle of one specific lot is yours. It lives in your account without installing anything or memorising secret phrases." },
        { q: "Do I need an account to browse?", a: "No. You can explore the whole catalogue. The account is created when you buy, or earlier if you wish." },
        { q: "What happens on pre-sale?", a: "You reserve bottles of a lot still maturing, at a lower price. You follow its making from your account and collect them when the winery releases them." },
        { q: "Where do I pick up?", a: "At the winery or at an authorised point. When you generate the pass you see the available addresses." },
        { q: "And if I never pick up?", a: "The bottle stays yours, in the winery's custody. The pass is only generated when you ask for it and expires if unused." },
        { q: "How is my account protected?", a: "With your phone's fingerprint or face (passkeys) and a second device or recovery email. We never store wallet passwords." },
      ],
    },
    wineries: { title: "Wineries", intro: "The wineries and vineyards of the network, each with its place on the map. The full site, with every parcel and lot, lives at bodegas.", cta: "Go to the wineries site" },
    tech: {
      title: "Technology",
      sections: [
        { h: "Traceability", p: "Each lot is recorded step by step in the winery's system. Those records feed the sheet you see when scanning and cannot be edited afterwards." },
        { h: "Stellar network", p: "Bottle tokens are issued on Stellar, a public, fast and low-cost network. Any issuance can be verified in a public explorer." },
        { h: "Wallet without a seed phrase", p: "Your account uses a wallet protected by your device's biometrics. No twelve-word phrases, no extensions; network fees are covered by the platform." },
        { h: "What we store", p: "An email or phone for your account, your bottles and your pick-up passes. We do not sell data or use advertising trackers." },
      ],
    },
    privacy: { title: "Privacy", p: "This site uses no tracking cookies and collects no personal data. It remembers in your browser that you confirmed your age and your language. The Drinks on Chain applications disclose their data processing on each form." },
    notFound: { title: "Page not found", back: "Back to home" },
  },
};

export const SITE: Record<Lang, typeof es> = { es, en };
