"use client";

import { useState } from "react";
import { Arrow } from "./ui";
import { PRIVACY_URL } from "@/lib/legal";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; message: string };

const BUSINESSES = ["Supermercato / GDO", "Negozio di alimentari", "Bar o caffetteria", "Palestra o club sportivo", "Altro"];

// Un solo modulo per due usi: messaggi dei privati e richieste dei rivenditori.
export default function ContactForm({ kind }: { kind: "privato" | "rivenditore" }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const shop = kind === "rivenditore";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          company: fd.get("company"),
          business: fd.get("business"),
          city: fd.get("city"),
          message: fd.get("message"),
          privacy: fd.get("privacy") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) return setStatus({ kind: "error", message: data.error ?? "Qualcosa non ha funzionato, riprova." });
      setStatus({ kind: "ok" });
    } catch {
      setStatus({ kind: "error", message: "Connessione assente, riprova tra un attimo." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="cf-done" role="status">
        <strong>Messaggio arrivato!</strong>
        <p>{shop ? "Grazie per l'interesse: ti ricontattiamo per parlarne insieme." : "Grazie, ti rispondiamo il prima possibile."}</p>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {shop && (
        <div className="cf-row">
          <label className="cf-field">
            <span>Nome dell&apos;attività</span>
            <input name="company" required placeholder="Es. Bar Centrale" />
          </label>
          <label className="cf-field">
            <span>Tipo di attività</span>
            <select name="business" defaultValue="">
              <option value="" disabled>
                Scegli
              </option>
              {BUSINESSES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="cf-row">
        <label className="cf-field">
          <span>{shop ? "Referente" : "Nome"}</span>
          <input name="name" autoComplete="name" required placeholder="Nome e cognome" />
        </label>
        <label className="cf-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="nome@email.it" />
        </label>
      </div>
      {shop && (
        <div className="cf-row">
          <label className="cf-field">
            <span>Telefono</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="+39 0522 000000" />
          </label>
          <label className="cf-field">
            <span>Città</span>
            <input name="city" autoComplete="address-level2" placeholder="Es. Reggio Emilia" />
          </label>
        </div>
      )}
      <label className="cf-field">
        <span>{shop ? "Messaggio (facoltativo)" : "Messaggio"}</span>
        <textarea name="message" rows={5} required={!shop} placeholder={shop ? "Raccontaci la tua attività" : "Come possiamo aiutarti?"} />
      </label>
      <label className="cf-check">
        <input type="checkbox" name="privacy" required />
        <span>
          Ho letto l&apos;<a href={PRIVACY_URL} target="_blank" rel="noopener">informativa privacy</a> e acconsento al trattamento dei dati per ricevere una risposta.
        </span>
      </label>
      <button className="btn btn--blue btn--lg" disabled={status.kind === "sending"} data-cursor="Invia">
        {status.kind === "sending" ? "Un attimo…" : shop ? "Richiedi informazioni" : "Invia messaggio"} <Arrow className="btn-arrow" />
      </button>
      {status.kind === "error" && (
        <p className="cf-error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}
