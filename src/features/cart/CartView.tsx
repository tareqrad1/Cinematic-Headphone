"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/utils";
import { TrashIcon, ArrowRight, ArrowLeft, CheckIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { AnimatedPrice } from "@/components/cart/AnimatedPrice";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 25;

/* ─────────────────────────────────────────────────────────────────────────── */

export function CartView() {
  const { lines, subtotal, count, remove, setQuantity, hydrated } = useCart();
  const root    = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);   // gold divider line

  /* ── entrance ── */
  useIsomorphicLayoutEffect(() => {
    if (!root.current || !hydrated) return;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) return;

      // header badge + title
      gsap.from(".cv-title", {
        y: 40, opacity: 0, filter: "blur(10px)",
        duration: 0.9, ease: "power3.out", clearProps: "opacity,filter,transform",
      });

      // gold rule extends in
      gsap.fromTo(".cv-rule",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut", delay: 0.15 },
      );

      // line items stagger up
      gsap.from(".cv-item", {
        y: 36, opacity: 0, filter: "blur(8px)",
        duration: 0.75, stagger: 0.1, ease: "power3.out",
        clearProps: "opacity,filter,transform", delay: 0.2,
      });

      // sidebar
      gsap.from(".cv-aside", {
        y: 24, opacity: 0, filter: "blur(6px)",
        duration: 0.8, ease: "power3.out",
        clearProps: "opacity,filter,transform", delay: 0.35,
      });
    }, root);
    return () => ctx.revert();
  }, [hydrated]);

  /* ── animated removal ── */
  const handleRemove = (id: string) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-item="${id}"]`);
    if (!el || prefersReducedMotion()) { remove(id); return; }
    gsap.to(el, {
      opacity: 0, x: 48,
      height: 0, marginBottom: 0,
      paddingTop: 0, paddingBottom: 0,
      duration: 0.4, ease: "power2.in",
      onComplete: () => remove(id),
    });
  };

  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total    = subtotal + shipping;
  const progress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  /* ── empty ── */
  if (hydrated && count === 0) {
    return <EmptyState />;
  }

  return (
    <div ref={root} className="relative min-h-screen bg-void overflow-hidden">

      {/* ambient background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,164,92,0.07) 0%, transparent 70%)",
        }}
      />

      {/* top gold hairline */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container-luxe pb-40 pt-28 md:pt-32">

        {/* ── back ── */}
        <Link
          href="/products"
          className="group mb-12 inline-flex items-center gap-2 text-[11px] uppercase
                     tracking-wide2 text-mist/40 transition-colors duration-300 hover:text-gold"
        >
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Collection
        </Link>

        {/* ── hero header ── */}
        <div className="cv-title mb-14">
          <span className="kicker mb-4 block">Your selection</span>
          <div className="flex items-end gap-5">
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.94] text-metallic">
              Cart
            </h1>
            {/* item count pill */}
            <span className="mb-2 flex h-8 min-w-8 items-center justify-center rounded-full
                             border border-gold/30 bg-gold/10 px-3 font-display text-xl
                             tabular-nums text-gold">
              {count}
            </span>
          </div>
          {/* animated gold rule */}
          <div
            ref={lineRef}
            className="cv-rule mt-6 h-px w-full origin-left bg-gradient-to-r
                       from-gold/50 via-gold/15 to-transparent"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">

          {/* ─────────── line items ─────────── */}
          <div className="space-y-6">

            {/* shipping banner */}
            {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-6 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wide2 text-mist/50">
                    Free shipping progress
                  </span>
                  <span className="text-[11px] tabular-nums text-gold">
                    {formatPrice(SHIPPING_THRESHOLD - subtotal)} away
                  </span>
                </div>
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/70 to-gold
                               transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${progress}%` }}
                  />
                  {/* moving shimmer on the bar */}
                  <div
                    className="absolute inset-y-0 rounded-full bg-white/20 blur-[1px]
                               transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ left: `${Math.max(0, progress - 6)}%`, width: "6%" }}
                  />
                </div>
              </div>
            )}

            {subtotal >= SHIPPING_THRESHOLD && (
              <div className="flex items-center gap-3 rounded-2xl border border-gold/25
                             bg-gold/[0.04] px-6 py-3.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
                  <CheckIcon className="text-[10px] text-gold" />
                </span>
                <span className="text-[11px] uppercase tracking-wide2 text-gold">
                  Free shipping unlocked
                </span>
              </div>
            )}

            {/* items */}
            <ul ref={listRef} className="space-y-4">
              {lines.map((line) => (
                <CartItem
                  key={line.product.id}
                  line={line}
                  onRemove={handleRemove}
                  onQuantityChange={(q) => setQuantity(line.product.id, q)}
                />
              ))}
            </ul>
          </div>

          {/* ─────────── summary ─────────── */}
          <aside className="cv-aside lg:sticky lg:top-28 lg:self-start">
            <SummaryPanel
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              count={count}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* CartItem                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

interface CartLine { product: import("@/types").Product; quantity: number }

function CartItem({
  line,
  onRemove,
  onQuantityChange,
}: {
  line: CartLine;
  onRemove: (id: string) => void;
  onQuantityChange: (q: number) => void;
}) {
  const itemRef  = useRef<HTMLLIElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLSpanElement>(null);

  /* card tilt on mouse move */
  function onMouseMove(e: React.MouseEvent<HTMLLIElement>) {
    if (prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
    const gx = ((e.clientX - rect.left) / rect.width) * 100;
    const gy = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(itemRef.current, {
      rotateX: y, rotateY: x, transformPerspective: 900,
      duration: 0.4, ease: "power2.out",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(circle at ${gx}% ${gy}%, ${line.product.accent}22 0%, transparent 65%)`,
        duration: 0.4, ease: "power2.out",
      });
    }
  }

  function onMouseLeave() {
    if (prefersReducedMotion()) return;
    gsap.to(itemRef.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.7, ease: "power2.out",
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 65%)",
        duration: 0.5,
      });
    }
  }

  return (
    <li
      ref={itemRef}
      data-item={line.product.id}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="cv-item group relative overflow-hidden rounded-2xl border border-white/[0.07]
                 bg-white/[0.02] transition-[border-color] duration-500
                 hover:border-white/[0.14]"
      style={{ willChange: "transform" }}
    >
      {/* cursor-tracked glow */}
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 65%)" }}
      />

      <div className="relative z-[1] flex gap-0">

        {/* ── image block ── */}
        <Link
          href={`/products/${line.product.slug}`}
          className="relative w-[120px] shrink-0 overflow-hidden sm:w-[140px]"
          aria-label={`View ${line.product.name}`}
        >
          {/* accent bloom */}
          <span
            className="pointer-events-none absolute inset-0 z-[1] opacity-60 transition-opacity
                       duration-700 group-hover:opacity-80"
            style={{
              background: `radial-gradient(ellipse 100% 80% at 50% 80%, ${line.product.accent}60 0%, transparent 70%)`,
            }}
          />
          <div ref={imageRef} className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={line.product.gallery[0]!.src}
              alt={line.product.gallery[0]!.alt}
              fill
              sizes="140px"
              className="relative z-[2] object-cover transition-transform duration-700
                         ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          </div>
          {/* right fade into card body */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-8
                          bg-gradient-to-r from-transparent to-[#0a0b0e]/60" />
        </Link>

        {/* ── details ── */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-5 py-5">

          {/* top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* category */}
              <span className="label-luxe block">{line.product.category}</span>

              {/* name */}
              <Link
                href={`/products/${line.product.slug}`}
                className="mt-1.5 block font-display text-2xl leading-tight text-platinum
                           transition-colors duration-300 group-hover:text-gold md:text-[1.65rem]"
              >
                {line.product.name}
              </Link>

              {/* color */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
                  style={{
                    background: line.product.accent,
                    boxShadow: `0 0 6px 2px ${line.product.accent}55`,
                  }}
                />
                <span className="text-[11px] uppercase tracking-wide2 text-mist/50">
                  {line.product.colorName}
                </span>
              </div>
            </div>

            {/* remove */}
            <button
              type="button"
              aria-label={`Remove ${line.product.name}`}
              onClick={() => onRemove(line.product.id)}
              className="mt-0.5 shrink-0 rounded-xl p-2 text-mist/25
                         transition-all duration-300
                         hover:bg-red-500/10 hover:text-red-400"
            >
              <TrashIcon className="text-sm" />
            </button>
          </div>

          {/* bottom row */}
          <div className="mt-5 flex items-end justify-between gap-4">
            <QuantityStepper
              value={line.quantity}
              onChange={onQuantityChange}
              size="sm"
            />
            <div className="text-right">
              <div className="font-display text-2xl tabular-nums text-platinum">
                {formatPrice(line.product.price * line.quantity)}
              </div>
              {line.quantity > 1 && (
                <div className="mt-0.5 text-[11px] tabular-nums text-mist/35">
                  {formatPrice(line.product.price)} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* SummaryPanel                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

function SummaryPanel({
  subtotal, shipping, total, count,
}: {
  subtotal: number; shipping: number; total: number; count: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* subtle entrance parallax on scroll */
  useEffect(() => {
    if (!panelRef.current || prefersReducedMotion()) return;
    gsap.fromTo(panelRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "opacity,transform", delay: 0.4 },
    );
  }, []);

  return (
    <div ref={panelRef} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0b0e]/80 backdrop-blur-2xl">

      {/* header */}
      <div className="relative border-b border-white/[0.06] px-7 py-6">
        {/* top accent hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <h2 className="font-display text-2xl text-platinum">Summary</h2>
        <p className="mt-1 text-[11px] uppercase tracking-wide2 text-mist/40">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      {/* rows */}
      <div className="space-y-3 px-7 py-6">
        <SummaryRow
          label="Subtotal"
          value={<AnimatedPrice value={subtotal} className="tabular-nums text-mist/80 text-sm" />}
        />
        <SummaryRow
          label="Shipping"
          value={
            shipping === 0
              ? <span className="text-sm font-medium text-gold">Free</span>
              : <span className="text-sm tabular-nums text-mist/80">{formatPrice(shipping)}</span>
          }
        />
        <p className="pt-1 text-[11px] uppercase tracking-wide2 text-mist/30">
          Tax calculated at checkout
        </p>
      </div>

      {/* total */}
      <div className="flex items-baseline justify-between border-t border-white/[0.06] px-7 py-6">
        <span className="text-sm uppercase tracking-wide2 text-mist/60">Total</span>
        <AnimatedPrice
          value={total}
          className="font-display text-[2.2rem] tabular-nums text-platinum"
        />
      </div>

      {/* CTAs */}
      <div className="space-y-3 px-7 pb-7">
        {/* primary */}
        <Link
          href="/checkout"
          className="group relative flex w-full items-center justify-center gap-3
                     overflow-hidden rounded-full bg-gold px-8 py-4 text-xs font-semibold
                     uppercase tracking-wide2 text-void
                     transition-all duration-500
                     hover:bg-[#d8b46c] hover:shadow-[0_16px_48px_-8px_rgba(200,164,92,0.65)]"
        >
          {/* sweep shimmer */}
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg]
                       bg-white/20 transition-transform duration-700
                       group-hover:translate-x-[200%]"
          />
          Checkout
          <ArrowRight className="relative z-[1] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* secondary */}
        <Link
          href="/products"
          className="group flex w-full items-center justify-center gap-2 rounded-full
                     border border-white/[0.08] py-3.5 text-[11px] uppercase tracking-wide2
                     text-mist/50 transition-all duration-300
                     hover:border-gold/30 hover:text-gold"
        >
          <ArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-0.5" />
          Continue shopping
        </Link>
      </div>

      {/* trust row */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.05] border-t border-white/[0.05]">
        {[
          { icon: LockSvg,    label: "Secure" },
          { icon: ReturnSvg,  label: "30-day returns" },
          { icon: StarSvg,    label: "2-yr warranty" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 py-5 text-center"
          >
            <Icon />
            <span className="text-[9px] uppercase tracking-wide2 text-mist/30">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({
  label, value,
}: {
  label: string; value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm tracking-wide2 text-mist/50">{label}</span>
      {value}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Empty state                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function EmptyState() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.from(ref.current.querySelectorAll(".es-reveal"), {
      y: 30, opacity: 0, filter: "blur(8px)",
      duration: 0.8, stagger: 0.12, ease: "power3.out",
      clearProps: "opacity,filter,transform",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-void">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh] -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,164,92,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        ref={ref}
        className="container-luxe flex min-h-[85vh] flex-col items-center justify-center gap-10 py-32 text-center"
      >
        {/* icon */}
        <div className="es-reveal relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
          <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-gold/[0.08]" />
          <div className="absolute inset-3 rounded-full border border-white/[0.04]" />
          <svg viewBox="0 0 48 48" fill="none" className="h-11 w-11 text-mist/25">
            <path d="M8 28v-6C8 17.134 15.163 10 24 10s16 7.134 16 16v6"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="4" y="28" width="8" height="10" rx="4" fill="currentColor" opacity=".4" />
            <rect x="36" y="28" width="8" height="10" rx="4" fill="currentColor" opacity=".4" />
          </svg>
        </div>

        <div className="es-reveal space-y-3">
          <h1 className="font-display text-5xl text-platinum md:text-6xl">Nothing here yet</h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-mist/50">
            Your cart is empty. Find your perfect pair in the collection.
          </p>
        </div>

        <Link
          href="/products"
          className="es-reveal group inline-flex items-center gap-2.5 rounded-full
                     border border-white/10 px-9 py-4 text-xs uppercase tracking-wide2
                     text-mist transition-all duration-500
                     hover:border-gold/50 hover:text-gold
                     hover:shadow-[0_0_40px_-8px_rgba(200,164,92,0.25)]"
        >
          Explore collection
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Inline SVG trust icons                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

function LockSvg() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-mist/35" stroke="currentColor" strokeWidth="1.4">
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function ReturnSvg() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-mist/35" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 8h9a5 5 0 0 1 0 10H8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5 3 8l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarSvg() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-mist/35" stroke="currentColor" strokeWidth="1.4">
      <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.83L10 13.27l-4.33 2.24.83-4.83L3 7.27l4.91-.71L10 2z"
        strokeLinejoin="round" />
    </svg>
  );
}
