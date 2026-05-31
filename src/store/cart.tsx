"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartLine, Product } from "@/types";

/* ───────────────────────────── state ───────────────────────────── */

interface CartState {
  /** insertion-ordered lines; quantity ≥ 1 */
  readonly lines: ReadonlyArray<CartLine>;
}

type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; lines: ReadonlyArray<CartLine> };

const MAX_QTY = 10;

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.lines.find((l) => l.product.id === action.product.id);
      if (existing) return state;
      return {
        lines: [
          ...state.lines,
          { product: action.product, quantity: Math.min(MAX_QTY, action.quantity) },
        ],
      };
    }
    case "REMOVE":
      return { lines: state.lines.filter((l) => l.product.id !== action.id) };
    case "SET_QTY": {
      const q = Math.max(1, Math.min(MAX_QTY, action.quantity));
      return {
        lines: state.lines.map((l) =>
          l.product.id === action.id ? { ...l, quantity: q } : l,
        ),
      };
    }
    case "CLEAR":
      return { lines: [] };
    case "HYDRATE":
      return { lines: action.lines };
    default:
      return state;
  }
}

/* ──────────────────────────── context ──────────────────────────── */

interface CartContextValue {
  readonly lines: ReadonlyArray<CartLine>;
  readonly count: number;
  readonly subtotal: number;
  readonly isOpen: boolean;
  readonly hydrated: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** registers a callback fired whenever an item is added (for fly-to-cart FX) */
  onAdd: (cb: AddListener) => () => void;
}

/** A subscriber notified when a product is added; receives the product added. */
type AddListener = (product: Product) => void;

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aurora.cart.v1";

/**
 * Persists cart lines by product id + quantity only (not the whole product
 * object), then re-resolves products from the static catalog on hydrate so the
 * stored payload stays small and never goes stale against catalog changes.
 */
function persist(lines: ReadonlyArray<CartLine>): void {
  try {
    const compact = lines.map((l) => ({ id: l.product.id, q: l.quantity }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  } catch {
    /* storage unavailable (private mode / quota) — non-fatal */
  }
}

export function CartProvider({
  children,
  resolveProduct,
}: {
  children: React.ReactNode;
  /** maps a persisted id back to a live Product (the static catalog lookup) */
  resolveProduct: (id: string) => Product | undefined;
}) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const addListeners = useRef<Set<AddListener>>(new Set());

  // Hydrate once on mount (client only) — avoids SSR/client markup mismatch by
  // starting empty and filling in after paint.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const compact = JSON.parse(raw) as Array<{ id: string; q: number }>;
        const lines = compact
          .map(({ id, q }) => {
            const product = resolveProduct(id);
            return product ? { product, quantity: q } : null;
          })
          .filter((l): l is CartLine => l !== null);
        if (lines.length) dispatch({ type: "HYDRATE", lines });
      }
    } catch {
      /* corrupt payload — ignore and start fresh */
    }
    setHydrated(true);
  }, [resolveProduct]);

  // Persist after every change (post-hydration only).
  useEffect(() => {
    if (!hydrated) return;
    persist(state.lines);
  }, [state.lines, hydrated]);

  // Lock body scroll while the drawer is open (Lenis-friendly: pure CSS).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const l of state.lines) {
      c += l.quantity;
      s += l.quantity * l.product.price;
    }
    return { count: c, subtotal: s };
  }, [state.lines]);

  const add = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD", product, quantity });
    addListeners.current.forEach((cb) => cb(product));
  }, []);

  const remove = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const setQuantity = useCallback(
    (id: string, quantity: number) => dispatch({ type: "SET_QTY", id, quantity }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const onAdd = useCallback((cb: AddListener) => {
    addListeners.current.add(cb);
    return () => {
      addListeners.current.delete(cb);
    };
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      count,
      subtotal,
      isOpen,
      hydrated,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
      toggle,
      onAdd,
    }),
    [
      state.lines, count, subtotal, isOpen, hydrated,
      add, remove, setQuantity, clear, open, close, toggle, onAdd,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
