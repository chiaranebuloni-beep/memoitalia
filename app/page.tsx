import { products } from "@/lib/catalog";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Flavors from "@/components/Flavors";
import Manifesto from "@/components/Manifesto";
import Benefits from "@/components/Benefits";
import FounderBox from "@/components/FounderBox";
import Supplement from "@/components/Supplement";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Flavors products={products} />
        <Manifesto />
        <Benefits />
        <FounderBox />
        <Supplement />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
