"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/store/cart";
import { useFlyTarget } from "@/store/fly-target";
import { CartIcon } from "@/components/ui/icons";
import { prefersReducedMotion } from "@/lib/utils";

export function CartButton() {
  const { count, hydrated } = useCart();
  const { registerTarget } = useFlyTarget();

  const iconRef  = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const glowRef  = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    registerTarget(iconRef.current);
    return () => registerTarget(null);
  }, [registerTarget]);

  /* badge spring-pop on count increase */
  useEffect(() => {
    if (count > prevCount.current && !prefersReducedMotion()) {
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current,
          { scale: 0.3, rotate: -15 },
          { scale: 1, rotate: 0, duration: 0.55, ease: "back.out(3.5)" },
        );
      }
      /* glow pulse on the button itself */
      if (glowRef.current) {
        gsap.fromTo(glowRef.current,
          { opacity: 0.7, scale: 1 },
          { opacity: 0, scale: 1.8, duration: 0.7, ease: "power2.out" },
        );
      }
    }
    prevCount.current = count;
  }, [count]);

  return (
    <Link
      href="/cart"
      aria-label={`View cart${count > 0 ? `, ${count} ${count === 1 ? "item" : "items"}` : ""}`}
      className="group relative flex h-10 w-10 items-center justify-center"
    >
      {/* radial glow ring — pulses when item added, fades to ambient on hover */}
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 rounded-full
                   bg-gold/20 opacity-0 blur-[6px]
                   transition-opacity duration-500 group-hover:opacity-40"
      />

      {/* circular border ring — visible on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full border border-gold/0
                   transition-all duration-500 group-hover:border-gold/30
                   group-hover:shadow-[0_0_14px_2px_rgba(200,164,92,0.2)]"
      />

      {/* icon */}
      <span
        ref={iconRef}
        className="relative z-[1] inline-flex text-[1.15rem] text-mist/70
                   transition-colors duration-300 group-hover:text-gold"
      >
        <CartIcon />
      </span>

      {/* count badge */}
      {hydrated && count > 0 && (
        <span
          ref={badgeRef}
          className="absolute -right-1 -top-1 z-[2] flex h-[18px] min-w-[18px]
                     items-center justify-center rounded-full
                     bg-gold px-1 font-sans text-[9px] font-bold
                     tabular-nums text-void shadow-[0_0_8px_2px_rgba(200,164,92,0.45)]"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
