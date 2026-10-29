// Piccoli elementi grafici condivisi tra le sezioni.

export function Swoosh({ className, title }: { className?: string; title?: string }) {
  // L'onda dell'accento sulla È del logo, usata come segno grafico.
  return (
    <svg className={className} viewBox="0 0 200 120" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title && <title>{title}</title>}
      <path
        fill="currentColor"
        d="M24 6C10 4 2 22 8 40c10 26 52 34 92 38 30 3 60 12 78 30 6 5 14 2 11-6-11-28-39-46-77-52-32-5-64-8-78-32-3-6-6-11-10-12Z"
      />
    </svg>
  );
}

export function SplitChars({ text, className }: { text: string; className?: string }) {
  // Divide il testo in parole e lettere, così GSAP può animarle una per una.
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span className="split-word" aria-hidden key={wi}>
          {Array.from(word).map((ch, ci) => (
            <span className="split-char" key={ci}>
              {ch}
            </span>
          ))}
          {wi < text.split(" ").length - 1 && <span className="split-space"> </span>}
        </span>
      ))}
    </span>
  );
}

export function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 0c1 6.5 5.5 11 12 12-6.5 1-11 5.5-12 12-1-6.5-5.5-11-12-12C6.5 11 11 6.5 12 0Z" />
    </svg>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M4 12h15m-6-7 7 7-7 7" />
    </svg>
  );
}
