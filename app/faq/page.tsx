import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import { Arrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Domande frequenti · Mèmo",
  description: "Ingredienti, allergeni, integratore, spedizioni e lancio dello shop: le risposte alle domande più comuni su Mèmo.",
};

export default function FaqPage() {
  return (
    <>
      <Cursor />
      <Header />
      <main className="page">
        <PageHero
          lines={["Domande", "frequenti."]}
          lead="Hai un dubbio? Probabilmente qualcuno l'ha già avuto prima di te. Qui trovi le risposte su barrette, integratore e ordini."
          art={<img className="pg-hero-art" src="/img/brand/elefante-dubbioso.webp?v=3" alt="" aria-hidden width={900} height={508} />}
        />
        <Faq />
        <section className="pg-cta">
          <div className="container pg-cta-inner pg-reveal">
            <h2>
              Non hai trovato la risposta? <span>Scrivici.</span>
            </h2>
            <div className="pg-cta-actions">
              <a href="/contatti" className="btn btn--white btn--lg" data-cursor="Scrivici">
                Contattaci <Arrow className="btn-arrow" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
