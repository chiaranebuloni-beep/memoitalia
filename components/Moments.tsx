"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const MOMENTS = [
  { title: "A scuola", text: "Una merenda pratica da mettere nello zaino.", img: "zaino-mascotte", tint: "#2e6bf0" },
  { title: "In campo", text: "Uno spuntino semplice tra un set e l'altro.", img: "tennis-cocco", tint: "#0b4ea2" },
  { title: "Al lavoro", text: "Lo spezzafame quando la giornata corre.", img: "lavoro-golosa", tint: "#e9a35e" },
  { title: "In famiglia", text: "La merenda che piace a tutti, grandi e piccoli.", img: "mamma-figlio", tint: "#8fb6ee" },
  { title: "In giro", text: "In borsa, in viaggio, con gli amici.", img: "amici-gianduia", tint: "#b4532a" },
  { title: "A ogni età", text: "Chi ha deciso che i grandi non fanno merenda?", img: "nonna-merenda", tint: "#2e6bf0" },
  { title: "Dopo il match", text: "Nella borsa, accanto alla borraccia.", img: "borsa-sport", tint: "#3a7d3a" },
];

export default function Moments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".mo-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".mo-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".mo-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector("img"),
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left right", end: "right left", scrub: true } }
          );
          gsap.from(card, {
            rotate: 6,
            y: 60,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left 95%", end: "left 55%", scrub: true },
          });
        });

        gsap.from(".mo-title .mo-title-line", {
          yPercent: 110,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="moments" id="momenti" ref={root}>
      <div className="mo-pin">
        <div className="mo-track">
          <div className="mo-intro">
            <span className="eyebrow eyebrow--light">02 — Nella vita reale</span>
            <h2 className="mo-title">
              <span className="mo-title-mask"><span className="mo-title-line">Un posto</span></span>
              <span className="mo-title-mask"><span className="mo-title-line">nello zaino.</span></span>
              <span className="mo-title-mask"><span className="mo-title-line mo-accent">In ogni momento.</span></span>
            </h2>
            <p className="mo-lead">Mèmo non nasce per un momento preciso: nasce per accompagnarne tanti. Non un alimento da dieta, ma una scelta migliore e piacevole, tutti i giorni.</p>
          </div>

          {MOMENTS.map((m, i) => (
            <article className="mo-card" key={m.title} style={{ "--tint": m.tint } as React.CSSProperties}>
              <div className="mo-img">
                <img src={`/img/photos/${m.img}.webp`} alt={`${m.title}: ${m.text}`} width={756} height={945} loading="lazy" />
              </div>
              <div className="mo-caption">
                <span className="mo-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            </article>
          ))}
          <div className="mo-end" aria-hidden />
        </div>
      </div>
    </section>
  );
}
