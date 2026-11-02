"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "./CartProvider";

// Barra fissa in basso, solo su mobile e solo nello shop: quanti articoli e quanto si spende.
export default function ShopCartBar() {
  const { count, totalCents, open, setOpen, bump } = useCart();
  const total = useRef<HTMLElement>(null);
  const icon = useRef<HTMLSpanElement>(null);
  const visible = count > 0 && !open;

  // a ogni aggiunta totale e icona fanno un piccolo salto
  useEffect(() => {
    if (!bump || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(total.current, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" });
    gsap.fromTo(icon.current, { rotate: -18 }, { rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, [bump]);

  return (
    <>
      {/* spazio in fondo alla pagina, così la barra non copre footer e pulsanti */}
      <div className={`sh-cartbar-space ${count > 0 ? "is-on" : ""}`} aria-hidden />
      <div className={`sh-cartbar ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
        <span className="sh-cartbar-icon" ref={icon}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Zm4 0V6a3 3 0 0 1 6 0v2" />
          </svg>
          <b>{count}</b>
        </span>
        <span className="sh-cartbar-text">
          <small>{count === 1 ? "1 articolo" : `${count} articoli`}</small>
          <strong ref={total}>{formatPrice(totalCents)}</strong>
        </span>
        <button className="btn btn--white btn--sm" onClick={() => setOpen(true)} tabIndex={visible ? 0 : -1}>
          Vedi carrello
        </button>
      </div>
    </>
  );
}
