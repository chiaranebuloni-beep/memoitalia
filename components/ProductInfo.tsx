"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/catalog";
import { getLabel } from "@/lib/labels";
import { Pending } from "./ui";

// Gli allergeni sono scritti tra **asterischi** nei dati di etichetta.
function Ingredients({ text }: { text: string }) {
  return (
    <p className="pi-ingredients">
      {text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
    </p>
  );
}

const list = (items: string[]) => items.join(", ");

// Pannello laterale con le informazioni di etichetta di un prodotto, da leggere prima dell'acquisto.
export default function ProductInfo({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const open = !!product;
  const supplement = product?.kind === "integratore";
  // i dati del pannello hanno la precedenza; quelli in codice restano come riserva
  const label = product?.label?.ingredients ? product.label : product ? getLabel(product.id) : undefined;
  const local = product ? getLabel(product.id) : undefined;

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

            {supplement && local?.benefits && (
              <section>
                <h3>Tre vitamine, a cosa servono</h3>
                <div className="pi-benefits">
                  {local.benefits.map((b) => (
                    <div key={b.name}>
                      <h4>{b.name}</h4>
                      <ul>
                        {b.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {local.closing && <p className="pi-note pi-closing">{local.closing}</p>}
              </section>
            )}

            <section>
              <h3>Ingredienti</h3>
              {label ? <Ingredients text={label.ingredients} /> : <Pending block />}
            </section>

            <section>
              <h3>Allergeni</h3>
              {label?.contains.length ? (
                <ul className="pi-allergens">
                  <li>
                    <span>Contiene</span>
                    <strong>{list(label.contains)}</strong>
                  </li>
                  <li>
                    <span>Può contenere tracce di</span>
                    <strong>{list(label.traces)}</strong>
                  </li>
                </ul>
              ) : label ? (
                <p className="pi-note">L&apos;etichetta non riporta allergeni.</p>
              ) : (
                <Pending block />
              )}
            </section>

            {supplement ? (
              <section>
                <h3>Per dose massima giornaliera</h3>
                <table className="pi-table pi-table--dose">
                  <thead>
                    <tr>
                      <th scope="col"> </th>
                      <th scope="col">Bambini<small>1 compressa</small></th>
                      <th scope="col">Adulti<small>2 compresse</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {label?.dose?.map((d) => (
                      <tr key={d.label}>
                        <th scope="row">{d.label}</th>
                        <td>{d.childAmount}<small>{d.childNrv} NRV*</small></td>
                        <td>{d.adultAmount}<small>{d.adultNrv} NRV*</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="pi-note">*NRV = Valori nutritivi di riferimento, Reg. UE n. 1169/2011.</p>
              </section>
            ) : (
              <section>
                <h3>Valori nutrizionali medi</h3>
                <table className="pi-table">
                  <thead>
                    <tr>
                      <th scope="col"> </th>
                      <th scope="col">Per 100 g</th>
                      <th scope="col">Per barretta ({label?.weight ?? "—"})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {label?.nutrition.map((n) => (
                      <tr key={n.label} className={n.sub ? "is-sub" : ""}>
                        <th scope="row">{n.label}</th>
                        <td>{n.per100}</td>
                        <td>{n.perBar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section>
              <dl className="pi-facts">
                <div>
                  <dt>{supplement ? "Contenuto" : "Confezione"}</dt>
                  <dd>{supplement ? "60 compresse masticabili da 1000 mg (60 g), gusto frutti rossi" : `Box da ${product.packSize ?? 12} barrette da ${label?.weight ?? "40 g"}`}</dd>
                </div>
                {supplement && (
                  <div>
                    <dt>Modo d&apos;uso</dt>
                    <dd>{label?.usage ?? <Pending />}</dd>
                  </div>
                )}
                <div>
                  <dt>Conservazione</dt>
                  <dd>{product.label?.storage || (supplement ? "In luogo fresco e asciutto." : "In luogo fresco e asciutto, a non più di 25 °C.")}</dd>
                </div>
              </dl>
            </section>

            {supplement && (
              <section>
                <h3>Avvertenze</h3>
                {label?.warnings ? <p className="pi-note">{label.warnings}</p> : <Pending block />}
              </section>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
