"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitChars, Swoosh, Arrow, Star } from "./ui";

gsap.registerPlugin(ScrollTrigger);

// Le quattro barrette in fila diagonale, tutte con la stessa inclinazione.
const BARS = [
  { src: "/img/products/golosa.webp", name: "Golosa" },
  { src: "/img/products/cocco.webp", name: "Cocco" },
  { src: "/img/products/arachide.webp", name: "Arachide" },
  { src: "/img/products/gianduia.webp", name: "Gianduia" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        intro
          .from(".hero-swoosh", { scale: 0.5, rotate: -30, opacity: 0, duration: 1.4, ease: "expo.out" }, 0)
          .from(".hero-kicker", { y: 20, opacity: 0, duration: 0.6 }, 0)
          .from(".hero-title .split-char", { yPercent: 115, duration: 0.9, stagger: 0.022 }, 0.05)
          .from(".hero-bar", { xPercent: 70, opacity: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }, 0.2)
          .from(".hero-sub > *, .hero-ctas > *, .hero-tags li", { y: 24, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.45);

        const start = () => intro.play();
        if (window.__memoIntroDone) start();
        else window.addEventListener("memo:intro-done", start, { once: true });
        // Rete di sicurezza: se l'evento non arriva, l'intro parte comunque.
        const safety = window.setTimeout(start, 4500);

        // Il mazzo di barrette ondeggia piano, tutto insieme.
        gsap.to(".hero-stack-float", { y: -12, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-swoosh", { rotate: 6, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

        // Su desktop: leggero effetto profondità col mouse e il mazzo che si apre scorrendo.
        if (!window.matchMedia("(min-width: 1081px)").matches) {
          return () => {
            window.clearTimeout(safety);
            window.removeEventListener("memo:intro-done", start);
          };
        }

        const bars = gsap.utils.toArray<HTMLElement>(".hero-bar-move");
        const movers = bars.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m, i) => {
            m.x(nx * (8 + i * 6));
            m.y(ny * (6 + i * 4));
          });
        };
        window.addEventListener("pointermove", onMove);

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(".hero-bar-scroll", { xPercent: (i) => 6 + i * 10, yPercent: (i) => (i - 1.5) * 18, ease: "none" }, 0)
          .to(".hero-copy", { yPercent: -12, opacity: 0.3, ease: "none" }, 0);

        return () => {
          window.clearTimeout(safety);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("memo:intro-done", start);
        };
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-bg" aria-hidden>
        <Swoosh className="hero-swoosh" />
        <div className="hero-lines" />
        <div className="hero-grain" />
      </div>

      <div className="hero-grid">
        <div className="hero-copy hero-head">
          <span className="hero-kicker">Barrette dolci per natura · Made in Italy</span>
          <h1 className="hero-title">
            <span className="hero-line">
              <SplitChars text="Il buono" />
            </span>
            <span className="hero-line hero-line--big">
              <SplitChars text="memorabile" />
            </span>
          </h1>
        </div>

        <div className="hero-visual" aria-label="Le quattro barrette Mèmo: Golosa, Cocco, Arachide e Gianduia" role="img">
          <div className="hero-stack-float">
            <div className="hero-stack">
              {BARS.map((b, i) => (
                <div className="hero-bar" key={b.name} style={{ "--i": i } as React.CSSProperties}>
                  <div className="hero-bar-scroll">
                    <div className="hero-bar-move">
                      <img src={b.src} alt="" width={820} height={262} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-copy hero-body">
          <p className="hero-sub">
            <span className="hero-sub-big">Pochi ingredienti. Zero edulcoranti.</span>
            <span className="hero-sub-small">
              Quattro gusti per lo spuntino di tutti i giorni: a scuola, in ufficio, in campo.
            </span>
          </p>
          <div className="hero-ctas">
            <a href="#gusti" className="btn btn--white" data-cursor="Scopri">
              Scegli il tuo gusto <Arrow className="btn-arrow" />
            </a>
            <a href="#founder" className="btn btn--ghost" data-cursor="Iscriviti">
              Entra nella lista Founder
            </a>
          </div>
          <ul className="hero-tags">
            <li><Star className="tag-star" /> Senza glutine</li>
            <li><Star className="tag-star" /> Senza lattosio</li>
            <li><Star className="tag-star" /> Senza derivati animali</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
