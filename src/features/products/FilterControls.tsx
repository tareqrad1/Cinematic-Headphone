"use client";

import { CATEGORIES, PRICE_BOUNDS, formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";
import type { Product } from "@/types";

export interface FilterState {
  categories: ReadonlyArray<Product["category"]>;
  featuredOnly: boolean;
  maxPrice: number;
}

interface FilterControlsProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  resultCount: number;
}

/**
 * Shared filter body (category multi-select, featured switch, price ceiling).
 * Rendered inside the desktop sidebar and the mobile sheet alike, so filter
 * behaviour is defined exactly once.
 */
export function FilterControls({
  state,
  onChange,
  onReset,
  resultCount,
}: FilterControlsProps) {
  const toggleCategory = (cat: Product["category"]) => {
    const has = state.categories.includes(cat);
    onChange({
      ...state,
      categories: has
        ? state.categories.filter((c) => c !== cat)
        : [...state.categories, cat],
    });
  };

  return (
    <div className="space-y-10">
      {/* category */}
      <fieldset>
        <legend className="label-luxe mb-4">Category</legend>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => {
            const checked = state.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleCategory(cat)}
                className="group flex w-full items-center gap-3 text-left"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-[6px] border transition-all duration-300",
                    checked
                      ? "border-gold bg-gold text-void"
                      : "border-white/15 text-transparent group-hover:border-white/40",
                  )}
                >
                  <CheckIcon className="text-[0.8em]" />
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    checked ? "text-platinum" : "text-mist group-hover:text-platinum",
                  )}
                >
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* featured */}
      <fieldset>
        <legend className="label-luxe mb-4">Collection</legend>
        <button
          type="button"
          role="switch"
          aria-checked={state.featuredOnly}
          onClick={() => onChange({ ...state, featuredOnly: !state.featuredOnly })}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm text-mist">Featured only</span>
          <span
            className={cn(
              "relative h-6 w-11 rounded-full border transition-colors duration-300",
              state.featuredOnly ? "border-gold bg-gold/20" : "border-white/15 bg-white/[0.04]",
            )}
          >
            <span
              className={cn(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-300",
                state.featuredOnly ? "left-[calc(100%-1.25rem)] bg-gold" : "left-1 bg-mist",
              )}
            />
          </span>
        </button>
      </fieldset>

      {/* price */}
      <fieldset>
        <legend className="label-luxe mb-4 flex items-center justify-between">
          <span>Max price</span>
          <span className="text-gold tabular-nums">{formatPrice(state.maxPrice)}</span>
        </legend>
        <input
          type="range"
          className="range-luxe"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={10}
          value={state.maxPrice}
          onChange={(e) => onChange({ ...state, maxPrice: Number(e.target.value) })}
          aria-label="Maximum price"
        />
        <div className="mt-2 flex justify-between text-[11px] text-mist/70 tabular-nums">
          <span>{formatPrice(PRICE_BOUNDS.min)}</span>
          <span>{formatPrice(PRICE_BOUNDS.max)}</span>
        </div>
      </fieldset>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
        <span className="text-xs tracking-wide2 text-mist">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-xs uppercase tracking-wide2 text-mist underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
