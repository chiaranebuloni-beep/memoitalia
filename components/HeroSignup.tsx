"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { PRIVACY_URL } from "@/lib/legal";

type Status = { kind: "idle" | "sending" | "ok" | "error"; title?: string; message?: string; field?: "email" | "privacy" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Iscrizione veloce ad "Avvisami al lancio" direttamente dalla hero: solo email e consenso.
export default function HeroSignup() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // A ogni clic l'avviso riparte, così si vede una risposta anche se il messaggio è lo stesso.
  const [attempt, setAttempt] = useState(0);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Su finestre basse l'avviso può finire sotto il bordo dello schermo: lo portiamo in vista.
  useEffect(() => {
    if (status.kind !== "error" || !errorRef.current) return;
    const overflow = errorRef.current.getBoundingClientRect().bottom + 16 - window.innerHeight;
    if (overflow <= 0) return;
    if (window.__lenis) window.__lenis.scrollTo(window.scrollY + overflow);
    else window.scrollBy({ top: overflow, behavior: "smooth" });
  }, [status, attempt]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setAttempt((n) => n + 1);

    if (!EMAIL_RE.test(String(fd.get("email") ?? "").trim())) {
      setStatus({ kind: "error", field: "email", message: "Scrivi la tua email per ricevere l'avviso." });
      form.querySelector<HTMLInputElement>("#hs-email")?.focus();
      return;
    }
    if (fd.get("privacy") !== "on") {
      setStatus({ kind: "error", field: "privacy", message: "Manca solo la spunta qui sotto: accetta l'informativa privacy." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), privacy: fd.get("privacy") === "on", source: "hero" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Qualcosa non ha funzionato, riprova." });
        return;
      }
      setStatus({
        kind: "ok",
        title: data.alreadyIn ? "Ci sei già!" : "Congratulazioni!",
        message: data.alreadyIn ? "Sei già in squadra: a breve riceverai tutti gli aggiornamenti di Mèmo." : "Sei in squadra: a breve riceverai tutti gli aggiornamenti di Mèmo.",
      });
    } catch {
      setStatus({ kind: "error", message: "Connessione assente, riprova tra un attimo." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="hs-done" role="status">
        <strong>{status.title}</strong> {status.message}
      </div>
    );
  }

  return (
    <form className="hs" onSubmit={onSubmit} onChange={() => status.kind === "error" && setStatus({ kind: "idle" })} noValidate>
      <div className={`hs-row ${status.field === "email" ? "is-missing" : ""}`}>
        <label className="sr-only" htmlFor="hs-email">
          Email
        </label>
        <input id="hs-email" name="email" type="email" autoComplete="email" required placeholder="La tua email" />
        <button className="btn btn--white" disabled={status.kind === "sending"} data-cursor="Dai!">
          {status.kind === "sending" ? "Un attimo…" : "Avvisami"} <Arrow className="btn-arrow" />
        </button>
      </div>
      {status.kind === "error" && (
        <p className="hs-error" role="alert" ref={errorRef} key={attempt}>
          {status.message}
        </p>
      )}
      <label className={`hs-check ${status.field === "privacy" ? "is-missing" : ""}`}>
        <input type="checkbox" name="privacy" required />
        <span>
          Accetto l'<a href={PRIVACY_URL} target="_blank" rel="noopener">informativa privacy</a> e voglio ricevere novità da Mèmo.
        </span>
      </label>
    </form>
  );
}
