"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/store/cart";
import { useFlyTarget } from "@/store/fly-target";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  flySource?: () => HTMLElement | null | undefined;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  quantity = 1,
  flySource,
  className,
  children = "Add to cart",
}: AddToCartButtonProps) {
  const { add } = useCart();
  const { fly } = useFlyTarget();
  const [added, setAdded] = useState(false);
  const timer    = useRef<number | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const checkRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    if (added) return;
    fly(flySource?.());
    add(product, quantity);
    setAdded(true);

    // animate label out → check in
    if (labelRef.current && checkRef.current) {
      gsap.to(labelRef.current, { y: -10, autoAlpha: 0, duration: 0.18, ease: "power2.in" });
      gsap.fromTo(checkRef.current,
        { y: 10, autoAlpha: 0, scale: 0.6 },
        { y: 0,  autoAlpha: 1, scale: 1, duration: 0.32, ease: "back.out(2.5)", delay: 0.14 },
      );
    }

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAdded(false);
      // animate back
      if (labelRef.current && checkRef.current) {
        gsap.to(checkRef.current, { y: -10, autoAlpha: 0, duration: 0.18, ease: "power2.in" });
        gsap.fromTo(labelRef.current,
          { y: 10, autoAlpha: 0 },
          { y: 0,  autoAlpha: 1, duration: 0.3, ease: "power3.out", delay: 0.14 },
        );
      }
    }, 1800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
      className={cn(
        "btn-gold relative overflow-hidden",
        added && "!bg-[#4a7c59] !shadow-[0_10px_40px_-8px_rgba(74,124,89,0.55)]",
        className,
      )}
    >
      {/* default label */}
      <span
        ref={labelRef}
        className="inline-flex items-center gap-2"
        style={{ visibility: added ? "hidden" : "visible" }}
      >
        {children}
      </span>

      {/* added confirmation — absolutely positioned so it doesn't shift layout */}
      <span
        ref={checkRef}
        className="absolute inset-0 inline-flex items-center justify-center gap-2"
        style={{ opacity: 0, visibility: added ? "visible" : "hidden" }}
        aria-hidden={!added}
      >
        <CheckIcon className="text-base" />
        Added
      </span>
    </button>
  );
}
