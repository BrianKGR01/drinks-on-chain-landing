import type { Metadata } from "next";
import { WineriesPage } from "@/components/pages/SimplePages";

export const metadata: Metadata = { title: "Bodegas" };

export default function Page() {
  return <WineriesPage />;
}
