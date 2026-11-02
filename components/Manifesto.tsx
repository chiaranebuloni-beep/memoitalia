"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "Esistono prodotti molto sani che nessuno sceglie, perché non sono abbastanza buoni. Mèmo parte dal contrario: prima di tutto deve essere buona.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // La frase si scrive una volta sola, appena entri nella sezione.
        gsap.from(".mf-word", {
          opacity: 0.1,
          y: 12,
          duration: 0.5,
          stagger: 0.025,
          ease: "power2.out",
          scrollTrigger: { trigger: ".mf-statement", start: "top 78%", once: true },
        });

        // Le tre frasi sono già tutte scritte: arrivano una dopo l'altra, prendono il timbro NO!
        // e alla fine arriva "Una barretta equilibrata." con il timbro Sì!
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".mf-nots", start: "top 72%", once: true },
        });
        tl.from(".mf-line", { x: -40, opacity: 0, duration: 0.6, stagger: 0.12 })
          .from(".mf-line .mf-stamp", { scale: 2.6, rotate: -40, opacity: 0, duration: 0.45, stagger: 0.28, ease: "back.out(2.4)" }, "+=0.05")
          .to(".mf-line", { opacity: 0.45, duration: 0.5, stagger: 0.12 }, "-=0.3")
          .from(".mf-final", { y: 50, opacity: 0, duration: 0.7, ease: "back.out(1.6)" }, "-=0.2")
          .from(".mf-final .mf-stamp", { scale: 2.6, rotate: 40, opacity: 0, duration: 0.45, ease: "back.out(2.4)" }, "-=0.2")
          .from(".mf-yes, .mf-note", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.2");

        gsap.to(".mf-frame img", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: ".mf-photo", start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(".mf-sticker", {
          rotate: 360,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="manifesto" id="visione" ref={root}>
      <div className="container">
        <span className="eyebrow eyebrow--blue">01 — La visione</span>
        <p className="mf-statement">
          {STATEMENT.split(" ").map((w, i) => (
            <span className="mf-word" key={i}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mf-grid">
          <div className="mf-nots">
            <ul className="mf-lines">
              {["fit.", "light.", "proteica."].map((w) => (
                <li className="mf-line" key={w}>
                  Non una barretta
                  <span className="mf-tail">
                    <em>{w}</em>
                    <span className="mf-stamp" aria-hidden>
                      No!
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mf-final">
              Una barretta
              <span className="mf-tail">
                <strong>equilibrata.</strong>
                <span className="mf-stamp mf-stamp--yes" aria-hidden>
                  Sì!
                </span>
              </span>
            </p>
            <div className="mf-yes" aria-hidden>
              Pensata per la vita reale
            </div>
            <p className="mf-note">
              Carboidrati, proteine, grassi e fibre in equilibrio. Qualità senza estremismi: niente paura degli zuccheri, niente logica del prodotto perfetto.
            </p>
          </div>

          <figure className="mf-photo">
            <div className="mf-frame">
              <img src="/img/photos/morso-cocco.webp" alt="Una ragazza addenta con gusto una barretta Mèmo Cocco" width={756} height={945} loading="lazy" />
            </div>
            <div className="mf-sticker" aria-hidden>
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="mf-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#mf-circle">DOLCE PER NATURA ✦ DOLCE PER NATURA ✦ </textPath>
                </text>
              </svg>
              <img src="/img/brand/monogram.png" alt="" width={90} height={90} />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
