import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/frames");
const OUT = path.resolve("public/sequence");
const QUALITY = 82;
const WIDTH = 1280; // keep native width, WebP handles the weight

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => f.toLowerCase().endsWith(".png"))
  .sort();

let totalIn = 0;
let totalOut = 0;
let index = 0;

for (const file of files) {
  const srcPath = path.join(SRC, file);
  // normalize to zero-padded sequential name: frame-0001.webp
  const outName = `frame-${String(index).padStart(4, "0")}.webp`;
  const outPath = path.join(OUT, outName);

  const inSize = (await stat(srcPath)).size;
  await sharp(srcPath)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outPath);
  const outSize = (await stat(outPath)).size;

  totalIn += inSize;
  totalOut += outSize;
  index++;
  if (index % 20 === 0) process.stdout.write(`  ...${index}/${files.length}\n`);
}

const mb = (b) => (b / 1024 / 1024).toFixed(2);
console.log(`\nConverted ${index} frames`);
console.log(`Input:  ${mb(totalIn)} MB`);
console.log(`Output: ${mb(totalOut)} MB`);
console.log(`Saved:  ${(100 - (totalOut / totalIn) * 100).toFixed(1)}%`);
console.log(`Frame count constant: export const FRAME_COUNT = ${index};`);
