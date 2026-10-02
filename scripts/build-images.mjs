// One-off asset pipeline: assets-src/ -> public/images/ as WebP.
//
//   assets-src/apps/<slug>/NN.{png,jpg,jpeg}        raw phone shot      -> NN.webp (720w)
//   assets-src/apps/<slug>/tablet-NN.png             raw tablet shot     -> tablet-NN.webp (1200w)
//   assets-src/apps/<slug>/framed-NN.png             Play-store mockup   -> NN.webp (screen cropped out)
//   assets-src/apps/<slug>/framed-tablet-NN.png      Play-store mockup   -> tablet-NN.webp (screen cropped out)
//   assets-src/apps/<slug>/icon.png                  launcher icon       -> icon.webp (160w)
//   assets-src/content/NN.{png,jpg}                  reel cover          -> NN.webp (640w)
//
// Run with `npm run images`. Originals stay in assets-src/; next/image serves the WebP.

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SRC = "assets-src";
const OUT = path.join("public", "images");
const PHONE_W = 720;
const TABLET_W = 1200;
const ICON_W = 160;
const COVER_W = 640;
const QUALITY = 80;

const isImage = (f) => /\.(png|jpe?g)$/i.test(f);

/**
 * Finds the device screen inside a Play-store mockup. The bezel is near-black and
 * forms a rectangle: side bezels are columns dark for most of the image height,
 * top/bottom bezels are rows dark for most of the image width. Titles above the
 * device are sparse text, so they never reach the 55% density bar.
 */
async function findScreenBox(input) {
  const meta = await sharp(input).metadata();
  const w = 400;
  const h = Math.round((meta.height / meta.width) * w);
  const buf = await sharp(input).flatten({ background: "#fff" }).greyscale().resize(w, h).raw().toBuffer();

  const rowCount = new Array(h).fill(0);
  const colCount = new Array(w).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (buf[y * w + x] < 48) {
        rowCount[y]++;
        colCount[x]++;
      }
    }
  }
  const cols = [];
  const rows = [];
  for (let x = 0; x < w; x++) if (colCount[x] > h * 0.55) cols.push(x);
  for (let y = 0; y < h; y++) if (rowCount[y] > w * 0.55) rows.push(y);
  if (!cols.length || !rows.length) return null;

  const scale = meta.width / w;
  const x0 = Math.min(...cols) * scale;
  const x1 = (Math.max(...cols) + 1) * scale;
  const y0 = Math.min(...rows) * scale;
  const y1 = (Math.max(...rows) + 1) * scale;
  const inset = Math.min(x1 - x0, y1 - y0) * 0.03; // just inside the bezel
  const box = {
    left: Math.round(x0 + inset),
    top: Math.round(y0 + inset),
    width: Math.round(x1 - x0 - inset * 2),
    height: Math.round(y1 - y0 - inset * 2),
  };
  if (box.width < meta.width * 0.3 || box.height < meta.height * 0.3) return null;
  return box;
}

async function convert(input, output, { width, crop = false }) {
  let img = sharp(input);
  let target = width;
  if (crop) {
    const box = await findScreenBox(input);
    if (!box) throw new Error(`no device bezel found in ${input}`);
    img = img.extract(box);
    target = box.width > box.height ? TABLET_W : width;
  }
  await img.resize({ width: target, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(output);
}

async function processApps() {
  const appsDir = path.join(SRC, "apps");
  const slugs = (await fs.readdir(appsDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const slug of slugs) {
    const inDir = path.join(appsDir, slug);
    const outDir = path.join(OUT, "apps", slug);
    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });
    const files = (await fs.readdir(inDir)).filter(isImage).sort();
    for (const file of files) {
      const stem = file.replace(/\.[^.]+$/, "");
      const input = path.join(inDir, file);
      if (stem === "icon") {
        await convert(input, path.join(outDir, "icon.webp"), { width: ICON_W });
      } else if (stem.startsWith("framed-tablet-")) {
        await convert(input, path.join(outDir, `tablet-${stem.slice("framed-tablet-".length)}.webp`), { width: PHONE_W, crop: true });
      } else if (stem.startsWith("framed-")) {
        await convert(input, path.join(outDir, `${stem.slice("framed-".length)}.webp`), { width: PHONE_W, crop: true });
      } else if (stem.startsWith("tablet-")) {
        await convert(input, path.join(outDir, `${stem}.webp`), { width: TABLET_W });
      } else {
        await convert(input, path.join(outDir, `${stem}.webp`), { width: PHONE_W });
      }
      console.log(`${slug}/${file}`);
    }
  }
}

async function processCovers() {
  const inDir = path.join(SRC, "content");
  const outDir = path.join(OUT, "content");
  await fs.mkdir(outDir, { recursive: true });
  const files = (await fs.readdir(inDir)).filter(isImage).sort();
  for (const file of files) {
    const stem = file.replace(/\.[^.]+$/, "");
    await convert(path.join(inDir, file), path.join(outDir, `${stem}.webp`), { width: COVER_W });
    console.log(`content/${file}`);
  }
}

await processApps();
await processCovers();
console.log("done");
