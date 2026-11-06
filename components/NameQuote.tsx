"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// La frase del fondatore sul nome: le parole si "accendono" una alla volta mentre si scorre,
// e sotto "un gusto che si ricorda" passa un tratto di evidenziatore.
const QUOTE: { text: string; hl?: boolean }[] = [
  { text: "«Non un imperativo, non un consiglio medico, ma una promessa semplice:" },
  { text: "un gusto che si ricorda.", hl: true },
  { text: "Scegliere Mèmo non è uno sforzo: è un piacere che torni a cercare naturalmente, giorno dopo giorno, perché è buono e perché fa bene.»" },
];

export default function NameQuote() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true }, defaults: { ease: "power3.out" } })
          .from(".nq-eyebrow", { y: 16, opacity: 0, duration: 0.6 })
          .from(".nq-title-word", { yPercent: 110, rotate: 4, duration: 0.8, stagger: 0.08 }, 0.1);

        gsap.fromTo(
          ".nq-word",
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ".nq-text", start: "top 82%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        // "un gusto che si ricorda": un tratto di evidenziatore che si disegna sotto le parole
        gsap.fromTo(
          ".nq-hl",
          { backgroundSize: "0% 100%" },
          {
            backgroundSize: "100% 100%",
            ease: "none",
            scrollTrigger: { trigger: ".nq-hl", start: "top 72%", end: "top 50%", scrub: 0.6 },
          },
        );
        gsap.from(".nq-author", {
          y: 14,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".nq-author", start: "top 92%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="container cs-name" ref={root}>
      <figure className="cs-name-quote">
        <span className="eyebrow eyebrow--blue nq-eyebrow">Il nome</span>
        <p className="cs-name-title" aria-label="Mèmo, come memoria.">
          <span className="nq-mask" aria-hidden>
            <span className="nq-title-word">Mèmo,</span>
          </span>{" "}
          <span className="nq-mask nq-mask--hl" aria-hidden>
            <span className="nq-title-word">come</span>
          </span>{" "}
          <span className="nq-mask nq-mask--hl" aria-hidden>
            <span className="nq-title-word">memoria.</span>
          </span>
        </p>
        <blockquote>
          <p className="nq-text">
            {QUOTE.map((part, i) => {
              const words = part.text.split(" ").map((w, j, all) => (
                <span className="nq-word" key={`${i}-${j}`}>
                  {w}
                  {j < all.length - 1 || !part.hl ? " " : ""}
                </span>
              ));
              return part.hl ? (
                <span key={i}>
                  <span className="nq-hl">{words}</span>{" "}
                </span>
              ) : (
                words
              );
            })}
          </p>
        </blockquote>
        <figcaption className="nq-author">
          <strong>Emanuele Menozzi</strong>
          <span>Biologo nutrizionista e fondatore di Mèmo</span>
        </figcaption>
      </figure>
    </section>
  );
}
