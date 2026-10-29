"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Swoosh, Arrow } from "./ui";

gsap.registerPlugin(ScrollTrigger);

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

const FAN = [
  { src: "/img/products/golosa.webp", r: -34 },
  { src: "/img/products/cocco.webp", r: -16 },
  { src: "/img/products/arachide.webp", r: 2 },
  { src: "/img/products/gianduia.webp", r: 20 },
];

export default function FounderBox() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [phone, setPhone] = useState("");

  const { contextSafe } = useGSAP(
    () => {
      // Posizione finale "a ventaglio" delle quattro barrette.
      gsap.set(".fb-fan-bar", {
        transformOrigin: "18% 80%",
        rotate: (i) => FAN[i].r,
        xPercent: (i) => (i - 1.5) * 5,
        yPercent: (i) => (i - 1.5) * 22,
      });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".fb-fan", start: "top 85%", end: "center 45%", scrub: 0.8 } });
        tl.from(".fb-fan-bar", { rotate: 0, xPercent: 0, yPercent: 0, stagger: 0.04, ease: "power2.out" }, 0)
          .from(".fb-box-label", { scale: 0, rotate: -30, ease: "back.out(2)" }, 0.4);
        gsap.from(".fb-copy > *", {
          y: 50,
          opacity: 0,
          stagger: 0.07,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fb-copy", start: "top 80%" },
        });
        gsap.to(".fb-mascot", { y: -12, rotate: 3, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: root }
  );

  const celebrate = contextSafe(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".fb-mascot", { y: 0 }, { y: -80, duration: 0.35, yoyo: true, repeat: 3, ease: "power2.out" });
    gsap.utils.toArray<HTMLElement>(".fb-burst svg").forEach((el, i) => {
      const a = (i / 12) * Math.PI * 2;
      gsap.fromTo(
        el,
        { x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 },
        { x: Math.cos(a) * 220, y: Math.sin(a) * 180, scale: 1, rotate: gsap.utils.random(-180, 180), opacity: 0, duration: 1.4, ease: "expo.out" }
      );
    });
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          whatsappConsent: fd.get("whatsapp") === "on",
          privacy: fd.get("privacy") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Qualcosa non ha funzionato, riprova." });
        return;
      }
      setStatus({
        kind: "ok",
        message: data.alreadyIn ? "Sei già nella lista Founder: ci sentiamo al lancio!" : "Benvenuto tra i Founder! Ti scriviamo noi il giorno del lancio.",
      });
      celebrate();
    } catch {
      setStatus({ kind: "error", message: "Connessione assente, riprova tra un attimo." });
    }
  }

  return (
    <section className="founder" id="founder" ref={root}>
      <Swoosh className="fb-bg-swoosh" />
      <div className="container fb-grid">
        <div className="fb-copy">
          <span className="eyebrow eyebrow--light">Lista Founder</span>
          <h2 className="fb-title">
            Assaggiali tutti, <span className="fb-title-hl">prima di tutti.</span>
          </h2>
          <p className="fb-lead">
            Davanti a un gusto nuovo la domanda è sempre la stessa: <em>«mi piacerà?»</em>. Iscriviti alla lista Founder: avrai un <strong>prezzo riservato</strong> e il <strong>box degustazione</strong> con tutti e 4 i gusti. Il giorno del lancio ti scriviamo noi.
          </p>

          {status.kind === "ok" ? (
            <div className="fb-success" role="status">
              <strong>Fatto!</strong>
              <p>{status.message}</p>
            </div>
          ) : (
            <form className="fb-form" onSubmit={onSubmit} noValidate>
              <div className="fb-row">
                <label className="field">
                  <span>Nome</span>
                  <input name="name" autoComplete="given-name" required placeholder="Come ti chiami?" />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" required placeholder="nome@email.it" />
                </label>
              </div>
              <label className="field">
                <span>WhatsApp (facoltativo)</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+39 333 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              {phone.trim() && (
                <label className="check">
                  <input type="checkbox" name="whatsapp" />
                  <span>Acconsento a ricevere su WhatsApp l'accesso riservato al lancio e comunicazioni Mèmo.</span>
                </label>
              )}
              <label className="check">
                <input type="checkbox" name="privacy" required />
                <span>
                  Ho letto l'<a href="#privacy">informativa privacy</a> e voglio ricevere novità da Mèmo.
                </span>
              </label>
              <button className="btn btn--white btn--lg" disabled={status.kind === "sending"} data-cursor="Dai!">
                {status.kind === "sending" ? "Un attimo…" : "Voglio essere Founder"} <Arrow className="btn-arrow" />
              </button>
              {status.kind === "error" && (
                <p className="fb-error" role="alert">
                  {status.message}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="fb-visual">
          <div className="fb-fan" aria-hidden>
            {FAN.map((b, i) => (
              <img
                key={b.src}
                className="fb-fan-bar"
                src={b.src}
                alt=""
                width={820}
                height={262}
                style={{ zIndex: i }}
              />
            ))}
            <span className="fb-box-label">
              Box
              <br />
              4 gusti
            </span>
          </div>
          <div className="fb-burst" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <Swoosh key={i} />
            ))}
          </div>
          <img className="fb-mascot" src="/img/brand/mascot.webp" alt="La mascotte Mèmo festeggia" width={420} height={452} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
