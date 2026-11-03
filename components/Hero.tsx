"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { launchDateLabel } from "@/lib/launch";
import { SplitChars, Swoosh, Arrow, Star } from "./ui";
import Countdown from "./Countdown";
import HeroSignup from "./HeroSignup";

gsap.registerPlugin(ScrollTrigger);

// Le quattro barrette dritte, una dietro l'altra: dalla più lontana (in alto, piccola)
// alla più vicina (in basso, grande), come in una vetrina.
const BARS = [
  { src: "/img/products/gianduia.webp", name: "Gianduia" },
  { src: "/img/products/arachide.webp", name: "Arachide" },
  { src: "/img/products/cocco.webp", name: "Cocco" },
  { src: "/img/products/golosa.webp", name: "Golosa" },
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
          .from(".hero-bar-scroll", { yPercent: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.2)
          .from(".hero-launch > *", { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.4)
          .from(".cd-unit", { y: 40, rotateX: -60, opacity: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.6)" }, 0.5);

        const start = () => intro.play();
        if (window.__memoIntroDone) start();
        else window.addEventListener("memo:intro-done", start, { once: true });
        const safety = window.setTimeout(start, 4500);

        gsap.to(".hero-stack-float", { y: -12, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".hero-swoosh", { rotate: 6, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

        let onMove: ((e: PointerEvent) => void) | null = null;
        if (window.matchMedia("(min-width: 1081px)").matches) {
          const movers = gsap.utils.toArray<HTMLElement>(".hero-bar-move").map((el) => ({
            x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
          }));
          onMove = (e: PointerEvent) => {
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
            .to(".hero-bar-scroll", { yPercent: (i) => -(3 - i) * 45, ease: "none" }, 0)
            .to(".hero-copy", { yPercent: -12, opacity: 0.3, ease: "none" }, 0);
        }

        return () => {
          window.clearTimeout(safety);
          if (onMove) window.removeEventListener("pointermove", onMove);
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
          <span className="hero-kicker"><span className="hk-more">Lista Founder aperta · </span>Lo shop apre il {launchDateLabel}</span>
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

        <div className="hero-copy hero-body hero-launch">
          <p className="hero-launch-title">Lo shop apre tra</p>
          <Countdown />
          <p className="hero-launch-text">
            Entra nella lista Founder: <strong>prezzo riservato</strong> e <strong>box con tutti e 4 i gusti</strong>.
          </p>
          <HeroSignup />
          <div className="hero-launch-foot">
            <a href="#gusti" className="hero-link" data-cursor="Scopri">
              Intanto scopri i gusti <Arrow className="btn-arrow" />
            </a>
            <ul className="hero-tags">
              <li><Star className="tag-star" /> Senza glutine</li>
              <li><Star className="tag-star" /> Senza lattosio</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
