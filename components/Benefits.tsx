"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { big: "Pochi", small: "ingredienti", text: "Una ricetta essenziale, che si legge in un attimo.", color: "blue" },
  { big: "Zero", small: "edulcoranti", text: "Il gusto lo costruiamo con ingredienti veri, non con i dolcificanti.", color: "sand" },
  { big: "Senza", small: "glutine", text: "Buona per tutti, senza pensieri.", color: "cream" },
  { big: "Senza", small: "lattosio", text: "Leggera anche per chi il latte non lo digerisce.", color: "electric" },
  { big: "100%", small: "vegetale", text: "Senza derivati animali, solo ingredienti di origine naturale.", color: "choco" },
  { big: "Made", small: "in Italy", text: "Prodotta in Italia, nata a Cavriago (RE).", color: "sky" },
];

export default function Benefits() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".bn-card", {
          y: 120,
          rotate: (i) => (i % 2 ? 8 : -8),
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".bn-grid", start: "top 80%" },
        });
        gsap.from(".bn-title .bn-title-line", {
          yPercent: 110,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".bn-title", start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="benefits" ref={root}>
      <div className="container">
        <div className="bn-head">
          <span className="eyebrow eyebrow--blue">03 — Cosa la rende diversa</span>
          <h2 className="bn-title">
            <span className="bn-title-mask"><span className="bn-title-line">Semplicità che</span></span>
            <span className="bn-title-mask"><span className="bn-title-line">si vede e si sente.</span></span>
          </h2>
        </div>
        <ul className="bn-grid">
          {ITEMS.map((it) => (
            <li className={`bn-card bn-card--${it.color}`} key={it.small} data-cursor="Buona">
              <span className="bn-big">{it.big}</span>
              <span className="bn-small">{it.small}</span>
              <p>{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
