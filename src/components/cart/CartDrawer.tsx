"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/utils";
import { CloseIcon, TrashIcon, ArrowRight } from "@/components/ui/icons";
import { QuantityStepper } from "./QuantityStepper";
import { AnimatedPrice } from "./AnimatedPrice";

/**
 * Slide-in cart drawer. GSAP drives the panel + scrim on open/close; line items
 * stagger in, and removal plays a collapse-out before the store drops the line.
 * The drawer is always mounted (panel parked off-canvas) so animations have a
 * stable target and there's no mount flash.
 */
export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, remove, setQuantity } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Open / close motion.
  useEffect(() => {
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;

    const reduce = prefersReducedMotion();
    gsap.killTweensOf([panel, scrim]);

    if (isOpen) {
      gsap.set(scrim, { display: "block" });
      gsap.to(scrim, { autoAlpha: 1, duration: reduce ? 0 : 0.4, ease: "power2.out" });
      gsap.to(panel, {
        xPercent: 0,
        duration: reduce ? 0 : 0.6,
        ease: "expo.out",
      });
      // Stagger the line items in just after the panel begins to settle.
      const items = listRef.current?.querySelectorAll("[data-cart-item]");
      if (items && items.length && !reduce) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: 28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
            delay: 0.12,
          },
        );
      }
    } else {
      gsap.to(panel, {
        xPercent: 100,
        duration: reduce ? 0 : 0.5,
        ease: "power3.inOut",
      });
      gsap.to(scrim, {
        autoAlpha: 0,
        duration: reduce ? 0 : 0.4,
        ease: "power2.in",
        onComplete: () => gsap.set(scrim, { display: "none" }),
      });
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Animated removal: collapse the row out, then commit to the store.
  const handleRemove = (id: string) => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-cart-item="${id}"]`,
    );
    if (!el || prefersReducedMotion()) {
      remove(id);
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      x: 40,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => remove(id),
    });
  };

  return (
    <div className="contents" aria-hidden={!isOpen}>
      {/* scrim */}
      <div
        ref={scrimRef}
        onClick={close}
        className="fixed inset-0 z-[90] hidden bg-void/70 opacity-0 backdrop-blur-sm"
      />

      {/* panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={isOpen}
        className="fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-[440px] translate-x-full flex-col border-l border-white/10 bg-graphite/95 backdrop-blur-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-6">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl tracking-luxe text-platinum">
              Cart
            </h2>
            <span className="text-xs tracking-wide2 text-mist">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-mist transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            <CloseIcon className="text-[1.2em]" />
          </button>
        </div>

        {/* body */}
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 text-mist">
              <ArrowRight className="text-2xl" />
            </div>
            <div>
              <p className="font-display text-xl text-platinum">
                Your cart is silent
              </p>
              <p className="mt-2 text-sm text-mist">
                Nothing here yet. The collection awaits.
              </p>
            </div>
            <Link
              href="/products"
              onClick={close}
              className="btn-luxe !px-7 !py-3 !text-xs"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            <ul
              ref={listRef}
              className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
            >
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  data-cart-item={line.product.id}
                  className="flex gap-4 overflow-hidden rounded-xl p-3 transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  <Link
                    href={`/products/${line.product.slug}`}
                    onClick={close}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-carbon"
                  >
                    <Image
                      src={line.product.gallery[0]!.src}
                      alt={line.product.gallery[0]!.alt}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${line.product.slug}`}
                          onClick={close}
                          className="block truncate font-display text-lg leading-tight text-platinum transition-colors hover:text-gold"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-mist">
                          {line.product.colorName}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.product.name}`}
                        onClick={() => handleRemove(line.product.id)}
                        className="-mr-1 mt-0.5 shrink-0 text-mist transition-colors duration-300 hover:text-[#c87b6b]"
                      >
                        <TrashIcon className="text-base" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(q) => setQuantity(line.product.id, q)}
                      />
                      <span className="text-sm tabular-nums text-platinum">
                        {formatPrice(line.product.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* footer */}
            <div className="border-t border-white/[0.06] px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm tracking-wide2 text-mist">Subtotal</span>
                <AnimatedPrice
                  value={subtotal}
                  className="font-display text-2xl text-platinum tabular-nums"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-mist">
                Shipping &amp; duties calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="btn-gold mt-5 w-full !py-4"
              >
                Proceed to checkout
                <ArrowRight className="text-base" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
