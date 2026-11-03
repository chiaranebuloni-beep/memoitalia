"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { formatPrice, type Product, type ProductId } from "@/lib/catalog";
import { launchDateLabel } from "@/lib/launch";
import { useCart } from "./CartProvider";
import { Arrow, SplitChars, Star, Swoosh } from "./ui";

gsap.registerPlugin(ScrollTrigger, Flip);

type Filter = "tutto" | "barretta" | "integratore";

const FAN_ANGLES = [-24, -9, 6, 21];

export default function Shop({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const [filter, setFilter] = useState<Filter>("tutto");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const peekTl = useRef<gsap.core.Timeline | null>(null);

  const bars = products.filter((p) => p.kind === "barretta");
  const boxCents = bars.reduce((s, p) => s + p.priceCents, 0);
  const visible = (p: Product) => filter === "tutto" || p.kind === filter;
  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "tutto", label: "Tutto", count: products.length },
    { id: "barretta", label: "Barrette", count: bars.length },
    { id: "integratore", label: "Integratore", count: products.length - bars.length },
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

        // Il ventaglio del box si apre quando arriva sullo schermo.
        gsap.from(".sh-fan-bar", {
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

  // Cambio filtro: le card restanti scivolano nella nuova posizione.
  const changeFilter = (f: Filter) => {
    if (f === filter) return;
    // le card non ancora scoperte devono comparire subito, altrimenti resterebbero nascoste
    gsap.set(".sh-card", { clearProps: "clipPath" });
    flipState.current = Flip.getState(".sh-card");
    setFilter(f);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

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
    bars.forEach((p) => add(p.id as ProductId, 1));
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
                <SplitChars text="Fai scorta" />
              </span>
              <span className="sh-title-line sh-title-hl">
                <SplitChars text="di buono." />
              </span>
            </h1>
            <p className="sh-lead sh-hero-anim">
              Quattro barrette senza edulcoranti e l&apos;integratore con vitamine C, D e K. Scegli i tuoi preferiti e prepara il carrello.
            </p>
            <p className="sh-launch sh-hero-anim">
              <span className="sh-launch-dot" aria-hidden />
              Lo shop apre il {launchDateLabel}
            </p>
          </div>
          <div className="sh-hero-visual" aria-hidden>
            {bars.map((p, i) => (
              <img key={p.id} className="sh-hero-bar" src={p.image} alt="" width={820} height={262} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </section>

      {/* Filtri */}
      <div className="sh-toolbar">
        <div className="container sh-toolbar-inner">
          <div className="sh-filters" role="group" aria-label="Filtra i prodotti">
            {FILTERS.map((f) => (
              <button key={f.id} className={filter === f.id ? "is-active" : ""} aria-pressed={filter === f.id} onClick={() => changeFilter(f.id)}>
                {f.label} <span>{f.count}</span>
              </button>
            ))}
          </div>
          <ul className="sh-ticks">
            <li><Star className="tag-star" /> Senza glutine</li>
            <li><Star className="tag-star" /> Senza lattosio</li>
            <li><Star className="tag-star" /> Senza edulcoranti</li>
          </ul>
        </div>
      </div>

      {/* Prodotti */}
      <section className="container sh-grid" aria-label="Prodotti">
        {products.map((p) => {
          const n = qty[p.id] ?? 1;
          const wide = p.kind === "integratore";
          return (
            <article
              key={p.id}
              id={p.id}
              className={`sh-card sh-card--${p.kind} ${visible(p) ? "" : "is-hidden"}`}
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
                    alt={wide ? "Flacone dell'integratore Mèmo, vitamine C, D e K" : `Barretta Mèmo ${p.name}`}
                    width={wide ? 544 : 820}
                    height={wide ? 900 : 262}
                  />
                </div>
              </div>

              <div className="sh-info">
                <div className="sh-meta">
                  <span className="sh-kind">{wide ? "Integratore" : "Barretta"}</span>
                  {p.badge && <span className="sh-badge">{p.badge}</span>}
                </div>
                <h2 className="sh-name">{p.name}</h2>
                <p className="sh-tagline">{p.tagline}</p>
                <p className="sh-desc">{p.description}</p>
                <ul className="sh-chips">
                  {wide ? (
                    <>
                      <li>Vitamine C, D, K</li>
                      <li>{p.ingredients}</li>
                      <li>Gusto frutti rossi</li>
                    </>
                  ) : (
                    <>
                      <li>{p.ingredients}</li>
                      <li>Senza edulcoranti</li>
                    </>
                  )}
                </ul>
                <div className="sh-buy">
                  <span className="sh-price">{formatPrice(p.priceCents)}</span>
                  <div className="sh-qty" aria-label={`Quantità ${p.name}`}>
                    <button onClick={() => changeQty(p.id, -1)} disabled={n <= 1} aria-label="Una in meno">−</button>
                    <span aria-live="polite">{n}</span>
                    <button onClick={() => changeQty(p.id, 1)} aria-label="Una in più">+</button>
                  </div>
                  <button
                    className={`btn btn--accent sh-add ${added === p.id ? "is-added" : ""}`}
                    onClick={(e) => onAdd(p, e)}
                    data-cursor="Aggiungi"
                  >
                    {added === p.id ? "Aggiunto!" : "Aggiungi"}
                  </button>
                </div>
                {wide && (
                  <p className="sh-legal">
                    Gli integratori non vanno intesi come sostituti di una dieta varia ed equilibrata e di uno stile di vita sano.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* Box con tutti i gusti */}
      <section className="sh-box">
        <div className="container sh-box-grid">
          <div className="sh-box-copy">
            <span className="eyebrow eyebrow--blue">Non sai quale scegliere?</span>
            <h2 className="sh-box-title">
              Prendile tutte <span>e quattro.</span>
            </h2>
            <p>Una barretta per gusto: Golosa, Cocco, Arachide e Gianduia. Il modo più veloce per trovare la tua preferita.</p>
            <div className="sh-box-buy">
              <span className="sh-price">{formatPrice(boxCents)}</span>
              <button className={`btn btn--blue btn--lg ${added === "box" ? "is-added" : ""}`} onClick={onAddBox} data-cursor="Aggiungi">
                {added === "box" ? "Aggiunte!" : "Aggiungi le 4 barrette"} <Arrow className="btn-arrow" />
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
      </section>

      {/* Lista Founder */}
      <section className="sh-founder">
        <div className="container sh-founder-inner">
          <h2>
            Prezzo riservato <span>per i Founder.</span>
          </h2>
          <p>Entra nella lista: il giorno del lancio ti scriviamo noi, prima di tutti.</p>
          <a href="/#founder" className="btn btn--white btn--lg" data-cursor="Iscriviti">
            Entra nella lista <Arrow className="btn-arrow" />
          </a>
        </div>
      </section>
    </div>
  );
}
