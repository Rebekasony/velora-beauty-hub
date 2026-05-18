import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const KEY = "veloracart_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
  };
  const remove = (id: string) => setItems((p) => p.filter((i) => i.product.id !== id));
  const update = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems((p) => p.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  };
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const deliveryFee = subtotal > 0 && subtotal < 999 ? 49 : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ items, add, remove, update, clear, count, subtotal, deliveryFee, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}