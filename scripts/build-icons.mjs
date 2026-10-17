// Generates favicons, PWA icons and the Open Graph image from the wordmark and hero photo.
// Usage: node scripts/build-icons.mjs   (re-run after changing the hero photo or branding)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const paper = "#F5F2ED";
const maroon = "#7B1E2B";
const ink = "#232323";

const monogram = (size, rounded) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${rounded ? 22 : 0}" fill="${maroon}"/>
  <text x="50" y="69" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="62" fill="${paper}">K</text>
</svg>`;

async function png(svg, size, out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
}

// ICO container holding a single PNG image (supported by every current browser).
function icoFromPng(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuf]);
}

await mkdir(path.join(root, "public", "icons"), { recursive: true });
await png(monogram(512, true), 512, path.join(root, "app", "icon.png"));
await png(monogram(180, false), 180, path.join(root, "app", "apple-icon.png"));
await png(monogram(192, true), 192, path.join(root, "public", "icons", "icon-192.png"));
await png(monogram(512, false), 512, path.join(root, "public", "icons", "icon-512.png"));
const fav = await sharp(Buffer.from(monogram(32, true))).resize(32, 32).png().toBuffer();
await writeFile(path.join(root, "app", "favicon.ico"), icoFromPng(fav, 32));

// Open Graph / Twitter card: photo on the left, wordmark on paper on the right (English text in every
// locale, since the image renderer cannot shape Telugu or Devanagari reliably).
const W = 1200;
const H = 630;
const photoW = 620;
const photo = await sharp(path.join(root, "_source", "img", "v2", "hero-1.png"))
  .resize(photoW, H, { fit: "cover", position: "right" })
  .toBuffer();
const panel = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W - photoW}" height="${H}">
  <rect width="100%" height="100%" fill="${paper}"/>
  <text x="56" y="250" font-family="Georgia, serif" font-size="64" fill="${ink}">Kalamkrutha</text>
  <text x="58" y="292" font-family="Arial, sans-serif" font-size="17" letter-spacing="7" fill="#5E554C">DIGITAL STUDIO</text>
  <rect x="58" y="330" width="56" height="2" fill="${maroon}"/>
  <text x="56" y="392" font-family="Georgia, serif" font-style="italic" font-size="38" fill="${maroon}">Life Time Memories</text>
  <text x="58" y="446" font-family="Arial, sans-serif" font-size="21" fill="${ink}">Wedding photography &amp; films · Guntur</text>
  <text x="58" y="478" font-family="Arial, sans-serif" font-size="21" fill="#5E554C">+91 88858 58111</text>
</svg>`;
const og = await sharp({ create: { width: W, height: H, channels: 3, background: paper } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: Buffer.from(panel), left: photoW, top: 0 },
  ])
  .jpeg({ quality: 82 })
  .toBuffer();
// Referenced by lib/seo/metadata.ts (ogImage).
await mkdir(path.join(root, "public", "og"), { recursive: true });
await writeFile(path.join(root, "public", "og", "og-default.jpg"), og);
console.log("icons and Open Graph image written");
