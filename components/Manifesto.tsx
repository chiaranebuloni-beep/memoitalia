"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "Esistono prodotti molto sani che nessuno sceglie, perché non sono abbastanza buoni. Mèmo parte dal contrario: prima di tutto deve essere buona.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".mf-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".mf-statement", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );

        gsap.set(".mf-strike", { scaleX: 0, rotate: -2, transformOrigin: "left center" });
        gsap.utils.toArray<HTMLElement>(".mf-not").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 82%", end: "top 50%", scrub: 0.6 } });
          tl.from(row, { xPercent: -12, opacity: 0, ease: "power2.out" }).to(row.querySelector(".mf-strike"), { scaleX: 1, ease: "power2.inOut" }, 0.3);
        });

        gsap.from(".mf-yes", {
          scale: 0.6,
          rotate: -6,
          opacity: 0,
          ease: "back.out(1.7)",
          duration: 1,
          scrollTrigger: { trigger: ".mf-yes", start: "top 85%" },
        });

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
            {["fit.", "light.", "proteica."].map((w) => (
              <div className="mf-not" key={w}>
                <span className="mf-not-text">
                  Non una barretta <em>{w}</em>
                </span>
                <span className="mf-strike" aria-hidden />
              </div>
            ))}
            <div className="mf-yes">
              <Swoosh className="mf-yes-swoosh" />
              <span>Equilibrata. Pensata per la vita reale.</span>
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
