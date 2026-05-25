"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollReveal } from "@/animations/reveal";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface RevealConfig {
  /** CSS selector (within the root) for the elements to stagger in */
  selector?: string;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Declarative wrapper around {@link scrollReveal} — the house reveal (upward
 * lift + blur clear). Returns a ref to attach to the section root; every
 * element matching `selector` inside it animates in on scroll. GSAP context is
 * scoped to the root and reverted on unmount, so it's safe across route changes.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>({
  selector = ".reveal",
  start,
  y,
  stagger,
  duration,
}: RevealConfig = {}) {
  const root = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(selector);
      if (targets.length === 0) return;
      scrollReveal({ targets, trigger: el, start, y, stagger, duration });
    }, el);
    return () => ctx.revert();
  }, [selector, start, y, stagger, duration]);

  return root;
}
