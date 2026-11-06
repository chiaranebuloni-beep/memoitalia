import type { Metadata } from "next";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Cursor from "@/components/Cursor";
import NameQuote from "@/components/NameQuote";
import { Arrow } from "@/components/ui";
import { MENOZZI_IG_HANDLE, MENOZZI_IG_URL, MENOZZI_SITE_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Chi siamo · Mèmo",
  description:
    "Mèmo nasce da un'idea del biologo nutrizionista Emanuele Menozzi: uno spuntino che prima di tutto deve essere buono. Pochi ingredienti, senza edulcoranti, fatto in Italia.",
};

// Testi presi dalla presentazione del brand (MEMO_Presentazione_Brand_e_Prodotti_v4).
const VALUES = [
  { title: "Prima di tutto, buona", text: "Il gusto viene prima della spiegazione.", icon: "heart", color: "blue" },
  { title: "Pochi ingredienti", text: "Una ricetta essenziale e leggibile.", icon: "leaf", color: "sand" },
  { title: "Equilibrata", text: "Né fit né light: carboidrati, proteine, grassi e fibre in equilibrio.", icon: "balance", color: "electric" },
  { title: "Per tutti", text: "Senza glutine, senza lattosio, senza derivati animali.", icon: "people", color: "choco" },
] as const;

// icone semplici a tratto per i valori
const ICONS: Record<(typeof VALUES)[number]["icon"], React.ReactNode> = {
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  balance: (
    <>
      <path d="M12 4v16M7 20h10M5 8h14" />
      <path d="M5 8 2.5 14a3 3 0 0 0 5 0L5 8ZM19 8l-2.5 6a3 3 0 0 0 5 0L19 8Z" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M14.5 15a4 4 0 0 1 6 4" />
    </>
  ),
};

// Collaborazioni: grafica dell'etichetta fornita dal cliente, ricostruita in alta qualità (5/11/2026).
const COLLABS = [
  {
    name: "Cigarini e Costa Football Academy",
    tag: "Calcio · Reggio Emilia",
    art: "/img/collab/memo-x-ccfa.webp",
    text: "L'academy di tecnica calcistica fondata da Luca Cigarini e Andrea Costa, ex giocatori della Reggiana, per ragazzi e adulti.",
    more: "Insieme abbiamo creato un'etichetta speciale sulle box, con un QR code per uno sconto dedicato del 10%: Mèmo × Cigarini & Costa, la barretta in 4 gusti golosi, energetica per natura.",
  },
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

        {/* Il nome: citazione del fondatore, animata */}
        <NameQuote />

        {/* Il fondatore */}
        <section className="cs-founder">
          <div className="container cs-founder-grid">
            <div className="cs-founder-head pg-reveal">
              <span className="eyebrow eyebrow--light">Il fondatore</span>
              <h2 className="pg-h2 pg-h2--light">
                Una competenza <span>reale.</span>
              </h2>
              {/* foto del dottore con l'elefantino davanti */}
              <figure className="cs-doc">
                <div className="cs-doc-photo">
                  <img src="/img/photos/emanuele-menozzi.webp" alt="Il Dott. Emanuele Menozzi, biologo nutrizionista e fondatore di Mèmo" width={900} height={900} loading="lazy" />
                </div>
                <img className="cs-doc-mascot" src="/img/brand/mascot.webp" alt="" aria-hidden width={839} height={910} loading="lazy" />
                <figcaption>
                  <strong>Dott. Emanuele Menozzi</strong>
                  <span>Biologo nutrizionista</span>
                </figcaption>
              </figure>
            </div>
            <div className="cs-founder-text pg-reveal">
              <p>
                Mèmo nasce dal lavoro del <strong>Dott. Emanuele Menozzi</strong>, biologo nutrizionista con laurea magistrale in Scienze della nutrizione umana all&apos;Università San Raffaele e iscritto all&apos;albo nazionale dei Biologi. Riceve nei suoi studi di Cavriago,
                Reggio Emilia e Parma e online, e segue tra gli altri sportivi, bambini e ragazzi.
              </p>
              <p className="cs-founder-more">
                Il suo metodo è l&apos;educazione alimentare: non una dieta da seguire per qualche settimana, ma imparare a mangiare bene ogni giorno, senza rinunce inutili. È la stessa idea da cui nasce Mèmo, che traduce la sua filosofia in
                prodotti concreti.
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
              <a className="cs-founder-site" href={MENOZZI_SITE_URL} target="_blank" rel="noreferrer">
                Scopri il Dott. Menozzi <Arrow className="btn-arrow" />
              </a>
            </div>
          </div>
        </section>

        {/* Valori: quattro schede compatte con icona */}
        <section className="container cs-values">
          <div className="pg-reveal">
            <span className="eyebrow eyebrow--blue">I nostri valori</span>
            <h2 className="pg-h2 cs-values-title">
              Buono da ricordare, <span>non una regola da seguire.</span>
            </h2>
          </div>
          <ul className="cs-values-grid">
            {VALUES.map((v, i) => (
              <li className={`cs-value cs-value--${v.color} pg-reveal`} key={v.title}>
                <span className="cs-value-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[v.icon]}
                  </svg>
                </span>
                <span className="cs-value-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{v.title}</strong>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Collaborazioni */}
        <section className="cs-collabs">
          <div className="container">
            <div className="pg-reveal">
              <span className="eyebrow eyebrow--blue">Le collaborazioni</span>
              <h2 className="pg-h2">
                In squadra <span>con Mèmo.</span>
              </h2>
            </div>
            <ul className="cs-collabs-list">
              {COLLABS.map((c) => (
                <li className="cs-collab pg-reveal" key={c.name}>
                  <img className="cs-collab-art" src={c.art} alt={`Mèmo × ${c.name}`} width={1240} height={1051} loading="lazy" />
                  <div className="cs-collab-body">
                    <span className="cs-collab-tag">{c.tag}</span>
                    <h3>{c.name}</h3>
                    <p>{c.text}</p>
                    <p className="cs-collab-more">
                      <span className="cs-collab-badge">Collab</span>
                      {c.more}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cs-collabs-cta pg-reveal">
              <div>
                <h3>Vuoi entrare in squadra?</h3>
                <p>Academy, società sportive, allenatori e professionisti, scuole di padel, palestre o eventi: se anche tu credi in uno spuntino buono e semplice, scrivici e costruiamo qualcosa insieme.</p>
              </div>
              <a href="/contatti#scrivici" className="btn btn--blue" data-cursor="Scrivici">
                Collabora con noi <Arrow className="btn-arrow" />
              </a>
            </div>
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
