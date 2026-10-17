// Converts the source PNGs in _source/img into optimised WebP files in public/images
// and records their dimensions in lib/content/image-manifest.json.
// Usage: npm run images   (re-run after replacing any source photo)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "images");

// key -> source file (relative to _source/img)
const sources = {
  hero1: "v2/hero-1.png",
  hero2: "v2/hero-2.png",
  hero3: "v2/hero-3.png",
  s1Talambralu: "v2/s1-talambralu.png",
  s1Jeelakarra: "v2/s1-jeelakarra.png",
  s1Candid: "v2/s1-candid.png",
  s1Mangalsutra: "v2/s1-mangalsutra.png",
  s2Cover: "v2/s2-cover.png",
  s2Rings: "v2/s2-rings.png",
  s2Family: "v2/s2-family.png",
  s2Bride: "v2/s2-bride.png",
  s3Fort: "v2/s3-fort.png",
  s3River: "v2/s3-river.png",
  s3Field: "v2/s3-field.png",
  s3Closeup: "v2/s3-closeup.png",
  weddingRitual: "wedding-ritual.png",
  prewedding: "prewedding.png",
  svcTraditionalVideo: "v2/svc-traditional-video.png",
  svcCinematic: "v2/svc-cinematic.png",
  svcPostWedding: "v2/svc-post-wedding.png",
  svcFunctions: "v2/svc-functions.png",
  svcAlbum: "v2/svc-album.png",
  svcStudioSitting: "v2/svc-studio-sitting.png",
  svcPassport: "v2/svc-passport.png",
};

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`).replace(/^-/, "");

await mkdir(outDir, { recursive: true });
const manifest = {};
for (const [key, file] of Object.entries(sources)) {
  const name = `${kebab(key)}.webp`;
  const info = await sharp(path.join(root, "_source", "img", file))
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(path.join(outDir, name));
  manifest[key] = { src: `/images/${name}`, width: info.width, height: info.height };
  console.log(`${name.padEnd(28)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
await writeFile(
  path.join(root, "lib", "content", "image-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
