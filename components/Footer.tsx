"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { SHOP_OPEN } from "@/lib/shop";
import { COOKIE_URL, PRIVACY_URL, TERMS_URL, openCookiePreferences } from "@/lib/legal";
import { Arrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ft-top > *, .ft-nav > *", {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: root }
  );

  const year = new Date().getFullYear();

  return (
    <footer className="footer" ref={root}>
      <div className="container ft-top">
        <a href="/#top" className="ft-logo" aria-label="Mèmo, torna all'inizio">
          <img src="/img/brand/logo-white.png" alt="Mèmo, il buono memorabile" width={200} height={56} loading="lazy" />
        </a>
        <a className="ft-ig" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-cursor="Instagram">
          <span className="ft-ig-icon">
            <InstagramIcon />
          </span>
          <span className="ft-ig-text">
            <small>Seguici su Instagram</small>
            <b>@{INSTAGRAM_HANDLE}</b>
          </span>
          <Arrow className="ft-ig-arrow" />
        </a>
      </div>

      <div className="container ft-nav">
        {SHOP_OPEN ? (
          <nav className="ft-col" aria-label="Shop">
            <h3>Shop</h3>
            <a href="/shop">Tutti i prodotti</a>
            <a href="/shop/barrette#golosa">Golosa</a>
            <a href="/shop/barrette#cocco">Cocco</a>
            <a href="/shop/barrette#arachide">Arachide</a>
            <a href="/shop/barrette#gianduia">Gianduia</a>
            <a href="/shop/integratore">Integratore</a>
          </nav>
        ) : (
          <nav className="ft-col" aria-label="Prodotti">
            <h3>Prodotti</h3>
            <a href="/#gusti">Golosa</a>
            <a href="/#gusti">Cocco</a>
            <a href="/#gusti">Arachide</a>
            <a href="/#gusti">Gianduia</a>
            <a href="/#integratore">Integratore</a>
          </nav>
        )}
        <nav className="ft-col" aria-label="Mèmo">
          <h3>Mèmo</h3>
          <a href="/chi-siamo">Chi siamo</a>
          <a href="/faq">Domande frequenti</a>
          <a href="/#founder">Avvisami al lancio</a>
        </nav>
        <div className="ft-col ft-col--contact">
          <h3>Contatti</h3>
          <a className="ft-mail" href="mailto:info@memoitalia.it">
            info@memoitalia.it
          </a>
          <p>
            Via Tagliavini 10
            <br />
            Cavriago (RE)
          </p>
          <a className="ft-mini" href="/contatti">Scrivici</a>
          <a className="ft-mini" href="/contatti#rivenditori">Rivenditori e GDO</a>
          <a className="ft-mini" href="/contatti#dove-trovarci">Dove trovarci</a>
        </div>
      </div>

      <div className="container ft-legal">
        <span>© {year} MÈMO ITALIA SRLS · P.IVA 03151990359</span>
        <span className="ft-legal-links">
          <a href={PRIVACY_URL} target="_blank" rel="noopener">Privacy</a>
          <a href={COOKIE_URL} target="_blank" rel="noopener">Cookie</a>
          <button type="button" className="ft-legal-btn" onClick={openCookiePreferences}>
            Preferenze cookie
          </button>
          <a href={TERMS_URL} target="_blank" rel="noopener">Termini di vendita</a>
        </span>
        <a href="#top" className="ft-up">
          Torna su <Arrow className="ft-up-arrow" />
        </a>
      </div>
    </footer>
  );
}
