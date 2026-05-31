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

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, remove, setQuantity } = useCart();

  const panelRef  = useRef<HTMLDivElement>(null);
  const scrimRef  = useRef<HTMLDivElement>(null);
  const listRef   = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  /* ── open / close ── */
  useEffect(() => {
    const panel  = panelRef.current;
    const scrim  = scrimRef.current;
    const header = headerRef.current;
    const footer = footerRef.current;
    if (!panel || !scrim) return;

    const reduce = prefersReducedMotion();
    gsap.killTweensOf([panel, scrim, header, footer]);

    if (isOpen) {
      // Make scrim interactive immediately on open
      gsap.set(scrim, { display: "block", pointerEvents: "auto" });
      gsap.to(scrim, { opacity: 1, duration: reduce ? 0 : 0.35, ease: "power2.out" });
      gsap.fromTo(panel,
        { xPercent: 100 },
        { xPercent: 0, duration: reduce ? 0 : 0.55, ease: "expo.out" },
      );

      if (!reduce) {
        gsap.fromTo(header, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.15 });
        gsap.fromTo(footer, { opacity: 0, y:  16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.2  });

        const items = listRef.current?.querySelectorAll("[data-cart-item]");
        if (items?.length) {
          gsap.fromTo(items,
            { opacity: 0, x: 24, filter: "blur(4px)" },
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.07, ease: "power3.out", delay: 0.22, clearProps: "filter" },
          );
        }
      }
    } else {
      gsap.to(panel, { xPercent: 100, duration: reduce ? 0 : 0.45, ease: "power3.inOut" });
      // Disable pointer-events immediately so clicks pass through during fade-out
      gsap.set(scrim, { pointerEvents: "none" });
      gsap.to(scrim, {
        opacity: 0,
        duration: reduce ? 0 : 0.35,
        ease: "power2.in",
        onComplete: () => gsap.set(scrim, { display: "none" }),
      });
    }
  }, [isOpen]);

  /* ── escape key ── */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, close]);

  /* ── animated removal ── */
  const handleRemove = (id: string) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cart-item="${id}"]`);
    if (!el || prefersReducedMotion()) { remove(id); return; }
    gsap.to(el, {
      autoAlpha: 0, x: 48, height: 0,
      marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.38, ease: "power2.in",
      onComplete: () => remove(id),
    });
  };

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 25;
  const total    = subtotal + shipping;

  return (
    <div className="contents" aria-hidden={!isOpen}>
      {/* scrim */}
      <div
        ref={scrimRef}
        onClick={close}
        className="fixed inset-0 z-[90] hidden bg-void/60 opacity-0 backdrop-blur-[6px]"
      />

      {/* panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={isOpen}
        className="fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-[420px]
                   translate-x-full flex-col overflow-hidden
                   border-l border-white/[0.07] bg-[#0a0b0e]/95 backdrop-blur-3xl"
      >
        {/* top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* ── header ── */}
        <div
          ref={headerRef}
          className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl tracking-luxe text-platinum">Cart</h2>
            {count > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full
                               bg-gold/15 px-1.5 text-[11px] font-medium tabular-nums text-gold">
                {count}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="group flex h-9 w-9 items-center justify-center rounded-full
                       border border-white/[0.08] text-mist/70
                       transition-all duration-300 hover:border-gold/50 hover:text-gold"
          >
            <CloseIcon className="text-base transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* ── body ── */}
        {lines.length === 0 ? (
          <EmptyState close={close} />
        ) : (
          <>
            <ul
              ref={listRef}
              className="flex-1 space-y-2 overflow-y-auto px-4 py-4
                         scrollbar-thin [scrollbar-color:theme(colors.steel)_transparent]"
            >
              {lines.map((line) => (
                <li
                  key={line.product.id}
                  data-cart-item={line.product.id}
                  className="group/item relative overflow-hidden rounded-2xl
                             border border-white/[0.05] bg-white/[0.025]
                             p-3 transition-colors duration-300 hover:border-white/[0.1]
                             hover:bg-white/[0.04]"
                >
                  <div className="flex gap-4">
                    {/* image */}
                    <Link
                      href={`/products/${line.product.slug}`}
                      onClick={close}
                      className="relative h-[88px] w-[72px] shrink-0 overflow-hidden
                                 rounded-xl border border-white/[0.07] bg-carbon"
                    >
                      {/* accent glow */}
                      <span
                        className="pointer-events-none absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at 50% 60%, ${line.product.accent}60, transparent 70%)`,
                        }}
                      />
                      <Image
                        src={line.product.gallery[0]!.src}
                        alt={line.product.gallery[0]!.alt}
                        fill
                        sizes="72px"
                        className="relative z-[1] object-cover transition-transform
                                   duration-500 hover:scale-[1.06]"
                      />
                    </Link>

                    {/* info */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${line.product.slug}`}
                            onClick={close}
                            className="block truncate font-display text-[1.05rem]
                                       leading-tight text-platinum transition-colors
                                       duration-300 hover:text-gold"
                          >
                            {line.product.name}
                          </Link>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                background: line.product.accent,
                                boxShadow: `0 0 5px 1px ${line.product.accent}60`,
                              }}
                            />
                            <p className="text-[11px] uppercase tracking-wide2 text-mist/60">
                              {line.product.colorName}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${line.product.name}`}
                          onClick={() => handleRemove(line.product.id)}
                          className="shrink-0 rounded-lg p-1 text-mist/40
                                     transition-all duration-300 hover:bg-red-500/10
                                     hover:text-red-400"
                        >
                          <TrashIcon className="text-sm" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantityStepper
                          value={line.quantity}
                          onChange={(q) => setQuantity(line.product.id, q)}
                        />
                        <span className="font-display text-base tabular-nums text-platinum">
                          {formatPrice(line.product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ── footer ── */}
            <div
              ref={footerRef}
              className="border-t border-white/[0.06] px-6 pt-5 pb-6 space-y-4"
            >
              {/* free shipping progress */}
              {subtotal < 500 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] tracking-wide2 text-mist/50">
                    <span>Free shipping at $500</span>
                    <span className="text-gold">{formatPrice(500 - subtotal)} away</span>
                  </div>
                  <div className="h-px w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* totals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs tracking-wide2 text-mist/60">
                  <span>Subtotal</span>
                  <AnimatedPrice value={subtotal} className="tabular-nums text-mist/80" />
                </div>
                <div className="flex items-center justify-between text-xs tracking-wide2 text-mist/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-gold">Free</span> : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/[0.06] pt-4">
                <span className="text-sm tracking-wide2 text-mist">Total</span>
                <AnimatedPrice
                  value={total}
                  className="font-display text-2xl text-platinum tabular-nums"
                />
              </div>

              <Link
                href="/cart"
                onClick={close}
                className="group relative flex w-full items-center justify-center gap-3
                           overflow-hidden rounded-full bg-gold px-8 py-4 text-xs font-medium
                           uppercase tracking-wide2 text-void transition-all duration-500
                           hover:bg-[#d8b46c] hover:shadow-[0_12px_40px_-8px_rgba(200,164,92,0.6)]"
              >
                View cart
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/checkout"
                onClick={close}
                className="group flex w-full items-center justify-center gap-2 rounded-full
                           border border-white/[0.08] py-3 text-xs uppercase tracking-wide2
                           text-mist/60 transition-all duration-300 hover:border-gold/40 hover:text-gold"
              >
                Checkout directly
                <ArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                onClick={close}
                className="block text-center text-[11px] uppercase tracking-wide2
                           text-mist/40 transition-colors duration-300 hover:text-mist"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ── empty state ── */
function EmptyState({ close }: { close: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-12 text-center">
      {/* animated headphone icon */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-white/[0.04]" />
        <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-mist/30">
          <path d="M8 28v-6C8 17.134 15.163 10 24 10s16 7.134 16 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <rect x="4" y="28" width="8" height="10" rx="4" fill="currentColor" opacity=".5"/>
          <rect x="36" y="28" width="8" height="10" rx="4" fill="currentColor" opacity=".5"/>
        </svg>
      </div>

      <div>
        <p className="font-display text-2xl text-platinum">Nothing here yet</p>
        <p className="mt-2 text-sm leading-relaxed text-mist/60">
          Your cart is empty. Explore the collection and add something extraordinary.
        </p>
      </div>

      <Link
        href="/products"
        onClick={close}
        className="group inline-flex items-center gap-2.5 rounded-full border border-white/10
                   px-7 py-3 text-xs uppercase tracking-wide2 text-mist
                   transition-all duration-500 hover:border-gold/50 hover:text-gold"
      >
        Explore collection
        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
