"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/utils";
import type { ProductImage } from "@/types";

export interface ProductGalleryHandle {
  /** the currently-active full image element (for fly-to-cart) */
  getActiveImage: () => HTMLImageElement | null;
}

interface ProductGalleryProps {
  images: ReadonlyArray<ProductImage>;
  accent: string;
}

/**
 * Luxury product gallery: a large stage with an ambient colour-matched glow and
 * a thumbnail rail. Switching images crossfades + lifts the stage layer (GSAP),
 * never a hard swap. Exposes the active <img> so the detail page can launch the
 * fly-to-cart flourish from exactly what the customer is looking at.
 */
export const ProductGallery = forwardRef<ProductGalleryHandle, ProductGalleryProps>(
  function ProductGallery({ images, accent }, ref) {
    const [active, setActive] = useState(0);
    const stageRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({ getActiveImage: () => imgRef.current }), []);

    const select = (i: number) => {
      if (i === active) return;
      setActive(i);
      const stage = stageRef.current;
      if (!stage || prefersReducedMotion()) return;
      gsap.fromTo(
        stage,
        { autoAlpha: 0.4, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power3.out" },
      );
    };

    const current = images[active]!;

    return (
      <div className="lg:sticky lg:top-28">
        {/* stage */}
        <div className="surface relative aspect-square overflow-hidden">
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
            aria-hidden
          />
          <div ref={stageRef} className="relative h-full w-full">
            <Image
              ref={imgRef}
              key={current.src + active}
              src={current.src}
              alt={current.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10 md:p-16"
            />
          </div>
        </div>

        {/* thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.src + i}
                type="button"
                onClick={() => select(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "surface relative aspect-square w-20 overflow-hidden transition-all duration-300 md:w-24",
                  i === active
                    ? "border-gold/60 opacity-100"
                    : "opacity-50 hover:opacity-90",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
