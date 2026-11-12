"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCart } from "./CartProvider";
import { SHOP_OPEN } from "@/lib/shop";
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
  photo?: boolean;
  // punto della foto da tenere al centro quando la card la ritaglia
  focus?: string;
};

// Solo l'integratore: confezione, famiglia e gusto.
const SLIDES: Slide[] = [
  {
    id: "vitamine",
    kind: "Integratore alimentare",
    name: "Vitamine D3, K2, C",
    line: "Compresse masticabili a base di vitamine D3, K2 e C.",
    img: "/img/products/integratore.webp",
    bg: "#0b4ea2",
    ink: "#ffffff",
  },
  {
    id: "famiglia",
    kind: "Per tutta la famiglia",
    name: "Grandi e piccoli",
    line: "Masticabile, pensato apposta anche per i più piccoli*.",
    img: "/img/photos/famiglia-integratore.webp",
    bg: "#0b4ea2",
    ink: "#ffffff",
    photo: true,
    focus: "50% 38%",
  },
  {
    id: "gusto",
    kind: "Gusto",
    name: "Frutti rossi",
    line: "Un gusto che piace a grandi e piccoli.",
    img: "/img/photos/frutti-rossi-card.webp",
    bg: "#07326f",
    ink: "#ffffff",
    photo: true,
  },
];

const ALT: Record<string, string> = {
  vitamine: "Integratore Mèmo vitamine D3, K2 e C",
  famiglia: "Una famiglia sorridente attorno al flacone dell'integratore Mèmo",
  gusto: "Frutti rossi: lamponi, more e mirtilli",
};

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
  const { add } = useCart();
  const [added, setAdded] = useState(false);

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
      .to(out.querySelector(".rg-media"), { xPercent: -70 * dir, rotate: -12 * dir, opacity: 0, duration: 0.55 }, 0)
      .to(out.querySelectorAll(".rg-caption > *"), { y: -16, opacity: 0, duration: 0.3, stagger: 0.03 }, 0)
      .set(out, { autoAlpha: 0 }, 0.55)
      .set(inn, { autoAlpha: 1 }, 0.2)
      .fromTo(
        inn.querySelector(".rg-media"),
        { xPercent: 70 * dir, rotate: 12 * dir, opacity: 0 },
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
    <section className="range" id="integratore" ref={root}>
      <div className="container rg-grid">
        <div className="rg-copy">
          <span className="rg-badge">Integratore Mèmo</span>
          <h2 className="rg-title">
            Tutti i giorni,
            <br />
            <span>una buona abitudine.</span>
          </h2>
          <p>
            Accanto alle barrette c'è l'<strong>integratore Mèmo</strong>: 60 compresse masticabili a base di vitamine D3, K2 e C, gusto frutti rossi, per tutta la famiglia: anche per i più piccoli*, dai 3 anni in su. La <strong>vitamina D</strong> è fondamentale per la salute di tutta la famiglia e la <strong>vitamina C</strong> contribuisce a fortificare il sistema immunitario.
          </p>
          <ul className="rg-facts">
            <li>Vitamine D3, K2, C</li>
            <li>60 compresse masticabili</li>
            <li>Gusto frutti rossi</li>
          </ul>
          <p className="rg-price">
            Prezzo <strong>19,90 €</strong>
          </p>
          {SHOP_OPEN && (
          <div className="rg-actions">
            <button
              className={`btn btn--blue ${added ? "is-added" : ""}`}
              onClick={() => {
                add("integratore");
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1600);
              }}
              data-cursor="Aggiungi"
            >
              {added ? "Aggiunto!" : "Aggiungi al carrello"}
            </button>
            <a href="/shop/integratore" className="rg-shop" data-cursor="Shop">
              Vai allo shop <Arrow className="btn-arrow" />
            </a>
          </div>
          )}
          <p className="rg-legal">
            *Per l&apos;uso al di sotto dei 12 anni, si consiglia di consultare il medico.
            <br />
            Gli integratori alimentari non vanno intesi quali sostituti di una dieta variata, equilibrata e uno stile di vita sano.
          </p>
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
          aria-label="Integratore Mèmo"
        >
          <div className="rg-top">
            <span className="rg-count">
              {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <span className="rg-kind">{slide.kind}</span>
          </div>

          <div className="rg-slides" aria-live="polite">
            {SLIDES.map((s, i) => (
              <div className={`rg-slide ${s.photo ? "is-photo" : ""}`} key={s.id} aria-hidden={i !== index}>
                <div className="rg-stage">
                  <img
                    className={`rg-media ${s.photo ? "rg-photo" : "rg-product"}`}
                    src={s.img}
                    alt={ALT[s.id]}
                    width={s.photo ? 1080 : 544}
                    height={s.photo ? 1350 : 900}
                    style={s.focus ? { objectPosition: s.focus } : undefined}
                    loading="lazy"
                    draggable={false}
                  />
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
                  <span className="rg-dot">
                    {i === index && autoplay && <i style={{ animationDuration: `${AUTOPLAY_MS}ms` }} key={index} />}
                  </span>
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
