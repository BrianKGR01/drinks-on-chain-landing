import type { Metadata } from "next";
import { TechnologyPage } from "@/components/pages/SimplePages";

export const metadata: Metadata = { title: "Tecnología" };

export default function Page() {
  return <TechnologyPage />;
}
