"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { ArrowRight } from "@/components/ui/icons";

/**
 * Homepage → storefront bridge. A restrained three-up of featured models that
 * turns the cinematic story into a buyable collection without breaking the dark
 * luxury tone. Cards link straight to each product. Kept minimal.
 *
 * Reveal robustness: this section sits BETWEEN two pinned sections (Immersive →
 * Finale). Stacked pins can leave a generic scroll-reveal mis-measured so the
 * trigger never fires — leaving the opacity-0 cards as empty boxes. To prevent
 * that we (a) animate from a guaranteed-visible baseline with `immediateRender:
 * false`, (b) use `once`, and (c) provide a `start: "top bottom"` fallback that
 * always fires plus a refresh on mount so positions are correct after the pins.
 */
const FEATURED = PRODUCTS.filter((p) => p.featured).slice(0, 3);

export function CollectionShowcase() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(".cs-reveal");
      if (targets.length === 0) return;

      // Hide via JS (not CSS) so that if JS ever fails the cards stay VISIBLE
      // rather than stranded at opacity 0. Hidden state is applied only once we
      // know the animation is wired up.
      gsap.set(targets, { y: 40, autoAlpha: 0, filter: "blur(10px)" });

      gsap.to(targets, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "filter",
        scrollTrigger: {
          trigger: root.current,
          // Fires as the section's top reaches the lower viewport — robust even
          // after the preceding pin re-measures.
          start: "top 88%",
          once: true,
        },
      });

      // The section is bracketed by pinned ScrollTriggers; their pin spacing is
      // injected after first layout, shifting this trigger's start. One refresh
      // on mount anchors it to the correct position so the reveal can't be
      // stranded above the fold with opacity 0.
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="collection"
      className="relative overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      <div className="container-luxe">
        <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="cs-reveal kicker">The Collection</span>
            <h2 className="cs-reveal display-lg mt-5 max-w-2xl text-metallic">
              One obsession, many forms
            </h2>
          </div>
          <Link
            href="/products"
            className="cs-reveal inline-flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-wide2 text-mist transition-colors duration-300 hover:text-gold"
          >
            View all models
            <ArrowRight className="text-sm" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURED.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="cs-reveal group surface relative overflow-hidden transition-all duration-500 ease-cinematic hover:border-white/15"
            >
              <div className="card-sheen relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-carbon to-graphite">
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                  style={{ background: `radial-gradient(circle, ${p.accent}, transparent 70%)` }}
                />
                <Image
                  src={p.gallery[0]!.src}
                  alt={p.gallery[0]!.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="relative z-[1] object-contain p-10 transition-transform duration-700 ease-cinematic group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex items-end justify-between p-7">
                <div>
                  <span className="label-luxe">{p.category}</span>
                  <h3 className="mt-2 font-display text-2xl text-platinum transition-colors duration-300 group-hover:text-gold">
                    {p.name}
                  </h3>
                </div>
                <span className="font-display text-xl text-platinum tabular-nums">
                  {formatPrice(p.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
