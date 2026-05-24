# AURORA — Phantom One

A cinematic, award-style interactive product site for luxury over-ear headphones.
Built as a premium product commercial transformed into a scroll experience.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **TailwindCSS** — custom graphite/metallic luxury design tokens
- **GSAP + ScrollTrigger** — entrance timelines, scrub, pinning, staggered reveals
- **Lenis** — smooth scroll, driven from GSAP's ticker so ScrollTrigger stays in sync
- **Three.js** via `@react-three/fiber` — a single subtle ambient particle field

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Experience flow

1. **Hero** — fullscreen looping product video, GSAP cinematic entrance
   (masked word reveal, parallax on pointer + scroll), animated scroll indicator.
2. **Frame sequence** — pinned `<canvas>` scrubbed through 182 WebP frames by
   ScrollTrigger. Story beats fade in/out over their scroll windows.
3. **Story sections** — Premium Sound · Engineering · Materials, alternating
   layout with parallax numerals, blur-lift text reveals, shimmering panels.
4. **Immersive** — scroll-scrubbed equalizer wall (GPU transforms only).
5. **CTA + footer** — cinematic glow, reserve call to action.

## Frame pipeline

Source: 182 PNGs @ 1280×720 (~97 MB). Converted to WebP q82 via
[`scripts/convert-frames.mjs`](scripts/convert-frames.mjs) → `public/sequence/`
(~7 MB, 92.7% smaller). To regenerate from new PNGs in `public/frames/`:

```bash
npm install --no-save sharp
node scripts/convert-frames.mjs
# then update FRAME_COUNT in src/lib/config.ts
```

### Preloading & streaming
`useFrameSequence` opens the experience after just **4 critical frames** decode
in order, then streams the rest with bounded concurrency (6 workers) using
`img.decode()` — each image decoded exactly once and cached in memory, never
recreated. React state is rAF-throttled (not per-frame) to avoid re-render
thrash; a `contiguousRef` pointer tracks how far decoding has reached for O(1)
"is this frame ready" checks with no scanning.

### Ultra-performance hot path (`FrameSequence`)
Per scroll tick the draw loop does **zero** redundant work:
- **O(1) frame lookup** — direct array index; never scans the sequence.
- **Dirty check** — if the rounded frame index is unchanged, the tick returns
  immediately (no canvas write).
- **No allocations** in the loop; cover-fit geometry is cached and recomputed
  only on a real resize.
- **No `clearRect`** — opaque 2D context (`alpha:false`) + cover-fit means each
  `drawImage` fully overwrites the surface.
- GSAP writes the fractional index into a plain object; the paint is coalesced
  into a single `requestAnimationFrame`. `ScrollTrigger.refresh()` is **never**
  called on decode (pin geometry is independent of image loading).

## Architecture

```
src/
  app/            layout, page, globals (App Router shell)
  components/     Experience (composition root), ui/, three/
  sections/       Hero, FrameSequence, StorySections, Immersive, CallToAction
  hooks/          useSmoothScroll, useFrameSequence, useIsomorphicLayoutEffect
  animations/     reusable GSAP reveal helpers
  lib/            gsap registration, config (copy + sequence + beats), utils
  types/          shared TypeScript contracts
public/
  sequence/       182 optimized WebP frames
  video/          hero.mp4
```

## Performance & accessibility notes

- Three.js scene is `dynamic({ ssr: false })`, code-split, DPR-capped at 1.5,
  pauses its render loop when the tab is hidden, and is skipped entirely under
  `prefers-reduced-motion`.
- All scroll animation uses GPU-friendly props only (transform/opacity) or
  direct canvas draws — no layout-affecting properties, no forced reflow.
- Smooth scroll + heavy entrance motion are disabled under
  `prefers-reduced-motion`.
- Canvas draws are rAF-coalesced, dirty-checked, and DPR-capped at 2.
