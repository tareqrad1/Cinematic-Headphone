import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/sequence-2");
const OUT = path.resolve("public/finale");
const QUALITY = 80;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => f.toLowerCase().endsWith(".png"))
  .sort();

// Source frames are 1280×720 with a small "Veo" watermark in the bottom-right.
// Crop a thin bottom strip to remove it (kept minimal so the framing barely
// changes; the canvas cover-fit absorbs the new aspect ratio).
const SRC_W = 1280;
const SRC_H = 720;
const CROP_BOTTOM = 54; // px removed from the bottom (~7.5%)
const CROP_RIGHT = 18; // px shaved off the right edge

let totalIn = 0;
let totalOut = 0;
let index = 0;

for (const file of files) {
  const srcPath = path.join(SRC, file);
  const outName = `frame-${String(index).padStart(4, "0")}.webp`;
  const outPath = path.join(OUT, outName);

  const inSize = (await stat(srcPath)).size;
  await sharp(srcPath)
    .extract({
      left: 0,
      top: 0,
      width: SRC_W - CROP_RIGHT,
      height: SRC_H - CROP_BOTTOM,
    })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outPath);
  totalOut += (await stat(outPath)).size;
  totalIn += inSize;
  index += 1;
  if (index % 25 === 0) process.stdout.write(`  ...${index}/${files.length}\n`);
}

const meta = await sharp(path.join(OUT, "frame-0000.webp")).metadata();
const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`\nConverted ${index} frames → ${meta.width}x${meta.height}`);
console.log(`Input ${mb(totalIn)} MB → Output ${mb(totalOut)} MB (${(100 - (totalOut / totalIn) * 100).toFixed(1)}% saved)`);
console.log(`FRAME_COUNT = ${index}`);
