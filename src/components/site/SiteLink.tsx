import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { isExternal } from "@/lib/links";

/**
 * A link whose target depends on the environment (`src/lib/links.ts`): another site of the
 * ecosystem when it has a public URL (a plain `<a>`), or the page of this site that takes its
 * place meanwhile (client navigation with `next/link`).
 */
export function SiteLink({ href, children, ...rest }: Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string }) {
  return isExternal(href) ? (
    <a href={href} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
