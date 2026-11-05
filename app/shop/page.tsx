import type { Metadata } from "next";
import { products } from "@/lib/catalog";
import Header from "@/components/Header";
import Shop from "@/components/Shop";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import ShopCartBar from "@/components/ShopCartBar";

export const metadata: Metadata = {
  title: "Shop · Mèmo",
  description:
    "Le barrette Mèmo Golosa, Cocco, Arachide e Gianduia e l'integratore con vitamine D3, K2 e C. Senza edulcoranti, senza glutine e senza lattosio.",
};

export default function ShopPage() {
  return (
    <>
      <Cursor />
      <Header />
      <main>
        <Shop products={products} />
      </main>
      <Footer />
      <ShopCartBar />
      <CartDrawer />
    </>
  );
}
