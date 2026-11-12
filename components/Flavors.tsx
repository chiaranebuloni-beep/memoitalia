"use client";

import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Product } from "@/lib/catalog";
import { SHOP_OPEN } from "@/lib/shop";
import ProductInfo from "./ProductInfo";
import { Arrow, Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export default function Flavors({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // con lo shop chiuso ingredienti e valori si aprono qui, nel pannello laterale
  const [info, setInfo] = useState<Product | null>(null);
  const closeInfo = useCallback(() => setInfo(null), []);
  const stRef = useRef<ScrollTrigger | null>(null);
  // salto diretto a un gusto dai bottoni: durante il salto l'aggancio automatico è sospeso
  const jumpRef = useRef({ start: () => {}, end: () => {} });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".fl-panel");
        const n = panels.length;
        const small = window.matchMedia("(max-width: 1080px)").matches;
        const copyOut = small ? -16 : -60;
        const copyIn = small ? 16 : 70;

        // Una barretta alla volta: la vecchia esce del tutto a sinistra, poi la nuova entra da destra.
        // Niente dissolvenze incrociate, quindi le due barrette non si sovrappongono mai.
        panels.slice(1).forEach((p) => {
          gsap.set(p.querySelector(".fl-bar"), { xPercent: 150, rotate: 16, autoAlpha: 0 });
          gsap.set(p.querySelectorAll(".fl-copy > *"), { y: copyIn, autoAlpha: 0 });
          gsap.set(p.querySelector(".fl-giant"), { xPercent: 25, autoAlpha: 0 });
        });

        let jumping = false;
        const step = 1 / (n - 1);
        // quanto bisogna scorrere (in frazione del passaggio) prima di cambiare gusto: di più col dito,
        // così un tocco leggero o uno scroll accidentale riporta al gusto attuale
        const touch = window.matchMedia("(pointer: coarse)").matches;
        const threshold = touch ? 0.3 : 0.2;
        // stato dell'aggancio (vedi settle più sotto)
        let dir = 1;
        let snapping = false;
        let fingerDown = false;
        let timer = 0;
        let safety = 0;

        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 1) * 1.1}`,
            pin: true,
            scrub: 0.5,
            // quando lo scroll si ferma, la pagina si aggancia da sola al gusto più vicino nella direzione di scorrimento
            onUpdate: (self) => {
              setActive(Math.round(self.progress * (n - 1)));
              if (!snapping) dir = self.direction;
              schedule();
            },
          },
        });
        stRef.current = tl.scrollTrigger ?? null;

        // Aggancio fatto da noi tramite lo scroll morbido (Lenis), non dallo snap di GSAP:
        // lo snap di GSAP spostava la pagina per conto suo mentre Lenis inseguiva un'altra posizione,
        // e a volte la barretta restava ferma a metà o tornava indietro.
        // Quando lo scroll si ferma, si va sempre a uno dei due gusti tra cui ti trovi, nella direzione in cui scorrevi.
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const settle = () => {
          const st = tl.scrollTrigger;
          if (!st || jumping || snapping || fingerDown || !st.isActive) return;
          const pos = st.progress / step;
          const base = Math.floor(pos + 1e-6);
          const frac = pos - base;
          const target = Math.max(0, Math.min(n - 1, dir > 0 ? (frac > threshold ? base + 1 : base) : frac < 1 - threshold ? base : base + 1));
          const y = st.start + (st.end - st.start) * target * step;
          if (Math.abs(y - st.scroll()) < 2) return;
          snapping = true;
          const done = () => {
            window.clearTimeout(safety);
            snapping = false;
          };
          // se lo scroll viene interrotto (nuovo gesto), si sblocca comunque e ricontrolla la posizione
          safety = window.setTimeout(() => {
            snapping = false;
            schedule();
          }, 900);
          if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.65, easing: easeInOut, onComplete: done });
          else window.scrollTo({ top: y, behavior: "smooth" });
        };
        function schedule() {
          if (snapping) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(settle, touch ? 220 : 160);
        }
        const onTouchStart = () => {
          fingerDown = true;
          window.clearTimeout(timer);
        };
        const onTouchEnd = () => {
          fingerDown = false;
          schedule();
        };
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        jumpRef.current = {
          start: () => (jumping = true),
          end: () => {
            jumping = false;
          },
        };

        panels.forEach((panel, i) => {
          if (i === 0) return;
          const prev = panels[i - 1];
          const at = i - 1;
          const prevBar = prev.querySelector(".fl-bar");
          const bar = panel.querySelector(".fl-bar");
          tl
            // esce il gusto precedente
            .to(prevBar, { xPercent: -150, rotate: -16, duration: 0.5, ease: "power2.in" }, at)
            .set(prevBar, { autoAlpha: 0 }, at + 0.5)
            .to(prev.querySelectorAll(".fl-copy > *"), { y: copyOut, autoAlpha: 0, stagger: 0.03, duration: 0.35, ease: "power2.in" }, at)
            .to(prev.querySelector(".fl-giant"), { xPercent: -25, autoAlpha: 0, duration: 0.5 }, at)
            // il colore cambia nel momento in cui la scena è vuota
            .to(root.current, { backgroundColor: products[i].theme.bg, color: products[i].theme.ink, duration: 0.4, ease: "none" }, at + 0.3)
            // entra il gusto nuovo
            .set(bar, { autoAlpha: 1 }, at + 0.45)
            .to(bar, { xPercent: 0, rotate: 0, duration: 0.55, ease: "power2.out" }, at + 0.45)
            .to(panel.querySelector(".fl-giant"), { xPercent: 0, autoAlpha: 0.16, duration: 0.5 }, at + 0.5)
            .to(panel.querySelectorAll(".fl-copy > *"), { y: 0, autoAlpha: 1, stagger: 0.02, duration: 0.3, ease: "power2.out" }, at + 0.55);
        });

        // la durata totale coincide con il numero di passaggi, così ogni gusto sta esattamente a 1/(n-1)
        tl.set({}, {}, n - 1);

        // Movimento continuo della barretta attiva.
        gsap.utils.toArray<HTMLElement>(".fl-bar-inner").forEach((el) => {
          gsap.to(el, { y: -16, rotate: -2, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });

        return () => {
          window.clearTimeout(timer);
          window.clearTimeout(safety);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchend", onTouchEnd);
          window.removeEventListener("touchcancel", onTouchEnd);
          stRef.current = null;
        };
      });
    },
    { scope: root, dependencies: [] }
  );

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / (products.length - 1));
    jumpRef.current.start();
    // il blocco si toglie sempre, anche se il salto viene interrotto da un altro scroll
    window.setTimeout(() => jumpRef.current.end(), 1300);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
    <section
      className="flavors"
      id="gusti"
      ref={root}
      style={{ backgroundColor: products[0].theme.bg, color: products[0].theme.ink }}
      aria-label="I quattro gusti Mèmo"
    >
      <div className="fl-head">
        <span className="eyebrow">
          I gusti<span className="fl-head-more"> · 4 barrette, una sola identità</span>
        </span>
        <span className="fl-head-right">
          {SHOP_OPEN && (
            <a href="/shop" className="fl-shop" data-cursor="Shop">
              Vai allo shop <Arrow className="btn-arrow" />
            </a>
          )}
          <span className="fl-counter">
            <b>{String(active + 1).padStart(2, "0")}</b> / {String(products.length).padStart(2, "0")}
          </span>
        </span>
      </div>

      {products.map((p, i) => (
        <article className={`fl-panel ${active === i ? "is-active" : ""}`} data-flavor={p.id} key={p.id} aria-hidden={active !== i} style={{ "--accent": p.theme.accent } as React.CSSProperties}>
          <div className="fl-giant" aria-hidden>
            {p.name}
          </div>

          <div className="fl-bar">
            <div className="fl-bar-inner">
              <Swoosh className="fl-bar-swoosh" />
              <img src={p.image} alt={`Barretta Mèmo ${p.name}`} width={820} height={262} />
            </div>
          </div>

          <div className="fl-copy">
            {p.badge && <span className="fl-badge">{p.badge}</span>}
            <h2 className="fl-name">{p.name}</h2>
            <p className="fl-tagline">{p.tagline}</p>
            <p className="fl-desc">{p.description}</p>
            <ul className="fl-chips">
              <li>{p.ingredients}</li>
              <li>Senza edulcoranti</li>
              <li>Senza glutine</li>
            </ul>
            {SHOP_OPEN ? (
              <a className="fl-info" href={`/shop/barrette#info-${p.id}`} tabIndex={active === i ? 0 : -1}>
                Ingredienti e valori nutrizionali <Arrow className="btn-arrow" />
              </a>
            ) : (
              <button type="button" className="fl-info" onClick={() => setInfo(p)} tabIndex={active === i ? 0 : -1}>
                Ingredienti e valori nutrizionali <Arrow className="btn-arrow" />
              </button>
            )}
            {/* in home niente prezzi: si acquista dallo shop */}
            {SHOP_OPEN && (
              <div className="fl-buy">
                <a className="btn btn--accent" href={`/shop/barrette#${p.id}`} tabIndex={active === i ? 0 : -1} data-cursor="Shop">
                  Scopri nello shop <Arrow className="btn-arrow" />
                </a>
              </div>
            )}
          </div>
        </article>
      ))}

      <nav className="fl-dots" aria-label="Scegli gusto">
        {products.map((p, i) => (
          <button key={p.id} className={active === i ? "is-active" : ""} onClick={() => goTo(i)} aria-label={p.name} aria-current={active === i}>
            <span>{p.name}</span>
          </button>
        ))}
      </nav>
    </section>
    {!SHOP_OPEN && <ProductInfo product={info} onClose={closeInfo} />}
    </>
  );
}
