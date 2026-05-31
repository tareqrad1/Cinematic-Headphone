"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Product } from "@/types";

/* ─── individual card ─────────────────────────────────────────────────────── */

function RelatedCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hero = product.gallery[0]!;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at ${x}% ${y}%, ${product.accent}55 0%, transparent 65%)`,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      rotateX: (y - 50) * -0.06,
      rotateY: (x - 50) * 0.06,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }

  function onMouseLeave() {
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at 50% 50%, ${product.accent}22 0%, transparent 65%)`,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]
                 transition-[border-color,box-shadow] duration-700 ease-cinematic
                 hover:border-white/[0.14] hover:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)]"
      style={{ willChange: "transform" }}
    >
      {/* ambient glow that follows the cursor */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${product.accent}22 0%, transparent 65%)`,
        }}
      />

      {/* image area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-carbon to-graphite"
        aria-label={`View ${product.name}`}
      >
        {/* static accent bloom */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%]
                     -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl
                     transition-opacity duration-700 group-hover:opacity-60"
          style={{ background: `radial-gradient(circle, ${product.accent}, transparent 70%)` }}
        />

        <Image
          ref={imgRef}
          src={hero.src}
          alt={hero.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="relative z-[1] object-contain p-8 transition-transform duration-700
                     ease-cinematic group-hover:scale-[1.07]"
        />

        {product.featured && (
          <span
            className="absolute left-4 top-4 z-[2] rounded-full border border-gold/40
                       bg-void/60 px-3 py-1 text-[10px] uppercase tracking-wide2 text-gold backdrop-blur-sm"
          >
            Featured
          </span>
        )}

        {/* bottom fade into card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-graphite/80 to-transparent" />
      </Link>

      {/* card body */}
      <div className="relative z-[1] p-6">
        <div className="flex items-center justify-between">
          <span className="label-luxe">{product.category}</span>
          <span
            className="h-2 w-2 rounded-full opacity-70 ring-2 ring-white/10"
            style={{ background: product.accent }}
          />
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3
            className="mt-3 font-display text-2xl leading-tight text-platinum
                       transition-colors duration-300 group-hover:text-gold md:text-[1.65rem]"
          >
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">
          {product.tagline}
        </p>

        {/* price + cta */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-platinum tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-mist/50 line-through tabular-nums">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <AddToCartButton
            product={product}
            flySource={() => imgRef.current}
            className="!px-5 !py-2.5 !text-[11px]"
          >
            Add to cart
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}

/* ─── section ─────────────────────────────────────────────────────────────── */

export function RelatedProducts({ products }: { products: ReadonlyArray<Product> }) {
  const root = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>(".rp-card");
    const heading = headingRef.current;
    const line = lineRef.current;

    // initial states
    if (heading) gsap.set(heading, { opacity: 0, y: 40, filter: "blur(12px)" });
    if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(cards, { opacity: 0, y: 64, filter: "blur(14px)" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          if (entry.target === el) {
            // Heading + line
            const tl = gsap.timeline();
            if (heading) {
              tl.to(heading, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.1,
                ease: "power3.out",
              });
            }
            if (line) {
              tl.to(
                line,
                { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
                "-=0.7",
              );
            }

            // Cards stagger after heading
            tl.to(
              cards,
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.1,
                stagger: 0.15,
                ease: "power3.out",
              },
              "-=0.5",
            );
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-white/[0.06] py-28"
    >
      {/* full-width ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(200,164,92,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container-luxe">
        {/* ── header ── */}
        <div ref={headingRef} className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker mb-3 block">More from AURORA</span>
            <h2 className="font-display text-4xl leading-tight text-platinum md:text-5xl lg:text-6xl">
              You may{" "}
              <span
                className="animate-shimmer bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, #c8a45c 0%, #f0d898 35%, #c8a45c 55%, #9a7a3a 75%, #c8a45c 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                }}
              >
                also like
              </span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist/60">
              Crafted from the same acoustic philosophy —<br className="hidden sm:block" /> different form, same soul.
            </p>
          </div>

          {/* animated rule line on the right */}
          <div className="hidden md:flex md:flex-col md:items-end md:gap-2">
            <div
              ref={lineRef}
              className="h-px w-48 bg-gradient-to-r from-gold/60 via-gold/20 to-transparent"
            />
            <span className="text-[10px] uppercase tracking-luxe text-mist/30">
              Curated selection
            </span>
          </div>
        </div>

        {/* ── cards ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rp-card">
              <RelatedCard product={p} />
            </div>
          ))}
        </div>

        {/* ── footer ornament ── */}
        <div className="mt-20 flex items-center gap-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="flex items-center gap-2.5">
            <span
              className="h-1 w-1 rounded-full bg-gold/50"
              style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.3)" }}
            />
            <span className="text-[10px] uppercase tracking-luxe text-mist/25">Aurora</span>
            <span
              className="h-1 w-1 rounded-full bg-gold/50"
              style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.3)" }}
            />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.07] to-transparent" />
        </div>
      </div>
    </section>
  );
}
