import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import { Pending, Star } from "@/components/ui";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contatti · Mèmo",
  description: "Scrivi a Mèmo, diventa rivenditore o scopri dove trovare le barrette Mèmo.",
};

// Proposta per il punto vendita, dalla presentazione del brand.
const RETAIL = [
  { title: "Monoporzione", text: "Ogni barretta è pronta per la vendita singola: perfetta per l'acquisto d'impulso e la merenda." },
  { title: "Espositore da terra", text: "I quattro gusti esposti insieme, con l'espositore fornito da Mèmo." },
  { title: "Riordino semplice", text: "Poche referenze, riconoscibili e facili da reintegrare." },
];

export default function ContattiPage() {
  return (
    <>
      <Cursor />
      <Header />
      <main className="page">
        <PageHero lines={["Parliamone", "insieme."]} lead="Una domanda su Mèmo, una proposta per il tuo negozio o la voglia di sapere dove trovarci: siamo qui.">
          <nav className="pg-jump" aria-label="Sezioni della pagina">
            <a href="#scrivici">Scrivici</a>
            <a href="#rivenditori">Rivenditori e GDO</a>
            <a href="#dove-trovarci">Dove trovarci</a>
          </nav>
        </PageHero>

        {/* Scrivici */}
        <section className="container ct-grid" id="scrivici">
          <div className="ct-info pg-reveal">
            <span className="eyebrow eyebrow--blue">Scrivici</span>
            <h2 className="pg-h2">
              Ti rispondiamo <span>noi.</span>
            </h2>
            <ul className="ct-cards">
              <li>
                <small>Email</small>
                <a href="mailto:info@memoitalia.it">info@memoitalia.it</a>
              </li>
              <li>
                <small>Instagram</small>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  @{INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <small>Sede</small>
                <span>
                  Mèmo Italia SRLS
                  <br />
                  Via Tagliavini 10, Cavriago (RE)
                </span>
              </li>
            </ul>
          </div>
          <div className="ct-form pg-reveal">
            <ContactForm kind="privato" />
            <Pending block>A quale indirizzo inviare i messaggi del modulo: in attesa dei dati del cliente</Pending>
          </div>
        </section>

        {/* Rivenditori e GDO */}
        <section className="ct-retail" id="rivenditori">
          <div className="container ct-grid">
            <div className="pg-reveal">
              <span className="eyebrow eyebrow--light">Rivenditori e GDO</span>
              <h2 className="pg-h2 pg-h2--light">
                Porta Mèmo <span>nel tuo negozio.</span>
              </h2>
              <p className="ct-retail-lead">
                Supermercati, negozi, bar, palestre e punti vendita selezionati: Mèmo è pensata per lo scaffale. Prezzo al pubblico consigliato <strong>2,50 €</strong> a barretta.
              </p>
              <ul className="ct-retail-list">
                {RETAIL.map((r) => (
                  <li key={r.title}>
                    <Star className="tag-star" />
                    <div>
                      <strong>{r.title}</strong>
                      <span>{r.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ct-form ct-form--card pg-reveal">
              <ContactForm kind="rivenditore" />
            </div>
          </div>
        </section>

        {/* Dove trovarci */}
        <section className="container ct-stores" id="dove-trovarci">
          <div className="pg-reveal">
            <span className="eyebrow eyebrow--blue">Dove trovarci</span>
            <h2 className="pg-h2">
              Mèmo <span>vicino a te.</span>
            </h2>
            <p className="ct-stores-lead">I punti vendita dove trovi le barrette Mèmo.</p>
          </div>
          <ul className="ct-store-list">
            {[0, 1, 2].map((i) => (
              <li className="ct-store pg-reveal" key={i}>
                <span className="ct-store-pin" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                <strong>Punto vendita</strong>
                <Pending>Nome, indirizzo e città: in attesa dei dati del cliente</Pending>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
