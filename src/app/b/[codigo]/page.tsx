import { redirect } from "next/navigation";
import { LINKS } from "@/lib/links";

/** Old labels may point at the root domain: send them to the Marketplace viewer. */
export default async function Page({ params }: PageProps<"/b/[codigo]">) {
  const { codigo } = await params;
  redirect(LINKS.appBottle(codigo));
}
