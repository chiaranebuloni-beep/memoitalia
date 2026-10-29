# Mèmo · e-commerce

Sito e-commerce di Mèmo («Il buono memorabile»): frontend e backend nello stesso progetto Next.js.

## Avvio in locale

```bash
npm install
npm run dev
```

Prima del primo avvio copia `Bomega.woff2` in `public/fonts/` (il font ha licenza commerciale e non è nel repository, vedi `public/fonts/README.md`).

Poi apri http://localhost:3000.

## Struttura

- `app/page.tsx` — home page (compone le sezioni in `components/`)
- `app/api/products` — catalogo prodotti (GET)
- `app/api/founder` — iscrizione alla lista Founder (POST, salva in `data/founders.json` in locale)
- `lib/catalog.ts` — prodotti, prezzi e colori per gusto
- `components/` — sezioni della home, carrello, cursore, smooth scroll
- `public/fonts/Bomega.woff2` — font Bomega con le lettere accentate italiane aggiunte (à è é ì ò ù)
- `public/img/` — logo, mascotte e pack scontornati; foto prese dal PED

Animazioni: GSAP + ScrollTrigger, smooth scroll con Lenis. Chi ha attivo «riduci movimento» vede la pagina senza animazioni.

## Prossimi passi

- Checkout e pagamenti (oggi il carrello funziona ma il checkout è disattivato)
- Database al posto del file JSON per la lista Founder
- Pixel Meta + Conversions API + catalogo prodotti (come da strategia)
- Pagine prodotto, privacy, cookie e termini di vendita
