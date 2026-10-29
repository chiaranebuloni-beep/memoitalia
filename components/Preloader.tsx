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
      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLElement>(".pre-count");
      const tl = gsap.timeline({
        onComplete: () => {
          window.__lenis?.start();
          finish();
        },
      });
      tl.from(".pre-mascot", { yPercent: 120, rotate: -18, duration: 0.9, ease: "back.out(1.6)" })
        .from(".pre-logo", { yPercent: 110, duration: 0.7, ease: "power4.out" }, "-=0.55")
        .to(counter, {
          v: 100,
          duration: 0.9,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, 0.2)
        .to(".pre-mascot", { rotate: 8, yoyo: true, repeat: 1, duration: 0.18, ease: "sine.inOut" }, "-=0.4")
        .to(".pre-inner", { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.1")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.25");
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div className="preloader" ref={root} aria-hidden>
      <div className="pre-inner">
        <img className="pre-mascot" src="/img/brand/mascot.webp" alt="" width={220} height={236} />
        <div className="pre-logo-mask">
          <img className="pre-logo" src="/img/brand/logo-white.png" alt="" width={420} height={120} />
        </div>
        <span className="pre-count">000</span>
      </div>
    </div>
  );
}
