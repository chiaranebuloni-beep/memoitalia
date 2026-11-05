"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Arrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

// Lo sport si alterna alla vita di tutti i giorni: Mèmo non è solo per chi fa sport.
const SHOTS = [
  { img: "sport-campo-gianduia", tag: "Sport", title: "In campo", text: "Tra un set e l'altro." },
  { img: "auto-gianduia", tag: "Ogni giorno", title: "In viaggio", text: "Il buono che ti porti dietro." },
  { img: "padel-cocco", tag: "Sport", title: "A padel", text: "Il cambio campo più buono." },
  { img: "ufficio-gianduia", tag: "Ogni giorno", title: "In ufficio", text: "Tra una riunione e l'altra." },
  { img: "calcio-gianduia", tag: "Sport", title: "Dopo l'allenamento", text: "Il premio dopo la fatica." },
  { img: "papa-figlio-integratore", tag: "Ogni età", title: "Grandi e piccoli", text: "Le vitamine Mèmo, per tutta la famiglia." },
  { img: "sport-borsa-gianduia", tag: "Sport", title: "In borsa", text: "Accanto alla borraccia, sempre." },
  { img: "amici-gianduia", tag: "Ogni età", title: "Con gli amici", text: "Ovunque si vada." },
  { img: "sport-tribuna-integratore-sm", tag: "Sport", title: "Prima del match", text: "Le vitamine Mèmo, a portata di mano." },
  { img: "tasca-cocco", tag: "Ogni giorno", title: "In tasca", text: "Piccola, pronta quando serve." },
  { img: "bambini-integratore", tag: "Ogni età", title: "All'aria aperta", text: "Compresse masticabili, gusto frutti rossi." },
  { img: "mamma-figlio", tag: "Ogni età", title: "In famiglia", text: "La merenda che mette d'accordo tutti." },
  { img: "nonna-merenda", tag: "Ogni età", title: "A ogni età", text: "Chi ha detto che i grandi non fanno merenda?" },
];

export default function Target() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tg-copy > *", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });
        // Le foto si scoprono dal basso come una tendina: niente dissolvenze né spostamenti,
        // così non restano mai a metà trasparenti mentre il carosello scorre.
        gsap.from(".tg-card", {
          clipPath: "inset(100% 0% 0% 0% round 26px)",
          stagger: 0.09,
          duration: 0.9,
          ease: "power3.inOut",
          clearProps: "clipPath",
          scrollTrigger: { trigger: ".tg-track", start: "top 85%", once: true },
        });
      });
    },
    { scope: root }
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".tg-card");
    const amount = card ? card.offsetWidth + 18 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  // Trascinamento col mouse (su touch lo scorrimento è quello nativo).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.classList.add("is-dragging");
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !track.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    if (!track.current) return;
    track.current.classList.remove("is-dragging");
    drag.current = null;
  };

  return (
    <section className="target" id="per-chi" ref={root}>
      <div className="container tg-head">
        <div className="tg-copy">
          <span className="eyebrow eyebrow--light">02 — Per chi è Mèmo</span>
          <h2 className="tg-title">
            <span className="tg-title-line">In campo e fuori.</span>
            <span className="tg-title-line tg-title-hl">Buona a ogni età.</span>
          </h2>
          <p>
            Tra un set e l'altro, a scuola, in ufficio o a merenda con gli amici: Mèmo sta in borsa, pronta quando serve. Prima di tutto è buona, per questo piace ai grandi e ai piccoli.
          </p>
        </div>
        <div className="tg-nav">
          <button onClick={() => step(-1)} disabled={edges.start} aria-label="Foto precedenti">
            <Arrow className="tg-arrow tg-arrow--prev" />
          </button>
          <button onClick={() => step(1)} disabled={edges.end} aria-label="Foto successive">
            <Arrow className="tg-arrow" />
          </button>
        </div>
      </div>

      <div
        className="tg-track"
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        data-cursor="Trascina"
        role="region"
        aria-label="Mèmo nello sport e a ogni età"
        tabIndex={0}
      >
        {SHOTS.map((s, i) => (
          <figure className="tg-card" key={s.img}>
            <img src={`/img/photos/${s.img}.webp`} alt={`${s.title}: ${s.text}`} width={1080} height={1350} loading={i < 5 ? "eager" : "lazy"} draggable={false} />
            <figcaption>
              <span className={`tg-tag ${s.tag === "Sport" ? "is-sport" : s.tag === "Ogni giorno" ? "is-daily" : ""}`}>{s.tag}</span>
              <strong>{s.title}</strong>
              <span className="tg-line">{s.text}</span>
            </figcaption>
          </figure>
        ))}
        <div className="tg-spacer" aria-hidden />
      </div>

      <div className="container">
        <div className="tg-progress" aria-hidden>
          <i style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </div>
      </div>
    </section>
  );
}
