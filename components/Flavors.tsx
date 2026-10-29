"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export default function Flavors({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();
  const stRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".fl-panel");
        const n = panels.length;

        gsap.set(panels.slice(1), { autoAlpha: 0 });
        gsap.set(panels.slice(1).map((p) => p.querySelector(".fl-bar")), { xPercent: 90, rotate: 35, scale: 0.7 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 0.3)}`,
            pin: true,
            scrub: 0.8,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut", delay: 0.05 },
            onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
          },
        });
        stRef.current = tl.scrollTrigger ?? null;

        panels.forEach((panel, i) => {
          if (i === 0) return;
          const prev = panels[i - 1];
          const at = i - 1;
          tl.to(root.current, { backgroundColor: products[i].theme.bg, color: products[i].theme.ink, duration: 1 }, at)
            .to(prev.querySelector(".fl-bar"), { xPercent: -110, rotate: -30, scale: 0.7, duration: 1 }, at)
            .to(prev.querySelectorAll(".fl-copy > *"), { y: -60, autoAlpha: 0, stagger: 0.04, duration: 0.5 }, at)
            .to(prev.querySelector(".fl-giant"), { xPercent: -30, autoAlpha: 0, duration: 1 }, at)
            .set(prev, { autoAlpha: 0 }, at + 1)
            .set(panel, { autoAlpha: 1 }, at + 0.35)
            .to(panel.querySelector(".fl-bar"), { xPercent: 0, rotate: 0, scale: 1, duration: 1 }, at)
            .from(panel.querySelectorAll(".fl-copy > *"), { y: 70, autoAlpha: 0, stagger: 0.05, duration: 0.55 }, at + 0.45)
            .from(panel.querySelector(".fl-giant"), { xPercent: 30, autoAlpha: 0, duration: 1 }, at);
        });

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
        <span className="eyebrow">I gusti · 4 barrette, una sola identità</span>
        <span className="fl-counter">
          <b>{String(active + 1).padStart(2, "0")}</b> / {String(products.length).padStart(2, "0")}
        </span>
      </div>

      {products.map((p, i) => (
        <article className={`fl-panel ${active === i ? "is-active" : ""}`} key={p.id} aria-hidden={active !== i} style={{ "--accent": p.theme.accent } as React.CSSProperties}>
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
