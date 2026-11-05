import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Integratore · Mèmo",
  description: "L'integratore Mèmo con vitamine D3, K2 e C: 60 compresse masticabili al gusto frutti rossi.",
};

export default function IntegratorePage() {
  return <ShopView category="integratore" />;
}
