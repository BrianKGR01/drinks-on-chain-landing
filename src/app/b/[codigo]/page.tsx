import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LINKS, SCAN_HELP_PATH } from "@/lib/links";

/** A redirect, not a page of its own: keep it out of search results. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Old labels may point at the root domain: send them to the Marketplace viewer. While the
 * Marketplace has no public URL (`NEXT_PUBLIC_URL_APP`), to the page that explains the code.
 */
export default async function Page({ params }: PageProps<"/b/[codigo]">) {
  const { codigo } = await params;
  redirect(LINKS.appBottle(codigo) ?? SCAN_HELP_PATH);
}
