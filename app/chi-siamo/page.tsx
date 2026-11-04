import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import { Arrow, Pending, Star } from "@/components/ui";
import { MENOZZI_IG_HANDLE, MENOZZI_IG_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Chi siamo · Mèmo",
  description:
    "Mèmo nasce da un'idea del biologo nutrizionista Emanuele Menozzi: uno spuntino che prima di tutto deve essere buono. Pochi ingredienti, senza edulcoranti, fatto in Italia.",
};

// Testi presi dalla presentazione del brand (MEMO_Presentazione_Brand_e_Prodotti_v4).
const VALUES = [
  { title: "Prima di tutto, buona", text: "Non basta che uno spuntino sia sano: deve essere un piacere mangiarlo. Il gusto viene prima della spiegazione.", color: "blue" },
  { title: "Pochi ingredienti", text: "Una formulazione essenziale e leggibile, con ingredienti di origine naturale.", color: "sand" },
  { title: "Equilibrata", text: "Non una barretta fit, light o proteica: carboidrati, proteine, grassi e fibre in equilibrio.", color: "electric" },
  { title: "Per tutti", text: "Senza glutine, senza lattosio e senza derivati animali. Dalla merenda dei bambini allo sport.", color: "choco" },
];

const MOMENTS = [
  { name: "Scuola", text: "Una merenda pratica da mettere nello zaino." },
  { name: "Ufficio", text: "Uno spezzafame quando la giornata corre." },
  { name: "Sport", text: "Uno spuntino semplice tra match e allenamenti." },
  { name: "Colazione", text: "Una soluzione pratica quando hai poco tempo." },
];

export default function ChiSiamoPage() {
  return (
    <>
      <Cursor />
      <Header />
      <main className="page page--chi-siamo">
        <PageHero
          lines={["Prima di tutto,", "deve essere buona."]}
          lead="Esistono prodotti molto sani che nessuno sceglie, perché non sono abbastanza buoni. Mèmo cerca il punto d'incontro tra gusto, semplicità e qualità nutrizionale."
        />

        {/* Il nome */}
        <section className="container cs-name">
          <div className="cs-name-copy pg-reveal">
            <span className="eyebrow eyebrow--blue">Il nome</span>
            <h2 className="pg-h2">
              Mèmo, <span>come memoria.</span>
            </h2>
            <blockquote className="cs-quote">
              <p>
                «Non un imperativo, non un consiglio medico, ma una promessa semplice: un gusto che si ricorda. Scegliere Mèmo non è uno sforzo: è un piacere che torni a cercare naturalmente, giorno dopo giorno, perché è buono e perché fa bene.»
              </p>
              <footer>
                <strong>Emanuele Menozzi</strong>
                <span>Biologo nutrizionista e fondatore di Mèmo</span>
              </footer>
            </blockquote>
          </div>
          <figure className="cs-portrait pg-reveal">
            <div className="cs-portrait-frame">
              <Pending block>Foto del Dott. Emanuele Menozzi: in attesa dei dati del cliente</Pending>
            </div>
          </figure>
        </section>

        {/* Il fondatore */}
        <section className="cs-founder">
          <div className="container cs-founder-grid">
            <div className="pg-reveal">
              <span className="eyebrow eyebrow--light">Il fondatore</span>
              <h2 className="pg-h2 pg-h2--light">
                Una competenza <span>reale.</span>
              </h2>
            </div>
            <div className="cs-founder-text pg-reveal">
              <p>
                Mèmo nasce dal lavoro del <strong>Dott. Emanuele Menozzi</strong>, biologo nutrizionista. La divulgazione nutrizionale e il brand vivono insieme: Mèmo traduce la sua filosofia in prodotti concreti, da mangiare ogni giorno.
              </p>
              {/* riprova sociale: il numero viene dalla presentazione del brand (pag. 10) */}
              <a className="cs-ig" href={MENOZZI_IG_URL} target="_blank" rel="noreferrer" data-cursor="Instagram">
                <strong className="cs-ig-num">90.000+</strong>
                <span className="cs-ig-label">
                  follower su Instagram
                  <small>@{MENOZZI_IG_HANDLE}</small>
                </span>
              </a>
              <p className="cs-ig-text">Una community che ogni giorno segue i suoi consigli su nutrizione, alimentazione e benessere, e che cresce insieme a Mèmo.</p>
              <Pending block>Biografia e percorso del Dott. Menozzi: in attesa dei dati del cliente</Pending>
            </div>
          </div>
        </section>

        {/* Valori */}
        <section className="container cs-values">
          <div className="pg-reveal">
            <span className="eyebrow eyebrow--blue">I nostri valori</span>
            <h2 className="pg-h2">
              Buono da ricordare, <span>non una regola da seguire.</span>
            </h2>
          </div>
          <ul className="cs-values-grid">
            {VALUES.map((v, i) => (
              <li className={`cs-value cs-value--${v.color} pg-reveal`} key={v.title}>
                <span className="cs-value-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Nella vita reale */}
        <section className="cs-moments">
          <div className="container">
            <div className="pg-reveal">
              <span className="eyebrow eyebrow--blue">Nella vita reale</span>
              <h2 className="pg-h2">
                Dalla scuola al campo. <span>Sempre a portata di mano.</span>
              </h2>
            </div>
            <ul className="cs-moments-row">
              {MOMENTS.map((m) => (
                <li className="pg-reveal" key={m.name}>
                  <Star className="cs-star" />
                  <strong>{m.name}</strong>
                  <span>{m.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Chiusura */}
        <section className="pg-cta">
          <div className="container pg-cta-inner pg-reveal">
            <h2>
              Il modo migliore per conoscerci? <span>Assaggiarci.</span>
            </h2>
            <div className="pg-cta-actions">
              <a href="/shop" className="btn btn--white btn--lg" data-cursor="Shop">
                Vai allo shop <Arrow className="btn-arrow" />
              </a>
              <a href="/#founder" className="btn btn--ghost btn--lg" data-cursor="Iscriviti">
                Lista Founder
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
