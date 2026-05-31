"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const BARS = Array.from({ length: 64 });

const PILLARS = [
  {
    value: "360°",
    title: "Spatial audio",
    body: "Head-tracked processing anchors the soundstage to the room, not your skull.",
    accent: "from-gold/0 via-gold/30 to-gold/60",
  },
  {
    value: "−42dB",
    title: "Adaptive ANC",
    body: "Dual-feedback cancellation reads the world 50,000 times a second and erases it.",
    accent: "from-[#6ab0ff]/0 via-[#6ab0ff]/25 to-[#6ab0ff]/50",
  },
  {
    value: "40h",
    title: "Endurance",
    body: "Forty hours with cancellation on. A weekend away on a single charge.",
    accent: "from-[#a8f0c8]/0 via-[#a8f0c8]/20 to-[#a8f0c8]/45",
  },
] as const;

export function Immersive() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(".imm-reveal");
      if (targets.length > 0) {
        gsap.set(targets, { y: 48, opacity: 0, filter: "blur(12px)" });
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,filter,transform",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            once: true,
          },
        });
      }

      /* pillar cards pop in with scale */
      gsap.from(".imm-pillar", {
        scale: 0.88,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        clearProps: "opacity,filter,transform",
        scrollTrigger: {
          trigger: ".imm-pillars",
          start: "top 82%",
          once: true,
        },
      });

      /* eq bars scrub with scroll */
      const bars = gsap.utils.toArray<HTMLElement>(".eq-bar");
      gsap.fromTo(
        bars,
        { scaleY: 0.04 },
        {
          scaleY: () => 0.15 + Math.random() * 0.9,
          ease: "sine.inOut",
          stagger: { each: 0.012, from: "center" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      /* center line grows in */
      gsap.fromTo(".imm-center-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: "power3.inOut",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        },
      );

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="immersive"
      className="relative flex min-h-[100svh] flex-col items-center justify-center
                 overflow-hidden border-t border-white/[0.04] pb-[38vh] pt-32 text-center"
    >
      {/* deep ambient radial */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(80,120,200,0.07) 0%, rgba(200,164,92,0.04) 50%, transparent 80%)",
        }}
      />

      {/* animated center divider */}
      <div className="imm-center-line absolute left-1/2 top-0 h-32 w-px origin-top
                      bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div className="container-luxe relative z-10 max-w-5xl">

        {/* ── kicker ── */}
        <div className="imm-reveal flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="kicker">Immersive Audio</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* ── headline ── */}
        <h2 className="imm-reveal display-lg mx-auto mt-6 max-w-3xl text-metallic">
          You don&apos;t listen to it.<br className="hidden sm:block" />
          <span className="relative">
            {" "}You step{" "}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: "1px rgba(200,164,92,0.4)",
                WebkitTextFillColor: "transparent",
              }}
            >
              inside
            </span>
          </span>
          {" "}it.
        </h2>

        {/* ── body ── */}
        <p className="imm-reveal body-lux mx-auto mt-7 max-w-xl text-mist/70">
          Head-tracked spatial audio locks the soundstage to the world around
          you. Turn your head — the music stays exactly where it should.
        </p>

        {/* ── stat line ── */}
        <div className="imm-reveal mt-10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-wide2 text-mist/30">
          <span>Beryllium drivers</span>
          <span className="h-px w-6 bg-white/10" />
          <span>5Hz–45kHz</span>
          <span className="h-px w-6 bg-white/10" />
          <span>−42dB ANC</span>
        </div>

        {/* ── pillar cards ── */}
        <div className="imm-pillars mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="imm-pillar group relative overflow-hidden rounded-2xl
                         border border-white/[0.06] bg-white/[0.02]
                         px-7 py-9 text-center backdrop-blur-sm
                         transition-[border-color,background] duration-500
                         hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {/* bottom accent glow per card */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-24
                            bg-gradient-to-t ${pillar.accent} opacity-0
                            transition-opacity duration-500 group-hover:opacity-100`}
              />

              {/* stat value */}
              <div className="relative font-display text-5xl text-platinum md:text-6xl">
                {pillar.value}
                {/* gold underline */}
                <div className="mx-auto mt-3 h-px w-8 bg-gradient-to-r from-transparent via-gold/60 to-transparent
                                transition-all duration-500 group-hover:w-16" />
              </div>

              <span className="mt-5 block text-[11px] uppercase tracking-wide2 text-mist/60">
                {pillar.title}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-mist/50">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── equalizer wall ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0
                      flex h-[36vh] items-end justify-center gap-[3px] px-4">
        {BARS.map((_, i) => (
          <span
            key={i}
            className="eq-bar block flex-1 origin-bottom rounded-t-sm"
            style={{
              height: "100%",
              background: `linear-gradient(to top,
                rgba(200,164,92,0.04) 0%,
                rgba(200,164,92,${0.15 + (Math.abs(i - 32) < 8 ? 0.25 : 0.05)}) 50%,
                rgba(240,220,160,${0.4 + (Math.abs(i - 32) < 6 ? 0.3 : 0)}) 100%
              )`,
            }}
          />
        ))}
      </div>

      {/* fade eq into void */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/5
                      bg-gradient-to-t from-void via-void/80 to-transparent" />

      {/* side vignettes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24
                      bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24
                      bg-gradient-to-l from-void to-transparent" />
    </section>
  );
}
