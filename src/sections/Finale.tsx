"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useFrameSequence } from "@/hooks/useFrameSequence";
import { SEQUENCE_2 } from "@/lib/config";

const FRAME_COUNT = SEQUENCE_2.frameCount;
const IMG_ASPECT = SEQUENCE_2.width / SEQUENCE_2.height;

/**
 * THE FINAL CLIMAX — a pinned, scroll-driven cinematic playback of the 176-frame
 * "putting the headphones on" sequence, ending on a delayed premium CTA.
 *
 * Performance: reuses {@link useFrameSequence} (decode-once, in-memory cache,
 * O(1) lookup). The hot path is dirty-checked and rAF-coalesced — identical to
 * the main sequence — so scrubbing never re-decodes or re-renders React.
 *
 * Emotional pacing: scroll progress is remapped through a slow→fast→slow ease
 * before it drives the frame index, so the calm opening and the hero closing
 * "breathe" while the interaction moment in the middle plays quicker.
 */
export function Finale() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef({ value: 0 }); // 0–1 eased scroll progress
  const rafRef = useRef<number | null>(null);
  const scheduleDrawRef = useRef<() => void>(() => {});
  const forceDrawRef = useRef<() => void>(() => {});

  // Lazy-arm frame loading only when the finale is near the viewport, so its
  // ~5 MB of frames never competes with above-the-fold assets.
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!root.current || armed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }, // arm ~1.5 viewports early
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [armed]);

  const { store, drawTick } = useFrameSequence(
    armed ? SEQUENCE_2 : EMPTY_SEQUENCE,
  );
  // The pin/ScrollTrigger is created ONCE on mount and must never be torn down
  // and rebuilt (that would re-measure stacked pins and snap progress). The
  // paint loop therefore reads the store through a ref that always holds the
  // latest value, instead of closing over it.
  const storeRef = useRef(store);
  storeRef.current = store;

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx2d || !root.current) return;

    let cw = 0;
    let ch = 0;
    let dx = 0;
    let dy = 0;
    let dw = 0;
    let dh = 0;
    let lastDrawnIndex = -1;

    const computeGeometry = () => {
      const canvasAspect = cw / ch;
      if (canvasAspect > IMG_ASPECT) {
        dw = cw;
        dh = cw / IMG_ASPECT;
      } else {
        dh = ch;
        dw = ch * IMG_ASPECT;
      }
      dx = (cw - dw) * 0.5;
      dy = (ch - dh) * 0.5;
    };

    const resolveIndex = (target: number): number => {
      const { images, contiguousRef } = storeRef.current;
      if (images[target]) return target;
      const safe = contiguousRef.current;
      return safe >= 0 ? Math.min(target, safe) : -1;
    };

    const paint = () => {
      if (cw === 0 || ch === 0) return;
      let target = (progressRef.current.value * (FRAME_COUNT - 1) + 0.5) | 0;
      if (target < 0) target = 0;
      else if (target >= FRAME_COUNT) target = FRAME_COUNT - 1;
      const index = resolveIndex(target);
      if (index < 0 || index === lastDrawnIndex) return;
      const img = storeRef.current.images[index];
      if (!img) return;
      ctx2d.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndex = index;
    };

    const scheduleDraw = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        paint();
      });
    };
    scheduleDrawRef.current = scheduleDraw;
    forceDrawRef.current = () => {
      lastDrawnIndex = -1;
      scheduleDraw();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      const nextW = Math.round(w * dpr);
      const nextH = Math.round(h * dpr);
      if (nextW === cw && nextH === ch) return;
      cw = canvas.width = nextW;
      ch = canvas.height = nextH;
      computeGeometry();
      lastDrawnIndex = -1;
      paint();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ctx = gsap.context(() => {
      // ONE master timeline on a SINGLE pinned ScrollTrigger. Its length is
      // anchored to 1.0 so every tween is positioned by scroll fraction. Folding
      // the depth/intro motion into this one timeline (instead of separate
      // triggers) guarantees the pin releases cleanly and avoids trigger
      // conflicts. The frame index is driven by `progressRef.value`, eased
      // slow→fast→slow for emotional pacing.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          // Pin length tuned for DENSE frame-to-scroll mapping: 176 frames over
          // ~4× viewport (≈ one frame per ~26px) so a normal scroll gesture
          // advances many frames and motion reads as continuous — not "stuck".
          // ~68% frame playback, then a held hero frame while the CTA reveals.
          end: () => `+=${window.innerHeight * 4}`,
          // Low scrub lag: Lenis already smooths input; a big scrub value here
          // double-damps and makes frames trail the scroll (the "jitter"/lag).
          scrub: 0.3,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            // Drive the frame DIRECTLY from the ScrollTrigger's own progress —
            // this fires on EVERY scrub tick (unlike a child tween's onUpdate,
            // which can stop firing and freeze the canvas). Map the first 68% of
            // scroll → frames 0→1 with eased pacing; the tail holds the hero
            // frame while the CTA reveals.
            const p = self.progress;
            const playback = Math.min(1, p / 0.68); // 0→1 over first 68%
            // power1.inOut easing for slow→fast→slow emotional pacing.
            const eased =
              playback < 0.5
                ? 2 * playback * playback
                : 1 - Math.pow(-2 * playback + 2, 2) / 2;
            progressRef.current.value = eased;
            scheduleDraw();

            // Toggle interactivity/a11y for the CTA (visual reveal is scrubbed).
            const atEnd = p >= 0.7;
            setRevealed((prev) => (prev === atEnd ? prev : atEnd));
          },
          onLeave: () => setRevealed(true),
          onEnterBack: () => setRevealed(true),
          onLeaveBack: () => setRevealed(false),
        },
      });
      // DEPTH — camera-move illusion + parallax (GPU transforms only).
      tl.to("[data-finale-canvas]", { scale: 1.08, duration: 1 }, 0);
      tl.to("[data-finale-glow]", { yPercent: -18, opacity: 0.95, duration: 1 }, 0);
      tl.to("[data-finale-haze]", { yPercent: 14, duration: 1 }, 0);

      // CTA reveal — SCRUBBED (scroll-synchronised, not wall-clock), so it is
      // fully visible by ~85% and HOLDS to 100% while the section is pinned.
      tl.to("[data-finale-scrim]", { opacity: 1, duration: 0.18 }, 0.68);
      tl.fromTo(
        "[data-cta-stagger]",
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.05, ease: "power3.out" },
        0.72,
      );

      // Opening title fades out over the first ~23% (interaction begins).
      tl.to(
        "[data-finale-intro]",
        { autoAlpha: 0, yPercent: -10, duration: 0.23 },
        0,
      );
    }, root);

    return () => {
      ctx.revert();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // Mount-once: the pin must never be rebuilt (store is read via storeRef).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Repaint at load milestones (bypassing dirty-check) so late-decoded frames
  // replace clamped placeholders even when the scrub is idle.
  //
  // IMPORTANT: do NOT call ScrollTrigger.refresh() here. Finale frames stream in
  // lazily *while the user scrolls into the section*, so the all-loaded drawTick
  // fires mid-scroll — a refresh() would re-pin and SNAP the scrubbed progress
  // backward (the "jitter/jump/stuck" symptom). Pin geometry is independent of
  // image decode, so a plain repaint is all that's needed.
  useEffect(() => {
    forceDrawRef.current();
  }, [drawTick]);

  return (
    <section
      ref={root}
      id="finale"
      className="relative h-[100svh] w-full overflow-hidden bg-void"
    >
      {/* depth: light haze behind */}
      <div
        data-finale-haze
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(60,110,140,0.22),transparent_60%)]"
      />

      {/* the cinematic frame sequence */}
      <canvas
        ref={canvasRef}
        data-finale-canvas
        className="absolute inset-0 z-[1] block h-full w-full will-change-transform"
        aria-hidden
      />

      {/* depth: ambient glow drifting with scroll */}
      <div
        data-finale-glow
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(80,150,180,0.16),transparent_65%)] opacity-60 blur-3xl"
      />

      {/* cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(5,5,6,0.82)_100%)]" />

      {/* opening title — fades out as motion begins */}
      <div
        data-finale-intro
        className="pointer-events-none absolute inset-x-0 top-[12%] z-[4]
                   flex flex-col items-center gap-5 text-center"
      >
        {/* animated bracket ornament */}
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
            Aurora Acoustics
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
        <h2 className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.96]
                       tracking-tight text-metallic">
          The moment it<br className="hidden sm:block" /> all comes together
        </h2>
        <p className="text-sm tracking-wide2 text-mist/40">
          Scroll to experience
        </p>
        {/* animated chevron */}
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
          className="mt-2 h-6 w-6 animate-bounce text-gold/40"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* CTA scrim */}
      <div
        data-finale-scrim
        className="pointer-events-none absolute inset-0 z-[4]
                   bg-gradient-to-t from-void via-void/75 to-void/10 opacity-0"
      />

      {/* ── CTA panel ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-[5] pb-[10%]"
        style={{ pointerEvents: revealed ? "auto" : "none" }}
        aria-hidden={!revealed}
      >
        <div className="container-luxe flex flex-col items-center text-center">

          {/* top rule */}
          <div
            data-cta-stagger
            className="mb-8 flex items-center gap-5 opacity-0"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-gold/70" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60">
              Limited Edition
            </span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-gold/40 to-gold/70" />
          </div>

          {/* product name */}
          <div data-cta-stagger className="opacity-0">
            <span className="kicker mb-3 block tracking-[0.4em]">Phantom One</span>
            <h3
              className="font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.9]
                         tracking-tight text-metallic"
            >
              Hear<br className="sm:hidden" />
              {" "}everything.
            </h3>
          </div>

          {/* descriptor */}
          <p
            data-cta-stagger
            className="mt-6 max-w-md text-sm leading-relaxed text-mist/60 opacity-0"
          >
            Reserve yours today. Limited first edition, individually numbered
            and delivered in a hand-finished case.
          </p>

          {/* CTAs */}
          <div
            data-cta-stagger
            className="mt-10 flex flex-wrap items-center justify-center gap-4 opacity-0"
          >
            <Link
              href="/products"
              tabIndex={revealed ? 0 : -1}
              className="group relative overflow-hidden rounded-full border border-white/15
                         px-8 py-3.5 text-xs uppercase tracking-wide2 text-platinum
                         transition-all duration-500
                         hover:border-gold/60 hover:text-gold
                         hover:shadow-[0_0_40px_-8px_rgba(200,164,92,0.3)]"
            >
              Shop the collection
            </Link>
            <Link
              href="/products/phantom-one"
              tabIndex={revealed ? 0 : -1}
              className="group relative flex items-center gap-2.5 overflow-hidden
                         rounded-full bg-gold px-8 py-3.5 text-xs font-semibold
                         uppercase tracking-wide2 text-void
                         transition-all duration-500
                         hover:bg-[#d8b46c] hover:shadow-[0_12px_48px_-8px_rgba(200,164,92,0.7)]"
            >
              {/* sweep shimmer */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full
                           skew-x-[-20deg] bg-white/25 transition-transform
                           duration-700 group-hover:translate-x-[200%]"
              />
              <span className="relative">Reserve Phantom One — $899</span>
            </Link>
          </div>

          {/* tiny footnote */}
          <p
            data-cta-stagger
            className="mt-8 text-[10px] uppercase tracking-wide2 text-mist/25 opacity-0"
          >
            Free worldwide shipping · 2-year warranty · 30-day returns
          </p>
        </div>
      </div>
    </section>
  );
}

/** Sentinel passed to the loader before the section is armed (loads nothing). */
const EMPTY_SEQUENCE = {
  frameCount: 0,
  width: SEQUENCE_2.width,
  height: SEQUENCE_2.height,
  getFrameUrl: () => "",
};
