"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { prefersReducedMotion } from "@/lib/utils";
import { ArrowRight } from "@/components/ui/icons";
import type { Product } from "@/types";

/* ─── single card ─────────────────────────────────────────────────────────── */

function RelatedCard({ product }: { product: Product }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const glowRef  = useRef<HTMLSpanElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const infoRef  = useRef<HTMLDivElement>(null);
  const hero     = product.gallery[0]!;

  function onEnter() {
    if (prefersReducedMotion()) return;
    gsap.to(imgRef.current,   { scale: 1.07, duration: 0.7, ease: "power2.out" });
    gsap.to(scrimRef.current, { opacity: 1,  duration: 0.4, ease: "power2.out" });
    gsap.fromTo(infoRef.current,
      { y: 10, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.4, ease: "power3.out" },
    );
  }

  function onLeave() {
    if (prefersReducedMotion()) return;
    gsap.to(imgRef.current,   { scale: 1,   duration: 0.6, ease: "power2.out" });
    gsap.to(scrimRef.current, { opacity: 0, duration: 0.35 });
    gsap.to(infoRef.current,  { opacity: 0, y: 6, duration: 0.25 });
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion() || !glowRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at ${x}% ${y}%, ${product.accent}35 0%, transparent 65%)`,
      duration: 0.4, ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      rotateX: ((e.clientY - r.top)  / r.height - 0.5) * -6,
      rotateY: ((e.clientX - r.left) / r.width  - 0.5) *  6,
      transformPerspective: 900, duration: 0.4, ease: "power2.out",
    });
  }

  function onMouseLeave() {
    onLeave();
    if (!prefersReducedMotion()) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07]
                 transition-[border-color,box-shadow] duration-500
                 hover:border-white/[0.16]
                 hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.9)]"
      style={{ willChange: "transform", transformStyle: "preserve-3d" }}
    >
      {/* cursor glow */}
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${product.accent}18 0%, transparent 65%)` }}
      />

      {/* image — full cover portrait */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden"
        aria-label={`View ${product.name}`}
        tabIndex={0}
      >
        {/* accent bloom */}
        <span
          className="pointer-events-none absolute inset-0 z-[1] opacity-40
                     transition-opacity duration-700 group-hover:opacity-65"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 80%,
              ${product.accent}70 0%, transparent 70%)`,
          }}
        />

        <Image
          ref={imgRef}
          src={hero.src}
          alt={hero.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="relative z-[2] object-cover"
          style={{ willChange: "transform" }}
        />

        {/* permanent bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3]
                        h-3/5 bg-gradient-to-t from-void via-void/70 to-transparent" />

        {/* top vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3]
                        h-20 bg-gradient-to-b from-void/40 to-transparent" />

        {/* featured badge */}
        {product.featured && (
          <span className="absolute left-4 top-4 z-[4] rounded-full border border-gold/40
                           bg-void/60 px-3 py-1 text-[10px] uppercase tracking-wide2
                           text-gold backdrop-blur-sm">
            Featured
          </span>
        )}

        {/* hover scrim */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0 z-[3] opacity-0"
          style={{ background: "linear-gradient(to top, rgba(5,5,6,0.5) 0%, transparent 60%)" }}
        />

        {/* permanent bottom info */}
        <div className="absolute inset-x-0 bottom-0 z-[5] px-5 pb-5">
          {/* category */}
          <span className="label-luxe block">{product.category}</span>

          {/* name */}
          <h3 className="mt-1.5 font-display text-[1.4rem] leading-tight text-platinum
                         transition-colors duration-300 group-hover:text-gold">
            {product.name}
          </h3>

          {/* color dot + price row */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full ring-1 ring-white/10"
                style={{
                  background: product.accent,
                  boxShadow: `0 0 5px 2px ${product.accent}55`,
                }}
              />
              <span className="text-[11px] uppercase tracking-wide2 text-mist/50">
                {product.colorName}
              </span>
            </div>
            <span className="font-display text-lg tabular-nums text-platinum">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* hover CTA row */}
          <div
            ref={infoRef}
            className="mt-4 flex items-center gap-2 opacity-0"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px]
                             uppercase tracking-wide2 text-gold">
              View details
              <ArrowRight className="text-[10px] transition-transform duration-300
                                     group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* add to cart — sits below image, outside the Link */}
      <div className="relative z-[1] border-t border-white/[0.05] bg-white/[0.02] px-5 py-3.5">
        <AddToCartButton
          product={product}
          flySource={() => imgRef.current}
          className="w-full !py-3 !text-[11px]"
        >
          Add to cart
        </AddToCartButton>
      </div>
    </div>
  );
}

/* ─── section ─────────────────────────────────────────────────────────────── */

export function RelatedProducts({ products }: { products: ReadonlyArray<Product> }) {
  const root       = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const cards   = el.querySelectorAll<HTMLElement>(".rp-card");
    const heading = headingRef.current;
    const line    = lineRef.current;

    if (heading) gsap.set(heading, { opacity: 0, y: 40, filter: "blur(12px)" });
    if (line)    gsap.set(line,    { scaleX: 0, transformOrigin: "left center" });
    gsap.set(cards, { opacity: 0, y: 56, filter: "blur(10px)" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const tl = gsap.timeline();
          if (heading) {
            tl.to(heading, {
              opacity: 1, y: 0, filter: "blur(0px)",
              duration: 1.0, ease: "power3.out", clearProps: "filter",
            });
          }
          if (line) {
            tl.to(line, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, "-=0.7");
          }
          tl.to(cards, {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.9, stagger: 0.13, ease: "power3.out",
            clearProps: "filter",
          }, "-=0.5");
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-white/[0.05] py-28"
    >
      {/* ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(200,164,92,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container-luxe">
        {/* ── header ── */}
        <div
          ref={headingRef}
          className="mb-14 flex flex-col items-start gap-4
                     md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="kicker">More from AURORA</span>
            </div>
            <h2 className="mt-4 font-display text-4xl leading-tight text-platinum
                           md:text-5xl lg:text-[3.5rem]">
              You may{" "}
              <span
                className="animate-shimmer bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg,#c8a45c 0%,#f0d898 35%,#c8a45c 55%,#9a7a3a 75%,#c8a45c 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                }}
              >
                also like
              </span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist/50">
              Crafted from the same acoustic philosophy —{" "}
              <br className="hidden sm:block" />
              different form, same soul.
            </p>
          </div>

          {/* animated rule */}
          <div className="hidden md:flex md:flex-col md:items-end md:gap-2">
            <div
              ref={lineRef}
              className="h-px w-48 bg-gradient-to-r from-gold/60 via-gold/20 to-transparent"
            />
            <span className="text-[10px] uppercase tracking-luxe text-mist/25">
              Curated selection
            </span>
          </div>
        </div>

        {/* ── cards ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rp-card">
              <RelatedCard product={p} />
            </div>
          ))}
        </div>

        {/* ── footer ornament ── */}
        <div className="mt-20 flex items-center gap-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-gold/50"
              style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.3)" }} />
            <span className="text-[10px] uppercase tracking-luxe text-mist/20">Aurora</span>
            <span className="h-1 w-1 rounded-full bg-gold/50"
              style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.3)" }} />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
}
