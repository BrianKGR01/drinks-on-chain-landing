import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Public pages only. `/b/[codigo]` is a redirect to the Marketplace and stays out. */
const ROUTES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/vinos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/como-funciona", changeFrequency: "monthly", priority: 0.8 },
  { path: "/bodegas", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tecnologia", changeFrequency: "monthly", priority: 0.6 },
  { path: "/historia", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.5 },
  { path: "/aviso-legal", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: siteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
