"use client";

import { useEffect } from "react";
import { formatPrice, products } from "@/lib/catalog";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { lines, open, setOpen, setQty, totalCents, count } = useCart();

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={() => setOpen(false)} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Carrello">
        <div className="drawer-head">
          <h2>Il tuo carrello</h2>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Chiudi carrello">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <img src="/img/brand/mascot.webp" alt="" width={160} height={172} />
            <p>Il carrello è vuoto. Mèmo ha un po' fame…</p>
            <a href="/shop" className="btn btn--blue" onClick={() => setOpen(false)}>
              Vai allo shop
            </a>
          </div>
        ) : (
          <>
            <ul className="drawer-lines">
              {lines.map((l) => {
                const p = products.find((x) => x.id === l.id);
                if (!p) return null;
                return (
                  <li key={l.id} className="drawer-line">
                    <div className={`drawer-thumb drawer-thumb--${p.kind}`} style={{ background: p.theme.bg }}>
                      <img src={p.image} alt="" width={160} height={52} />
                    </div>
                    <div className="drawer-info">
                      <strong>Mèmo {p.name}</strong>
                      <span>
                        {p.packSize ? (p.kind === "box" ? `${p.packSize} barrette, 3 per gusto · ` : `Box da ${p.packSize} barrette · `) : ""}
                        {formatPrice(p.priceCents)}
                      </span>
                    </div>
                    <div className="qty">
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Togli ${p.packSize ? "un box" : "uno"}: ${p.name}`}>−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Aggiungi ${p.packSize ? "un box" : "uno"}: ${p.name}`}>+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="drawer-foot">
              <div className="drawer-total">
                <span>Totale · {count} {count === 1 ? "articolo" : "articoli"}</span>
                <strong>{formatPrice(totalCents)}</strong>
              </div>
              <button className="btn btn--blue btn--lg btn--full" disabled>
                Checkout in arrivo
              </button>
              <p className="drawer-note">
                Lo shop apre a breve. <a href="/#founder" onClick={() => setOpen(false)}>Lascia la tua email</a> e ti avvisiamo al lancio.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
