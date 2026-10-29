// Catalogo prodotti: per ora in codice, in seguito verrà spostato su database / CMS.

export type FlavorId = "golosa" | "cocco" | "arachide" | "gianduia";

export type Product = {
  id: FlavorId;
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
};

export const products: Product[] = [
  {
    id: "golosa",
    sku: "MEMO-BAR-GOL",
    name: "Golosa",
    tagline: "La barretta ricoperta di cioccolato",
    ingredients: "Cioccolato, nocciole e mandorle",
    description:
      "Una copertura di cioccolato che si scioglie al primo morso e un cuore di nocciole e mandorle. Dolce per natura.",
    priceCents: 250,
    image: "/img/products/golosa.webp",
    theme: { bg: "#3a1d12", ink: "#fff3e4", accent: "#f2b66d" },
    badge: "La più golosa",
  },
  {
    id: "cocco",
    sku: "MEMO-BAR-COC",
    name: "Cocco",
    tagline: "La barretta al cocco e mandorle",
    ingredients: "Cocco e mandorle",
    description:
      "Cocco morbido e mandorle croccanti: fresca, leggera al palato, perfetta tra un set e l'altro.",
    priceCents: 250,
    image: "/img/products/cocco.webp",
    theme: { bg: "#f6efe4", ink: "#3a1d12", accent: "#0b4ea2" },
  },
  {
    id: "arachide",
    sku: "MEMO-BAR-ARA",
    name: "Arachide",
    tagline: "La barretta agli arachidi",
    ingredients: "Arachidi",
    description:
      "Tutto il gusto pieno delle arachidi tostate, in una barretta semplice e saziante. Per chi non si accontenta.",
    priceCents: 250,
    image: "/img/products/arachide.webp",
    theme: { bg: "#b4532a", ink: "#fff3e4", accent: "#ffd29a" },
  },
  {
    id: "gianduia",
    sku: "MEMO-BAR-GIA",
    name: "Gianduia",
    tagline: "La barretta al cacao e nocciole",
    ingredients: "Cacao, nocciole e mandorle",
    description:
      "Il gusto di casa del gianduia: cacao e nocciole che sanno di merenda, senza edulcoranti.",
    priceCents: 250,
    image: "/img/products/gianduia.webp",
    theme: { bg: "#76291b", ink: "#fff3e4", accent: "#f7b98b" },
  },
];

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);

export const getProduct = (id: string) => products.find((p) => p.id === id);
