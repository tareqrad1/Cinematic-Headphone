"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/utils";
import type { ProductImage } from "@/types";

export interface ProductGalleryHandle {
  getActiveImage: () => HTMLImageElement | null;
}

interface ProductGalleryProps {
  images: ReadonlyArray<ProductImage>;
  accent: string;
  coverImage?: boolean;
}

export const ProductGallery = forwardRef<ProductGalleryHandle, ProductGalleryProps>(
  function ProductGallery({ images, accent, coverImage = false }, ref) {
    const [active, setActive] = useState(0);
    // per-slot loaded state — true once that image's onLoad fires
    const [loaded, setLoaded] = useState<boolean[]>(() => images.map(() => false));
    // refs for every full-size image so we can crossfade between them
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const stageRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getActiveImage: () => imgRefs.current[active] ?? null,
    }), [active]);

    const markLoaded = (i: number) =>
      setLoaded((prev) => {
        if (prev[i]) return prev;
        const next = [...prev];
        next[i] = true;
        return next;
      });

    const select = (i: number) => {
      if (i === active) return;

      const incoming = imgRefs.current[i];
      const outgoing = imgRefs.current[active];

      if (!incoming || prefersReducedMotion()) {
        setActive(i);
        return;
      }

      // Crossfade: incoming fades + lifts in while outgoing fades out.
      // No remount — both <Image> elements live in the DOM simultaneously.
      gsap.set(incoming, { autoAlpha: 0, scale: 1.04 });
      gsap.to(outgoing, { autoAlpha: 0, scale: 0.97, duration: 0.3, ease: "power2.in" });
      gsap.to(incoming, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.1 });

      setActive(i);
    };

    return (
      <div className="lg:sticky lg:top-28">
        {/* ── stage ── */}
        <div
          ref={stageRef}
          className={cn(
            "surface relative overflow-hidden",
            coverImage ? "aspect-[3/4]" : "aspect-square",
          )}
        >
          {/* skeleton shimmer — hidden once the active image loads */}
          <div
            className={cn(
              "absolute inset-0 z-0 transition-opacity duration-500",
              loaded[active] ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="h-full w-full animate-shimmer bg-[length:200%_100%]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #0c0d10 0%, #16181d 40%, #0c0d10 80%)",
              }}
            />
          </div>

          {/* accent glow */}
          <span
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%]",
              "-translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700",
              loaded[active]
                ? coverImage ? "opacity-20" : "opacity-50"
                : "opacity-0",
            )}
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
            aria-hidden
          />

          {/* all images stacked — only the active one is visible */}
          <div className="relative h-full w-full">
            {images.map((img, i) => (
              <Image
                key={img.src}                          // stable key — no remount
                ref={(el) => { imgRefs.current[i] = el; }}
                src={img.src}
                alt={i === 0 ? img.alt : ""}
                fill
                priority={i === 0}                    // first image: highest priority
                fetchPriority={i === 0 ? "high" : "low"}
                sizes="(max-width: 1024px) 100vw, 50vw"
                onLoad={() => markLoaded(i)}
                className={cn(
                  "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  coverImage ? "object-cover" : "object-contain p-10 md:p-16",
                  // visibility: show only the active slot; others are opacity-0 but still loaded
                  i === active ? "opacity-100" : "opacity-0",
                )}
                style={{ zIndex: i === active ? 1 : 0 }}
              />
            ))}
          </div>

          {/* bottom vignette for cover images */}
          {coverImage && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-graphite/70 to-transparent" />
          )}
        </div>

        {/* ── thumbnails ── */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => select(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "surface relative overflow-hidden transition-all duration-300",
                  coverImage ? "aspect-[3/4] w-16 md:w-20" : "aspect-square w-20 md:w-24",
                  i === active
                    ? "border-gold/60 opacity-100 shadow-[0_0_12px_2px_rgba(200,164,92,0.15)]"
                    : "opacity-45 hover:opacity-80",
                )}
              >
                {/* thumbnail shimmer */}
                {!loaded[i] && (
                  <div className="absolute inset-0 animate-shimmer bg-[length:200%_100%]"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #0c0d10 0%, #16181d 40%, #0c0d10 80%)",
                    }}
                  />
                )}
                <Image
                  src={img.src}
                  alt=""
                  fill
                  priority                              // all thumbs are above the fold
                  sizes="96px"
                  onLoad={() => markLoaded(i)}
                  className={cn(
                    "transition-transform duration-500 hover:scale-[1.06]",
                    coverImage ? "object-cover" : "object-contain p-2",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
