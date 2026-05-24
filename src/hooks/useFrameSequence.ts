"use client";

import { useEffect, useRef, useState } from "react";
import type { SequenceConfig } from "@/types";

export interface FrameStore {
  /**
   * Decoded images indexed by frame number; sparse until loaded.
   * Read directly for O(1) lookup — never scanned on the hot path.
   */
  readonly images: ReadonlyArray<HTMLImageElement | undefined>;
  /** highest contiguously-decoded index (−1 = none). O(1) "is ready" checks. */
  readonly contiguousRef: { current: number };
}

interface FrameSequenceState {
  readonly store: FrameStore;
  /** 0–1 load progress across the whole sequence (throttled, ~UI cadence) */
  readonly progress: number;
  /** true once the minimal critical subset is decoded — gates the splash */
  readonly ready: boolean;
  /** monotonic redraw signal: bumped only at meaningful load milestones */
  readonly drawTick: number;
}

const CRITICAL_FRAMES = 4; // open the experience after just these

/**
 * Streams an image sequence with a three-tier strategy and exposes a store
 * designed for O(1) hot-path reads:
 *
 *   1. Critical subset (first {@link CRITICAL_FRAMES}) decoded in order →
 *      unblocks the splash almost immediately.
 *   2. Remaining frames streamed with bounded concurrency.
 *
 * Every image is decoded exactly once via `img.decode()` and cached in memory;
 * objects are never recreated. React state updates are throttled to a handful
 * of milestones (not per-frame) to avoid re-render thrash during loading.
 */
export function useFrameSequence(
  sequence: SequenceConfig,
  concurrency = 6,
): FrameSequenceState {
  const { frameCount, getFrameUrl } = sequence;

  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  if (imagesRef.current.length !== frameCount) {
    imagesRef.current = new Array(frameCount).fill(undefined);
  }
  const contiguousRef = useRef<number>(-1);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [drawTick, setDrawTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const images = imagesRef.current;
    let completed = 0;

    // Throttle React updates: coalesce many decodes into one rAF-batched
    // setState so we never trigger 182 re-renders.
    let rafPending = false;
    const flush = () => {
      rafPending = false;
      if (cancelled) return;
      setProgress(frameCount === 0 ? 1 : completed / frameCount);
    };
    const requestFlush = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(flush);
    };

    // Advance the contiguous-ready pointer as far as decoded frames allow.
    const advanceContiguous = () => {
      let next = contiguousRef.current + 1;
      while (next < frameCount && images[next]) next += 1;
      contiguousRef.current = next - 1;
    };

    const loadFrame = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = getFrameUrl(index);
        const finish = () => {
          if (cancelled) return resolve();
          images[index] = img;
          completed += 1;
          advanceContiguous();
          requestFlush();
          resolve();
        };
        img
          .decode()
          .then(finish)
          .catch(() => {
            img.onload = finish;
            img.onerror = () => {
              completed += 1;
              requestFlush();
              resolve();
            };
          });
      });

    const run = async () => {
      // Tier 1 — critical subset, in order, then open the experience.
      const critical = Math.min(CRITICAL_FRAMES, frameCount);
      for (let i = 0; i < critical; i += 1) {
        if (cancelled) return;
        await loadFrame(i);
      }
      if (!cancelled) {
        setReady(true);
        setDrawTick((t) => t + 1); // first real paint
      }

      // Tier 2 — stream the rest with bounded concurrency.
      let cursor = critical;
      const worker = async () => {
        while (!cancelled && cursor < frameCount) {
          const index = cursor;
          cursor += 1;
          await loadFrame(index);
        }
      };
      await Promise.all(Array.from({ length: concurrency }, () => worker()));
      if (!cancelled) setDrawTick((t) => t + 1); // final settle
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [frameCount, getFrameUrl, concurrency]);

  return {
    store: { images: imagesRef.current, contiguousRef },
    progress,
    ready,
    drawTick,
  };
}
