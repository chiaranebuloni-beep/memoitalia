"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "Esistono prodotti molto sani che nessuno sceglie, perché non sono abbastanza buoni. Mèmo parte dal contrario: prima di tutto deve essere buona.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".mf-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".mf-statement", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );

        gsap.to(".mf-frame img", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: ".mf-photo", start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(".mf-sticker", {
          rotate: 360,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });

      // "Non una barretta fit / light / proteica" → "Una barretta equilibrata":
      // la sezione si ferma, le parole scorrono come una slot, ognuna prende il timbro NO e vola via.
      const roller = (pin: string) => {
        const words = gsap.utils.toArray<HTMLElement>(".mf-roll-word");
        const nos = words.length - 1;
        const stamp = root.current!.querySelector<HTMLElement>(".mf-stamp:not(.mf-stamp--yes)")!;
        const yes = root.current!.querySelector<HTMLElement>(".mf-stamp--yes")!;
        const finalWord = words[words.length - 1];
        const windowEl = root.current!.querySelector<HTMLElement>(".mf-roll-window")!;

        gsap.set(words.slice(1), { yPercent: 110, rotateX: -50, opacity: 0 });
        gsap.set(finalWord, { scale: 0.85, transformOrigin: "0% 50%" });
        gsap.set(stamp, { opacity: 0, scale: 2.6, rotate: -40 });
        gsap.set(".mf-yes, .mf-note", { opacity: 0, y: 40 });
        gsap.set(yes, { opacity: 0, scale: 2.6, rotate: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: { trigger: pin, start: "center center", end: "+=230%", pin: true, scrub: 0.7 },
        });

        for (let i = 0; i < nos; i++) {
          const t = i * 2;
          const word = words[i];
          tl.set(stamp, { x: () => word.offsetWidth - stamp.offsetWidth * 0.35 }, t)
            .to(stamp, { opacity: 1, scale: 1, rotate: -12, duration: 0.35, ease: "back.out(2.4)" }, t + 0.25)
            .to(windowEl, { x: 10, duration: 0.05, yoyo: true, repeat: 3, ease: "none" }, t + 0.55)
            .to(word, { opacity: 0.4, duration: 0.3 }, t + 0.5)
            .to(word, { yPercent: -110, rotateX: 50, opacity: 0, duration: 0.6 }, t + 1.2)
            .to(stamp, { x: "+=120", rotate: 40, scale: 0.4, opacity: 0, duration: 0.45, ease: "power2.in" }, t + 1.1)
            .set(stamp, { y: 0, scale: 2.6, rotate: -40 }, t + 1.8)
            .to(words[i + 1], { yPercent: 0, rotateX: 0, scale: 1, opacity: 1, duration: 0.6 }, t + 1.3);
        }

        const end = nos * 2 - 0.6;
        tl.to(".mf-non", { width: 0, marginRight: 0, opacity: 0, duration: 0.5 }, end)
          .set(yes, { x: () => finalWord.offsetWidth - yes.offsetWidth * 0.3 }, end)
          .to(yes, { opacity: 1, scale: 1, rotate: 10, duration: 0.35, ease: "back.out(2.4)" }, end + 0.35)
          .to(".mf-yes", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.8)" }, end + 0.45)
          .to(".mf-note", { opacity: 1, y: 0, duration: 0.5 }, end + 0.6)
          .to({}, { duration: 0.6 });
      };

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1081px)", () => roller(".mf-grid"));
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1080px)", () => roller(".mf-nots"));
    },
    { scope: root }
  );

  return (
    <section className="manifesto" id="visione" ref={root}>
      <div className="container">
        <span className="eyebrow eyebrow--blue">01 — La visione</span>
        <p className="mf-statement">
          {STATEMENT.split(" ").map((w, i) => (
            <span className="mf-word" key={i}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mf-grid">
          <div className="mf-nots">
            <p className="sr-only">Non una barretta fit, non light, non proteica: una barretta equilibrata, pensata per la vita reale.</p>
            <div className="mf-roll" aria-hidden>
              <span className="mf-roll-lead">
                <span className="mf-non">Non</span>una barretta
              </span>
              <span className="mf-roll-window">
                {["fit.", "light.", "proteica."].map((w) => (
                  <span className="mf-roll-word" key={w}>
                    {w}
                  </span>
                ))}
                <span className="mf-roll-word mf-roll-final">equilibrata.</span>
                <span className="mf-stamp">No!</span>
                <span className="mf-stamp mf-stamp--yes">Sì!</span>
              </span>
            </div>
            <div className="mf-yes" aria-hidden>
              Pensata per la vita reale
            </div>
            <p className="mf-note">
              Carboidrati, proteine, grassi e fibre in equilibrio. Qualità senza estremismi: niente paura degli zuccheri, niente logica del prodotto perfetto.
            </p>
          </div>

          <figure className="mf-photo">
            <div className="mf-frame">
              <img src="/img/photos/morso-cocco.webp" alt="Una ragazza addenta con gusto una barretta Mèmo Cocco" width={756} height={945} loading="lazy" />
            </div>
            <div className="mf-sticker" aria-hidden>
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="mf-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#mf-circle">DOLCE PER NATURA ✦ DOLCE PER NATURA ✦ </textPath>
                </text>
              </svg>
              <img src="/img/brand/monogram.png" alt="" width={90} height={90} />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
