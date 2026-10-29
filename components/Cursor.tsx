"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Cursore personalizzato: solo su dispositivi con mouse.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const text = t?.dataset.cursor ?? "";
      el.classList.toggle("is-hover", Boolean(t));
      el.classList.toggle("has-label", Boolean(text));
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="cursor" ref={dot} aria-hidden>
      <span ref={label} />
    </div>
  );
}
