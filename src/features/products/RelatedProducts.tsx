"use client";

import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

/** A small curated rail of sibling models shown beneath the detail page. */
export function RelatedProducts({ products }: { products: ReadonlyArray<Product> }) {
  const root = useGsapReveal<HTMLDivElement>({ selector: ".rp-reveal" });
  if (products.length === 0) return null;

  return (
    <section ref={root} className="container-luxe border-t border-white/[0.06] py-24">
      <span className="rp-reveal reveal-hidden kicker">More from AURORA</span>
      <h2 className="rp-reveal reveal-hidden mt-4 font-display text-4xl text-platinum md:text-5xl">
        You may also like
      </h2>
      <div className="rp-reveal reveal-hidden mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view="grid" />
        ))}
      </div>
    </section>
  );
}
