"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useCart } from "./CartProvider";
import { Star } from "./ui";

const NAV = [
  { href: "#gusti", label: "Gusti" },
  { href: "#visione", label: "Visione" },
  { href: "#momenti", label: "Momenti" },
  { href: "#storia", label: "Storia" },
];

export default function Header() {
  const { count, setOpen, bump } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!bump || !badge.current) return;
    gsap.fromTo(badge.current, { scale: 1.8, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, [bump]);

  return (
    <>
      <div className="topbar" aria-label="Novità">
        <div className="topbar-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="topbar-group" key={k} aria-hidden={k > 0}>
              <span>Lista Founder aperta: prezzo riservato + box con tutti e 4 i gusti</span>
              <Star className="topbar-star" />
              <span>Spedizioni in tutta Italia</span>
              <Star className="topbar-star" />
              <span>Ci trovi anche da Conad Cavriago e Reggio Emilia</span>
              <Star className="topbar-star" />
            </div>
          ))}
        </div>
      </div>

      <header className={`header ${scrolled ? "is-scrolled" : ""} ${hidden && !menu ? "is-hidden" : ""}`}>
        <a href="#top" className="header-logo" aria-label="Mèmo, torna all'inizio">
          <img src="/img/brand/logo.png" alt="Mèmo, il buono memorabile" width={190} height={52} />
        </a>

        <nav className={`header-nav ${menu ? "is-open" : ""}`} aria-label="Principale">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="header-link">
              <span className="hl-mask">
                <span data-text={n.label}>{n.label}</span>
              </span>
            </a>
          ))}
          <a href="#founder" className="header-link header-link--mobile" onClick={() => setMenu(false)}>
            <span className="hl-mask">
              <span data-text="Lista Founder">Lista Founder</span>
            </span>
          </a>
        </nav>

        <div className="header-actions">
          <a href="#founder" className="btn btn--blue btn--sm header-cta" data-cursor="Iscriviti">
            Lista Founder
          </a>
          <button className="cart-btn" onClick={() => setOpen(true)} aria-label={`Apri il carrello, ${count} articoli`} data-cursor="Carrello">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Zm4 0V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="cart-count" ref={badge}>{count}</span>
          </button>
          <button className={`burger ${menu ? "is-open" : ""}`} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}
