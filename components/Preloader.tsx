"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Letto una sola volta per caricamento pagina (React in dev monta due volte i componenti).
let seenThisLoad: boolean | null = null;
function introAlreadySeen() {
  if (seenThisLoad === null) {
    try {
      seenThisLoad = sessionStorage.getItem("memo-intro") === "1";
      sessionStorage.setItem("memo-intro", "1");
    } catch {
      seenThisLoad = false;
    }
  }
  return seenThisLoad;
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const seen = introAlreadySeen();

      const finish = () => {
        setDone(true);
        window.__memoIntroDone = true;
        window.dispatchEvent(new Event("memo:intro-done"));
      };

      if (reduce || seen) {
        finish();
        return;
      }

      window.__lenis?.stop();
      const tl = gsap.timeline({
        onComplete: () => {
          window.__lenis?.start();
          finish();
        },
      });
      tl.from(".pre-logo", { yPercent: 110, duration: 0.8, ease: "power4.out" })
        // barra di caricamento sotto il logo, larga quanto il logo: niente numeri che possano finirci sopra
        .from(".pre-bar i", { scaleX: 0, duration: 0.9, ease: "power2.inOut" }, 0.2)
        .to(".pre-inner", { yPercent: -30, opacity: 0, duration: 0.5, ease: "power3.in" }, "+=0.1")
        // il blu si apre in quattro colonne, una per gusto, che salgono una dopo l'altra
        .to(".pre-col", { yPercent: -100, duration: 0.8, stagger: 0.07, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div className="preloader" ref={root} aria-hidden>
      <div className="pre-cols">
        {[0, 1, 2, 3].map((i) => (
          <span className="pre-col" key={i} style={{ "--c": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="pre-inner">
        <div className="pre-logo-mask">
          <img className="pre-logo" src="/img/brand/logo-white.png" alt="" width={420} height={120} />
        </div>
        <span className="pre-bar">
          <i />
        </span>
      </div>
    </div>
  );
}
