"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SEQUENCE, SEQUENCE_BEATS } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { FrameStore } from "@/hooks/useFrameSequence";

interface FrameSequenceProps {
  store: FrameStore;
  /** bumped at load milestones to trigger a redraw without per-frame churn */
  drawTick: number;
  /** scroll distance multiplier — higher = slower, more cinematic scrub */
  scrollLength?: number;
}

const FRAME_COUNT = SEQUENCE.frameCount;
const IMG_ASPECT = SEQUENCE.width / SEQUENCE.height;

/**
 * Pinned, scrubbed canvas playback of the WebP frame sequence.
 *
 * HOT-PATH GUARANTEES (per scroll tick):
 *  - O(1) frame resolution: direct array index, never a scan.
 *  - Dirty check: if the rounded frame index is unchanged, the tick does ZERO
 *    canvas work and returns immediately.
 *  - No allocations in the draw loop; cover-fit geometry is cached and only
 *    recomputed on resize.
 *  - GSAP writes the frame index into a plain object; the actual paint is
 *    coalesced into a single rAF.
 */
export function FrameSequence({
  store,
  drawTick,
  // Pin length tuned for dense frame-to-scroll mapping (≈ one frame per ~25px),
  // so scroll gestures advance many frames and motion reads as continuous.
  scrollLength = 3.5,
}: FrameSequenceProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef({ value: 0 }); // fractional index written by GSAP
  const rafRef = useRef<number | null>(null);

  // Stable handle so the load-milestone effect can poke the same draw pipeline.
  const scheduleDrawRef = useRef<() => void>(() => {});
  // Lets the load-milestone effect force a repaint past the dirty-check, so a
  // late-decoded frame is shown even when the scrub is idle.
  const forceDrawRef = useRef<() => void>(() => {});

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctxCanvas = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctxCanvas || !root.current) return;

    const { images, contiguousRef } = store;

    // --- cached geometry (recomputed only on resize) -----------------------
    let cw = 0;
    let ch = 0;
    let dx = 0;
    let dy = 0;
    let dw = 0;
    let dh = 0;

    // --- dirty-check state --------------------------------------------------
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

    /** O(1) resolve: exact frame if decoded, else clamp to contiguous-ready. */
    const resolveIndex = (target: number): number => {
      if (images[target]) return target;
      const safe = contiguousRef.current;
      return safe >= 0 ? Math.min(target, safe) : -1;
    };

    const paint = () => {
      if (cw === 0 || ch === 0) return;

      // O(1) integer index from the scrubbed fractional value.
      let target = (frameRef.current.value + 0.5) | 0; // fast round, ≥0
      if (target < 0) target = 0;
      else if (target >= FRAME_COUNT) target = FRAME_COUNT - 1;

      const index = resolveIndex(target);
      if (index < 0 || index === lastDrawnIndex) return; // dirty check → bail

      const img = images[index];
      if (!img) return;

      ctxCanvas.drawImage(img, dx, dy, dw, dh);
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
    // Invalidate the dirty-check, then repaint: ensures a newly-decoded frame
    // replaces a stale clamped one even if the scroll position hasn't changed.
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
      if (nextW === cw && nextH === ch) return; // no real change → skip
      cw = canvas.width = nextW;
      ch = canvas.height = nextH;
      computeGeometry();
      lastDrawnIndex = -1; // force one repaint at the new size
      paint();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ResizeObserver covers the pinned 0-size-on-first-layout case.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const ctx = gsap.context(() => {
      // The frame index is driven DIRECTLY from the ScrollTrigger's own
      // progress — its onUpdate fires on every scrub tick, so the canvas can
      // never freeze behind a stale tween. The only per-tick work is writing a
      // number + scheduling one rAF-coalesced, dirty-checked paint.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * scrollLength}`,
        // Low scrub: Lenis smooths input; a high value here double-damps and
        // makes frames trail the scroll. 0.3 tracks tightly yet smoothly.
        scrub: 0.3,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => {
          frameRef.current.value = self.progress * (FRAME_COUNT - 1);
          scheduleDraw();
        },
      });

      // Beat overlays — ONE shared scrubbed timeline whose total length is
      // pinned to 1.0, so every beat's [start, end] fraction maps directly to
      // scroll progress (0–1). Each beat ENTERS and fully EXITS within its own
      // window — the exit completes by `end`, never bleeding into the next
      // beat's entrance — so two left-aligned blocks (which share the same
      // centred rectangle) are never on screen together. Enter/exit each take
      // ~28% of the window; the middle holds steady for readability.
      const beatsTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * scrollLength}`,
          scrub: true,
        },
      });
      // Anchor the timeline to a normalised 0→1 length so positions = progress.
      beatsTl.to({}, { duration: 1 }, 0);

      SEQUENCE_BEATS.forEach((beat) => {
        const el = root.current!.querySelector<HTMLElement>(
          `[data-beat="${beat.id}"]`,
        );
        if (!el) return;
        const span = beat.end - beat.start;
        const enter = span * 0.28;
        const exit = span * 0.28;
        beatsTl
          .fromTo(
            el,
            { autoAlpha: 0, yPercent: 24 },
            { autoAlpha: 1, yPercent: 0, duration: enter, ease: "power2.out" },
            beat.start,
          )
          // elegant exit, finishing exactly at beat.end
          .to(
            el,
            { autoAlpha: 0, yPercent: -24, duration: exit, ease: "power2.in" },
            beat.end - exit,
          );
      });
    }, root);

    return () => {
      ctx.revert();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // Mount-once: ScrollTrigger/pin must not be rebuilt on load updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLength]);

  // Repaint at load milestones (critical-ready, fully-loaded), bypassing the
  // dirty-check so a late-decoded frame replaces a clamped placeholder even
  // when the scrub is idle. Does NOT call ScrollTrigger.refresh() — pin
  // geometry is independent of image decode (that refresh lives in
  // useSmoothScroll, fired once after layout settles).
  useEffect(() => {
    forceDrawRef.current();
  }, [drawTick]);

  return (
    <section
      ref={root}
      className="relative h-[100svh] w-full overflow-hidden bg-void"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,6,0.7)_100%)]" />

      <div className="container-luxe relative z-10 flex h-full items-center">
        {SEQUENCE_BEATS.map((beat) => (
          <div
            key={beat.id}
            data-beat={beat.id}
            className={cn(
              "pointer-events-none absolute max-w-md opacity-0 will-change-[transform,opacity]",
              beat.align === "left" && "left-6 md:left-16",
              beat.align === "right" && "right-6 text-right md:right-16",
              beat.align === "center" &&
                "left-1/2 -translate-x-1/2 text-center",
            )}
          >
            <span className="kicker">{beat.kicker}</span>
            <h2 className="display-lg mt-4 text-platinum">{beat.title}</h2>
            <p className="body-lux mt-5">{beat.body}</p>
            {beat.stat && (
              <div
                className={cn(
                  "mt-8 flex flex-col",
                  beat.align === "right" && "items-end",
                  beat.align === "center" && "items-center",
                )}
              >
                <span className="font-display text-4xl text-gold">
                  {beat.stat.value}
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-wide2 text-mist">
                  {beat.stat.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
