import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/SimplePages";

export const metadata: Metadata = { title: "Privacidad" };

export default function Page() {
  return <PrivacyPage />;
}
