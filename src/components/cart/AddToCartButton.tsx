"use client";

import { useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { useFlyTarget } from "@/store/fly-target";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  /** the product image element to launch the fly-to-cart clone from */
  flySource?: () => HTMLElement | null | undefined;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Adds a product to the cart, launches the fly-to-cart flourish from a supplied
 * source image, and shows a brief "Added" confirmation. Variant-agnostic — the
 * caller styles it (gold primary, ghost, etc.) via className.
 */
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
  const timer = useRef<number | null>(null);

  const handleClick = () => {
    fly(flySource?.());
    add(product, quantity);
    setAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
      className={cn("btn-gold", className)}
    >
      {added ? (
        <>
          <CheckIcon className="text-base" />
          Added
        </>
      ) : (
        children
      )}
    </button>
  );
}
