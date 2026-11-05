// Dati di etichetta ufficiali delle barrette (forniti dal cliente il 4 novembre 2026).
// Negli ingredienti gli allergeni sono tra **asterischi**: il pannello li mostra in grassetto.

import type { DoseRow, FlavorId } from "./catalog";

export type NutritionRow = { label: string; per100: string; perBar: string; sub?: boolean };

export type BarLabel = {
  weight: string;
  ingredients: string;
  contains: string[];
  traces: string[];
  nutrition: NutritionRow[];
  usage?: string;
  warnings?: string;
  claim?: string;
  dose?: DoseRow[];
  benefits?: { name: string; items: string[] }[];
  closing?: string;
};

const rows = (values: [string, string][]): NutritionRow[] =>
  [
    { label: "Energia" },
    { label: "Grassi" },
    { label: "di cui acidi grassi saturi", sub: true },
    { label: "Carboidrati" },
    { label: "di cui zuccheri", sub: true },
    { label: "Fibre" },
    { label: "Proteine" },
    { label: "Sale" },
  ].map((r, i) => ({ ...r, per100: values[i][0], perBar: values[i][1] }));

export const LABELS: Record<FlavorId | "integratore", BarLabel> = {
  golosa: {
    weight: "40 g",
    ingredients:
      "pasta di datteri (43,5%), cioccolato fondente di copertura (pasta di cacao, zucchero, burro di cacao, emulsionante: lecitina di **soia**, aroma naturale di vaniglia) (22,5%), granella di **mandorle** (13%), proteine di pisello testurizzate, pasta di **nocciole** (4%), granella di **nocciole** (4%), sciroppo di dattero (3%), aroma naturale, sale.",
    contains: ["soia", "mandorle", "nocciole"],
    traces: ["latte", "altra frutta a guscio"],
    nutrition: rows([
      ["1887 kJ / 451 kcal", "755 kJ / 180 kcal"],
      ["21 g", "8,4 g"],
      ["6,0 g", "2,4 g"],
      ["50 g", "20 g"],
      ["39 g", "16 g"],
      ["9,1 g", "3,6 g"],
      ["11 g", "4,4 g"],
      ["0,10 g", "0,04 g"],
    ]),
  },
  gianduia: {
    weight: "40 g",
    ingredients:
      "pasta di datteri (56%), granella di **mandorle** (16%), proteine di pisello testurizzate, pasta di **nocciole** (7,5%), cacao in polvere (5%), sciroppo di dattero (4%), aroma naturale, sale.",
    contains: ["mandorle", "nocciole"],
    traces: ["soia", "altra frutta a guscio"],
    nutrition: rows([
      ["1731 kJ / 413 kcal", "692 kJ / 165 kcal"],
      ["15 g", "6,0 g"],
      ["1,8 g", "0,7 g"],
      ["51 g", "20 g"],
      ["38 g", "15 g"],
      ["11 g", "4,4 g"],
      ["13 g", "5,2 g"],
      ["0,13 g", "0,05 g"],
    ]),
  },
  cocco: {
    weight: "40 g",
    ingredients:
      "pasta di datteri (54,5%), cocco rapè (16%), proteine di pisello testurizzate, pasta di **mandorle** (5,5%), granella di **mandorle** (5%), sciroppo di dattero (4%), aroma naturale, sale.",
    contains: ["mandorle"],
    traces: ["altra frutta a guscio"],
    nutrition: rows([
      ["1796 kJ / 429 kcal", "718 kJ / 172 kcal"],
      ["17 g", "6,8 g"],
      ["9,8 g", "3,9 g"],
      ["50 g", "20 g"],
      ["38 g", "15 g"],
      ["12 g", "4,8 g"],
      ["13 g", "5,2 g"],
      ["0,14 g", "0,06 g"],
    ]),
  },
  arachide: {
    weight: "40 g",
    ingredients:
      "pasta di datteri (55%), granella di **arachidi** (24%), proteine di pisello testurizzate, pasta di **arachidi** (6,5%), sciroppo di dattero (4%), sale, aroma naturale.",
    contains: ["arachidi"],
    traces: ["latte", "soia", "frutta a guscio"],
    nutrition: rows([
      ["1786 kJ / 426 kcal", "714 kJ / 170 kcal"],
      ["16 g", "6,4 g"],
      ["2,4 g", "1,0 g"],
      ["52 g", "21 g"],
      ["38 g", "15 g"],
      ["9,0 g", "3,6 g"],
      ["14 g", "5,6 g"],
      ["0,33 g", "0,13 g"],
    ]),
  },
  // Dall'etichetta ufficiale dell'integratore (fornita il 4 novembre 2026). L'etichetta non indica allergeni.
  integratore: {
    weight: "60 g",
    ingredients:
      "Agenti di carica: Sorbitolo, Cellulosa microcristallina (gel di cellulosa); Vitamina C (Acido l-Ascorbico); Antiagglomeranti: Sali di magnesio degli acidi grassi, Biossido di silicio; Vitamina K2 (Menachinone 7); Vitamina D3 (colecalciferolo); Aroma naturale; Edulcorante: Sucralosio.",
    contains: [],
    traces: [],
    nutrition: [],
    usage:
      "Per gli adulti, si consiglia l'assunzione di 2 compresse al giorno. Per i bambini di età superiore ai 3 anni, si consiglia 1 compressa al giorno.",
    warnings:
      "Tenere fuori dalla portata dei bambini al di sotto dei 3 anni di età. Non superare la dose giornaliera consigliata. Gli integratori alimentari non vanno intesi quali sostituti di una dieta variata, equilibrata e uno stile di vita sano. Per l'uso del prodotto in gravidanza, durante l'allattamento e al di sotto dei 12 anni di età, si consiglia di consultare il medico.",
    claim: "La Vitamina C contribuisce alla normale funzione del sistema immunitario e alla riduzione della stanchezza e dell'affaticamento.",
    dose: [
      { label: "Vitamina C", childAmount: "250 mg", childNrv: "312,5%", adultAmount: "500 mg", adultNrv: "625%" },
      { label: "Vitamina K2", childAmount: "37,5 µg", childNrv: "50%", adultAmount: "75 µg", adultNrv: "100%" },
      { label: "Vitamina D3", childAmount: "25 µg", childNrv: "500%", adultAmount: "50 µg", adultNrv: "1000%" },
    ],
    // Indicazioni sulla salute: usare solo la formula autorizzata, senza titoli o promesse aggiuntive.
    benefits: [
      {
        name: "Vitamina D3",
        items: [
          "Contribuisce alla normale funzione del sistema immunitario.",
          "Contribuisce al mantenimento di ossa e denti normali.",
          "Contribuisce alla normale funzione muscolare.",
          "Contribuisce al normale assorbimento e utilizzo di calcio e fosforo.",
        ],
      },
      {
        name: "Vitamina K2",
        items: ["Contribuisce al mantenimento di ossa normali.", "Contribuisce alla normale coagulazione del sangue."],
      },
      {
        name: "Vitamina C",
        items: [
          "Contribuisce alla normale funzione del sistema immunitario.",
          "Contribuisce alla protezione delle cellule dallo stress ossidativo.",
          "Contribuisce alla riduzione della stanchezza e dell'affaticamento.",
          "Accresce l'assorbimento del ferro.",
        ],
      },
    ],
    closing: "Il benessere non nasce da soluzioni miracolose, ma da buone abitudini, alimentazione equilibrata e scelte consapevoli.",
  },
};

export const getLabel = (id: string): BarLabel | undefined => LABELS[id as keyof typeof LABELS];
