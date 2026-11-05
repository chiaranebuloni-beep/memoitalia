import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Shop · Mèmo",
  description:
    "Le barrette Mèmo Golosa, Cocco, Arachide e Gianduia, senza edulcoranti, senza glutine e senza lattosio, e l'integratore con vitamine D3, K2 e C.",
};

export default function ShopPage() {
  return <ShopView />;
}
