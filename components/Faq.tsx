"use client";

import { useState } from "react";
import { launchDateLabel } from "@/lib/launch";
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
            Le barrette contengono frutta a guscio (nocciole, mandorle) o arachidi, a seconda del gusto. Elenco completo degli allergeni e delle possibili tracce: <Pending />
          </>
        ),
      },
      { q: "Quanto pesa una barretta e quante calorie ha?", a: <Pending /> },
      { q: "Come si conserva e quanto dura?", a: <Pending /> },
      { q: "Possono mangiarla anche i bambini?", a: "Sì: Mèmo è pensata anche come merenda per bambini e ragazzi, da mettere nello zaino per la scuola o lo sport." },
      { q: "Dove vengono prodotte?", a: "In Italia. Mèmo è nata a Cavriago, in provincia di Reggio Emilia." },
    ],
  },
  {
    id: "integratore",
    title: "L'integratore",
    items: [
      { q: "Che cos'è l'integratore Mèmo?", a: "Un integratore alimentare a base di vitamine C, D e K, al gusto frutti rossi. La confezione contiene 60 compresse." },
      { q: "Come si assume e qual è la dose giornaliera?", a: <Pending /> },
      { q: "Possono prenderlo anche i bambini?", a: <Pending /> },
      { q: "Ci sono avvertenze?", a: <>Gli integratori non vanno intesi come sostituti di una dieta varia ed equilibrata e di uno stile di vita sano. Avvertenze complete: <Pending /></> },
    ],
  },
  {
    id: "ordini",
    title: "Ordini e spedizioni",
    items: [
      { q: "Quando apre lo shop?", a: `Lo shop apre il ${launchDateLabel}.` },
      { q: "Dove spedite?", a: "In tutta Italia." },
      { q: "Quanto costa la spedizione e quanto ci mette?", a: <Pending /> },
      { q: "Come posso pagare?", a: <Pending /> },
      { q: "Posso restituire un prodotto?", a: <>Diritto di recesso e modalità di reso: <Pending /></> },
    ],
  },
  {
    id: "founder",
    title: "Lista Founder",
    items: [
      { q: "Che cos'è la lista Founder?", a: "È la lista di chi vuole assaggiare Mèmo prima di tutti: riceve un prezzo riservato e il box degustazione con tutti e 4 i gusti." },
      { q: "Iscriversi costa qualcosa?", a: "No, l'iscrizione è gratuita e non ti obbliga ad acquistare." },
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
