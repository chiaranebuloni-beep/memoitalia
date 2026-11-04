"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { Arrow, Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export default function Flavors({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();
  const stRef = useRef<ScrollTrigger | null>(null);
  // salto diretto a un gusto dai bottoni: durante il salto l'aggancio automatico è sospeso
  const jumpRef = useRef({ start: () => {}, end: (_i: number) => {} });

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

        // Gusto su cui ci si è fermati: ogni gesto di scroll porta solo al gusto accanto.
        let idx = 0;
        let jumping = false;
        const step = 1 / (n - 1);
        // quanto bisogna scorrere prima di cambiare gusto: di più col dito, così un tocco leggero
        // o uno scroll accidentale riporta al gusto attuale invece di passare al successivo
        const touch = window.matchMedia("(pointer: coarse)").matches;
        const threshold = step * (touch ? 0.3 : 0.2);

        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 1) * 1.1}`,
            pin: true,
            scrub: 0.5,
            // basta un colpo di rotellina: lo scroll va da solo al gusto successivo (o precedente),
            // con barretta e testi già al loro posto
            snap: {
              snapTo: (v: number) => {
                if (jumping) return v;
                const d = v - idx * step;
                if (Math.abs(d) < threshold) return idx * step;
                return Math.max(0, Math.min(n - 1, idx + Math.sign(d))) * step;
              },
              duration: { min: 0.6, max: 0.9 },
              ease: "power2.inOut",
              delay: touch ? 0.18 : 0.1,
              inertia: false,
              onComplete: (self) => {
                idx = Math.round(self.progress * (n - 1));
              },
            },
            onEnter: () => (idx = 0),
            onEnterBack: () => (idx = n - 1),
            onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
          },
        });
        stRef.current = tl.scrollTrigger ?? null;
        jumpRef.current = {
          start: () => (jumping = true),
          end: (i: number) => {
            if (!jumping) return;
            idx = i;
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
    window.setTimeout(() => jumpRef.current.end(i), 1300);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const onAdd = (p: Product) => {
    add(p.id);
    setAdded(p.id);
    window.setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1600);
  };

  return (
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
          <a href="/shop" className="fl-shop" data-cursor="Shop">
            Vai allo shop <Arrow className="btn-arrow" />
          </a>
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
            <a className="fl-info" href={`/shop#info-${p.id}`} tabIndex={active === i ? 0 : -1}>
              Ingredienti e valori nutrizionali <Arrow className="btn-arrow" />
            </a>
            <div className="fl-buy">
              <span className="fl-price">{formatPrice(p.priceCents)}</span>
              <button className={`btn btn--accent ${added === p.id ? "is-added" : ""}`} onClick={() => onAdd(p)} tabIndex={active === i ? 0 : -1} data-cursor="Aggiungi">
                {added === p.id ? "Aggiunta!" : "Aggiungi al carrello"}
              </button>
            </div>
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
  );
}
