import type { Metadata } from "next";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/historia",
  title: "Historia",
  description:
    "Drinks on Chain nace en los valles altos de Bolivia, donde la vid crece entre 1.700 y 2.400 metros. Un puente entre las familias que cultivan esas parcelas y quienes descorchan sus botellas.",
});

export default function Page() {
  return <HistoryPage />;
}
