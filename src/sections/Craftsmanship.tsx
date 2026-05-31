"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { STORY_SECTIONS } from "@/lib/config";
import { prefersReducedMotion } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ─── hover-expand image card ─────────────────────────────────────────────── */

interface CraftCardProps {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
  index: number;
}

function CraftCard({ src, alt, kicker, title, body, stat, index }: CraftCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const mediaRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLSpanElement>(null);

  function onEnter() {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* card scales up slightly — feels like it "lifts" */
    tl.to(cardRef.current, { scale: 1.03, duration: 0.55 }, 0);

    /* image inside zooms in */
    tl.to(mediaRef.current, { scale: 1.08, duration: 0.7 }, 0);

    /* dark scrim slides in */
    tl.to(overlayRef.current, { opacity: 1, duration: 0.4 }, 0);

    /* "explore" label slides up */
    tl.fromTo(titleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
      0.12,
    );

    /* cursor-tracked glow */
    tl.to(glowRef.current, { opacity: 1, duration: 0.4 }, 0);
  }

  function onLeave() {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(cardRef.current, { scale: 1, duration: 0.5 }, 0);
    tl.to(mediaRef.current, { scale: 1, duration: 0.55 }, 0);
    tl.to(overlayRef.current, { opacity: 0, duration: 0.35 }, 0);
    tl.to(titleRef.current, { opacity: 0, y: 10, duration: 0.22 }, 0);
    tl.to(glowRef.current, { opacity: 0, duration: 0.3 }, 0);
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion() || !cardRef.current || !glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    /* subtle 3-D tilt */
    gsap.to(cardRef.current, {
      rotateY: (x - 0.5) * 7,
      rotateX: (y - 0.5) * -5,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });
    /* glow follows cursor */
    gsap.to(glowRef.current, {
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%,
        rgba(200,164,92,0.22) 0%, transparent 60%)`,
      duration: 0.35,
    });
  }

  function onMouseLeaveCard() {
    onLeave();
    if (!prefersReducedMotion()) {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
    }
  }

  return (
    <div
      ref={cardRef}
      data-craft-card
      onMouseEnter={onEnter}
      onMouseLeave={onMouseLeaveCard}
      onMouseMove={onMouseMove}
      className="group relative cursor-pointer overflow-hidden rounded-2xl
                 border border-white/[0.07]
                 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]"
      style={{ willChange: "transform", transformStyle: "preserve-3d" }}
    >
      {/* cursor-tracked glow layer */}
      <span
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-[1] opacity-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(200,164,92,0.15) 0%, transparent 60%)" }}
      />

      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          ref={mediaRef}
          data-craft-media
          className="absolute inset-x-0 -top-[6%] bottom-[-6%] will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover"
          />
        </div>

        {/* permanent top & bottom vignette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]
                        h-2/5 bg-gradient-to-t from-void/90 via-void/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2]
                        h-16 bg-gradient-to-b from-void/25 to-transparent" />

        {/* hover scrim — deepens so text is always legible */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-[3] opacity-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,6,0.96) 0%, rgba(5,5,6,0.65) 45%, rgba(5,5,6,0.15) 100%)",
          }}
        />

        {/* kicker badge — always visible */}
        <div className="absolute left-4 top-4 z-[4]">
          <span className="inline-flex items-center gap-1.5 rounded-full
                           border border-white/10 bg-void/60 px-3 py-1.5
                           text-[10px] uppercase tracking-wide2 text-mist/70
                           backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full bg-gold/70"
              style={{ boxShadow: "0 0 6px 2px rgba(200,164,92,0.4)" }}
            />
            {kicker}
          </span>
        </div>

        {/* hover cue — just a gold "explore" label, no duplicate text */}
        <div className="absolute inset-x-0 bottom-0 z-[5] flex items-center justify-center pb-5">
          <div ref={titleRef} className="opacity-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40
                             bg-void/60 px-4 py-1.5 text-[10px] uppercase tracking-wide2
                             text-gold backdrop-blur-sm">
              <span className="h-1 w-1 rounded-full bg-gold" />
              Explore detail
            </span>
          </div>
        </div>

        {/* index watermark */}
        <div className="pointer-events-none absolute -right-2 bottom-16 z-[2]
                        select-none font-display text-[6rem] leading-none text-white/[0.025]">
          0{index + 1}
        </div>
      </div>
    </div>
  );
}

/* ─── section ─────────────────────────────────────────────────────────────── */

export function Craftsmanship() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const intro = gsap.utils.toArray<HTMLElement>(".craft-intro .craft-reveal");
      if (intro.length > 0) {
        gsap.set(intro, { y: 48, opacity: 0, filter: "blur(12px)" });
        gsap.to(intro, {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 1.1, stagger: 0.12, ease: "power3.out",
          clearProps: "opacity,filter,transform",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-craft-row]");
      rows.forEach((row) => {
        const copy = row.querySelectorAll<HTMLElement>(".craft-reveal");
        if (copy.length > 0) {
          gsap.set(copy, { y: 36, opacity: 0, filter: "blur(8px)" });
          gsap.to(copy, {
            y: 0, opacity: 1, filter: "blur(0px)",
            duration: 0.95, stagger: 0.1, ease: "power3.out",
            clearProps: "opacity,filter,transform",
            scrollTrigger: { trigger: row, start: "top 82%", once: true },
          });
        }

        /* scroll-enter scale-in for the card wrapper */
        const cardWrap = row.querySelector<HTMLElement>("[data-craft-card]");
        if (cardWrap) {
          gsap.fromTo(cardWrap,
            { scale: 0.96, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 1.1, ease: "power3.out",
              clearProps: "opacity",   // keep transform for hover
              scrollTrigger: { trigger: row, start: "top 85%", once: true },
            },
          );
        }

        /* parallax drift */
        const media = row.querySelector<HTMLElement>("[data-craft-media]");
        if (media) {
          gsap.fromTo(media,
            { yPercent: -6 },
            {
              yPercent: 6, ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
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
      className="relative overflow-hidden border-t border-white/[0.04] py-24 md:py-36"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(200,164,92,0.05) 0%, transparent 100%)",
        }}
      />

      {/* ── intro ── */}
      <div className="craft-intro container-luxe">
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="craft-reveal kicker">The Object</span>
        </div>
        <h2 className="craft-reveal display-lg mt-5 max-w-2xl text-metallic">
          Made to be felt,<br className="hidden md:block" /> before it&apos;s heard
        </h2>
      </div>

      {/* ── rows ── */}
      <div className="container-luxe mt-20 space-y-20 md:space-y-28">
        {STORY_SECTIONS.map((item, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={item.id}
              data-craft-row
              className={cn(
                "grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14",
                reversed && "md:[direction:rtl]",
              )}
            >
              {/* ── image card ── */}
              <div className="md:[direction:ltr]">
                <CraftCard
                  src={item.image.src}
                  alt={item.imageAlt}
                  kicker={item.kicker}
                  title={item.title}
                  body={item.body}
                  stat={item.stat}
                  index={i}
                />
              </div>

              {/* ── copy ── */}
              <div className="md:[direction:ltr]">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[11px] tabular-nums text-gold/50">0{i + 1}</span>
                  <div className="h-px w-6 bg-gold/30" />
                  <span className="craft-reveal kicker">{item.kicker}</span>
                </div>

                <h3 className="craft-reveal mt-4 font-display
                               text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.06] text-platinum">
                  {item.title}
                </h3>

                <p className="craft-reveal mt-5 max-w-sm text-sm leading-relaxed text-mist/60">
                  {item.body}
                </p>

                {item.stat && (
                  <div className="craft-reveal mt-8 flex items-baseline gap-3
                                  border-t border-white/[0.06] pt-6">
                    <span className="font-display text-4xl text-gold">{item.stat.value}</span>
                    <span className="text-[10px] uppercase tracking-wide2 text-mist/50">
                      {item.stat.label}
                    </span>
                  </div>
                )}

                <div className="craft-reveal mt-8 flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-gold/40 to-transparent" />
                  <span className="text-[10px] uppercase tracking-luxe text-mist/20">
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
