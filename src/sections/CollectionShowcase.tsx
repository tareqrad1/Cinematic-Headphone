"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { ArrowRight } from "@/components/ui/icons";

/**
 * Pick the 3 best cover-image featured products for the hero showcase.
 * sol-edition (gold), wave-blue (blue), bw-amber (amber) — three distinct
 * accent palettes that look great side-by-side.
 */
const SHOWCASE = ["sol-edition", "wave-blue", "bw-amber"]
  .map((slug) => PRODUCTS.find((p) => p.slug === slug)!)
  .filter(Boolean);

export function CollectionShowcase() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // header
      gsap.set(".cs-header", { y: 48, opacity: 0, filter: "blur(12px)" });
      gsap.to(".cs-header", {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1.1, stagger: 0.12, ease: "power3.out",
        clearProps: "opacity,filter,transform",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });

      // cards stagger in from below
      gsap.set(".cs-card", { y: 80, opacity: 0, filter: "blur(14px)" });
      gsap.to(".cs-card", {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1.15, stagger: 0.18, ease: "power3.out",
        clearProps: "opacity,filter,transform",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });

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
      {/* ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(200,164,92,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container-luxe">
        {/* ── header ── */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="cs-header kicker">The Collection</span>
            <h2 className="cs-header display-lg mt-5 max-w-2xl text-metallic">
              One obsession, many forms
            </h2>
            <p className="cs-header mt-4 max-w-sm text-sm leading-relaxed text-mist/60">
              Every model a distinct statement. Every driver tuned to one truth.
            </p>
          </div>
          <Link
            href="/products"
            className="cs-header group inline-flex items-center gap-2.5 whitespace-nowrap
                       rounded-full border border-white/10 px-6 py-3 text-xs uppercase
                       tracking-wide2 text-mist transition-all duration-500
                       hover:border-gold/50 hover:text-gold"
          >
            View all models
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── showcase grid ── */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {SHOWCASE.map((p, i) => (
            <ShowcaseCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {/* ── bottom cta strip ── */}
        <div className="cs-header mt-12 flex items-center justify-between border-t border-white/[0.06] pt-8">
          <div className="flex items-center gap-6">
            {SHOWCASE.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: p.accent,
                    boxShadow: `0 0 8px 2px ${p.accent}55`,
                  }}
                />
                <span className="hidden text-[11px] tracking-wide2 text-mist/40 sm:block">
                  {p.colorName}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[11px] uppercase tracking-luxe text-mist/20">
            Aurora Acoustics
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── individual showcase card ───────────────────────────────────────────── */

function ShowcaseCard({
  product: p,
  index,
}: {
  product: (typeof SHOWCASE)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at ${x}% ${y}%, ${p.accent}40 0%, transparent 60%)`,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(cardRef.current, {
      rotateX: (y - 50) * -0.05,
      rotateY: (x - 50) * 0.05,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 900,
    });
  }

  function onMouseLeave() {
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 60%)`,
      duration: 0.6,
    });
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.7, ease: "power2.out",
    });
  }

  /* first card is taller — visual hierarchy */
  const isFeatured = index === 0;

  return (
    <Link
      ref={cardRef}
      href={`/products/${p.slug}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="cs-card group relative overflow-hidden rounded-2xl border border-white/[0.07]
                 bg-white/[0.02] transition-[border-color,box-shadow] duration-700 ease-cinematic
                 hover:border-white/[0.16] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
      style={{ willChange: "transform" }}
      aria-label={`View ${p.name}`}
    >
      {/* cursor-tracked glow */}
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 60%)` }}
      />

      {/* image */}
      <div
        className={
          isFeatured ? "relative aspect-[3/4]" : "relative aspect-[3/4]"
        }
      >
        {/* accent bloom */}
        <span
          className="pointer-events-none absolute inset-0 z-[1] opacity-30 transition-opacity
                     duration-700 group-hover:opacity-50"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${p.accent} 0%, transparent 70%)`,
          }}
        />

        <Image
          src={p.gallery[0]!.src}
          alt={p.gallery[0]!.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="relative z-[2] object-cover transition-transform duration-700
                     ease-cinematic group-hover:scale-[1.05]"
        />

        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 z-[3] h-2/5 bg-gradient-to-t from-void/95 via-void/50 to-transparent" />

        {/* card text overlay */}
        <div className="absolute inset-x-0 bottom-0 z-[4] p-7">
          {p.featured && (
            <span
              className="mb-3 inline-block rounded-full border border-gold/40 bg-void/60
                         px-3 py-1 text-[10px] uppercase tracking-wide2 text-gold backdrop-blur-sm"
            >
              Featured
            </span>
          )}
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="label-luxe block text-mist/60">{p.category}</span>
              <h3
                className="mt-1.5 font-display text-2xl leading-tight text-platinum
                           transition-colors duration-300 group-hover:text-gold md:text-[1.7rem]"
              >
                {p.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-mist/50">{p.tagline}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="font-display text-xl text-platinum tabular-nums">
                {formatPrice(p.price)}
              </span>
              <span
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide2
                           text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                View
                <ArrowRight className="text-xs" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
