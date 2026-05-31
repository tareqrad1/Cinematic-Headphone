export interface SequenceConfig {
  /** total number of frames in the sequence */
  readonly frameCount: number;
  /** resolves a frame index (0-based) to its public URL */
  readonly getFrameUrl: (index: number) => string;
  /** native frame width in pixels */
  readonly width: number;
  /** native frame height in pixels */
  readonly height: number;
}

export interface StorySection {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly stat?: { readonly value: string; readonly label: string };
}

export type LoadState = "idle" | "loading" | "ready";

/** Target transform for the persistent product at one story chapter. */
export interface ProductTransform {
  /** horizontal offset from centre, in viewport-width units (vw) */
  readonly xVW: number;
  /** vertical offset from centre, in viewport-height units (vh) */
  readonly yVH: number;
  readonly scale: number;
  /** z-rotation in degrees (kept subtle) */
  readonly rotate: number;
}

export interface StoryChapter {
  readonly id: string;
  readonly index: string; // "01" | "02" | "03"
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  /** which side the copy sits on, so it never overlaps the product */
  readonly align: "left" | "right";
  /** where the shared product travels to for this chapter */
  readonly product: ProductTransform;
}

/* ──────────────────────────── ECOMMERCE ──────────────────────────── */

export type ProductCategory =
  | "Over-Ear"
  | "Studio"
  | "Wireless"
  | "Limited"
  | "In-Ear";

/** A single resolved image with its intrinsic dimensions for next/image. */
export interface ProductImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface ProductSpec {
  readonly label: string;
  readonly value: string;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: ProductCategory;
  /** one-line luxury hook shown on cards */
  readonly tagline: string;
  /** richer paragraph shown on the detail page */
  readonly description: string;
  /** price in whole USD (no cents — these are luxury round numbers) */
  readonly price: number;
  /** optional struck-through original price for a subtle "value" cue */
  readonly compareAtPrice?: number;
  readonly colorName: string;
  /** hex used for the swatch + ambient glow tint behind the product */
  readonly accent: string;
  readonly featured: boolean;
  /** when true the card image uses object-cover (full-bleed) instead of object-contain */
  readonly coverImage?: boolean;
  /** newest-first ordering key (higher = newer) */
  readonly releaseRank: number;
  readonly gallery: ReadonlyArray<ProductImage>;
  readonly specs: ReadonlyArray<ProductSpec>;
  readonly highlights: ReadonlyArray<string>;
}

export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
}

export type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc";

export type ViewMode = "grid" | "list";
