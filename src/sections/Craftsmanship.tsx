"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { STORY_SECTIONS } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * CRAFTSMANSHIP — the grounded editorial middle of the homepage.
 *
 * The pinned/canvas sections before it are pure immersion; this is the "why":
 * three alternating image/text splits about materials, engineering, and brand
 * philosophy. It gives the cinematic rhythm a place to breathe between two
 * full-viewport moments.
 *
 * Motion budget (kept light): per row, ONE scrubbed parallax on the image
 * (GPU transform) and ONE toggle-actions reveal on the copy — both batched in a
 * single gsap.context and reverted on unmount. No per-frame React work.
 */
export function Craftsmanship() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // Self-healing reveal (see CollectionShowcase/Immersive): this editorial
      // sits between pinned sections, so a plain scroll-reveal can mis-measure
      // and never fire. Hide via JS (CSS resting state stays visible), reveal
      // with a `once` trigger, then refresh after the pins inject their spacing.

      // Section intro.
      const intro = gsap.utils.toArray<HTMLElement>(
        ".craft-intro .craft-reveal",
      );
      if (intro.length > 0) {
        gsap.set(intro, { y: 48, autoAlpha: 0, filter: "blur(12px)" });
        gsap.to(intro, {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "filter",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-craft-row]");
      rows.forEach((row) => {
        const copy = row.querySelectorAll<HTMLElement>(".craft-reveal");
        if (copy.length > 0) {
          gsap.set(copy, { y: 48, autoAlpha: 0, filter: "blur(12px)" });
          gsap.to(copy, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "filter",
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          });
        }
        // image parallax — subtle vertical drift as the row crosses the viewport
        const media = row.querySelector<HTMLElement>("[data-craft-media]");
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="craft"
      className="relative overflow-hidden border-t border-white/5 py-28 md:py-40"
    >
      {/* section intro */}
      <div className="craft-intro container-luxe">
        <span className="craft-reveal kicker">The Object</span>
        <h2 className="craft-reveal display-lg mt-5 max-w-3xl text-metallic">
          Made to be felt, before it&apos;s heard
        </h2>
      </div>

      <div className="container-luxe mt-24 space-y-28 md:space-y-40">
        {STORY_SECTIONS.map((item, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={item.id}
              data-craft-row
              className={cn(
                "grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20",
                reversed && "md:[direction:rtl]",
              )}
            >
              {/* media */}
              <div className="md:[direction:ltr]">
                <div className="surface card-sheen group relative aspect-[4/5] overflow-hidden md:aspect-square">
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,92,0.16),transparent_70%)] blur-3xl"
                    aria-hidden
                  />
                  <div
                    data-craft-media
                    className="relative h-[112%] w-full will-change-transform"
                  >
                    <Image
                      src={item.image.src}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-10 md:p-16"
                    />
                  </div>
                </div>
              </div>

              {/* copy */}
              <div className="md:[direction:ltr]">
                <span className="craft-reveal kicker">
                  {item.kicker}
                </span>
                <h3 className="craft-reveal mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-platinum">
                  {item.title}
                </h3>
                <p className="craft-reveal body-lux mt-6 max-w-md">
                  {item.body}
                </p>
                {item.stat && (
                  <div className="craft-reveal mt-10 flex items-baseline gap-4 border-t border-white/[0.07] pt-6">
                    <span className="font-display text-5xl text-gold">
                      {item.stat.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide2 text-mist">
                      {item.stat.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
