"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products";
import { ArrowLeft, ArrowRight, CheckIcon } from "@/components/ui/icons";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE       = 25;
const TAX_RATE           = 0.08;

type Stage = "form" | "placing" | "done";

export function CheckoutView() {
  const { lines, subtotal, count, clear, hydrated } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const root       = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax      = Math.round(subtotal * TAX_RATE);
  const total    = subtotal + shipping + tax;

  /* entrance */
  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".co-reveal", {
        y: 28, opacity: 0, filter: "blur(8px)",
        duration: 0.85, stagger: 0.07, ease: "power3.out",
        clearProps: "opacity,filter,transform", delay: 0.08,
      });
    }, root);
    return () => ctx.revert();
  }, [hydrated]);

  const placeOrder = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (stage === "placing") return;
    setStage("placing");
    window.setTimeout(() => {
      setStage("done");
      clear();
      requestAnimationFrame(() => {
        if (!confirmRef.current) return;
        gsap.fromTo(confirmRef.current,
          { opacity: 0, y: 32, filter: "blur(8px)" },
          { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.9, ease: "power3.out", clearProps: "opacity,filter,transform" },
        );
      });
    }, 1600);
  };

  /* ── confirmation ── */
  if (stage === "done") {
    return (
      <div className="container-luxe flex min-h-[80vh] items-center justify-center py-32">
        <div ref={confirmRef} className="max-w-md text-center">
          <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-gold/10" style={{ animationDuration: "2s" }} />
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-gold/10">
              <CheckIcon className="text-3xl text-gold" />
            </div>
          </div>
          <h1 className="font-display text-4xl text-metallic md:text-5xl">Order confirmed</h1>
          <p className="mt-5 leading-relaxed text-mist/70">
            Thank you. A confirmation is on its way to your inbox. Your AURORA headphones will be
            hand-finished and dispatched within two business days.
          </p>
          <Link href="/products" className="btn-gold mt-10 inline-flex">
            Continue exploring
            <ArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── empty ── */
  if (hydrated && count === 0) {
    return (
      <div className="container-luxe flex min-h-[80vh] flex-col items-center justify-center gap-6 py-32 text-center">
        <h1 className="font-display text-4xl text-platinum md:text-5xl">Your cart is empty</h1>
        <p className="max-w-sm text-mist/70">Add a pair of headphones to begin checkout.</p>
        <Link href="/products" className="btn-gold mt-2">Explore the collection</Link>
      </div>
    );
  }

  return (
    <div ref={root} className="min-h-screen bg-void">
      <div className="container-luxe pb-32 pt-28 md:pt-32">

        <Link
          href="/products"
          className="co-reveal mb-10 inline-flex items-center gap-2 text-xs uppercase
                     tracking-wide2 text-mist/60 transition-colors duration-300 hover:text-gold"
        >
          <ArrowLeft className="text-sm" />
          Continue shopping
        </Link>

        <h1 className="co-reveal font-display text-[clamp(2.4rem,5vw,3.5rem)] text-metallic">
          Checkout
        </h1>
        <p className="co-reveal mt-2 text-sm text-mist/50">
          {count} {count === 1 ? "item" : "items"} · {formatPrice(subtotal)} subtotal
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] lg:gap-10">

          {/* ── form ── */}
          <form onSubmit={placeOrder} className="space-y-10">
            <FormSection title="Contact" index="01" className="co-reveal">
              <Field type="email" required placeholder="Email address" autoComplete="email" />
            </FormSection>

            <FormSection title="Shipping" index="02" className="co-reveal">
              <div className="grid grid-cols-2 gap-4">
                <Field required placeholder="First name"   autoComplete="given-name" />
                <Field required placeholder="Last name"    autoComplete="family-name" />
              </div>
              <Field required placeholder="Address"        autoComplete="street-address" />
              <div className="grid grid-cols-2 gap-4">
                <Field required placeholder="City"         autoComplete="address-level2" />
                <Field required placeholder="Postal code"  autoComplete="postal-code" />
              </div>
              <Field required placeholder="Country"        autoComplete="country-name" />
            </FormSection>

            <FormSection title="Payment" index="03" className="co-reveal">
              <Field required placeholder="Card number" inputMode="numeric" autoComplete="cc-number" />
              <div className="grid grid-cols-2 gap-4">
                <Field required placeholder="MM / YY"   autoComplete="cc-exp" />
                <Field required placeholder="CVC"       inputMode="numeric" autoComplete="cc-csc" />
              </div>
              <p className="flex items-center gap-2 text-xs text-mist/40">
                <LockIcon />
                Demo storefront — no payment is processed or stored.
              </p>
            </FormSection>

            {/* mobile CTA */}
            <PlaceOrderBtn stage={stage} total={total} className="lg:hidden" />
          </form>

          {/* ── order summary ── */}
          <aside className="co-reveal lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

              {/* summary header */}
              <div className="border-b border-white/[0.06] px-6 py-5">
                <h2 className="font-display text-xl text-platinum">Order summary</h2>
              </div>

              {/* line items */}
              <ul className="divide-y divide-white/[0.04] px-4 py-3">
                {lines.map((line) => (
                  <li key={line.product.id} className="flex gap-4 py-3">
                    <div className="relative h-16 w-[52px] shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-carbon">
                      <span
                        className="pointer-events-none absolute inset-0 opacity-25"
                        style={{
                          background: `radial-gradient(circle at 50% 60%, ${line.product.accent}70, transparent 70%)`,
                        }}
                      />
                      <Image
                        src={line.product.gallery[0]!.src}
                        alt={line.product.gallery[0]!.alt}
                        fill
                        sizes="52px"
                        className="relative z-[1] object-cover"
                      />
                      <span className="absolute -right-1.5 -top-1.5 z-[2] flex h-5 min-w-5 items-center
                                       justify-center rounded-full bg-gold px-1 text-[10px]
                                       font-semibold text-void">
                        {line.quantity}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-platinum">{line.product.name}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide2 text-mist/50">
                          {line.product.colorName}
                        </p>
                      </div>
                      <span className="shrink-0 font-display text-base tabular-nums text-platinum">
                        {formatPrice(line.product.price * line.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* totals */}
              <div className="border-t border-white/[0.06] px-6 py-5 space-y-2.5">
                <SummaryRow label="Subtotal"       value={formatPrice(subtotal)} />
                <SummaryRow
                  label="Shipping"
                  value={shipping === 0 ? "Free" : formatPrice(shipping)}
                  highlight={shipping === 0}
                />
                <SummaryRow label="Estimated tax"  value={formatPrice(tax)} />
              </div>

              <div className="border-t border-white/[0.06] px-6 py-5 flex items-baseline justify-between">
                <span className="text-sm tracking-wide2 text-mist">Total</span>
                <span className="font-display text-3xl tabular-nums text-platinum">
                  {formatPrice(total)}
                </span>
              </div>

              {/* desktop CTA */}
              <div className="px-6 pb-6">
                <PlaceOrderBtn stage={stage} total={total} className="hidden lg:flex" />
              </div>
            </div>

            {/* trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: "🔒", label: "Secure checkout" },
                { icon: "↩", label: "30-day returns" },
                { icon: "✦", label: "2-year warranty" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.05]
                             bg-white/[0.02] px-2 py-3 text-center"
                >
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[10px] uppercase tracking-wide2 text-mist/40">{b.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── sub-components ─────────────────────────────────────────────────────── */

function FormSection({
  title, index, children, className,
}: {
  title: string; index: string; children: React.ReactNode; className?: string;
}) {
  return (
    <fieldset className={className}>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30
                         text-[11px] font-medium tabular-nums text-gold">
          {index}
        </span>
        <legend className="font-display text-xl text-platinum">{title}</legend>
        <div className="flex-1 h-px bg-white/[0.04]" />
      </div>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5
                 text-sm text-platinum placeholder:text-mist/35 outline-none
                 transition-all duration-300
                 focus:border-gold/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(200,164,92,0.08)]"
    />
  );
}

function PlaceOrderBtn({ stage, total, className }: { stage: Stage; total: number; className?: string }) {
  return (
    <button
      type="submit"
      form={stage !== "placing" ? undefined : undefined}
      disabled={stage === "placing"}
      className={`group relative w-full overflow-hidden rounded-full bg-gold px-8 py-4
                  text-xs font-medium uppercase tracking-wide2 text-void
                  transition-all duration-500
                  hover:bg-[#d8b46c] hover:shadow-[0_12px_40px_-8px_rgba(200,164,92,0.6)]
                  disabled:cursor-not-allowed disabled:opacity-60
                  inline-flex items-center justify-center gap-3 ${className ?? ""}`}
    >
      {stage === "placing" ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-void/30 border-t-void" />
          Processing…
        </>
      ) : (
        <>
          Pay {formatPrice(total)}
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-mist/60">{label}</dt>
      <dd className={`tabular-nums ${highlight ? "text-gold" : "text-mist/80"}`}>{value}</dd>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="10" height="8" rx="2" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
