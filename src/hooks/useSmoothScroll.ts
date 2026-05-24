"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Drives Lenis smooth scrolling and keeps GSAP ScrollTrigger perfectly in sync
 * by advancing Lenis from GSAP's ticker (single RAF loop, no jank).
 * Respects prefers-reduced-motion by skipping smoothing entirely.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Lenis changes the effective scroll height; ScrollTrigger's cached pin/
    // start/end positions are now stale. Refresh once it's wired up so the
    // scroll→frame mapping is anchored to the correct coordinates.
    ScrollTrigger.refresh();

    // Late layout shifts (web fonts, video metadata) can move the pin start.
    // A single refresh on full load is the GSAP-recommended safety net.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
    };
  }, []);
}
