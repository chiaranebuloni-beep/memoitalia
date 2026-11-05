// Catalogo prodotti: per ora in codice, in seguito verrà spostato su database / CMS.

export type FlavorId = "golosa" | "cocco" | "arachide" | "gianduia";
export type ProductId = FlavorId | "integratore" | "misto";

/** Integratore: tenore per dose massima giornaliera. */
export type DoseRow = { label: string; childAmount: string; childNrv: string; adultAmount: string; adultNrv: string };

export type Product = {
  id: ProductId;
  kind: "barretta" | "integratore" | "box";
  sku: string;
  name: string;
  tagline: string;
  ingredients: string;
  description: string;
  priceCents: number;
  image: string;
  theme: {
    bg: string;
    ink: string;
    accent: string;
  };
  badge?: string;
  /** barrette nella confezione: le barrette si vendono solo in box da 12 */
  packSize?: number;
  /** dal backend: false se esaurito */
  inStock?: boolean;
  /** dal backend: dati di etichetta modificabili dal pannello */
  label?: {
    weight: string;
    ingredients: string;
    contains: string[];
    traces: string[];
    storage: string;
    nutrition: { label: string; per100: string; perBar: string; sub?: boolean }[];
    usage?: string;
    warnings?: string;
    claim?: string;
    dose?: DoseRow[];
  };
};

// Le barrette non si vendono singole: ogni gusto è in box da 12, al prezzo di 2,50 € a barretta.
export const PACK_SIZE = 12;
const BOX_CENTS = 3000;

export const products: Product[] = [
  {
    id: "golosa",
    kind: "barretta",
    sku: "MEMO-BOX12-GOL",
    name: "Golosa",
    tagline: "La barretta ricoperta di cioccolato",
    ingredients: "Cioccolato, nocciole e mandorle",
    description:
      "Una copertura di cioccolato che si scioglie al primo morso e un cuore di nocciole e mandorle. Dolce per natura.",
    priceCents: BOX_CENTS,
    packSize: PACK_SIZE,
    image: "/img/products/golosa.webp",
    theme: { bg: "#3a1d12", ink: "#fff3e4", accent: "#f2b66d" },
    badge: "La più golosa",
  },
  {
    id: "cocco",
    kind: "barretta",
    sku: "MEMO-BOX12-COC",
    name: "Cocco",
    tagline: "La barretta al cocco e mandorle",
    ingredients: "Cocco e mandorle",
    description:
      "Cocco morbido e mandorle croccanti: fresca, leggera al palato, perfetta tra un set e l'altro.",
    priceCents: BOX_CENTS,
    packSize: PACK_SIZE,
    image: "/img/products/cocco.webp",
    theme: { bg: "#f6efe4", ink: "#3a1d12", accent: "#0b4ea2" },
  },
  {
    id: "arachide",
    kind: "barretta",
    sku: "MEMO-BOX12-ARA",
    name: "Arachide",
    tagline: "La barretta agli arachidi",
    ingredients: "Arachidi",
    description:
      "Tutto il gusto pieno delle arachidi tostate, in una barretta semplice e saziante. Per chi non si accontenta.",
    priceCents: BOX_CENTS,
    packSize: PACK_SIZE,
    image: "/img/products/arachide.webp",
    theme: { bg: "#b4532a", ink: "#fff3e4", accent: "#ffd29a" },
  },
  {
    id: "gianduia",
    kind: "barretta",
    sku: "MEMO-BOX12-GIA",
    name: "Gianduia",
    tagline: "La barretta al cacao e nocciole",
    ingredients: "Cacao, nocciole e mandorle",
    description:
      "Il gusto di casa del gianduia: cacao e nocciole che sanno di merenda, senza edulcoranti.",
    priceCents: BOX_CENTS,
    packSize: PACK_SIZE,
    image: "/img/products/gianduia.webp",
    theme: { bg: "#76291b", ink: "#fff3e4", accent: "#f7b98b" },
  },
  {
    id: "integratore",
    kind: "integratore",
    sku: "MEMO-INT-VIT",
    name: "Integratore",
    tagline: "Vitamine D3, K2 e C, compresse masticabili",
    ingredients: "60 compresse",
    description:
      "Tre vitamine con funzioni complementari in un'unica compressa masticabile al gusto frutti rossi, pensata apposta anche per i più piccoli*, dai 3 anni in su. Per integrare l'alimentazione di tutti i giorni.",
    priceCents: 1790,
    image: "/img/products/integratore.webp",
    theme: { bg: "#0b4ea2", ink: "#ffffff", accent: "#eaa65f" },
  },
];

// Box Experience (multigusto): 3 barrette per ognuno dei 4 gusti. Ha una sezione sua nello shop, non una card.
products.push({
  id: "misto",
  kind: "box",
  sku: "MEMO-BOX12-MIX",
  name: "Experience",
  tagline: "3 barrette per ognuno dei 4 gusti",
  ingredients: "Golosa, Cocco, Arachide e Gianduia",
  description: "Tre barrette per ogni gusto, dodici in tutto: per trovare la tua preferita.",
  priceCents: BOX_CENTS,
  packSize: PACK_SIZE,
  image: "/img/products/golosa.webp",
  theme: { bg: "#e9eefb", ink: "#0b4ea2", accent: "#eaa65f" },
});

export const bars = products.filter((p) => p.kind === "barretta");

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

export const getProduct = (id: string) => products.find((p) => p.id === id);
