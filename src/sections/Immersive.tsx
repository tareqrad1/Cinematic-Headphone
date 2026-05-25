"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollReveal } from "@/animations/reveal";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const BARS = Array.from({ length: 48 });

const PILLARS = [
  {
    value: "360°",
    title: "Spatial audio",
    body: "Head-tracked processing anchors the soundstage to the room, not your skull.",
  },
  {
    value: "−42dB",
    title: "Adaptive ANC",
    body: "Dual-feedback cancellation reads the world 50,000 times a second and erases it.",
  },
  {
    value: "40h",
    title: "Endurance",
    body: "Forty hours with cancellation on. A weekend away on a single charge.",
  },
] as const;

/**
 * Immersive audio section: a wall of equalizer bars whose heights are scrubbed
 * by scroll, evoking sound made visible. Pure transforms, GPU-friendly.
 */
export function Immersive() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      scrollReveal({
        targets: root.current!.querySelectorAll(".imm-reveal"),
        trigger: root.current!,
      });

      const bars = gsap.utils.toArray<HTMLElement>(".eq-bar");
      gsap.fromTo(
        bars,
        { scaleY: 0.06 },
        {
          scaleY: () => 0.2 + Math.random() * 0.95,
          ease: "sine.inOut",
          stagger: { each: 0.015, from: "center" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="immersive"
      className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden border-t border-white/5 pb-[42vh] pt-28 text-center"
    >
      <div className="container-luxe relative z-10">
        <span className="imm-reveal reveal-hidden kicker">Immersive Audio</span>
        <h2 className="imm-reveal reveal-hidden display-lg mx-auto mt-5 max-w-3xl text-metallic">
          You don&apos;t listen to it. You step inside it.
        </h2>
        <p className="imm-reveal reveal-hidden body-lux mx-auto mt-7 max-w-xl">
          Head-tracked spatial audio locks the soundstage to the world around
          you. Turn your head — the music stays exactly where it should.
        </p>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="imm-reveal reveal-hidden flex flex-col items-center bg-graphite/60 px-7 py-10 text-center backdrop-blur-sm"
            >
              <span className="font-display text-5xl text-gold">{pillar.value}</span>
              <span className="mt-4 text-xs uppercase tracking-wide2 text-platinum">
                {pillar.title}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-mist">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equalizer wall */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[38vh] items-end justify-center gap-1.5 px-6 opacity-80">
        {BARS.map((_, i) => (
          <span
            key={i}
            className="eq-bar block w-full max-w-[10px] flex-1 origin-bottom rounded-t bg-gradient-to-t from-gold/10 via-gold/40 to-platinum/70"
            style={{ height: "100%" }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
