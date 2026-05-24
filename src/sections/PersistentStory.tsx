"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { PRODUCT_IMAGE, STORY_CHAPTERS } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Persistent-product storytelling. ONE headphone element is pinned to the
 * viewport and travels across three chapters via a single scrubbed GSAP
 * timeline — it is never remounted, hidden, or swapped. All motion is
 * transform-based (translate/scale/rotate) for GPU compositing.
 *
 * Layering:
 *  - a continuous idle float (independent timeline) gives the product life;
 *  - the scrubbed master timeline drives chapter-to-chapter travel;
 *  - because the float lives on an inner wrapper and the travel on an outer
 *    one, the two never fight for the same transform.
 */
export function PersistentStory() {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const travel = root.current!.querySelector<HTMLElement>(
        "[data-product-travel]",
      );
      const glow = root.current!.querySelector<HTMLElement>("[data-glow]");
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const bigNums = gsap.utils.toArray<HTMLElement>("[data-bignum]");
      if (!travel) return;

      // --- idle float: subtle, infinite, independent of scroll ---
      gsap.to("[data-product-float]", {
        y: -22,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to("[data-product-float]", {
        rotation: 1.5,
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // --- master scrubbed timeline pinned across the whole section ---
      const segments = STORY_CHAPTERS.length; // 3
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * segments}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Initialise product at chapter 01's pose.
      const first = STORY_CHAPTERS[0]!.product;
      gsap.set(travel, {
        xPercent: -50,
        yPercent: -50,
        x: () => (first.xVW / 100) * window.innerWidth,
        y: () => (first.yVH / 100) * window.innerHeight,
        scale: first.scale,
        rotation: first.rotate,
      });

      // Each chapter occupies one unit on the timeline. Travel eases over the
      // transition; text + big-number crossfade within their own windows.
      STORY_CHAPTERS.forEach((chapter, i) => {
        const at = i; // timeline position (one unit per chapter)

        // Travel TO this chapter's pose (skip for the first — already set).
        if (i > 0) {
          tl.to(
            travel,
            {
              x: () => (chapter.product.xVW / 100) * window.innerWidth,
              y: () => (chapter.product.yVH / 100) * window.innerHeight,
              scale: chapter.product.scale,
              rotation: chapter.product.rotate,
              duration: 1,
            },
            at - 1,
          );
        }

        // Lighting glow drifts with the product.
        if (glow) {
          tl.to(
            glow,
            {
              x: () => (chapter.product.xVW / 100) * window.innerWidth * 0.6,
              opacity: 0.9 - i * 0.1,
              duration: 1,
            },
            Math.max(0, at - 1),
          );
        }

        const text = chapters[i];
        const num = bigNums[i];

        // Fade the chapter copy in as we arrive…
        if (text) {
          tl.fromTo(
            text,
            { autoAlpha: 0, yPercent: 18 },
            { autoAlpha: 1, yPercent: 0, duration: 0.45 },
            Math.max(0, at - 0.4),
          );
          // …and back out before the next (except the last).
          if (i < segments - 1) {
            tl.to(
              text,
              { autoAlpha: 0, yPercent: -18, duration: 0.35 },
              at + 0.5,
            );
          }
        }

        // Giant background numeral parallax + crossfade.
        if (num) {
          tl.fromTo(
            num,
            { autoAlpha: 0, yPercent: 12 },
            { autoAlpha: 0.06, yPercent: 0, duration: 0.45 },
            Math.max(0, at - 0.4),
          );
          if (i < segments - 1) {
            tl.to(num, { autoAlpha: 0, yPercent: -12, duration: 0.35 }, at + 0.5);
          }
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="story"
      className="relative h-[100svh] w-full overflow-hidden bg-void"
    >
      {/* moving lighting ambience */}
      <div
        data-glow
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,92,0.16),transparent_65%)] blur-2xl"
      />

      {/* giant chapter numerals (stacked, crossfaded) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        {STORY_CHAPTERS.map((c) => (
          <span
            key={c.id}
            data-bignum
            className="absolute select-none font-display text-[44vw] leading-none text-platinum opacity-0 md:text-[36vw]"
          >
            {c.index}
          </span>
        ))}
      </div>

      {/* THE persistent product — one element, never remounted */}
      <div
        data-product-travel
        className="absolute left-1/2 top-1/2 z-10 w-[62vw] max-w-[460px] will-change-transform sm:w-[46vw] md:w-[34vw]"
      >
        <div data-product-float className="will-change-transform">
          <Image
            src={PRODUCT_IMAGE}
            alt="Aurora Phantom One headphones"
            width={439}
            height={612}
            priority
            sizes="(max-width: 640px) 62vw, (max-width: 768px) 46vw, 34vw"
            className="h-auto w-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>

      {/* chapter copy (stacked, crossfaded) */}
      <div className="relative z-20 h-full">
        {STORY_CHAPTERS.map((c) => (
          <div
            key={c.id}
            data-chapter
            className={cn(
              "container-luxe absolute inset-0 flex h-full flex-col justify-center opacity-0",
              c.align === "left" ? "items-start text-left" : "items-end text-right",
            )}
          >
            <div className="max-w-md">
              <span className="kicker">
                {c.index} — {c.kicker}
              </span>
              <h2 className="display-xl mt-4 text-metallic">{c.title}</h2>
              <p className="body-lux mt-6">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* edge vignette to seat the product in darkness */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,6,0.85)_100%)]" />
    </section>
  );
}
