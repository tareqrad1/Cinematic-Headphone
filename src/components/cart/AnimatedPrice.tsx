"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Smoothly tweens a currency value when it changes (subtotal updates) instead
 * of snapping. Writes text via a ref so the count-up never re-renders React.
 */
export function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = formatPrice(value);
      prev.current = value;
      return;
    }

    const obj = { v: prev.current };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatPrice(Math.round(obj.v));
      },
    });
    prev.current = value;
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {formatPrice(value)}
    </span>
  );
}
