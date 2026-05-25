"use client";

import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number; // 1-based
  pageCount: number;
  onChange: (page: number) => void;
}

/**
 * Premium pagination. A scaling gold pill marks the active page; prev/next
 * arrows disable at the bounds. Page changes are driven upward — the grid above
 * animates its own crossfade on page change.
 */
export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-mist transition-all duration-300 enabled:hover:border-gold enabled:hover:text-gold disabled:opacity-25";

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        className={arrow}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ArrowLeft className="text-base" />
      </button>

      <div className="mx-2 flex items-center gap-1.5">
        {pages.map((p) => {
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onChange(p)}
              className={cn(
                "relative flex h-11 min-w-[44px] items-center justify-center rounded-full text-sm tabular-nums transition-all duration-400 ease-cinematic",
                active
                  ? "scale-100 bg-gold font-medium text-void"
                  : "scale-90 text-mist hover:scale-100 hover:text-platinum",
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next page"
        className={arrow}
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ArrowRight className="text-base" />
      </button>
    </nav>
  );
}
