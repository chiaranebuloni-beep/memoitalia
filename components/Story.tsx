"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 4, suffix: "", label: "gusti, una sola identità" },
  { value: 0, suffix: "", label: "edulcoranti aggiunti" },
  { value: 80, suffix: ".000+", label: "persone nella community di Emanuele" },
  { value: 100, suffix: "%", label: "prodotta in Italia" },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".st-num b").forEach((el) => {
          const target = Number(el.dataset.value);
          const o = { v: 0 };
          gsap.to(o, {
            v: target,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => {
              el.textContent = String(Math.round(o.v));
            },
          });
        });
        gsap.from(".st-name .st-letter", {
          yPercent: 100,
          stagger: 0.06,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".st-name", start: "top 85%" },
        });
        gsap.from(".st-body > *", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".st-body", start: "top 80%" },
        });
        gsap.to(".st-memoria", {
          xPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="story" id="storia" ref={root}>
      <div className="st-memoria" aria-hidden>
        memoria · memoria · memoria · memoria
      </div>
      <div className="container st-grid">
        <div>
          <span className="eyebrow eyebrow--blue">04 — Il nome</span>
          <h2 className="st-name" aria-label="Mèmo, come memoria">
            {Array.from("Mèmo,").map((c, i) => (
              <span className="st-mask" key={i}>
                <span className="st-letter">{c}</span>
              </span>
            ))}
            <span className="st-name-sub">come memoria.</span>
          </h2>
        </div>
        <div className="st-body">
          <p className="st-lead">
            Non un imperativo, non un consiglio medico: una promessa semplice. <strong>Un gusto che si ricorda.</strong>
          </p>
          <p>
            Mèmo nasce dal lavoro del <strong>Dr. Emanuele Menozzi</strong>, biologo nutrizionista, e da un'idea testarda: lo spuntino di tutti i giorni può essere buono davvero e fare bene, senza sacrifici. Scegliere Mèmo non è uno sforzo: è un piacere che torni a cercare, giorno dopo giorno.
          </p>
          <blockquote className="st-quote">
            «Ciò che è buono davvero si ricorda: facile da scegliere, facile da capire e piacevole da ripetere.»
            <cite>Emanuele Menozzi · Biologo nutrizionista e fondatore</cite>
          </blockquote>
        </div>
      </div>

      <ul className="container st-stats">
        {STATS.map((s) => (
          <li key={s.label}>
            <span className="st-num">
              <b data-value={s.value}>{s.value}</b>
              {s.suffix}
            </span>
            <span className="st-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
