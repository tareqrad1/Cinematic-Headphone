"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { BRAND, HERO_VIDEO } from "@/lib/config";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // Cinematic entrance
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "expo.out" } });
      tl.from(".hero-video-frame", {
        scale: 1.12,
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
      })
        .from(
          ".hero-kicker",
          { y: 24, opacity: 0, duration: 1 },
          "-=1.1",
        )
        .from(
          ".hero-word",
          { yPercent: 120, opacity: 0, duration: 1.3, stagger: 0.08 },
          "-=0.8",
        )
        .from(
          ".hero-tagline",
          { y: 20, opacity: 0, duration: 1 },
          "-=0.7",
        )
        .from(
          ".hero-scroll",
          { opacity: 0, duration: 1 },
          "-=0.5",
        );

      // Scroll parallax — video drifts up & dims as the hero leaves
      gsap.to(".hero-video-frame", {
        yPercent: 18,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-copy", {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // pointer parallax
      const onMove = (e: PointerEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(".hero-video-frame", {
          x: x * 18,
          y: y * 14,
          duration: 1.2,
          ease: "power3.out",
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  const words = BRAND.product.split(" ");

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* Video centerpiece */}
      <div className="hero-video-frame absolute inset-0 will-change-transform">
        <video
          className="h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* cinematic grade */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/20 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,6,0.85)_100%)]" />
      </div>

      {/* Copy */}
      <div className="hero-copy container-luxe relative z-10 flex flex-col items-center text-center">
        <span className="hero-kicker kicker mb-6">{BRAND.name} — New</span>

        <h1 className="display-xl relative z-20">
          {words.map((word) => (
            <span
              key={word}
              className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
            >
              <span className="hero-word text-metallic inline-block">{word}</span>
            </span>
          ))}
        </h1>

        <p className="hero-tagline body-lux mt-8 max-w-md text-platinum/80">
          {BRAND.tagline}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-luxe text-mist">
          Scroll
        </span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="h-2 w-1 rounded-full bg-gold animate-scroll-pulse" />
        </span>
      </div>
    </section>
  );
}
