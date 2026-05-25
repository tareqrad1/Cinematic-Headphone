"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * Products hero header. A masked, staggered word reveal on mount (no scroll
 * dependency — it's above the fold) plus a slow parallax drift on the ambient
 * glow as the page scrolls, echoing the homepage's cinematic language.
 */
export function ProductsHero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
      tl.from(".ph-kicker", { y: 18, opacity: 0, duration: 1 })
        .from(
          ".ph-word",
          { yPercent: 120, opacity: 0, duration: 1.2, stagger: 0.09 },
          "-=0.75",
        )
        .from(".ph-sub", { y: 18, opacity: 0, duration: 1 }, "-=0.7")
        .from(".ph-meta", { opacity: 0, duration: 1 }, "-=0.6");

      gsap.to(".ph-glow", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = ["Engineered", "for", "Silence"];

  return (
    <section
      ref={root}
      className="relative flex min-h-[62vh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-36 text-center md:min-h-[68vh] md:pt-44"
    >
      <div className="ph-glow pointer-events-none absolute left-1/2 top-1/3 h-[55vmin] w-[55vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,92,0.16),transparent_65%)] blur-3xl" />

      <div className="relative z-10">
        <span className="ph-kicker kicker">The AURORA Collection</span>

        <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.95] tracking-tight">
          {words.map((w) => (
            <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0">
              <span className="ph-word text-metallic inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <p className="ph-sub body-lux mx-auto mt-7 max-w-xl text-platinum/80">
          Six expressions of one obsession. Discover the headphones engineered to
          disappear — so all that remains is the music.
        </p>

        <div className="ph-meta mt-10 flex items-center justify-center gap-8 text-[11px] uppercase tracking-wide2 text-mist">
          <span>Free worldwide shipping</span>
          <span className="h-3 w-px bg-white/15" />
          <span>2-year warranty</span>
        </div>
      </div>
    </section>
  );
}
