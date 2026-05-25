"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { scrollReveal } from "@/animations/reveal";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { BRAND } from "@/lib/config";

export function CallToAction() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      scrollReveal({
        targets: root.current!.querySelectorAll(".cta-reveal"),
        trigger: root.current!,
        y: 60,
        stagger: 0.14,
      });
      gsap.to(root.current!.querySelector(".cta-glow"), {
        scale: 1.25,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="cta"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden border-t border-white/5 text-center"
    >
      <div className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,92,0.25),transparent_70%)] opacity-50 blur-2xl" />

      <div className="container-luxe relative z-10">
        <span className="cta-reveal reveal-hidden kicker">
          {BRAND.product}
        </span>
        <h2 className="cta-reveal reveal-hidden display-xl mt-6 text-metallic">
          Hear everything.
        </h2>
        <p className="cta-reveal reveal-hidden body-lux mx-auto mt-8 max-w-md">
          Reserve yours today. Limited first edition, individually numbered and
          delivered in a hand-finished case.
        </p>
        <div className="cta-reveal reveal-hidden mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/products" className="btn-luxe border-gold text-gold">
            Shop the collection
          </Link>
          <Link href="/products/phantom-one" className="btn-luxe">
            Reserve Phantom One — $899
          </Link>
        </div>
      </div>

      <footer className="container-luxe relative z-10 mt-28 flex w-full flex-col items-center gap-4 border-t border-white/5 py-10 text-xs text-mist sm:flex-row sm:justify-between">
        <span className="font-display text-lg tracking-luxe text-platinum">
          {BRAND.name}
        </span>
        <span className="tracking-wide2">
          © {new Date().getFullYear()} {BRAND.name} Acoustics. All rights
          reserved.
        </span>
      </footer>
    </section>
  );
}
