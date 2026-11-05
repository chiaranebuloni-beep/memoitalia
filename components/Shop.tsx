"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatPrice, type Product, type ProductId } from "@/lib/catalog";
import { launchDateLabel } from "@/lib/launch";
import { useCart } from "./CartProvider";
import ProductInfo from "./ProductInfo";
import { Arrow, SplitChars, Star, Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger);

export type ShopCategory = "barretta" | "integratore";

// Titolo e testo di ogni pagina dello shop.
const COPY = {
  tutto: {
    title: ["Fai scorta", "di buono."],
    lead: "Quattro gusti senza edulcoranti, in box da 12 barrette, e l'integratore con vitamine D3, K2 e C. Scegli i tuoi preferiti e prepara il carrello.",
  },
  barretta: {
    title: ["Scegli", "il gusto."],
    lead: "Quattro gusti senza edulcoranti, in box da 12 barrette. Non sai quale scegliere? Con il box Experience li provi tutti.",
  },
  integratore: {
    title: ["La buona", "abitudine."],
    lead: "Vitamine D3, K2 e C in compresse masticabili al gusto frutti rossi, pensate apposta anche per i più piccoli*.",
  },
};

const FAN_ANGLES = [-24, -9, 6, 21];

// prezzo a barretta, mostrato sotto il prezzo del box
const perBar = (p: Product) => formatPrice(Math.round(p.priceCents / (p.packSize ?? 1)));

export default function Shop({ products, category }: { products: Product[]; category?: ShopCategory }) {
  const root = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);
  const [info, setInfo] = useState<ProductId | null>(null);
  const closeInfo = useCallback(() => {
    setInfo(null);
    // toglie "#info-…" dall'indirizzo, così lo stesso link funziona anche una seconda volta
    if (location.hash.startsWith("#info-")) history.replaceState(null, "", location.pathname + location.search);
  }, []);

  // "/shop#info-golosa" apre direttamente il pannello di quel prodotto (link dalla home)
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.startsWith("#info-") ? location.hash.slice(6) : "";
      if (products.some((p) => p.id === id)) setInfo(id as ProductId);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [products]);
  const peekTl = useRef<gsap.core.Timeline | null>(null);

  const bars = products.filter((p) => p.kind === "barretta");
  // Il box Experience è un prodotto a sé: 3 barrette per ognuno dei 4 gusti.
  const mixBox = products.find((p) => p.kind === "box");
  const allItems = products.filter((p) => p.kind !== "box");
  const items = category ? allItems.filter((p) => p.kind === category) : allItems;
  const copy = COPY[category ?? "tutto"];
  const onlySupplement = category === "integratore";
  const PAGES = [
    { href: "/shop", id: undefined, label: "Tutto", count: allItems.length },
    { href: "/shop/barrette", id: "barretta", label: "Barrette", count: bars.length },
    { href: "/shop/integratore", id: "integratore", label: "Integratore", count: allItems.length - bars.length },
  ];

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".sh-hero .split-char", { yPercent: 115, duration: 0.9, stagger: 0.025 }, 0.1)
          .from(".sh-hero-anim", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.35)
          .from(".sh-hero-bar", { xPercent: 60, rotate: 20, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.2);

        gsap.to(".sh-hero-swoosh", { rotate: 6, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

        // Le card si scoprono dal basso a tendina quando entrano nello schermo.
        gsap.set(".sh-card", { clipPath: "inset(100% 0% 0% 0% round 30px)" });
        ScrollTrigger.batch(".sh-card", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { clipPath: "inset(0% 0% 0% 0% round 30px)", duration: 0.9, stagger: 0.1, ease: "power3.inOut", clearProps: "clipPath" }),
        });

        // Le barrette fluttuano piano dentro la propria card.
        gsap.utils.toArray<HTMLElement>(".sh-float").forEach((el, i) => {
          gsap.to(el, { y: -10, rotate: 1.5, duration: 2.4 + (i % 3) * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });

        // L'elefantino spunta dal bordo, si guarda intorno e torna giù, a intervalli.
        if (root.current?.querySelector(".sh-peek")) {
        gsap.set(".sh-peek", { yPercent: 105 });
        peekTl.current = gsap
          .timeline({ repeat: -1, repeatDelay: 2.6, paused: true, delay: 0.6 })
          .to(".sh-peek", { yPercent: 0, duration: 0.7, ease: "back.out(1.7)" })
          .to(".sh-peek", { rotate: -5, duration: 0.45, ease: "sine.inOut" }, "+=0.5")
          .to(".sh-peek", { rotate: 4, duration: 0.6, ease: "sine.inOut" })
          .to(".sh-peek", { rotate: 0, duration: 0.4, ease: "sine.inOut" })
          .to(".sh-peek", { yPercent: 105, duration: 0.4, ease: "power2.in" }, "+=0.6");
        ScrollTrigger.create({
          trigger: ".sh-card--integratore",
          start: "top 80%",
          end: "bottom 20%",
          onToggle: (self) => (self.isActive ? peekTl.current?.play() : peekTl.current?.pause()),
        });
        }

        // Il ventaglio del box si apre quando arriva sullo schermo.
        if (root.current?.querySelector(".sh-fan-bar")) gsap.from(".sh-fan-bar", {
          rotate: 0,
          y: 40,
          duration: 1.1,
          stagger: 0.07,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".sh-box", start: "top 75%", once: true },
        });
      });
    },
    { scope: root }
  );

  // Timido: se lo tocchi o ci passi sopra, si rinasconde subito e riprova più tardi.
  const hidePeek = contextSafe(() => {
    const tl = peekTl.current;
    if (!tl || gsap.getProperty(".sh-peek", "yPercent") as number > 60) return;
    tl.pause();
    gsap.to(".sh-peek", {
      yPercent: 105,
      rotate: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.delayedCall(2.5, () => tl.restart(true));
      },
    });
  });

  // La foto del prodotto vola fino all'icona del carrello.
  const flyToCart = (from: HTMLElement | null) => {
    // su mobile vola verso la barra del carrello in basso, altrimenti verso l'icona nell'header
    const bar = document.querySelector<HTMLElement>(".sh-cartbar");
    const onBar = !!bar && getComputedStyle(bar).display !== "none";
    const cart = onBar ? bar.querySelector<HTMLElement>(".sh-cartbar-icon") : document.querySelector<HTMLElement>(".cart-btn");
    if (!from || !cart || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = from.getBoundingClientRect();
    const r = cart.getBoundingClientRect();
    // la barra può essere ancora fuori schermo (primo articolo): punta a dove arriverà
    const lift = onBar && !bar.classList.contains("is-visible") ? bar.offsetHeight + 40 : 0;
    const b = { left: r.left, top: r.top - lift, width: r.width, height: r.height };
    const ghost = from.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${a.left}px`,
      top: `${a.top}px`,
      width: `${a.width}px`,
      height: `${a.height}px`,
      margin: "0",
      zIndex: "900",
      pointerEvents: "none",
    });
    document.body.appendChild(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap
      .timeline({ onComplete: () => ghost.remove() })
      .to(ghost, { x: dx, duration: 0.75, ease: "power1.inOut" }, 0)
      .to(ghost, { y: dy, duration: 0.75, ease: "back.in(1.6)" }, 0)
      .to(ghost, { scale: 0.08, rotate: -30, duration: 0.75, ease: "power2.in" }, 0)
      .to(ghost, { opacity: 0, duration: 0.15 }, 0.62);
  };

  const onAdd = (p: Product, e: React.MouseEvent<HTMLElement>) => {
    const n = qty[p.id] ?? 1;
    add(p.id, n);
    flyToCart(e.currentTarget.closest(".sh-card")?.querySelector<HTMLElement>(".sh-product-img") ?? null);
    setAdded(p.id);
    setQty((q) => ({ ...q, [p.id]: 1 }));
    window.setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1600);
  };

  const onAddBox = (e: React.MouseEvent<HTMLElement>) => {
    if (!mixBox) return;
    add(mixBox.id);
    flyToCart(e.currentTarget.closest(".sh-box")?.querySelector<HTMLElement>(".sh-fan") ?? null);
    setAdded("box");
    window.setTimeout(() => setAdded((a) => (a === "box" ? null : a)), 1600);
  };

  const changeQty = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.min(24, Math.max(1, (q[id] ?? 1) + d)) }));

  return (
    <div className="shop" ref={root}>
      {/* Intestazione */}
      <section className="sh-hero">
        <div className="hero-bg" aria-hidden>
          <Swoosh className="sh-hero-swoosh" />
          <div className="hero-lines" />
          <div className="hero-grain" />
        </div>
        <div className="container sh-hero-grid">
          <div className="sh-hero-copy">
            <h1 className="sh-title">
              <span className="sh-title-line">
                <SplitChars text={copy.title[0]} />
              </span>
              <span className="sh-title-line sh-title-hl">
                <SplitChars text={copy.title[1]} />
              </span>
            </h1>
            <p className="sh-lead sh-hero-anim">
              {copy.lead}
            </p>
            <p className="sh-launch sh-hero-anim">
              <span className="sh-launch-dot" aria-hidden />
              Lo shop apre il {launchDateLabel}
            </p>
          </div>
          <div className="sh-hero-visual" aria-hidden>
            {onlySupplement
              ? items.map((p) => <img key={p.id} className="sh-hero-bar is-bottle" src={p.image} alt="" width={544} height={900} />)
              : bars.map((p, i) => (
                  <img key={p.id} className="sh-hero-bar" src={p.image} alt="" width={820} height={262} style={{ "--i": i } as React.CSSProperties} />
                ))}
          </div>
        </div>
      </section>

      {/* Filtri */}
      <div className="sh-toolbar">
        <div className="container sh-toolbar-inner">
          <nav className="sh-filters" aria-label="Categorie dello shop">
            {PAGES.map((f) => (
              <a key={f.href} href={f.href} className={category === f.id ? "is-active" : ""} aria-current={category === f.id ? "page" : undefined}>
                {f.label} <span>{f.count}</span>
              </a>
            ))}
          </nav>
          {/* valgono per le barrette: l'integratore contiene un edulcorante */}
          {!onlySupplement && (
            <ul className="sh-ticks">
              <li><Star className="tag-star" /> Senza glutine</li>
              <li><Star className="tag-star" /> Senza lattosio</li>
              <li><Star className="tag-star" /> Senza edulcoranti</li>
            </ul>
          )}
        </div>
      </div>

      {/* Prodotti */}
      <section className="container sh-grid" aria-label="Prodotti">
        {items.map((p) => {
          const n = qty[p.id] ?? 1;
          const wide = p.kind === "integratore";
          return (
            <article
              key={p.id}
              id={p.id}
              className={`sh-card sh-card--${p.kind}`}
              style={{ background: p.theme.bg, color: p.theme.ink, "--accent": p.theme.accent } as React.CSSProperties}
            >
              <div className="sh-visual">
                <span className="sh-giant" aria-hidden>{p.name}</span>
                {wide && (
                  // l'elefantino fa capolino dal bordo della card e poi si nasconde di nuovo
                  <img
                    className="sh-peek"
                    src="/img/brand/elefante-peek.webp"
                    alt=""
                    width={720}
                    height={337}
                    loading="lazy"
                    onPointerEnter={hidePeek}
                  />
                )}
                <div className="sh-float">
                  <img
                    className="sh-product-img"
                    src={p.image}
                    alt={wide ? "Flacone dell'integratore Mèmo, vitamine D3, K2 e C" : `Barretta Mèmo ${p.name}`}
                    width={wide ? 544 : 820}
                    height={wide ? 900 : 262}
                  />
                </div>
              </div>

              <div className="sh-info">
                <div className="sh-meta">
                  <span className="sh-kind">{wide ? "Integratore" : `Box da ${p.packSize} barrette`}</span>
                  {p.badge && <span className="sh-badge">{p.badge}</span>}
                </div>
                <h2 className="sh-name">{p.name}</h2>
                <p className="sh-tagline">{p.tagline}</p>
                <p className="sh-desc">{p.description}</p>
                <ul className="sh-chips">
                  {wide ? (
                    <>
                      <li>Vitamine D3, K2, C</li>
                      <li>{p.ingredients}</li>
                      <li>Gusto frutti rossi</li>
                    </>
                  ) : (
                    <>
                      <li>{p.packSize} × 40 g</li>
                      <li>{p.ingredients}</li>
                      <li>Senza edulcoranti</li>
                    </>
                  )}
                </ul>
                <button className="sh-info-link" onClick={() => setInfo(p.id)} data-cursor="Leggi">
                  {wide ? "Le vitamine, gli ingredienti e il modo d'uso" : "Ingredienti e valori nutrizionali"}
                  <Arrow className="btn-arrow" />
                </button>
                <div className="sh-buy">
                  <span className="sh-price">
                    {formatPrice(p.priceCents)}
                    {p.packSize && <small className="sh-price-unit">{perBar(p)} a barretta</small>}
                  </span>
                  <div className="sh-qty" aria-label={`Quantità ${p.name}`}>
                    <button onClick={() => changeQty(p.id, -1)} disabled={n <= 1} aria-label={wide ? "Uno in meno" : "Un box in meno"}>−</button>
                    <span aria-live="polite">{n}</span>
                    <button onClick={() => changeQty(p.id, 1)} aria-label={wide ? "Uno in più" : "Un box in più"}>+</button>
                  </div>
                  <button
                    className={`btn btn--accent sh-add ${added === p.id ? "is-added" : ""}`}
                    onClick={(e) => onAdd(p, e)}
                    disabled={p.inStock === false}
                    data-cursor="Aggiungi"
                  >
                    {p.inStock === false ? "Esaurito" : added === p.id ? "Aggiunto!" : "Aggiungi"}
                  </button>
                </div>
                {wide && (
                  <p className="sh-legal">
                    *Per l&apos;uso al di sotto dei 12 anni, si consiglia di consultare il medico.
                    <br />
                    Gli integratori alimentari non vanno intesi quali sostituti di una dieta variata, equilibrata e uno stile di vita sano.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <ProductInfo product={products.find((p) => p.id === info) ?? null} onClose={closeInfo} />

      {/* Box con tutti i gusti */}
      {!onlySupplement && <section className="sh-box">
        <div className="container sh-box-grid">
          <div className="sh-box-copy">
            <span className="eyebrow eyebrow--blue">Non sai quale scegliere?</span>
            <h2 className="sh-box-title">
              Prendile <span>tutte.</span>
            </h2>
            <p>Il box Experience: tre barrette per ogni gusto, Golosa, Cocco, Arachide e Gianduia. Dodici in tutto, per trovare la tua preferita.</p>
            <div className="sh-box-buy">
              {mixBox && (
                <span className="sh-price">
                  {formatPrice(mixBox.priceCents)}
                  <small className="sh-price-unit">{perBar(mixBox)} a barretta</small>
                </span>
              )}
              <button className={`btn btn--blue btn--lg ${added === "box" ? "is-added" : ""}`} onClick={onAddBox} disabled={mixBox?.inStock === false} data-cursor="Aggiungi">
                {mixBox?.inStock === false ? "Esaurito" : added === "box" ? "Aggiunto!" : "Aggiungi il box Experience"} <Arrow className="btn-arrow" />
              </button>
            </div>
          </div>
          <div className="sh-box-visual" aria-hidden>
            <div className="sh-fan">
              {bars.map((p, i) => (
                <img key={p.id} className="sh-fan-bar" src={`/img/products/${p.id}-ombra.webp`} alt="" width={916} height={349} style={{ transform: `rotate(${FAN_ANGLES[i]}deg)`, zIndex: i }} />
              ))}
            </div>
          </div>
        </div>
      </section>}

      {/* Avvisami al lancio */}
      <section className="sh-founder">
        <div className="container sh-founder-inner">
          <h2>
            Lo shop apre <span>a breve.</span>
          </h2>
          <p>Lascia la tua email e ti avvisiamo appena puoi ordinare.</p>
          <a href="/#founder" className="btn btn--white btn--lg" data-cursor="Iscriviti">
            Avvisami al lancio <Arrow className="btn-arrow" />
          </a>
        </div>
      </section>
    </div>
  );
}
