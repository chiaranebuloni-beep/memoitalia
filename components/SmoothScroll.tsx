"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
    __memoIntroDone?: boolean;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      // dentro al banner e al pannello dei cookie di iubenda la rotellina deve far scorrere loro, non la pagina
      prevent: (node) => !!node.closest?.("#iubenda-cs-banner, #iubenda-iframe"),
    });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // "#id" e "/pagina#id" quando si è già su quella pagina: scorrimento morbido invece del salto.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -60, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    // Arrivando da un'altra pagina con un #id: il salto nativo avviene prima che le sezioni
    // fissate (pin) occupino il loro spazio, quindi si riposiziona quando il layout è pronto.
    let hashTimer = 0;
    if (location.hash.length > 1) {
      hashTimer = window.setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (!el) return;
        ScrollTrigger.refresh();
        lenis.scrollTo(el, { offset: -60, immediate: true, force: true });
      }, 450);
    }

    return () => {
      window.clearTimeout(hashTimer);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
