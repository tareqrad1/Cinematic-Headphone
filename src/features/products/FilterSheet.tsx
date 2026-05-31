"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { CloseIcon } from "@/components/ui/icons";
import { FilterControls, type FilterState } from "./FilterControls";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  resultCount: number;
}

/** Mobile bottom-sheet wrapper around the shared FilterControls. */
export function FilterSheet({
  open,
  onClose,
  state,
  onChange,
  onReset,
  resultCount,
}: FilterSheetProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrim = scrimRef.current;
    const sheet = sheetRef.current;
    if (!scrim || !sheet) return;
    const reduce = prefersReducedMotion();
    gsap.killTweensOf([scrim, sheet]);

    if (open) {
      gsap.set(scrim, { display: "block", pointerEvents: "auto" });
      gsap.to(scrim, { opacity: 1, duration: reduce ? 0 : 0.35 });
      gsap.to(sheet, { yPercent: 0, duration: reduce ? 0 : 0.55, ease: "expo.out" });
    } else {
      gsap.to(sheet, { yPercent: 100, duration: reduce ? 0 : 0.4, ease: "power3.in" });
      gsap.set(scrim, { pointerEvents: "none" });
      gsap.to(scrim, {
        opacity: 0,
        duration: reduce ? 0 : 0.35,
        onComplete: () => gsap.set(scrim, { display: "none" }),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className="lg:hidden">
      <div
        ref={scrimRef}
        onClick={onClose}
        className="fixed inset-0 z-[95] hidden bg-void/70 opacity-0 backdrop-blur-sm [pointer-events:none]"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-label="Filters"
        className="fixed inset-x-0 bottom-0 z-[100] max-h-[85dvh] translate-y-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-graphite/95 px-6 pb-10 pt-5 backdrop-blur-2xl"
      >
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/15" />
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-platinum">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-mist hover:border-gold hover:text-gold"
          >
            <CloseIcon className="text-lg" />
          </button>
        </div>
        <FilterControls
          state={state}
          onChange={onChange}
          onReset={onReset}
          resultCount={resultCount}
        />
        <button type="button" onClick={onClose} className="btn-gold mt-8 w-full">
          Show {resultCount} {resultCount === 1 ? "result" : "results"}
        </button>
      </div>
    </div>
  );
}
