"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type FlavorId } from "@/lib/catalog";

type Line = { id: FlavorId; qty: number };

type CartCtx = {
  lines: Line[];
  count: number;
  totalCents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: FlavorId, qty?: number) => void;
  setQty: (id: FlavorId, qty: number) => void;
  bump: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "memo-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((id: FlavorId, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
    setBump((b) => b + 1);
  }, []);

  const setQty = useCallback((id: FlavorId, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const totalCents = lines.reduce((s, l) => s + l.qty * (products.find((p) => p.id === l.id)?.priceCents ?? 0), 0);
    return { lines, count, totalCents, open, setOpen, add, setQty, bump };
  }, [lines, open, add, setQty, bump]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart deve stare dentro CartProvider");
  return c;
}
