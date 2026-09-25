import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LINKS } from "@/lib/links";

/** A redirect, not a page of its own: keep it out of search results. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Old labels may point at the root domain: send them to the Marketplace viewer. */
export default async function Page({ params }: PageProps<"/b/[codigo]">) {
  const { codigo } = await params;
  redirect(LINKS.appBottle(codigo));
}
