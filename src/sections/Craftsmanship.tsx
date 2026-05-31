"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { STORY_SECTIONS } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Craftsmanship() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // section intro
      const intro = gsap.utils.toArray<HTMLElement>(".craft-intro .craft-reveal");
      if (intro.length > 0) {
        gsap.set(intro, { y: 48, autoAlpha: 0, filter: "blur(12px)" });
        gsap.to(intro, {
          y: 0, autoAlpha: 1, filter: "blur(0px)",
          duration: 1.1, stagger: 0.12, ease: "power3.out", clearProps: "filter",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-craft-row]");
      rows.forEach((row) => {
        // copy reveal
        const copy = row.querySelectorAll<HTMLElement>(".craft-reveal");
        if (copy.length > 0) {
          gsap.set(copy, { y: 48, autoAlpha: 0, filter: "blur(12px)" });
          gsap.to(copy, {
            y: 0, autoAlpha: 1, filter: "blur(0px)",
            duration: 1.1, stagger: 0.12, ease: "power3.out", clearProps: "filter",
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          });
        }

        // image scale-in on scroll enter
        const card = row.querySelector<HTMLElement>("[data-craft-card]");
        if (card) {
          gsap.fromTo(card,
            { scale: 0.94, autoAlpha: 0 },
            {
              scale: 1, autoAlpha: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 85%", once: true },
            },
          );
        }

        // parallax drift on the inner image
        const media = row.querySelector<HTMLElement>("[data-craft-media]");
        if (media) {
          gsap.fromTo(media,
            { yPercent: -8 },
            {
              yPercent: 8, ease: "none",
              scrollTrigger: {
                trigger: row, start: "top bottom", end: "bottom top", scrub: true,
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
      {/* ambient top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(200,164,92,0.06) 0%, transparent 100%)",
        }}
      />

      {/* ── intro ── */}
      <div className="craft-intro container-luxe">
        <span className="craft-reveal kicker">The Object</span>
        <h2 className="craft-reveal display-lg mt-5 max-w-3xl text-metallic">
          Made to be felt,<br className="hidden md:block" /> before it&apos;s heard
        </h2>
      </div>

      {/* ── rows ── */}
      <div className="container-luxe mt-24 space-y-28 md:space-y-40">
        {STORY_SECTIONS.map((item, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={item.id}
              data-craft-row
              className={cn(
                "grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16",
                reversed && "md:[direction:rtl]",
              )}
            >
              {/* ── image card ── */}
              <div className="md:[direction:ltr]">
                <div
                  data-craft-card
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07]
                             shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]"
                  style={{ willChange: "transform" }}
                >
                  {/* aspect container — portrait for cover images */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* parallax inner — slightly taller so the drift never shows edges */}
                    <div
                      data-craft-media
                      className="absolute inset-x-0 -top-[8%] bottom-[-8%] will-change-transform"
                    >
                      <Image
                        src={item.image.src}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                                   group-hover:scale-[1.04]"
                      />
                    </div>

                    {/* bottom gradient — text legibility + design depth */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10
                                    h-2/5 bg-gradient-to-t from-void/90 via-void/40 to-transparent" />

                    {/* top subtle vignette */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10
                                    h-24 bg-gradient-to-b from-void/30 to-transparent" />

                    {/* kicker badge inside the image */}
                    <div className="absolute left-5 top-5 z-20">
                      <span
                        className="inline-flex items-center gap-2 rounded-full border border-white/10
                                   bg-void/60 px-3 py-1.5 text-[10px] uppercase tracking-wide2
                                   text-mist/70 backdrop-blur-md"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-gold/70"
                          style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.4)" }}
                        />
                        {item.kicker}
                      </span>
                    </div>

                    {/* stat chip — bottom-right of image */}
                    {item.stat && (
                      <div className="absolute bottom-5 right-5 z-20 text-right">
                        <div className="font-display text-3xl leading-none text-gold">
                          {item.stat.value}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wide2 text-mist/50">
                          {item.stat.label}
                        </div>
                      </div>
                    )}

                    {/* index number watermark */}
                    <div
                      className="pointer-events-none absolute -right-3 bottom-24 z-10
                                  font-display text-[8rem] leading-none text-white/[0.03] select-none"
                    >
                      0{i + 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── copy ── */}
              <div className="md:[direction:ltr]">
                <span className="craft-reveal kicker">{item.kicker}</span>
                <h3
                  className="craft-reveal mt-4 font-display text-[clamp(2rem,4vw,3.4rem)]
                             leading-[1.02] text-platinum"
                >
                  {item.title}
                </h3>
                <p className="craft-reveal body-lux mt-6 max-w-md">{item.body}</p>

                {item.stat && (
                  <div
                    className="craft-reveal mt-10 flex items-baseline gap-4
                               border-t border-white/[0.07] pt-6"
                  >
                    <span className="font-display text-5xl text-gold">
                      {item.stat.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide2 text-mist">
                      {item.stat.label}
                    </span>
                  </div>
                )}

                {/* decorative line */}
                <div className="craft-reveal mt-10 flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-gold/50 to-transparent" />
                  <span className="text-[10px] uppercase tracking-luxe text-mist/25">
                    Aurora Acoustics
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
