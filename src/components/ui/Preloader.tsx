"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { BRAND } from "@/lib/config";

interface PreloaderProps {
  /** 0–1 load progress of the heavy frame sequence */
  progress: number;
  /** when true, the preloader plays its exit and unmounts */
  done: boolean;
}

/**
 * Full-screen cinematic intro curtain. Counts up with the sequence preload,
 * then lifts away once the leading frames are ready.
 */
export function Preloader({ progress, done }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const display = Math.round(progress * 100);

  useEffect(() => {
    if (!done || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setHidden(true) })
        .to(".pl-content", { opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
        });
    }, rootRef);
    return () => ctx.revert();
  }, [done]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
    >
      <div className="pl-content flex flex-col items-center gap-6">
        <span className="font-display text-4xl tracking-luxe text-platinum md:text-6xl">
          {BRAND.name}
        </span>
        <div className="h-px w-48 overflow-hidden bg-white/10">
          <div
            className="h-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${display}%` }}
          />
        </div>
        <span className="text-xs tabular-nums tracking-wide2 text-mist">
          {String(display).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
