"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scrollReveal } from "@/animations/reveal";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { STORY_SECTIONS } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { StorySection as StorySectionType } from "@/types";

function StoryBlock({
  section,
  index,
}: {
  section: StorySectionType;
  index: number;
}) {
  const root = useRef<HTMLElement>(null);
  const reversed = index % 2 === 1;

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      scrollReveal({
        targets: root.current!.querySelectorAll(".story-reveal"),
        trigger: root.current!,
      });
      // parallax on the large index numeral
      gsap.to(root.current!.querySelector(".story-numeral"), {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id={section.id}
      className="relative flex min-h-[90svh] items-center border-t border-white/5 py-28"
    >
      <span className="story-numeral pointer-events-none absolute -top-6 left-2 select-none font-display text-[24vw] leading-none text-white/[0.03] md:left-10">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="container-luxe relative z-10">
        <div
          className={cn(
            "grid items-center gap-10 md:grid-cols-2 md:gap-20",
            reversed && "md:[direction:rtl]",
          )}
        >
          <div className={cn("md:[direction:ltr]")}>
            <span className="story-reveal reveal-hidden kicker block">
              {section.kicker}
            </span>
            <h2 className="story-reveal reveal-hidden display-lg mt-5 text-metallic">
              {section.title}
            </h2>
            <p className="story-reveal reveal-hidden body-lux mt-7 max-w-lg">
              {section.body}
            </p>
            {section.stat && (
              <div className="story-reveal reveal-hidden mt-10 flex items-baseline gap-4">
                <span className="font-display text-5xl text-gold md:text-6xl">
                  {section.stat.value}
                </span>
                <span className="text-xs uppercase tracking-wide2 text-mist">
                  {section.stat.label}
                </span>
              </div>
            )}
          </div>

          {/* Decorative panel — premium glass + metallic gradient */}
          <div className="story-reveal reveal-hidden md:[direction:ltr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#16181d_0%,#0c0d10_45%,#2a2d34_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,164,92,0.18),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void to-transparent" />
              <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] bg-[length:200%_100%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StorySections() {
  return (
    <>
      {STORY_SECTIONS.map((section, i) => (
        <StoryBlock key={section.id} section={section} index={i} />
      ))}
    </>
  );
}
