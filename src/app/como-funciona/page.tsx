import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/pages/SimplePages";

export const metadata: Metadata = { title: "Cómo funciona" };

export default function Page() {
  return <HowItWorksPage />;
}
