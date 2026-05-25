"use client";

import { GridIcon, ListIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/** Segmented grid/list switch with a sliding gold indicator. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="relative flex items-center rounded-full border border-white/10 p-1">
      {/* sliding indicator */}
      <span
        className="absolute top-1 h-8 w-8 rounded-full bg-white/[0.07] transition-transform duration-400 ease-cinematic"
        style={{ transform: value === "grid" ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden
      />
      {(["grid", "list"] as const).map((mode) => {
        const Icon = mode === "grid" ? GridIcon : ListIcon;
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-label={`${mode} view`}
            aria-pressed={active}
            onClick={() => onChange(mode)}
            className={cn(
              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300",
              active ? "text-gold" : "text-mist hover:text-platinum",
            )}
          >
            <Icon className="text-base" />
          </button>
        );
      })}
    </div>
  );
}
