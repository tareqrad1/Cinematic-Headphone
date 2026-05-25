import type { Product, ProductImage, SortKey } from "@/types";

/**
 * THE AURORA COLLECTION — curated catalog.
 *
 * Phantom One (the red flagship from the cinematic hero) anchors the range;
 * every other model is a sibling in the same design language. Data is static
 * and typed end-to-end so the storefront renders without a backend while
 * staying trivially swappable for a real commerce API later.
 *
 * Images live in /public/products. Intrinsic dimensions are baked in so
 * next/image reserves layout space with zero CLS.
 */

/* Raw image assets with their measured intrinsic sizes. */
const IMG = {
  phantomOne: { src: "/products/phantom-one-1.webp", width: 439, height: 611 },
  phantomPro: { src: "/products/phantom-pro-1.jpg", width: 736, height: 736 },
  studio: { src: "/products/studio-1.jpg", width: 1024, height: 1024 },
  nomad: { src: "/products/nomad-1.jpg", width: 679, height: 818 },
  core: { src: "/products/core-1.webp", width: 600, height: 600 },
} as const;

const img = (
  base: { src: string; width: number; height: number },
  alt: string,
): ProductImage => ({ ...base, alt });

export const PRODUCTS: ReadonlyArray<Product> = [
  {
    id: "phantom-one",
    slug: "phantom-one",
    name: "Phantom One",
    category: "Limited",
    tagline: "The flagship. Sound, sculpted in silence.",
    description:
      "Our defining statement. A monolith of machined aluminium and acoustic intent, the Phantom One pairs a 40mm beryllium driver with adaptive spatial processing to resolve detail the moment it exists. Individually numbered, delivered in a hand-finished case.",
    price: 899,
    colorName: "Crimson Noir",
    accent: "#b23a48",
    featured: true,
    releaseRank: 100,
    gallery: [
      img(IMG.phantomOne, "Aurora Phantom One in Crimson Noir, three-quarter view"),
      img(IMG.studio, "Phantom One ear cups, detail"),
      img(IMG.phantomPro, "Phantom One headband and yoke"),
    ],
    specs: [
      { label: "Driver", value: "40mm Beryllium" },
      { label: "Frequency response", value: "5Hz – 45kHz" },
      { label: "Total weight", value: "284g" },
      { label: "Battery, ANC on", value: "40 hours" },
      { label: "THD", value: "0.0003%" },
    ],
    highlights: [
      "Adaptive 360° spatial audio",
      "Aerospace aluminium chassis",
      "Lambskin-wrapped memory foam",
      "Hand-assembled, individually numbered",
    ],
  },
  {
    id: "phantom-pro",
    slug: "phantom-pro",
    name: "Phantom Pro",
    category: "Over-Ear",
    tagline: "Reference silence for the everyday.",
    description:
      "The Phantom language, distilled for daily wear. A matte aluminium frame and full-grain leather headband disappear the moment they touch your head, while hybrid ANC carves a pocket of stillness around you.",
    price: 1290,
    compareAtPrice: 1490,
    colorName: "Obsidian",
    accent: "#3c6e8c",
    featured: true,
    releaseRank: 92,
    gallery: [
      img(IMG.phantomPro, "Aurora Phantom Pro in Obsidian, three-quarter view"),
      img(IMG.studio, "Phantom Pro ear cups, detail"),
      img(IMG.phantomOne, "Phantom Pro silhouette"),
    ],
    specs: [
      { label: "Driver", value: "40mm Dynamic" },
      { label: "Frequency response", value: "6Hz – 40kHz" },
      { label: "Total weight", value: "298g" },
      { label: "Battery, ANC on", value: "38 hours" },
      { label: "Bluetooth", value: "5.4 · LDAC" },
    ],
    highlights: [
      "Hybrid active noise cancellation",
      "Full-grain leather headband",
      "Multipoint pairing",
      "USB-C fast charge — 5 min / 5 hrs",
    ],
  },
  {
    id: "studio-reference",
    slug: "studio-reference",
    name: "Studio Reference",
    category: "Studio",
    tagline: "What the mix actually sounds like.",
    description:
      "Built for the room where records are made. A flat, uncoloured response and a closed-back acoustic seal let you hear the recording — not the headphone. The choice of mastering engineers who trust nothing but the truth.",
    price: 749,
    colorName: "Graphite",
    accent: "#6b7280",
    featured: false,
    releaseRank: 80,
    gallery: [
      img(IMG.studio, "Aurora Studio Reference in Graphite, studio view"),
      img(IMG.phantomPro, "Studio Reference ear cup detail"),
      img(IMG.core, "Studio Reference folded"),
    ],
    specs: [
      { label: "Driver", value: "45mm Dynamic" },
      { label: "Frequency response", value: "10Hz – 40kHz" },
      { label: "Impedance", value: "32Ω" },
      { label: "Total weight", value: "315g" },
      { label: "Cable", value: "Detachable 3m / 1.2m" },
    ],
    highlights: [
      "Flat reference tuning",
      "Closed-back isolation",
      "Replaceable velour pads",
      "Studio-grade detachable cabling",
    ],
  },
  {
    id: "nomad",
    slug: "nomad",
    name: "Nomad",
    category: "Wireless",
    tagline: "Warm tone. Woven for the road.",
    description:
      "A softer, warmer signature wrapped in breathable woven fabric and a bronze anodised frame. Tuned for long journeys — generous low end, a featherweight clamp, and battery that outlasts the longest haul.",
    price: 549,
    colorName: "Bronze",
    accent: "#9a6b4f",
    featured: false,
    releaseRank: 70,
    gallery: [
      img(IMG.nomad, "Aurora Nomad in Bronze, three-quarter view"),
      img(IMG.core, "Nomad folded for travel"),
      img(IMG.studio, "Nomad ear cup detail"),
    ],
    specs: [
      { label: "Driver", value: "40mm Dynamic" },
      { label: "Frequency response", value: "16Hz – 22kHz" },
      { label: "Total weight", value: "268g" },
      { label: "Battery, ANC on", value: "55 hours" },
      { label: "Bluetooth", value: "5.3" },
    ],
    highlights: [
      "Woven breathable headband",
      "55-hour battery life",
      "Foldable travel profile",
      "Warm tuned signature",
    ],
  },
  {
    id: "core",
    slug: "core",
    name: "Core",
    category: "Wireless",
    tagline: "The essentials, done beautifully.",
    description:
      "Everything that matters, nothing that doesn't. The Core brings AURORA's acoustic philosophy to a lighter, simpler form — clean sound, dependable noise reduction, and a price that opens the door.",
    price: 349,
    colorName: "Black",
    accent: "#4b5563",
    featured: false,
    releaseRank: 60,
    gallery: [
      img(IMG.core, "Aurora Core in Black, three-quarter view"),
      img(IMG.phantomPro, "Core ear cup detail"),
      img(IMG.studio, "Core profile"),
    ],
    specs: [
      { label: "Driver", value: "38mm Dynamic" },
      { label: "Frequency response", value: "20Hz – 20kHz" },
      { label: "Total weight", value: "245g" },
      { label: "Battery, ANC on", value: "32 hours" },
      { label: "Bluetooth", value: "5.2" },
    ],
    highlights: [
      "Lightweight 245g build",
      "Active noise reduction",
      "32-hour battery life",
      "Fast USB-C charging",
    ],
  },
  {
    id: "phantom-one-midnight",
    slug: "phantom-one-midnight",
    name: "Phantom One — Midnight",
    category: "Limited",
    tagline: "The flagship, in deepest black.",
    description:
      "The Phantom One in a stealth Midnight finish — the same beryllium-driven reference performance, cloaked in matte black aluminium and obsidian leather. A limited run for those who prefer their statements quiet.",
    price: 949,
    colorName: "Midnight",
    accent: "#2a2d34",
    featured: true,
    releaseRank: 98,
    gallery: [
      img(IMG.studio, "Phantom One Midnight, studio view"),
      img(IMG.phantomPro, "Phantom One Midnight ear cups"),
      img(IMG.phantomOne, "Phantom One Midnight silhouette"),
    ],
    specs: [
      { label: "Driver", value: "40mm Beryllium" },
      { label: "Frequency response", value: "5Hz – 45kHz" },
      { label: "Total weight", value: "284g" },
      { label: "Battery, ANC on", value: "40 hours" },
      { label: "THD", value: "0.0003%" },
    ],
    highlights: [
      "Stealth matte-black finish",
      "Adaptive 360° spatial audio",
      "Obsidian leather headband",
      "Hand-assembled, individually numbered",
    ],
  },
  {
    id: "studio-monitor-x",
    slug: "studio-monitor-x",
    name: "Studio Monitor X",
    category: "Studio",
    tagline: "Open-back. Endlessly transparent.",
    description:
      "An open-back reference monitor for critical listening. A wide, airy soundstage and vanishing distortion make the Monitor X the last word in detail — for the room where nothing can hide.",
    price: 1190,
    colorName: "Slate",
    accent: "#5a6472",
    featured: false,
    releaseRank: 85,
    gallery: [
      img(IMG.phantomPro, "Aurora Studio Monitor X, three-quarter view"),
      img(IMG.studio, "Studio Monitor X ear cup"),
      img(IMG.core, "Studio Monitor X profile"),
    ],
    specs: [
      { label: "Driver", value: "50mm Planar" },
      { label: "Frequency response", value: "8Hz – 50kHz" },
      { label: "Impedance", value: "60Ω" },
      { label: "Total weight", value: "340g" },
      { label: "Cable", value: "Detachable balanced" },
    ],
    highlights: [
      "Planar-magnetic drivers",
      "Open-back soundstage",
      "Balanced cabling included",
      "Reference-flat tuning",
    ],
  },
  {
    id: "nomad-sand",
    slug: "nomad-sand",
    name: "Nomad — Sand",
    category: "Wireless",
    tagline: "Desert tone. Travel-ready.",
    description:
      "The Nomad's warm, road-tuned signature in a soft Sand colourway. Woven fabric, a bronze frame, and 55 hours of battery — styled for the places you'd rather be.",
    price: 569,
    colorName: "Sand",
    accent: "#b89878",
    featured: false,
    releaseRank: 68,
    gallery: [
      img(IMG.nomad, "Aurora Nomad in Sand, three-quarter view"),
      img(IMG.studio, "Nomad Sand ear cup"),
      img(IMG.core, "Nomad Sand folded"),
    ],
    specs: [
      { label: "Driver", value: "40mm Dynamic" },
      { label: "Frequency response", value: "16Hz – 22kHz" },
      { label: "Total weight", value: "268g" },
      { label: "Battery, ANC on", value: "55 hours" },
      { label: "Bluetooth", value: "5.3" },
    ],
    highlights: [
      "Woven breathable headband",
      "55-hour battery life",
      "Foldable travel profile",
      "Warm tuned signature",
    ],
  },
  {
    id: "core-platinum",
    slug: "core-platinum",
    name: "Core — Platinum",
    category: "Wireless",
    tagline: "Essentials, elevated in silver.",
    description:
      "The Core in a brushed Platinum finish. The same lightweight, dependable everyday performance with a touch more shine — the easiest way into the AURORA sound.",
    price: 369,
    colorName: "Platinum",
    accent: "#9aa0ab",
    featured: false,
    releaseRank: 58,
    gallery: [
      img(IMG.core, "Aurora Core in Platinum, three-quarter view"),
      img(IMG.studio, "Core Platinum ear cup"),
      img(IMG.phantomPro, "Core Platinum profile"),
    ],
    specs: [
      { label: "Driver", value: "38mm Dynamic" },
      { label: "Frequency response", value: "20Hz – 20kHz" },
      { label: "Total weight", value: "245g" },
      { label: "Battery, ANC on", value: "32 hours" },
      { label: "Bluetooth", value: "5.2" },
    ],
    highlights: [
      "Brushed platinum finish",
      "Active noise reduction",
      "32-hour battery life",
      "Fast USB-C charging",
    ],
  },
] as const;

/** O(1) slug → product map for the detail route. */
const BY_SLUG: ReadonlyMap<string, Product> = new Map(
  PRODUCTS.map((p) => [p.slug, p]),
);

export const getProductBySlug = (slug: string): Product | undefined =>
  BY_SLUG.get(slug);

export const ALL_SLUGS: ReadonlyArray<string> = PRODUCTS.map((p) => p.slug);

export const CATEGORIES: ReadonlyArray<Product["category"]> = [
  "Limited",
  "Over-Ear",
  "Studio",
  "Wireless",
];

export const PRICE_BOUNDS = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price)),
} as const;

export const SORT_OPTIONS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price · Low to High" },
  { key: "price-desc", label: "Price · High to Low" },
];

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) =>
    Number(b.featured) - Number(a.featured) || b.releaseRank - a.releaseRank,
  newest: (a, b) => b.releaseRank - a.releaseRank,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

export interface CatalogQuery {
  readonly categories: ReadonlyArray<Product["category"]>;
  readonly featuredOnly: boolean;
  readonly maxPrice: number;
  readonly sort: SortKey;
}

/**
 * Pure, side-effect-free catalog filter + sort. Returns a new array; callers
 * memoize on the query so this only runs when inputs change.
 */
export function queryProducts(query: CatalogQuery): Product[] {
  const { categories, featuredOnly, maxPrice, sort } = query;
  const hasCat = categories.length > 0;

  const filtered = PRODUCTS.filter((p) => {
    if (featuredOnly && !p.featured) return false;
    if (hasCat && !categories.includes(p.category)) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  return filtered.sort(SORTERS[sort]);
}

export const formatPrice = (usd: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
