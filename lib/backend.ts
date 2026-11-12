import { NextResponse } from "next/server";
import { products as staticProducts, type Product, type ProductId } from "./catalog";

// Collegamento al backend Django. Solo lato server.
// Senza BACKEND_URL (es. il sito online di oggi) tutto continua a funzionare come prima: catalogo in
// codice, nessun checkout. Basta impostare la variabile per accendere il collegamento.
const BASE = process.env.BACKEND_URL?.replace(/\/$/, "");

export const backendEnabled = Boolean(BASE);

type ApiProduct = Product & {
  id: string;
  image: string | null;
  inStock: boolean;
};

// Catalogo vivo: prezzi, testi e disponibilità del pannello. Se il backend non risponde resta quello in codice.
export async function getCatalog(): Promise<Product[]> {
  if (!BASE) return staticProducts;
  try {
    const res = await fetch(`${BASE}/api/v1/products/`, { next: { revalidate: 15 }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { products: ApiProduct[] };
    // Dal pannello arrivano solo nome, prezzo, foto, descrizione e disponibilità:
    // tutto il resto (etichetta, colori, sottotitolo, badge…) resta quello in codice.
    return data.products.map((p) => {
      const s = staticProducts.find((x) => x.id === p.id);
      if (!s) return { ...p, id: p.id as ProductId, image: p.image ?? "" };
      return {
        ...s,
        name: p.name || s.name,
        description: p.description || s.description,
        priceCents: p.priceCents,
        inStock: p.inStock,
        image: p.image ?? s.image,
      };
    });
  } catch (err) {
    console.error("catalogo: backend non raggiungibile, uso quello in codice", err);
    return staticProducts;
  }
}

// Inoltra una richiesta del browser al backend e ne restituisce la risposta.
// L'indirizzo del cliente va passato, altrimenti i limiti di richieste varrebbero per tutti insieme.
export async function forwardToBackend(path: string, req: Request, body?: unknown, unavailable = "Il negozio non è raggiungibile, riprova tra poco.") {
  if (!BASE) return NextResponse.json({ error: unavailable }, { status: 503 });
  try {
    const res = await fetch(`${BASE}/api/v1${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? "",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.error) {
      data.error = res.status === 429 ? "Troppe richieste, riprova tra qualche minuto." : "Controlla i dati inseriti e riprova.";
    }
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`backend ${path}: non raggiungibile`, err);
    return NextResponse.json({ error: unavailable }, { status: 503 });
  }
}

export type OrderView = {
  number: string;
  status: string;
  checkoutUrl: string | null;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: { name: string; qty: number; totalCents: number }[];
  shipments: { status: string; carrier: string; tracking: string; trackingUrl: string }[];
  bank: { iban: string; beneficiary: string } | null;
};

export async function getOrder(token: string): Promise<OrderView | null> {
  if (!BASE || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  const res = await fetch(`${BASE}/api/v1/orders/${token}/`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
