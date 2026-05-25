"use client";

import { memo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ArrowRight } from "@/components/ui/icons";
import type { Product, ViewMode } from "@/types";

interface ProductCardProps {
  product: Product;
  view: ViewMode;
  /** disables priority/eager loading for below-the-fold cards */
  priority?: boolean;
}

/**
 * Premium product card. Two layouts (grid / list) share one component so the
 * view toggle is a pure prop change. Hover lifts the card, scales the image,
 * and sweeps a subtle sheen (CSS). The image element is handed to the
 * fly-to-cart flourish via a ref getter. Memoized — only re-renders when its
 * product / view actually change.
 */
function ProductCardBase({ product, view, priority = false }: ProductCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const hero = product.gallery[0]!;
  const href = `/products/${product.slug}`;
  const getFlySource = () => imgRef.current;

  const isList = view === "list";

  return (
    <article
      className={cn(
        "group surface relative overflow-hidden transition-all duration-500 ease-cinematic hover:border-white/15 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]",
        isList && "sm:flex sm:items-stretch",
      )}
    >
      {/* media */}
      <Link
        href={href}
        className={cn(
          "card-sheen relative block overflow-hidden bg-gradient-to-b from-carbon to-graphite",
          isList ? "aspect-[4/3] sm:aspect-auto sm:w-2/5" : "aspect-[4/5]",
        )}
        aria-label={`View ${product.name}`}
      >
        {/* accent glow tinted to the colourway */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${product.accent}, transparent 70%)` }}
        />
        <Image
          ref={imgRef}
          src={hero.src}
          alt={hero.alt}
          fill
          sizes={isList ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          priority={priority}
          className="relative z-[1] object-contain p-6 transition-transform duration-700 ease-cinematic group-hover:scale-[1.06] md:p-10"
        />

        {product.featured && (
          <span className="absolute left-4 top-4 z-[2] rounded-full border border-gold/40 bg-void/40 px-3 py-1 text-[10px] uppercase tracking-wide2 text-gold backdrop-blur-sm">
            Featured
          </span>
        )}
      </Link>

      {/* body */}
      <div
        className={cn(
          "flex flex-col p-6 md:p-7",
          isList && "sm:flex-1 sm:justify-center",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="label-luxe">{product.category}</span>
          <span className="label-luxe text-mist/70">{product.colorName}</span>
        </div>

        <Link href={href}>
          <h3 className="mt-3 font-display text-2xl leading-tight text-platinum transition-colors duration-300 group-hover:text-gold md:text-[1.7rem]">
            {product.name}
          </h3>
        </Link>

        <p
          className={cn(
            "mt-2 text-sm leading-relaxed text-mist",
            isList ? "max-w-xl" : "line-clamp-2",
          )}
        >
          {isList ? product.description : product.tagline}
        </p>

        <div
          className={cn(
            "mt-6 flex items-center gap-4",
            isList ? "flex-wrap" : "justify-between",
          )}
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-platinum tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-mist/60 line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AddToCartButton
              product={product}
              flySource={getFlySource}
              className="!px-5 !py-3 !text-[11px]"
            >
              Add to cart
            </AddToCartButton>
            {isList && (
              <Link
                href={href}
                className="btn-luxe !px-5 !py-3 !text-[11px]"
              >
                Details
                <ArrowRight className="text-sm" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
