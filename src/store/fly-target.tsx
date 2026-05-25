"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { flyToCart } from "@/animations/flyToCart";

interface FlyTargetValue {
  /** the cart-icon registers its element here as the flight destination */
  registerTarget: (el: HTMLElement | null) => void;
  /** fire the fly-to-cart flourish from a given source image element */
  fly: (source: HTMLElement | null | undefined) => void;
}

const FlyTargetContext = createContext<FlyTargetValue | null>(null);

/**
 * Decouples "Add to cart" buttons (anywhere in the tree) from the cart icon
 * (in the navbar). The icon registers itself as the flight target; buttons call
 * `fly(sourceImg)` to launch the {@link flyToCart} flourish toward it.
 */
export function FlyTargetProvider({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<HTMLElement | null>(null);

  const registerTarget = useCallback((el: HTMLElement | null) => {
    targetRef.current = el;
  }, []);

  const fly = useCallback((source: HTMLElement | null | undefined) => {
    if (source && targetRef.current) flyToCart(source, targetRef.current);
  }, []);

  const value = useMemo(() => ({ registerTarget, fly }), [registerTarget, fly]);

  return (
    <FlyTargetContext.Provider value={value}>
      {children}
    </FlyTargetContext.Provider>
  );
}

export function useFlyTarget(): FlyTargetValue {
  const ctx = useContext(FlyTargetContext);
  if (!ctx) throw new Error("useFlyTarget must be used within <FlyTargetProvider>");
  return ctx;
}
