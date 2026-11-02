"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products } from "@/lib/catalog";
import { Arrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

type Slide = {
  id: string;
  kind: string;
  name: string;
  line: string;
  img: string;
  bg: string;
  ink: string;
  bottle?: boolean;
};

// La gamma al lancio: l'integratore e le quattro barrette.
const SLIDES: Slide[] = [
  {
    id: "integratore",
    kind: "Integratore",
    name: "Vitamine C, D, K",
    line: "60 compresse masticabili · gusto frutti rossi",
    img: "/img/products/integratore.webp",
    bg: "#f39a62",
    ink: "#0b2e6b",
    bottle: true,
  },
  ...products.map((p) => ({
    id: p.id,
    kind: "Barretta",
    name: p.name,
    line: p.ingredients,
    img: p.image,
    bg: p.theme.bg,
    ink: p.theme.ink,
  })),
];

const AUTOPLAY_MS = 4200;

export default function Range() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const current = useRef(0);
  const busy = useRef(false);
  const touchX = useRef<number | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".rg-slide");
      gsap.set(slides.slice(1), { autoAlpha: 0 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rg-copy > *", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from(".rg-card", {
          y: 60,
          rotate: 2,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
      });
    },
    { scope: root }
  );

  const goTo = contextSafe((next: number, dir: 1 | -1) => {
    const from = current.current;
    if (next === from || busy.current) return;
    const slides = gsap.utils.toArray<HTMLElement>(".rg-slide");
    const out = slides[from];
    const inn = slides[next];
    current.current = next;
    setIndex(next);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(out, { autoAlpha: 0 });
      gsap.set(inn, { autoAlpha: 1 });
      gsap.set(".rg-card", { backgroundColor: SLIDES[next].bg, color: SLIDES[next].ink });
      return;
    }

    busy.current = true;
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => (busy.current = false) });
    tl.to(".rg-card", { backgroundColor: SLIDES[next].bg, color: SLIDES[next].ink, duration: 0.7 }, 0)
      .to(out.querySelector(".rg-product"), { xPercent: -70 * dir, rotate: -18 * dir, opacity: 0, duration: 0.55 }, 0)
      .to(out.querySelectorAll(".rg-caption > *"), { y: -16, opacity: 0, duration: 0.3, stagger: 0.03 }, 0)
      .set(out, { autoAlpha: 0 }, 0.55)
      .set(inn, { autoAlpha: 1 }, 0.2)
      .fromTo(
        inn.querySelector(".rg-product"),
        { xPercent: 70 * dir, rotate: 18 * dir, opacity: 0 },
        { xPercent: 0, rotate: 0, opacity: 1, duration: 0.75, ease: "expo.out" },
        0.25
      )
      .fromTo(inn.querySelectorAll(".rg-caption > *"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }, 0.4);
  });

  const next = useCallback(() => goTo((current.current + 1) % SLIDES.length, 1), [goTo]);
  const prev = useCallback(() => goTo((current.current - 1 + SLIDES.length) % SLIDES.length, -1), [goTo]);

  // Il carosello scorre da solo solo quando è visibile e nessuno lo sta usando.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = visible && !paused && !reduced;

  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, index, next]);

  const slide = SLIDES[index];

  return (
    <section className="range" id="gamma" ref={root}>
      <div className="container rg-grid">
        <div className="rg-copy">
          <span className="rg-badge">La gamma Mèmo</span>
          <h2 className="rg-title">
            Tutti i giorni,
            <br />
            <span>una buona abitudine.</span>
          </h2>
          <p>
            Quattro barrette per lo spuntino di ogni giorno e l'<strong>integratore Mèmo</strong>, in compresse masticabili gusto frutti rossi. Pochi prodotti, una sola idea: il buono che si ricorda.
          </p>
          <a href="#founder" className="btn btn--blue" data-cursor="Iscriviti">
            Entra nella lista Founder <Arrow className="btn-arrow" />
          </a>
        </div>

        <div
          className="rg-card"
          style={{ backgroundColor: SLIDES[0].bg, color: SLIDES[0].ink }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={(e) => (touchX.current = e.clientX)}
          onPointerUp={(e) => {
            if (touchX.current === null) return;
            const dx = e.clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
          }}
          role="region"
          aria-roledescription="carosello"
          aria-label="La gamma Mèmo"
        >
          <div className="rg-top">
            <span className="rg-count">
              {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <span className="rg-kind">{slide.kind}</span>
          </div>

          <div className="rg-slides" aria-live="polite">
            {SLIDES.map((s, i) => (
              <div className={`rg-slide ${s.bottle ? "is-bottle" : ""}`} key={s.id} aria-hidden={i !== index}>
                <div className="rg-stage">
                  <img className="rg-product" src={s.img} alt={`Mèmo ${s.name}`} width={s.bottle ? 544 : 820} height={s.bottle ? 900 : 262} loading="lazy" draggable={false} />
                </div>
                <div className="rg-caption">
                  <h3>{s.name}</h3>
                  <p>{s.line}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rg-controls">
            <div className="rg-dots">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  className={i === index ? "is-active" : ""}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Mostra ${s.name}`}
                  aria-current={i === index}
                >
                  {i === index && autoplay && <i style={{ animationDuration: `${AUTOPLAY_MS}ms` }} key={index} />}
                </button>
              ))}
            </div>
            <div className="rg-arrows">
              <button onClick={prev} aria-label="Prodotto precedente">
                <Arrow className="rg-arrow rg-arrow--prev" />
              </button>
              <button onClick={next} aria-label="Prodotto successivo">
                <Arrow className="rg-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
