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
  phantomOne:  { src: "/products/57712f7c1014b09b3a76437adb471a98.jpg",      width: 750,  height: 1000 },
  phantomPro:  { src: "/products/phantom-pro-1.jpg",                         width: 736,  height: 736  },
  studio:      { src: "/products/studio-1.jpg",                              width: 1024, height: 1024 },
  nomad:       { src: "/products/1824623af0e834febe2bcb11cdf397d1.jpg",      width: 1000, height: 1000 },
  core:        { src: "/products/85312d5f21c27e60e5d1abd74020de21.jpg",      width: 1000, height: 1000 },
  // new cover-style shots — each used by exactly one product
  solGold:     { src: "/products/0526a025de1ac1adf2c2eb8e0c85efe3.jpg",      width: 735,  height: 1000 },
  waveBlue:    { src: "/products/12ac48e8963393fdb198358fbc4d8cbd.jpg",       width: 735,  height: 1000 },
  bwAmber:     { src: "/products/12dc86e1a3af858bf8ba37565f6c1309.jpg",       width: 800,  height: 1000 },
  caramel:     { src: "/products/1824623af0e834febe2bcb11cdf397d1.jpg",       width: 1000, height: 1000 },
  roseSilver:  { src: "/products/2aea28bc9502648890dbdeff4f186758.jpg",       width: 1000, height: 1000 },
  pinkCoral:   { src: "/products/4d643bce9d5c6d77d9c2149967864a11.jpg",       width: 1000, height: 1000 },
  darkFlame:   { src: "/products/57712f7c1014b09b3a76437adb471a98.jpg",       width: 750,  height: 1000 },
  oliveBlack:  { src: "/products/85312d5f21c27e60e5d1abd74020de21.jpg",       width: 1000, height: 1000 },
  airSlate:    { src: "/products/airboods-1.jpg",                             width: 667,  height: 1000 },
  airNight:    { src: "/products/airboods-2.jpg",                             width: 800,  height: 1000 },
  airOcean:    { src: "/products/airboods-3.jpg",                             width: 667,  height: 1000 },
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
    coverImage: true,
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
  // ── new cover-image products ──────────────────────────────────────────────
  {
    id: "sol-edition",
    slug: "sol-edition",
    name: "Sol Edition",
    category: "Limited",
    tagline: "Drenched in gold. Born from the sun.",
    description:
      "A monochromatic statement dipped in solar gold — every surface, every stitch, every yoke anodised to match. The Sol Edition is the most visually daring AURORA ever made, and the most acoustically faithful.",
    price: 1190,
    compareAtPrice: 1390,
    colorName: "Solar Gold",
    accent: "#c8a45c",
    featured: true,
    coverImage: true,
    releaseRank: 110,
    gallery: [
      img(IMG.solGold,    "Aurora Sol Edition in Solar Gold, three-quarter with case"),
      img(IMG.caramel,    "Sol Edition headband detail"),
      img(IMG.roseSilver, "Sol Edition ear cup profile"),
    ],
    specs: [
      { label: "Driver",            value: "40mm Beryllium" },
      { label: "Frequency response",value: "5Hz – 45kHz" },
      { label: "Total weight",      value: "291g" },
      { label: "Battery, ANC on",   value: "38 hours" },
      { label: "Finish",            value: "Anodised solar gold" },
    ],
    highlights: [
      "Full monochrome solar-gold finish",
      "Individually numbered — 500 units",
      "Lambskin leather case included",
      "Adaptive 360° spatial audio",
    ],
  },
  {
    id: "wave-blue",
    slug: "wave-blue",
    name: "Wave — Ocean Blue",
    category: "Over-Ear",
    tagline: "Deep blue. Deeper sound.",
    description:
      "A bold ocean-blue colourway built for those who refuse to blend in. The Wave pairs a mesh headband with memory-foam cups for all-day wearability, tuned to a wide, immersive soundstage.",
    price: 749,
    colorName: "Ocean Blue",
    accent: "#2563a8",
    featured: true,
    coverImage: true,
    releaseRank: 105,
    gallery: [
      img(IMG.waveBlue,  "Aurora Wave in Ocean Blue, floating on pink background"),
      img(IMG.oliveBlack,"Wave ear cup detail"),
      img(IMG.darkFlame, "Wave headband profile"),
    ],
    specs: [
      { label: "Driver",            value: "40mm Dynamic" },
      { label: "Frequency response",value: "8Hz – 40kHz" },
      { label: "Total weight",      value: "275g" },
      { label: "Battery, ANC on",   value: "36 hours" },
      { label: "Bluetooth",         value: "5.4 · LDAC" },
    ],
    highlights: [
      "Mesh breathable headband",
      "Immersive wide soundstage",
      "Multipoint pairing",
      "USB-C fast charge",
    ],
  },
  {
    id: "bw-amber",
    slug: "bw-amber",
    name: "Resonance — Amber",
    category: "Studio",
    tagline: "Amber cups. Obsidian frame. Perfect tension.",
    description:
      "A studio-grade closed-back with an amber anodised cup set against a deep obsidian chassis. The Resonance Amber delivers a flat, uncoloured reference response — for engineers who refuse to compromise on looks or truth.",
    price: 1490,
    compareAtPrice: 1690,
    colorName: "Amber / Obsidian",
    accent: "#b87333",
    featured: true,
    coverImage: true,
    releaseRank: 108,
    gallery: [
      img(IMG.bwAmber,   "Resonance Amber — obsidian frame with amber cups, floating"),
      img(IMG.darkFlame, "Resonance Amber side profile"),
      img(IMG.oliveBlack,"Resonance ear cup detail"),
    ],
    specs: [
      { label: "Driver",            value: "45mm Planar" },
      { label: "Frequency response",value: "8Hz – 48kHz" },
      { label: "Impedance",         value: "32Ω" },
      { label: "Total weight",      value: "320g" },
      { label: "Cable",             value: "Detachable balanced 4.4mm" },
    ],
    highlights: [
      "Planar-magnetic reference drivers",
      "Closed-back studio isolation",
      "Amber anodised cup accent",
      "Balanced cabling included",
    ],
  },
  {
    id: "velour-caramel",
    slug: "velour-caramel",
    name: "Velour — Caramel",
    category: "Wireless",
    tagline: "Soft to the touch. Precise to the ear.",
    description:
      "Wrapped in full-grain caramel leather — headband, case, and ear cups in perfect tonal harmony. The Velour Caramel brings a warm acoustic signature to a warmer aesthetic, arriving in a matching leather carry case.",
    price: 899,
    colorName: "Caramel",
    accent: "#c8894a",
    featured: false,
    coverImage: true,
    releaseRank: 96,
    gallery: [
      img(IMG.caramel,   "Aurora Velour Caramel with matching leather case"),
      img(IMG.solGold,   "Velour Caramel headband detail"),
      img(IMG.roseSilver,"Velour ear cup profile"),
    ],
    specs: [
      { label: "Driver",            value: "40mm Dynamic" },
      { label: "Frequency response",value: "10Hz – 38kHz" },
      { label: "Total weight",      value: "282g" },
      { label: "Battery, ANC on",   value: "42 hours" },
      { label: "Bluetooth",         value: "5.3 · AAC" },
    ],
    highlights: [
      "Full-grain caramel leather wrap",
      "Matching luxury carry case",
      "Warm, musical tuning",
      "42-hour battery life",
    ],
  },
  {
    id: "silver-stage",
    slug: "silver-stage",
    name: "Silver Stage",
    category: "Over-Ear",
    tagline: "Centre stage. Brushed silver.",
    description:
      "The Silver Stage commands attention on the display stand as readily as it commands the mix. Brushed silver aluminium cups sit on a sculpted pedestal form — equally at home in the studio and the spotlight.",
    price: 679,
    colorName: "Brushed Silver",
    accent: "#8ca0b0",
    featured: false,
    coverImage: true,
    releaseRank: 88,
    gallery: [
      img(IMG.roseSilver, "Aurora Silver Stage on rose-gold display pedestal"),
      img(IMG.waveBlue,   "Silver Stage ear cup detail"),
      img(IMG.caramel,    "Silver Stage headband arc"),
    ],
    specs: [
      { label: "Driver",            value: "42mm Dynamic" },
      { label: "Frequency response",value: "12Hz – 38kHz" },
      { label: "Total weight",      value: "288g" },
      { label: "Battery, ANC on",   value: "34 hours" },
      { label: "Bluetooth",         value: "5.3" },
    ],
    highlights: [
      "Brushed aluminium cup faces",
      "Sculpted ergonomic headband",
      "Hybrid ANC + Transparency",
      "USB-C fast charge",
    ],
  },
  {
    id: "coral-rush",
    slug: "coral-rush",
    name: "Rush — Coral Pink",
    category: "Wireless",
    tagline: "Vivid coral. Vanishing weight.",
    description:
      "A statement in coral pink mesh and anodised aluminium. The Rush is AURORA's lightest over-ear, tuned for energy — a punchy, forward signature built for movement and colour.",
    price: 599,
    colorName: "Coral Pink",
    accent: "#e8748a",
    featured: false,
    coverImage: true,
    releaseRank: 82,
    gallery: [
      img(IMG.pinkCoral,  "Aurora Rush in Coral Pink, floating hero shot"),
      img(IMG.waveBlue,   "Rush ear cup detail"),
      img(IMG.roseSilver, "Rush headband profile"),
    ],
    specs: [
      { label: "Driver",            value: "38mm Dynamic" },
      { label: "Frequency response",value: "16Hz – 22kHz" },
      { label: "Total weight",      value: "248g" },
      { label: "Battery, ANC on",   value: "30 hours" },
      { label: "Bluetooth",         value: "5.3" },
    ],
    highlights: [
      "Lightest AURORA at 248g",
      "Coral mesh cushions",
      "Forward energetic tuning",
      "30-hour battery",
    ],
  },
  {
    id: "dark-flame",
    slug: "dark-flame",
    name: "Dark Flame",
    category: "Over-Ear",
    tagline: "Two lights. One voice.",
    description:
      "Shot in dual-tone dramatic lighting — blue cool and amber heat — the Dark Flame is AURORA's most versatile over-ear. A neutral tuning that honours every genre, in an all-matte black chassis that absorbs the room.",
    price: 549,
    colorName: "Matte Black",
    accent: "#e05c2a",
    featured: false,
    coverImage: true,
    releaseRank: 76,
    gallery: [
      img(IMG.darkFlame,  "Aurora Dark Flame in matte black with dual-tone dramatic lighting"),
      img(IMG.oliveBlack, "Dark Flame ear cup detail"),
      img(IMG.bwAmber,    "Dark Flame headband profile"),
    ],
    specs: [
      { label: "Driver",            value: "40mm Dynamic" },
      { label: "Frequency response",value: "12Hz – 36kHz" },
      { label: "Total weight",      value: "295g" },
      { label: "Battery, ANC on",   value: "38 hours" },
      { label: "Bluetooth",         value: "5.2" },
    ],
    highlights: [
      "All-matte black chassis",
      "Neutral reference-adjacent tuning",
      "Hybrid ANC",
      "38-hour battery life",
    ],
  },
  {
    id: "olive-max",
    slug: "olive-max",
    name: "Max — Olive",
    category: "Wireless",
    tagline: "Understated. Unmatched.",
    description:
      "Matte black mesh on an olive-green stage — the Max Olive is AURORA's quietest statement. A flat, wide soundstage tuned for long listening, with a headband so light you forget it's there.",
    price: 479,
    colorName: "Olive",
    accent: "#6b7a4a",
    featured: false,
    coverImage: true,
    releaseRank: 72,
    gallery: [
      img(IMG.oliveBlack, "Aurora Max in matte black on olive-green background"),
      img(IMG.darkFlame,  "Max Olive ear cup detail"),
      img(IMG.pinkCoral,  "Max Olive headband arc"),
    ],
    specs: [
      { label: "Driver",            value: "40mm Dynamic" },
      { label: "Frequency response",value: "16Hz – 22kHz" },
      { label: "Total weight",      value: "265g" },
      { label: "Battery, ANC on",   value: "38 hours" },
      { label: "Bluetooth",         value: "5.3" },
    ],
    highlights: [
      "Mesh breathable headband",
      "Wide, spacious soundstage",
      "Foldable travel profile",
      "38-hour battery",
    ],
  },
  // ── In-Ear series ─────────────────────────────────────────────────────────
  {
    id: "air-slate",
    slug: "air-slate",
    name: "Air — Slate",
    category: "In-Ear",
    tagline: "Wireless freedom. Studio precision.",
    description:
      "AURORA's first true-wireless in-ear. A machined slate-grey case opens to reveal two drivers tuned to the same beryllium-inspired philosophy — vanishing weight, resolving detail, adaptive seal.",
    price: 349,
    colorName: "Slate Grey",
    accent: "#4a5568",
    featured: true,
    coverImage: true,
    releaseRank: 115,
    gallery: [
      img(IMG.airSlate,  "Aurora Air Slate — open case with earbuds, teal ambient glow"),
      img(IMG.airNight,  "Air Slate earbud detail"),
      img(IMG.airOcean,  "Air Slate case closed"),
    ],
    specs: [
      { label: "Driver",          value: "10mm Dynamic" },
      { label: "ANC",             value: "Adaptive hybrid" },
      { label: "Battery, buds",   value: "8 hours" },
      { label: "Battery, case",   value: "32 hours total" },
      { label: "Bluetooth",       value: "5.3 · AAC · SBC" },
    ],
    highlights: [
      "Adaptive hybrid ANC",
      "Machined aluminium case",
      "IPX4 water resistance",
      "Wireless charging case",
    ],
  },
  {
    id: "air-night",
    slug: "air-night",
    name: "Air — Night",
    category: "In-Ear",
    tagline: "Pure white. Pure black. Pure sound.",
    description:
      "The Air Night in a high-contrast white-on-black colourway — the starkest, most minimal object AURORA makes. Every edge deliberate. Every gram justified.",
    price: 329,
    colorName: "Night White",
    accent: "#c8c8c8",
    featured: false,
    coverImage: true,
    releaseRank: 113,
    gallery: [
      img(IMG.airNight,  "Aurora Air Night — white earbuds in black case, pure contrast"),
      img(IMG.airSlate,  "Air Night earbud detail"),
      img(IMG.airOcean,  "Air Night case open angle"),
    ],
    specs: [
      { label: "Driver",          value: "10mm Dynamic" },
      { label: "ANC",             value: "Adaptive hybrid" },
      { label: "Battery, buds",   value: "7 hours" },
      { label: "Battery, case",   value: "28 hours total" },
      { label: "Bluetooth",       value: "5.3 · AAC" },
    ],
    highlights: [
      "High-contrast night colourway",
      "Adaptive hybrid ANC",
      "IPX4 water resistance",
      "Wireless charging case",
    ],
  },
  {
    id: "air-ocean",
    slug: "air-ocean",
    name: "Air — Ocean",
    category: "In-Ear",
    tagline: "Deep teal. Deeper silence.",
    description:
      "The Air Ocean in a deep teal finish — inspired by the stillness beneath the surface. The most immersive in-ear AURORA makes, tuned for a wide, enveloping low end and crisp, extended highs.",
    price: 369,
    colorName: "Deep Teal",
    accent: "#1a6b7a",
    featured: false,
    coverImage: true,
    releaseRank: 111,
    gallery: [
      img(IMG.airOcean,  "Aurora Air Ocean — deep teal earbuds in case, moody blue light"),
      img(IMG.airSlate,  "Air Ocean earbud detail"),
      img(IMG.airNight,  "Air Ocean case closed"),
    ],
    specs: [
      { label: "Driver",          value: "10mm Dynamic" },
      { label: "ANC",             value: "Adaptive hybrid" },
      { label: "Battery, buds",   value: "9 hours" },
      { label: "Battery, case",   value: "36 hours total" },
      { label: "Bluetooth",       value: "5.3 · LDAC" },
    ],
    highlights: [
      "Deep teal signature finish",
      "LDAC high-res wireless",
      "9-hour bud battery",
      "Wireless charging case",
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
  "In-Ear",
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
