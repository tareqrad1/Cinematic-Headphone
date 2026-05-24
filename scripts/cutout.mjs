import sharp from "sharp";
import path from "node:path";

// Source: red headphone on a pure-white studio background with a soft shadow.
const SRC = path.resolve("public/headphone.jpg");
const OUT = path.resolve("public/headphone.webp");

const img = sharp(SRC).ensureAlpha();
const { width, height } = await img.metadata();
const { data } = await img.raw().toBuffer({ resolveWithObject: true });

// White-background keying.
//
// A pixel belongs to the background when it is BOTH bright AND low-saturation
// (white, or the light-gray cast shadow). The red product is highly saturated,
// so it stays fully opaque even in its brightest highlights — and the grey
// floor shadow is removed without any positional hacks.
//
//   alpha rises with "how far from white" =
//     blend of (255 − luminance) and chroma/saturation.
const out = Buffer.alloc(data.length);

const lumLow = 232; // above this brightness → leaning background
const lumHigh = 250; // near-white → fully background
const satFloor = 18; // chroma above this keeps a pixel (saturated product)

for (let p = 0; p < width * height; p += 1) {
  const i = p * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min; // cheap saturation proxy
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  let a;
  if (chroma >= satFloor) {
    // Saturated → product. Keep fully opaque.
    a = 255;
  } else if (lum >= lumHigh) {
    a = 0; // near-white background
  } else if (lum <= lumLow) {
    a = 255; // dark/neutral product detail (e.g. black mesh, logo)
  } else {
    // Feather across the white→product brightness ramp (smoothstep).
    const t = 1 - (lum - lumLow) / (lumHigh - lumLow);
    a = Math.round(t * t * (3 - 2 * t) * 255);
  }

  // EDGE DECONTAMINATION — kill the white halo.
  // Boundary pixels are a blend of red product + white bg, so they read as a
  // light fringe on a dark UI. Where a pixel is only partially opaque (an edge)
  // and still bright/low-saturation, pull its RGB toward the product's deep red
  // so no white ring survives even after compositing.
  if (a > 0 && a < 255 && chroma < satFloor && lum > 150) {
    out[i] = Math.min(r, 120); // tame the bright bleed
    out[i + 1] = Math.min(g, 40);
    out[i + 2] = Math.min(b, 45);
  } else {
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
  }
  out[i + 3] = a;
}

// Erode the alpha by ~1px to drop the contaminated boundary rim, with a soft
// feather. We do this directly on the alpha values using a 3×3 min filter
// (morphological erosion): a pixel keeps its alpha only if all neighbours are
// also opaque, otherwise it is pulled toward transparent.
const eroded = Buffer.from(out); // copy RGBA
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * 4;
    const a = out[i + 3];
    if (a === 0) continue;
    let minN = a;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          minN = 0;
        } else {
          const na = out[(ny * width + nx) * 4 + 3];
          if (na < minN) minN = na;
        }
      }
    }
    // Blend toward the neighbourhood minimum → shrinks the edge inward.
    eroded[i + 3] = Math.round(a * 0.25 + minN * 0.75);
  }
}

await sharp(eroded, { raw: { width, height, channels: 4 } })
  .trim()
  .resize({ width: 1000, withoutEnlargement: true })
  .webp({ quality: 92, alphaQuality: 100, effort: 6 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`${path.basename(SRC)} → ${path.basename(OUT)} ${meta.width}x${meta.height}`);
