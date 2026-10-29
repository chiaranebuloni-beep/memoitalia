"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitChars, Swoosh, Arrow, Star } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const BARS = [
  { src: "/img/products/golosa.webp", cls: "hb-1", depth: 1.4, rot: -18 },
  { src: "/img/products/cocco.webp", cls: "hb-2", depth: 0.8, rot: 14 },
  { src: "/img/products/arachide.webp", cls: "hb-3", depth: 1.1, rot: 22 },
  { src: "/img/products/gianduia.webp", cls: "hb-4", depth: 0.6, rot: -9 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        intro
          .from(".hero-swoosh", { scale: 0.4, rotate: -40, opacity: 0, duration: 1.4, ease: "expo.out" }, 0)
          .from(".hero-title .split-char", { yPercent: 115, rotate: 12, duration: 0.9, stagger: 0.025 }, 0)
          .from(".hero-bar", { scale: 0, rotate: (i) => BARS[i].rot * 3, duration: 1, stagger: 0.07, ease: "back.out(1.5)" }, 0.2)
          .from(".hero-mascot", { yPercent: 70, xPercent: 20, rotate: 20, opacity: 0, duration: 0.9, ease: "back.out(1.4)" }, 0.35)
          .from(".hero-sub, .hero-ctas > *, .hero-tags li", { y: 30, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.5);

        const start = () => intro.play();
        if (window.__memoIntroDone) start();
        else window.addEventListener("memo:intro-done", start, { once: true });
        // Rete di sicurezza: se l'evento non arriva, l'intro parte comunque.
        const safety = window.setTimeout(start, 4500);

        // Barrette che fluttuano.
        gsap.utils.toArray<HTMLElement>(".hero-bar-float").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 18 : -18, rotate: i % 2 ? 3 : -3, duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });
        gsap.to(".hero-mascot-bob", { y: -14, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-swoosh", { rotate: 8, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });

        // Parallasse col mouse.
        const bars = gsap.utils.toArray<HTMLElement>(".hero-bar");
        const movers = bars.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m, i) => {
            m.x(nx * 60 * BARS[i].depth);
            m.y(ny * 40 * BARS[i].depth);
          });
        };
        window.addEventListener("pointermove", onMove);

        // All'uscita le barrette si aprono e il titolo si allontana.
        const out = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        out
          .to(".hero-title", { yPercent: -30, scale: 0.92, opacity: 0.2, ease: "none" }, 0)
          .to(".hb-1 .hero-bar-scroll", { xPercent: -60, yPercent: -80, rotate: -40, ease: "none" }, 0)
          .to(".hb-2 .hero-bar-scroll", { xPercent: 70, yPercent: -90, rotate: 40, ease: "none" }, 0)
          .to(".hb-3 .hero-bar-scroll", { xPercent: -50, yPercent: 60, rotate: 60, ease: "none" }, 0)
          .to(".hb-4 .hero-bar-scroll", { xPercent: 60, yPercent: 70, rotate: -30, ease: "none" }, 0)
          .to(".hero-mascot", { yPercent: 40, ease: "none" }, 0);

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

      <div className="hero-stage">
        <h1 className="hero-title">
          <span className="hero-line">
            <SplitChars text="Il buono" />
          </span>
          <span className="hero-line hero-line--big">
            <SplitChars text="memorabile" />
          </span>
        </h1>

        {BARS.map((b, i) => (
          <div className={`hero-bar ${b.cls}`} key={b.cls} style={{ zIndex: i === 1 || i === 3 ? 1 : 3 }}>
            <div className="hero-bar-scroll">
              <div className="hero-bar-float">
                <img src={b.src} alt="" width={820} height={262} style={{ rotate: `${b.rot}deg` }} />
              </div>
            </div>
          </div>
        ))}

        <div className="hero-mascot">
          <div className="hero-mascot-bob">
            <img src="/img/brand/mascot.webp" alt="Mèmo, l'elefantino mascotte, saluta con lo zaino in spalla" width={420} height={452} />
          </div>
          <span className="hero-bubble">Ciao! Sono Mèmo</span>
        </div>
      </div>

      <div className="hero-bottom">
        <p className="hero-sub">
          La barretta <strong>dolce per natura</strong>. Pochi ingredienti, zero edulcoranti e un gusto che ti ricordi. A scuola, in ufficio, in campo.
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
          <li><Star className="tag-star" /> Made in Italy</li>
        </ul>
      </div>

      <a href="#gusti" className="hero-scroll" aria-label="Scorri ai gusti">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
