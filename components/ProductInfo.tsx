"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/catalog";
import { Pending } from "./ui";

// Righe della tabella nutrizionale (dichiarazione obbligatoria, Reg. UE 1169/2011).
const NUTRITION = ["Energia", "Grassi", "di cui acidi grassi saturi", "Carboidrati", "di cui zuccheri", "Fibre", "Proteine", "Sale"];
const VITAMINS = ["Vitamina C", "Vitamina D", "Vitamina K"];

// Pannello laterale con le informazioni di etichetta di un prodotto, da leggere prima dell'acquisto.
export default function ProductInfo({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const open = !!product;
  const supplement = product?.kind === "integratore";

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`drawer pi ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer-panel pi-panel" role="dialog" aria-modal="true" aria-label={product ? `Ingredienti e valori nutrizionali di ${product.name}` : undefined}>
        <div className="drawer-head">
          <h2>{product?.name}</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Chiudi">
            ×
          </button>
        </div>
        {product && (
          <div className="pi-body" data-lenis-prevent>
            <div className="pi-thumb" style={{ background: product.theme.bg }}>
              <img src={product.image} alt="" width={supplement ? 544 : 820} height={supplement ? 900 : 262} className={supplement ? "is-bottle" : ""} />
            </div>

            <section>
              <h3>Ingredienti</h3>
              <Pending block />
            </section>

            <section>
              <h3>Allergeni</h3>
              <p className="pi-note">Gli allergeni saranno evidenziati in grassetto nell&apos;elenco degli ingredienti.</p>
              <Pending block />
            </section>

            {supplement ? (
              <section>
                <h3>Per dose giornaliera</h3>
                <table className="pi-table">
                  <thead>
                    <tr>
                      <th scope="col">Componente</th>
                      <th scope="col">Per dose</th>
                      <th scope="col">% VNR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VITAMINS.map((v) => (
                      <tr key={v}>
                        <th scope="row">{v}</th>
                        <td>—</td>
                        <td>—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pending block>Valori per dose: in attesa dei dati del cliente</Pending>
              </section>
            ) : (
              <section>
                <h3>Valori nutrizionali</h3>
                <table className="pi-table">
                  <thead>
                    <tr>
                      <th scope="col"> </th>
                      <th scope="col">Per 100 g</th>
                      <th scope="col">Per barretta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NUTRITION.map((n) => (
                      <tr key={n} className={n.startsWith("di cui") ? "is-sub" : ""}>
                        <th scope="row">{n}</th>
                        <td>—</td>
                        <td>—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pending block>Valori nutrizionali: in attesa dei dati del cliente</Pending>
              </section>
            )}

            <section>
              <dl className="pi-facts">
                <div>
                  <dt>{supplement ? "Contenuto" : "Peso netto"}</dt>
                  <dd>{supplement ? "60 compresse" : <Pending />}</dd>
                </div>
                {supplement && (
                  <div>
                    <dt>Dose giornaliera</dt>
                    <dd>
                      <Pending />
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Conservazione</dt>
                  <dd>
                    <Pending />
                  </dd>
                </div>
                <div>
                  <dt>Prodotto da</dt>
                  <dd>
                    <Pending />
                  </dd>
                </div>
              </dl>
            </section>

            {supplement && (
              <section>
                <h3>Avvertenze</h3>
                <p className="pi-note">
                  Gli integratori non vanno intesi come sostituti di una dieta varia ed equilibrata e di uno stile di vita sano.
                </p>
                <Pending block />
              </section>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
