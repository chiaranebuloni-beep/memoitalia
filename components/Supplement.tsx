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
          x: -40,
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
          <span className="sp-soon">In arrivo</span>
          <h2 className="sp-title">Poca roba. Fatta bene.</h2>
          <p>
            Dopo le barrette arriva l'<strong>integratore Mèmo</strong>: tavolette masticabili al gusto frutti di bosco, pensate per grandi e piccoli. Stessa filosofia, stessa semplicità.
          </p>
          <a href="#founder" className="btn btn--blue" data-cursor="Avvisami">
            Avvisami quando arriva
          </a>
        </div>
        <figure className="sp-photo">
          <img src="/img/photos/integratore-tennis.webp" alt="Il flacone dell'integratore Mèmo appoggiato sulle tribune di un campo da tennis" width={756} height={945} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
