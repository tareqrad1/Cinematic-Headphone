"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * MANIFESTO — a cinematic palette-cleanser. One oversized statement whose words
 * brighten from mist to platinum as the line is scrubbed through the viewport,
 * giving the eye a quiet beat between the grounded Craftsmanship editorial and
 * the Immersive audio moment.
 *
 * Motion budget: a single scrubbed timeline driving a word-by-word colour/opacity
 * lift (transforms + color, no layout). One ScrollTrigger total.
 */
const LINE =
  "We didn't set out to build a headphone. We set out to remove everything between you and the sound.";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".mf-word");
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden border-t border-white/5 py-32"
    >
      <p className="container-luxe text-center font-display text-[clamp(1.8rem,4.4vw,4rem)] font-light leading-[1.18] tracking-tight text-platinum">
        {LINE.split(" ").map((word, i) => (
          <span key={`${word}-${i}`} className="mf-word mr-[0.22em] inline-block">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
