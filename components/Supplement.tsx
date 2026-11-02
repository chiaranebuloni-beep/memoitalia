"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Supplement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".sp-photo",
          { clipPath: "inset(18% 18% 18% 18% round 40px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: true },
          }
        );
        gsap.from(".sp-copy > *", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sp-copy", start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="supplement" ref={root}>
      <div className="container sp-grid">
        <div className="sp-copy">
          <span className="sp-soon">La gamma al lancio</span>
          <h2 className="sp-title">Poca roba. Fatta bene.</h2>
          <p>
            Mèmo arriva con quattro barrette e, insieme a loro, l'<strong>integratore Mèmo</strong>: tavolette masticabili al gusto frutti di bosco, pensate per grandi e piccoli. Pochi prodotti, scelti con cura e fatti con la stessa filosofia.
          </p>
          <ul className="sp-range">
            <li>
              <b>4</b>
              <span>
                barrette
                <small>Golosa, Cocco, Arachide, Gianduia</small>
              </span>
            </li>
            <li>
              <b>1</b>
              <span>
                integratore
                <small>Tavolette masticabili, frutti di bosco</small>
              </span>
            </li>
          </ul>
          <a href="#founder" className="btn btn--blue" data-cursor="Iscriviti">
            Entra nella lista Founder
          </a>
        </div>
        <figure className="sp-photo">
          <img src="/img/photos/integratore-tennis.webp" alt="Il flacone dell'integratore Mèmo appoggiato sulle tribune di un campo da tennis" width={756} height={945} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
