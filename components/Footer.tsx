"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ft-logo", {
          yPercent: 60,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        });
        gsap.from(".ft-mascot", {
          yPercent: 100,
          rotate: -15,
          ease: "back.out(1.6)",
          duration: 1,
          scrollTrigger: { trigger: ".ft-logo-wrap", start: "top 95%" },
        });
      });
    },
    { scope: root }
  );

  const year = new Date().getFullYear();

  return (
    <footer className="footer" ref={root}>
      <div className="container ft-cols">
        <div className="ft-col ft-col--wide">
          <p className="ft-claim">Ciò che è buono davvero si ricorda.</p>
          <p className="ft-retail">
            Ci trovi anche da <strong>Conad Cavriago</strong> e <strong>Conad Reggio Emilia</strong>, e negli espositori dei centri padel.
          </p>
        </div>
        <div className="ft-col">
          <h3>Shop</h3>
          <a href="#gusti">Golosa</a>
          <a href="#gusti">Cocco</a>
          <a href="#gusti">Arachide</a>
          <a href="#gusti">Gianduia</a>
          <a href="#founder">Box degustazione</a>
        </div>
        <div className="ft-col">
          <h3>Mèmo</h3>
          <a href="#visione">La visione</a>
          <a href="#founder">Lista Founder</a>
        </div>
        <div className="ft-col ft-col--contact">
          <h3>Contatti</h3>
          <a className="ft-mail" href="mailto:info@memoitalia.it">info@memoitalia.it</a>
          <span>Via Tagliavini 10, Cavriago (RE)</span>
          <span>Rivenditori e GDO: scrivici</span>
        </div>
      </div>

      <div className="ft-logo-wrap">
        <img className="ft-mascot" src="/img/brand/mascot.webp" alt="" width={420} height={452} loading="lazy" />
        <img className="ft-logo" src="/img/brand/logo-white.png" alt="Mèmo, il buono memorabile" width={1200} height={330} loading="lazy" />
      </div>

      <div className="container ft-legal">
        <span>© {year} MÈMO ITALIA SRLS · P.IVA 03151990359</span>
        <span id="privacy">
          <a href="#privacy">Privacy</a> · <a href="#cookie">Cookie</a> · <a href="#termini">Termini di vendita</a>
        </span>
      </div>
    </footer>
  );
}
