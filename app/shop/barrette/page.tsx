import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Barrette · Mèmo",
  description: "Le barrette Mèmo Golosa, Cocco, Arachide e Gianduia in box da 12, e la box Experience con tutti e 4 i gusti. Senza edulcoranti, senza glutine e senza lattosio.",
};

export default function BarrettePage() {
  return <ShopView category="barretta" />;
}
