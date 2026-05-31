"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PRICE_BOUNDS, queryProducts } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { FilterIcon } from "@/components/ui/icons";
import type { SortKey, ViewMode } from "@/types";
import { ProductCard } from "./ProductCard";
import { SortDropdown } from "./SortDropdown";
import { ViewToggle } from "./ViewToggle";
import { FilterControls, type FilterState } from "./FilterControls";
import { FilterSheet } from "./FilterSheet";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 6;

const INITIAL_FILTERS: FilterState = {
  categories: [],
  featuredOnly: false,
  maxPrice: PRICE_BOUNDS.max,
};

/**
 * Orchestrates the storefront: filter + sort + paginate (all pure, memoized),
 * view toggle, and a GSAP crossfade whenever the visible page of products
 * changes. State lives here; presentational pieces are dumb and reusable.
 */
export function ProductCatalog() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Pure filter + sort. Recomputes only when inputs change.
  const results = useMemo(
    () =>
      queryProducts({
        categories: filters.categories,
        featuredOnly: filters.featuredOnly,
        maxPrice: filters.maxPrice,
        sort,
      }),
    [filters, sort],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));

  // Keep page in range when the result set shrinks (e.g. after filtering).
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  // Reset to page 1 whenever the filter/sort criteria change.
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  // Crossfade the grid on any visible-content change (page / view / results).
  // A key on the inner wrapper remounts it; GSAP eases the new content in.
  const animKey = `${view}-${page}-${results.length}-${sort}`;
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const cards = grid.querySelectorAll("[data-grid-card]");
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    }, grid);
    return () => ctx.revert();
  }, [animKey]);

  const handlePageChange = (next: number) => {
    setPage(next);
    // ease the eye back toward the grid top on page change
    gridRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.featuredOnly ? 1 : 0) +
    (filters.maxPrice < PRICE_BOUNDS.max ? 1 : 0);

  return (
    <section className="container-luxe pb-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <h2 className="mb-8 font-display text-3xl text-platinum">Refine</h2>
            <FilterControls
              state={filters}
              onChange={setFilters}
              onReset={() => setFilters(INITIAL_FILTERS)}
              resultCount={results.length}
            />
          </div>
        </aside>

        {/* main column */}
        <div>
          {/* toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2.5 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-wide2 text-platinum transition-colors duration-300 hover:border-gold hover:text-gold lg:hidden"
              >
                <FilterIcon className="text-base" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-void">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="hidden text-xs tracking-wide2 text-mist sm:block">
                {results.length} {results.length === 1 ? "model" : "models"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <SortDropdown value={sort} onChange={setSort} />
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>

          {/* grid / list */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <p className="font-display text-3xl text-platinum">Nothing matches</p>
              <p className="max-w-sm text-sm text-mist">
                Try widening your price range or clearing a filter to see more of
                the collection.
              </p>
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="btn-luxe mt-2 !px-7 !py-3 !text-xs"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              key={animKey}
              ref={gridRef}
              className={cn(
                "scroll-mt-28",
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-6",
              )}
            >
              {pageItems.map((product, i) => (
                <div key={product.id} data-grid-card className="will-change-[transform,opacity]">
                  <ProductCard product={product} view={view} priority={i < 3} />
                </div>
              ))}
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} onChange={handlePageChange} />
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        state={filters}
        onChange={setFilters}
        onReset={() => setFilters(INITIAL_FILTERS)}
        resultCount={results.length}
      />
    </section>
  );
}
