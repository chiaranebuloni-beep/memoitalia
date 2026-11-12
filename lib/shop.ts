// Interruttore dello shop. Spento (come online dal 12/11/2026): niente Shop nel menu, niente carrello,
// niente link allo shop, e le pagine /shop, /checkout e /ordine rimandano alla home.
// Per riaprirlo: variabile NEXT_PUBLIC_SHOP_OPEN=1 (su Vercel o in .env.local) e nuova pubblicazione.
export const SHOP_OPEN = process.env.NEXT_PUBLIC_SHOP_OPEN === "1";
