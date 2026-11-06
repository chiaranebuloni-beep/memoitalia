"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitChars, Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

// Intestazione blu delle pagine interne (Chi siamo, FAQ, Contatti), nello stile della hero della home.
// Anima anche gli elementi ".pg-reveal" della pagina quando entrano nello schermo.
export default function PageHero({ lines, lead, children, art }: { lines: [string, string]; lead: React.ReactNode; children?: React.ReactNode; art?: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".pg-hero .split-char", { yPercent: 115, duration: 0.9, stagger: 0.025 }, 0.1)
        .from(".pg-hero-anim", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.35);

      gsap.to(".pg-hero-swoosh", { rotate: 6, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // illustrazione a cavallo tra il blu e il beige: compare in dissolvenza e poi resta ferma,
      // perché ogni movimento farebbe scendere il taglio dell'immagine sotto il bordo
      if (document.querySelector(".pg-hero-art")) {
        gsap.from(".pg-hero-art", { autoAlpha: 0, duration: 0.8, ease: "power2.out", delay: 0.5 });
      }

      gsap.set(".pg-reveal", { y: 40, opacity: 0 });
      ScrollTrigger.batch(".pg-reveal", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out" }),
      });
    });
  });

  const hero = (
    <section className={`pg-hero ${art ? "pg-hero--art" : ""}`} ref={root}>
      <div className="hero-bg" aria-hidden>
        <Swoosh className="pg-hero-swoosh" />
        <div className="hero-lines" />
        <div className="hero-grain" />
      </div>
      <div className="container pg-hero-inner">
        <h1 className="pg-title">
          <span className="pg-title-line">
            <SplitChars text={lines[0]} />
          </span>
          <span className="pg-title-line pg-title-hl">
            <SplitChars text={lines[1]} />
          </span>
        </h1>
        <p className="pg-lead pg-hero-anim">{lead}</p>
        {children && <div className="pg-hero-anim">{children}</div>}
      </div>
    </section>
  );

  if (!art) return hero;
  // l'illustrazione sta fuori dalla hero (che ritaglia ciò che sborda), così può stare a cavallo del bordo
  return (
    <div className="pg-hero-wrap">
      {hero}
      {art}
    </div>
  );
}
