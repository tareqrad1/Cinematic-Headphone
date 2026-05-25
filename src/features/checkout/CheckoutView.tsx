"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products";
import { ArrowLeft, ArrowRight, CheckIcon } from "@/components/ui/icons";

const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_FEE = 25;
const TAX_RATE = 0.08;

type Stage = "form" | "placing" | "done";

/**
 * Premium checkout. Order summary (sticky) + a contact/shipping/payment form.
 * Payment is intentionally non-functional — "Place order" plays a brief
 * processing motion, then a confirmation, and clears the cart. Empty carts show
 * an elegant redirect prompt rather than a broken form.
 */
export function CheckoutView() {
  const { lines, subtotal, count, clear, hydrated } = useCart();
  const [stage, setStage] = useState<Stage>("form");
  const root = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".co-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.1,
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
        if (confirmRef.current) {
          gsap.fromTo(
            confirmRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
          );
        }
      });
    }, 1400);
  };

  // Confirmation — also the state after the cart is cleared.
  if (stage === "done") {
    return (
      <div className="container-luxe flex min-h-[70vh] items-center justify-center py-32">
        <div ref={confirmRef} className="max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
            <CheckIcon className="text-3xl" />
          </div>
          <h1 className="mt-8 font-display text-4xl text-metallic md:text-5xl">
            Your order is confirmed
          </h1>
          <p className="mt-5 text-mist">
            Thank you. A confirmation is on its way to your inbox, and your AURORA
            headphones will be hand-finished and dispatched within two business
            days.
          </p>
          <Link href="/products" className="btn-luxe mt-10 border-gold text-gold">
            Continue exploring
            <ArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart (only meaningful after hydration).
  if (hydrated && count === 0) {
    return (
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center gap-6 py-32 text-center">
        <h1 className="font-display text-4xl text-platinum md:text-5xl">
          Your cart is empty
        </h1>
        <p className="max-w-sm text-mist">
          Add a pair of headphones to begin checkout.
        </p>
        <Link href="/products" className="btn-gold mt-2">
          Explore the collection
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-platinum placeholder:text-mist/50 outline-none transition-colors duration-300 focus:border-gold/60";

  return (
    <div ref={root} className="container-luxe pb-32 pt-28 md:pt-32">
      <Link
        href="/products"
        className="co-reveal mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-wide2 text-mist transition-colors duration-300 hover:text-gold"
      >
        <ArrowLeft className="text-sm" />
        Continue shopping
      </Link>

      <h1 className="co-reveal font-display text-[clamp(2.4rem,5vw,3.5rem)] text-metallic">
        Checkout
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        {/* form */}
        <form onSubmit={placeOrder} className="space-y-12">
          <fieldset className="co-reveal space-y-4">
            <legend className="mb-5 font-display text-2xl text-platinum">Contact</legend>
            <input type="email" required placeholder="Email address" className={inputCls} autoComplete="email" />
          </fieldset>

          <fieldset className="co-reveal space-y-4">
            <legend className="mb-5 font-display text-2xl text-platinum">Shipping</legend>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="First name" className={inputCls} autoComplete="given-name" />
              <input required placeholder="Last name" className={inputCls} autoComplete="family-name" />
            </div>
            <input required placeholder="Address" className={inputCls} autoComplete="street-address" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City" className={inputCls} autoComplete="address-level2" />
              <input required placeholder="Postal code" className={inputCls} autoComplete="postal-code" />
            </div>
            <input required placeholder="Country" className={inputCls} autoComplete="country-name" />
          </fieldset>

          <fieldset className="co-reveal space-y-4">
            <legend className="mb-5 font-display text-2xl text-platinum">Payment</legend>
            <input required placeholder="Card number" inputMode="numeric" className={inputCls} autoComplete="cc-number" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="MM / YY" className={inputCls} autoComplete="cc-exp" />
              <input required placeholder="CVC" inputMode="numeric" className={inputCls} autoComplete="cc-csc" />
            </div>
            <p className="text-xs text-mist">
              This is a demo storefront — no payment is processed and no card
              details are stored.
            </p>
          </fieldset>

          <button
            type="submit"
            disabled={stage === "placing"}
            className="btn-gold co-reveal w-full !py-4 lg:hidden"
          >
            {stage === "placing" ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        {/* summary */}
        <aside className="co-reveal lg:sticky lg:top-28 lg:self-start">
          <div className="surface p-6">
            <h2 className="font-display text-2xl text-platinum">Order summary</h2>

            <ul className="mt-6 space-y-4">
              {lines.map((line) => (
                <li key={line.product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-carbon">
                    <Image
                      src={line.product.gallery[0]!.src}
                      alt={line.product.gallery[0]!.alt}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-void">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-platinum">{line.product.name}</p>
                      <p className="text-[11px] uppercase tracking-wide2 text-mist">
                        {line.product.colorName}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-platinum">
                      {formatPrice(line.product.price * line.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-6 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
              />
              <Row label="Estimated tax" value={formatPrice(tax)} />
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-white/[0.06] pt-6">
              <span className="text-sm tracking-wide2 text-mist">Total</span>
              <span className="font-display text-3xl text-platinum tabular-nums">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => placeOrder()}
              disabled={stage === "placing"}
              className="btn-gold mt-6 hidden w-full !py-4 lg:flex"
            >
              {stage === "placing" ? "Processing…" : `Pay ${formatPrice(total)}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-mist">{label}</dt>
      <dd className="tabular-nums text-platinum">{value}</dd>
    </div>
  );
}
