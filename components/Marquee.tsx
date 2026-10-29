"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Star } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const A = ["Senza edulcoranti", "Senza glutine", "Senza lattosio", "Pochi ingredienti", "Made in Italy", "Dolce per natura"];
const B = ["Golosa", "Cocco", "Arachide", "Gianduia", "Il buono memorabile"];

function Row({ items, className }: { items: string[]; className: string }) {
  const group = (
    <>
      {items.map((t) => (
        <span className="mq-item" key={t}>
          {t}
          <Star className="mq-star" />
        </span>
      ))}
    </>
  );
  return (
    <div className={`mq-band ${className}`}>
      <div className="mq-track">
        <div className="mq-group">{group}</div>
        <div className="mq-group" aria-hidden>{group}</div>
        <div className="mq-group" aria-hidden>{group}</div>
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".mq-track");
      const loops = tracks.map((t, i) =>
        gsap.fromTo(t, { xPercent: i ? -33.333 : 0 }, { xPercent: i ? 0 : -33.333, duration: 22, ease: "none", repeat: -1 })
      );
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        loops.forEach((l) => l.pause());
        return;
      }
      // Accelera con la velocità di scroll, poi torna a regime.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          loops.forEach((l) => {
            gsap.to(l, { timeScale: 1 + Math.abs(v), duration: 0.2, overwrite: true });
            gsap.to(l, { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
          });
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  return (
    <div className="marquee" ref={root} aria-label="Senza edulcoranti, senza glutine, senza lattosio, pochi ingredienti, made in Italy">
      <Row items={B} className="mq-band--blue" />
      <Row items={A} className="mq-band--cream" />
    </div>
  );
}
