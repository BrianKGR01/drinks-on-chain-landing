import type { Lang } from "@/lib/scene-contract";

/** Copy of the main landing (header, home sections, footer, pages). */
const es = {
  nav: {
    wines: "Vinos",
    how: "Cómo funciona",
    wineries: "Bodegas",
    history: "Historia",
    b2b: "Para bodegas y puntos de canje",
    enter: "Entrar",
    menu: "Menú",
    close: "Cerrar",
    home: "Inicio",
    language: "Idioma",
  },
  hero: {
    eyebrow: "Tarija · Valle de Cinti · Bolivia",
    title: "Cada botella, con su lugar y su historia.",
    lead: "Vinos y singanis de los valles altos de Tarija y Cinti, verificados de la parcela a la copa. Adquiérelos directamente de la bodega, sigue su elaboración y recógelos en un punto de canje.",
    cta: "Explorar los vinos",
    scanned: "¿Escaneaste una botella?",
    scannedHint: "Abre el visor con el código de la etiqueta",
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "Del viñedo a tu mesa, en cuatro pasos",
    steps: [
      { title: "Escanea", text: "Cada botella lleva un código único. Al leerlo ves su parcela, su bodega, su vendimia y su reposo, sin necesidad de cuenta." },
      { title: "Descubre", text: "Recorre el catálogo sin registrarte: añadas, precios y lotes que aún maduran." },
      { title: "Adquiere", text: "Reserva botellas de un lote en preventa o compra las que ya están listas. Cada botella es un NFT que queda en tu cuenta, creada con tu correo en ese momento." },
      { title: "Canjea", text: "Genera un pase de canje en tu teléfono y recoge tus botellas en la bodega o en un punto de canje autorizado." },
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
    ready: "Listo para canjear",
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
      { title: "Trazabilidad real", text: "Los datos vienen del cuaderno de la bodega: pesaje, fermentación, crianza o destilación, embotellado. Al cerrar el lote, su huella digital queda anclada en la red Stellar y cualquier cambio posterior se detecta." },
      { title: "Un NFT por botella", text: "Cada botella tiene su propio NFT, numerado y emitido por su bodega. La bodega autoriza cuántos se emiten por lote y cada emisión se puede verificar." },
      { title: "Canje seguro", text: "El pase de canje caduca en pocas horas y, si vence, generas otro. Al entregar la botella su NFT se quema: nadie puede canjearla dos veces." },
    ],
    more: "Cómo funciona la tecnología",
  },
  b2b: {
    title: "¿Haces vino o singani? ¿Tienes una licorería o una cava?",
    text: "La red se construye con bodegas que registran sus lotes y puntos de canje que entregan las botellas. Conoce cómo funciona y pide el alta.",
    cta: "Para bodegas y puntos de canje",
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
    forPickup: "Puntos de canje",
    responsible: "Consuma con moderación. Venta prohibida a menores de 18 años.",
    madeBy: "© 2026 Drinks on Chain · Tarija, Bolivia",
  },
  pages: {
    how: {
      title: "Cómo funciona",
      intro: "Drinks on Chain une la bodega que elabora, el punto que entrega y la persona que descorcha. Así se ve desde tu lado.",
      faq: [
        { q: "¿Qué es el NFT de una botella?", a: "Es el certificado digital, único y numerado, de que una botella concreta de un lote concreto es tuya. Se guarda en tu cuenta: no instalas nada, no manejas criptomonedas ni recuerdas frases secretas." },
        { q: "¿Tengo que registrarme para mirar?", a: "No. Puedes recorrer todo el catálogo y escanear cualquier botella sin cuenta. La cuenta se crea cuando vas a comprar, o antes si tú quieres." },
        { q: "¿Qué pasa si compro en preventa?", a: "Reservas botellas de un lote que aún madura. Sigues su elaboración desde tu cuenta, casi en tiempo real, y las canjeas cuando la bodega las libera." },
        { q: "¿Dónde canjeo mis botellas?", a: "En la bodega o en un punto de canje autorizado por ella. Al generar el pase ves las direcciones disponibles." },
        { q: "¿Hay un plazo para canjear?", a: "Sí. Cada compra tiene una ventana de canje, en días, y te avisamos por correo antes de que termine. El pase de canje se genera cuando tú lo pides, caduca en pocas horas y, si vence, generas otro." },
        { q: "¿Necesito una billetera?", a: "No. Entras con tu correo y la plataforma crea y custodia la dirección donde se guardan tus NFT. No ves criptomonedas, no pagas comisiones de red y pagas en bolivianos." },
      ],
    },
    wineries: {
      title: "Bodegas",
      intro: "Las bodegas y viñedos de la red, cada uno con su lugar en el mapa. El detalle completo, con cada parcela y cada lote, está en el sitio de las bodegas.",
      cta: "Ir al sitio de las bodegas",
    },
    tech: {
      title: "Tecnología",
      sections: [
        { h: "Trazabilidad", p: "Cada lote se registra paso a paso en el sistema de la bodega. Esos registros alimentan la ficha que ves al escanear y, al cerrar el lote, su huella digital (hash) se ancla en la red: cualquier cambio posterior se puede detectar." },
        { h: "Red Stellar", p: "Cada botella es un NFT emitido en Stellar, una red pública, rápida y de bajo costo, desde el contrato de su bodega. Puedes verificar cualquier emisión en un explorador público." },
        { h: "Una billetera que no tienes que gestionar", p: "No necesitas billetera propia: al crear tu cuenta, la plataforma genera y custodia la dirección donde se guardan tus NFT. No hay frases de doce palabras ni extensiones que instalar, pagas en bolivianos y las comisiones de red las asume la plataforma." },
        { h: "Qué datos guardamos", p: "Tu correo, tus botellas y tus pases de canje. No vendemos datos ni usamos rastreo publicitario." },
      ],
    },
    privacy: {
      title: "Privacidad",
      p: "Este sitio no usa cookies de seguimiento ni recoge datos personales. Solo recuerda, en tu navegador y durante la sesión, que confirmaste tu edad. Las aplicaciones de Drinks on Chain informan de su tratamiento de datos en cada formulario.",
    },
    notFound: { title: "Página no encontrada", back: "Volver al inicio" },
  },
};

const en: typeof es = {
  nav: { wines: "Wines", how: "How it works", wineries: "Wineries", history: "History", b2b: "For wineries and redemption points", enter: "Enter", menu: "Menu", close: "Close", home: "Home", language: "Language" },
  hero: {
    eyebrow: "Tarija · Cinti Valley · Bolivia",
    title: "Every bottle, with its place and its story.",
    lead: "Wines and singanis from the high valleys of Tarija and Cinti, verified from the parcel to the glass. Buy them straight from the winery, follow how they are made and collect them at a redemption point.",
    cta: "Explore the wines",
    scanned: "Scanned a bottle?",
    scannedHint: "Open the viewer with the code on the label",
  },
  how: {
    eyebrow: "How it works",
    title: "From the vineyard to your table, in four steps",
    steps: [
      { title: "Scan", text: "Every bottle carries a unique code. Scan it to see its parcel, its winery, its harvest and its rest, no account needed." },
      { title: "Discover", text: "Browse the catalogue without signing up: vintages, prices and lots still maturing." },
      { title: "Buy", text: "Reserve bottles from a lot on pre-sale or buy the ones already released. Each bottle is an NFT kept in your account, which you create with your email at that moment." },
      { title: "Redeem", text: "Generate a redemption pass on your phone and collect your bottles at the winery or at an authorised redemption point." },
    ],
    more: "See the whole journey",
  },
  wines: { eyebrow: "Wines in the network", title: "What you can follow and buy today", all: "See everything in the Marketplace", acquire: "Buy", know: "Discover", presale: "Pre-sale", ready: "Ready to redeem" },
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
      { title: "Real traceability", text: "The data comes from the winery's own records: weighing, fermentation, ageing or distillation, bottling. When the lot is closed, its digital fingerprint is anchored on the Stellar network, so any later change can be detected." },
      { title: "One NFT per bottle", text: "Every bottle has its own numbered NFT, issued by its winery. The winery authorises how many are issued per lot, and every issuance can be verified." },
      { title: "Secure redemption", text: "The redemption pass expires within hours; if it lapses, you generate another. When the bottle is handed over its NFT is burned, so it can never be redeemed twice." },
    ],
    more: "How the technology works",
  },
  b2b: { title: "Do you make wine or singani? Do you run a wine shop or a cellar?", text: "The network is built by wineries that record their lots and redemption points that hand over the bottles. See how it works and apply to join.", cta: "For wineries and redemption points" },
  footer: { explore: "Explore", network: "The network", legal: "Legal", tech: "Technology", contact: "Contact", privacy: "Privacy", legalNotice: "Legal notice", forWineries: "For wineries", forPickup: "Redemption points", responsible: "Drink responsibly. Not for sale to anyone under 18.", madeBy: "© 2026 Drinks on Chain · Tarija, Bolivia" },
  pages: {
    how: {
      title: "How it works",
      intro: "Drinks on Chain connects the winery that makes the wine, the point that hands it over and the person who uncorks it. This is how it looks from your side.",
      faq: [
        { q: "What is a bottle NFT?", a: "A unique, numbered digital certificate showing that one specific bottle from one specific lot is yours. It lives in your account: nothing to install, no cryptocurrency to handle, no secret phrases to remember." },
        { q: "Do I need an account to browse?", a: "No. You can explore the whole catalogue and scan any bottle without an account. You create one when you buy, or earlier if you prefer." },
        { q: "What happens if I buy on pre-sale?", a: "You reserve bottles from a lot that is still maturing. You follow its progress from your account, almost in real time, and redeem them once the winery releases them." },
        { q: "Where do I redeem my bottles?", a: "At the winery or at a redemption point it has authorised. When you generate the pass you see the available addresses." },
        { q: "Is there a deadline to redeem?", a: "Yes. Each purchase has a redemption window, counted in days, and we email you before it ends. The redemption pass is generated when you ask for it, expires within hours and, if it lapses, you simply generate another." },
        { q: "Do I need a wallet?", a: "No. You sign in with your email and the platform creates and safeguards the address that holds your NFTs. You never see cryptocurrency, pay no network fees and pay in bolivianos." },
      ],
    },
    wineries: { title: "Wineries", intro: "The network's wineries and vineyards, each with its place on the map. The full picture, with every parcel and every lot, is on the wineries site.", cta: "Go to the wineries site" },
    tech: {
      title: "Technology",
      sections: [
        { h: "Traceability", p: "Each lot is recorded step by step in the winery's system. Those records feed the page you see when you scan and, when the lot is closed, its digital fingerprint (hash) is anchored on the network, so any later change can be detected." },
        { h: "Stellar network", p: "Each bottle is an NFT issued on Stellar, a public, fast and low-cost network, from its winery's own contract. Any issuance can be checked in a public explorer." },
        { h: "A wallet you don't have to manage", p: "You don't need a wallet of your own: when you create your account, the platform generates and safeguards the address that holds your NFTs. No twelve-word phrases, no extensions to install; you pay in bolivianos and the platform covers network fees." },
        { h: "What we store", p: "Your email, your bottles and your redemption passes. We do not sell data or use advertising trackers." },
      ],
    },
    privacy: { title: "Privacy", p: "This site uses no tracking cookies and collects no personal data. It only remembers, in your browser and for the current session, that you confirmed your age. The Drinks on Chain applications explain how they process data on each form." },
    notFound: { title: "Page not found", back: "Back to home" },
  },
};

export const SITE: Record<Lang, typeof es> = { es, en };
