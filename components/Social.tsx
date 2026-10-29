"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Arrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const COLS = [
  ["piacere-sono-memo", "arachide-burro", "tennis-cocco"],
  ["morso-cocco", "il-buono-memorabile", "campo-gianduia"],
  ["artiglio-barrette", "mamma-figlio", "cu-cu"],
  ["lavoro-golosa", "zaino-mascotte", "post-logo"],
];

export default function Social() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".so-col").forEach((col, i) => {
          gsap.fromTo(
            col,
            { yPercent: i % 2 ? -4 : 8 },
            {
              yPercent: i % 2 ? 8 : -12,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="social" ref={root}>
      <div className="container so-head">
        <div>
          <span className="eyebrow eyebrow--blue">Seguici</span>
          <h2 className="so-title">#ilbuonomemorabile</h2>
        </div>
        <a className="btn btn--blue" href="https://www.instagram.com/" target="_blank" rel="noreferrer" data-cursor="Instagram">
          Seguici su Instagram <Arrow className="btn-arrow" />
        </a>
      </div>
      <div className="so-wall">
        {COLS.map((col, i) => (
          <div className="so-col" key={i}>
            {col.map((img) => (
              <figure className="so-item" key={img} data-cursor="Guarda">
                <img src={`/img/photos/${img}.webp`} alt="" width={756} height={945} loading="lazy" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
