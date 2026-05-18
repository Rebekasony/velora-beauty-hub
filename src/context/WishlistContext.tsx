import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface WishlistContextValue {
  items: Product[];
  toggle: (p: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const KEY = "veloracart_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const toggle = (p: Product) =>
    setItems((prev) => prev.find((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p]);
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const has = (id: string) => items.some((i) => i.id === id);
  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, has, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}