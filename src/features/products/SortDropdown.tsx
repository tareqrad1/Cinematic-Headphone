"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SORT_OPTIONS } from "@/lib/products";
import { ChevronDown, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/utils";
import type { SortKey } from "@/types";

interface SortDropdownProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

/** Custom luxury sort menu — no native select. GSAP-eased open, click-outside close. */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0]!;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    gsap.killTweensOf(menu);
    if (open) {
      gsap.set(menu, { display: "block" });
      if (prefersReducedMotion()) {
        gsap.set(menu, { autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(
          menu,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" },
        );
      }
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        y: -8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-wide2 text-platinum transition-colors duration-300 hover:border-gold hover:text-gold"
      >
        <span className="text-mist">Sort</span>
        <span>{current.label}</span>
        <ChevronDown
          className={cn("text-sm transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        ref={menuRef}
        role="listbox"
        className="absolute right-0 z-30 mt-2 hidden w-60 overflow-hidden rounded-xl border border-white/10 bg-graphite/95 p-1.5 opacity-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {SORT_OPTIONS.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors duration-200",
                active ? "bg-white/[0.06] text-gold" : "text-mist hover:bg-white/[0.04] hover:text-platinum",
              )}
            >
              {opt.label}
              {active && <CheckIcon className="text-base" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
