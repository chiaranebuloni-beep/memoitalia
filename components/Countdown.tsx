"use client";

import { useEffect, useRef, useState } from "react";
import { LAUNCH_DATE } from "@/lib/launch";

const UNITS = [
  { key: "d", label: "Giorni" },
  { key: "h", label: "Ore" },
  { key: "m", label: "Minuti" },
  { key: "s", label: "Secondi" },
] as const;

type Parts = Record<(typeof UNITS)[number]["key"], number>;

function partsUntil(target: number, now: number): Parts {
  const t = Math.max(0, Math.floor((target - now) / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

// Una cifra del tabellone: quando cambia, la vecchia esce verso l'alto e la nuova entra dal basso.
function Digit({ value }: { value: string }) {
  const [state, setState] = useState({ prev: value, cur: value, n: 0 });
  useEffect(() => {
    setState((s) => (s.cur === value ? s : { prev: s.cur, cur: value, n: s.n + 1 }));
  }, [value]);
  return (
    <span className="cd-tile">
      {state.n > 0 && (
        <span className="cd-digit cd-out" key={`o${state.n}`}>
          {state.prev}
        </span>
      )}
      <span className={`cd-digit ${state.n > 0 ? "cd-in" : ""}`} key={`i${state.n}`}>
        {state.cur}
      </span>
    </span>
  );
}

export default function Countdown() {
  const target = new Date(LAUNCH_DATE).getTime();
  const [parts, setParts] = useState<Parts | null>(null);
  const [spinning, setSpinning] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick: number | undefined;
    let spin: number | undefined;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const live = () => setParts(partsUntil(target, Date.now()));
      if (reduce) {
        live();
        tick = window.setInterval(live, 1000);
        return;
      }
      // Partenza "a slot": le cifre girano a caso per un attimo, poi si fermano sul valore vero.
      setSpinning(true);
      const end = Date.now() + 1100;
      spin = window.setInterval(() => {
        if (Date.now() >= end) {
          window.clearInterval(spin);
          setSpinning(false);
          live();
          tick = window.setInterval(live, 1000);
          return;
        }
        const r = (max: number) => Math.floor(Math.random() * max);
        setParts({ d: r(99), h: r(24), m: r(60), s: r(60) });
      }, 70);
    };

    if (window.__memoIntroDone) window.setTimeout(run, 250);
    else window.addEventListener("memo:intro-done", () => window.setTimeout(run, 250), { once: true });
    const safety = window.setTimeout(run, 4500);

    return () => {
      window.clearTimeout(safety);
      window.clearInterval(tick);
      window.clearInterval(spin);
    };
  }, [target]);

  const over = parts !== null && !spinning && target <= Date.now();

  if (over) {
    return (
      <div className="cd cd--open" role="status">
        <span className="cd-open">Lo shop è aperto!</span>
      </div>
    );
  }

  return (
    <div className={`cd ${spinning ? "is-spinning" : ""}`} role="timer" aria-live="off" aria-label="Tempo all'apertura dello shop">
      {UNITS.map((u, i) => {
        const v = parts ? parts[u.key] : null;
        const text = v === null ? "--" : String(v).padStart(2, "0");
        return (
          <div className="cd-unit" key={u.key}>
            <div className="cd-digits">
              {Array.from(text).map((ch, k) => (
                <Digit value={ch} key={`${u.key}${text.length}${k}`} />
              ))}
            </div>
            <span className="cd-label">{u.label}</span>
            {i < UNITS.length - 1 && <span className="cd-sep" aria-hidden>:</span>}
          </div>
        );
      })}
    </div>
  );
}
