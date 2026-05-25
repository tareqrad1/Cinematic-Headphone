"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/store/cart";
import { useFlyTarget } from "@/store/fly-target";
import { CartIcon } from "@/components/ui/icons";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Navbar cart trigger. Registers its inner icon as the fly-to-cart destination
 * and animates the count badge whenever it changes (pop on increase). The badge
 * only renders after hydration so SSR markup matches the empty initial state.
 */
export function CartButton() {
  const { count, toggle, hydrated } = useCart();
  const { registerTarget } = useFlyTarget();

  const iconRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    registerTarget(iconRef.current);
    return () => registerTarget(null);
  }, [registerTarget]);

  useEffect(() => {
    if (count > prevCount.current && badgeRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4 },
        { scale: 1, duration: 0.5, ease: "back.out(3)" },
      );
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Open cart, ${count} items`}
      className="relative flex h-10 w-10 items-center justify-center text-platinum transition-colors duration-300 hover:text-gold"
    >
      <span ref={iconRef} className="inline-flex">
        <CartIcon className="text-xl" />
      </span>
      {hydrated && count > 0 && (
        <span
          ref={badgeRef}
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold tabular-nums text-void"
        >
          {count}
        </span>
      )}
    </button>
  );
}
