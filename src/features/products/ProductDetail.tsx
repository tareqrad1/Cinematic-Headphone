"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { formatPrice } from "@/lib/products";
import { ProductGallery, type ProductGalleryHandle } from "./ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { ArrowLeft, CheckIcon } from "@/components/ui/icons";
import type { Product } from "@/types";

/**
 * Premium product detail experience: luxury gallery on the left (sticky), a
 * sticky purchase column on the right. Copy reveals on mount with the house
 * stagger. Add-to-cart launches the fly-to-cart flourish from the active
 * gallery image.
 */
export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const galleryRef = useRef<ProductGalleryHandle>(null);
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pd-reveal", {
        y: 30,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="container-luxe pb-32 pt-28 md:pt-32">
      <Link
        href="/products"
        className="pd-reveal mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-wide2 text-mist transition-colors duration-300 hover:text-gold"
      >
        <ArrowLeft className="text-sm" />
        The Collection
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* gallery — NOT part of pd-reveal so the image loads immediately */}
        <div>
          <ProductGallery ref={galleryRef} images={product.gallery} accent={product.accent} coverImage={product.coverImage} />
        </div>

        {/* purchase column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-3">
            <span className="label-luxe">{product.category}</span>
            {product.featured && (
              <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-wide2 text-gold">
                Featured
              </span>
            )}
          </div>

          <h1 className="pd-reveal mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] text-metallic">
            {product.name}
          </h1>
          <p className="pd-reveal mt-3 text-lg text-mist">{product.tagline}</p>

          <div className="pd-reveal mt-7 flex items-baseline gap-3">
            <span className="font-display text-4xl text-platinum tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-mist/60 line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="ml-1 text-xs uppercase tracking-wide2 text-mist">
              {product.colorName}
            </span>
          </div>

          <p className="pd-reveal mt-7 max-w-prose leading-relaxed text-mist">
            {product.description}
          </p>

          {/* highlights */}
          <ul className="pd-reveal mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-platinum/90">
                <CheckIcon className="mt-0.5 shrink-0 text-base text-gold" />
                {h}
              </li>
            ))}
          </ul>

          {/* buy actions */}
          <div className="pd-reveal mt-10 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-8">
            <QuantityStepper value={qty} onChange={setQty} size="md" />
            <AddToCartButton
              product={product}
              quantity={qty}
              flySource={() => galleryRef.current?.getActiveImage()}
              className="flex-1 !py-4"
            >
              Add to cart · {formatPrice(product.price * qty)}
            </AddToCartButton>
          </div>
          <p className="pd-reveal mt-4 text-xs text-mist">
            Free worldwide shipping · 2-year warranty · 30-day returns
          </p>

          {/* specs */}
          <dl className="pd-reveal mt-10 divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between py-3.5">
                <dt className="text-sm text-mist">{spec.label}</dt>
                <dd className="text-sm text-platinum tabular-nums">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
