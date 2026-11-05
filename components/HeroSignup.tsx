"use client";

import { useState } from "react";
import { Arrow } from "./ui";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

// Iscrizione veloce ad "Avvisami al lancio" direttamente dalla hero: solo email e consenso.
export default function HeroSignup() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
        message: data.alreadyIn ? "Sei già iscritto!" : "Fatto! Ti avvisiamo appena apre lo shop.",
      });
    } catch {
      setStatus({ kind: "error", message: "Connessione assente, riprova tra un attimo." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="hs-done" role="status">
        <strong>Fatto!</strong> {status.message}
      </div>
    );
  }

  return (
    <form className="hs" onSubmit={onSubmit} noValidate>
      <div className="hs-row">
        <label className="sr-only" htmlFor="hs-email">
          Email
        </label>
        <input id="hs-email" name="email" type="email" autoComplete="email" required placeholder="La tua email" />
        <button className="btn btn--white" disabled={status.kind === "sending"} data-cursor="Dai!">
          {status.kind === "sending" ? "Un attimo…" : "Avvisami"} <Arrow className="btn-arrow" />
        </button>
      </div>
      <label className="hs-check">
        <input type="checkbox" name="privacy" required />
        <span>
          Accetto l'<a href="#privacy">informativa privacy</a> e voglio ricevere novità da Mèmo.
        </span>
      </label>
      {status.kind === "error" && (
        <p className="hs-error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}
