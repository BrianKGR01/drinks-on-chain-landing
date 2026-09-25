import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { AgeGate } from "@/components/intro/AgeGate";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { AGE_GATE_BOOT_SCRIPT } from "@/store/experience";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description:
    "Vinos y singanis de altura de Bolivia, verificados de la parcela a la copa. Adquiérelos a precio de bodega, sigue su elaboración y retíralos cuando quieras.",
  applicationName: SITE_NAME,
  keywords: ["vino boliviano", "singani", "Tarija", "Valle de Cinti", "trazabilidad", "bodegas", "preventa de vino"],
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    siteName: SITE_NAME,
    type: "website",
    locale: "es_BO",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fdfcf5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cormorant.variable} ${garamond.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks the document before first paint when the age gate was already passed this session. */}
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_BOOT_SCRIPT }} />
      </head>
      <body className="paper-grain">
        <a href="#content" className="skip-link">
          Saltar al contenido
        </a>
        <AgeGate />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
