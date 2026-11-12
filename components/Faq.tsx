"use client";

import { useState } from "react";
import { launchDateLabel } from "@/lib/launch";
import { SHOP_OPEN } from "@/lib/shop";
import { Pending } from "./ui";

type Item = { q: string; a: React.ReactNode };
type Group = { id: string; title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: "barrette",
    title: "Le barrette",
    items: [
      { q: "Le barrette Mèmo sono senza glutine e senza lattosio?", a: "Sì: tutte e quattro le barrette sono senza glutine e senza lattosio." },
      { q: "Contengono edulcoranti?", a: "No. Il gusto è costruito con ingredienti veri, senza ricorrere agli edulcoranti: Mèmo è dolce per natura." },
      { q: "Ci sono ingredienti di origine animale?", a: "No, le barrette sono senza derivati animali e fatte con ingredienti di origine naturale." },
      { q: "È una barretta proteica?", a: "No. Mèmo non è una barretta fit, light o proteica: è una barretta equilibrata, con carboidrati, proteine, grassi e fibre, pensata per la vita reale." },
      {
        q: "Quali allergeni contiene?",
        a: (
          <>
            Dipende dal gusto. <strong>Golosa</strong>: soia, mandorle e nocciole (può contenere tracce di latte e altra frutta a guscio). <strong>Gianduia</strong>: mandorle e nocciole (tracce di soia e altra frutta a guscio).{" "}
            <strong>Cocco</strong>: mandorle (tracce di altra frutta a guscio). <strong>Arachide</strong>: arachidi (tracce di latte, soia e frutta a guscio). Ingredienti completi e valori nutrizionali sono nella scheda di ogni barretta,
            {SHOP_OPEN ? (
              <>
                nello <a href="/shop/barrette#info-golosa">shop</a>.
              </>
            ) : (
              <>
                in home, nella <a href="/#gusti">sezione dei gusti</a>.
              </>
            )}
          </>
        ),
      },
      {
        q: "Quanto pesa una barretta e quante calorie ha?",
        a: "Ogni barretta pesa 40 g. Le calorie cambiano di poco da un gusto all'altro: Gianduia 165 kcal, Arachide 170 kcal, Cocco 172 kcal, Golosa 180 kcal.",
      },
      { q: "Come si conservano?", a: "In un luogo fresco e asciutto, a una temperatura non superiore a 25 °C." },
      { q: "Possono mangiarla anche i bambini?", a: "Sì: Mèmo è pensata anche come merenda per bambini e ragazzi, da mettere nello zaino per la scuola o lo sport." },
      { q: "Dove vengono prodotte?", a: "In Italia. Mèmo è nata a Cavriago, in provincia di Reggio Emilia." },
    ],
  },
  {
    id: "integratore",
    title: "L'integratore",
    items: [
      { q: "Che cos'è l'integratore Mèmo?", a: "Un integratore alimentare a base di vitamine D3, K2 e C, al gusto frutti rossi. La confezione contiene 60 compresse masticabili da 1000 mg." },
      { q: "Come si assume e qual è la dose giornaliera?", a: "Per gli adulti si consigliano 2 compresse al giorno. Per i bambini di età superiore ai 3 anni si consiglia 1 compressa al giorno. Non superare la dose giornaliera consigliata." },
      { q: "Possono prenderlo anche i bambini?", a: "Sì, sopra i 3 anni: 1 compressa al giorno. Al di sotto dei 12 anni si consiglia di consultare il medico. Va tenuto fuori dalla portata dei bambini al di sotto dei 3 anni." },
      { q: "Come si conserva?", a: "In un luogo fresco e asciutto." },
      { q: "Ci sono avvertenze?", a: "Non superare la dose giornaliera consigliata. Gli integratori alimentari non vanno intesi quali sostituti di una dieta variata, equilibrata e uno stile di vita sano. Per l'uso in gravidanza, durante l'allattamento e al di sotto dei 12 anni si consiglia di consultare il medico." },
    ],
  },
  {
    id: "ordini",
    title: "Ordini e spedizioni",
    items: [
      { q: "Quando apre lo shop?", a: `Lo shop apre il ${launchDateLabel}.` },
      { q: "Dove spedite?", a: "In tutta Italia." },
      {
        q: "Posso comprare una barretta singola?",
        a: "Online no: le barrette si acquistano in box da 12. Puoi scegliere la box di un solo gusto oppure la box Experience, con 3 barrette per ognuno dei 4 gusti. Ogni box costa 32,40 €, cioè 2,70 € a barretta.",
      },
      { q: "Quanto costa la spedizione e quanto ci mette?", a: <Pending /> },
      { q: "Come posso pagare?", a: <Pending /> },
      { q: "Posso restituire un prodotto?", a: <>Diritto di recesso e modalità di reso: <Pending /></> },
    ],
  },
  {
    id: "founder",
    title: "Avvisami al lancio",
    items: [
      { q: "Come funziona \"Avvisami al lancio\"?", a: "Lasci la tua email (e, se vuoi, il numero WhatsApp) e ti scriviamo appena apre lo shop." },
      { q: "Iscriversi costa qualcosa?", a: "No, è gratuito e non ti obbliga ad acquistare." },
      { q: "Come mi cancello dalla lista?", a: <>Scrivici a <a href="mailto:info@memoitalia.it">info@memoitalia.it</a> e ti togliamo subito.</> },
    ],
  },
];

export default function Faq() {
  const [open, setOpen] = useState<string | null>("barrette-0");

  return (
    <div className="container faq">
      <nav className="faq-nav pg-reveal" aria-label="Argomenti">
        {GROUPS.map((g) => (
          <a key={g.id} href={`#${g.id}`} className={`faq-topic--${g.id}`}>
            <i className="faq-dot" aria-hidden />
            {g.title}
          </a>
        ))}
      </nav>

      {GROUPS.map((g) => (
        // ogni argomento ha il suo riquadro colorato, così si capisce subito di cosa si parla
        <section className={`faq-group faq-topic--${g.id} pg-reveal`} id={g.id} key={g.id}>
          <header className="faq-group-head">
            <h2 className="faq-group-title">
              <i className="faq-dot" aria-hidden />
              {g.title}
            </h2>
          </header>
          <ul className="faq-list">
            {g.items.map((it, i) => {
              const id = `${g.id}-${i}`;
              const isOpen = open === id;
              return (
                <li className={`faq-item ${isOpen ? "is-open" : ""}`} key={id}>
                  <button className="faq-q" aria-expanded={isOpen} aria-controls={`${id}-a`} onClick={() => setOpen(isOpen ? null : id)}>
                    <span>{it.q}</span>
                    <i className="faq-icon" aria-hidden />
                  </button>
                  {/* la risposta resta nel DOM: l'altezza si anima con grid-template-rows */}
                  <div className="faq-a" id={`${id}-a`} role="region" aria-hidden={!isOpen}>
                    <div>
                      <p>{it.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
