const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "images");
const THUMBS_DIR = path.join(IMAGES_DIR, "thumbs");
const FULL_DIR = path.join(IMAGES_DIR, "full");
const THUMB_WIDTH = 800;
const FIRST = 1;
const LAST = 54;

// Find the original for photoN in images/, returning its real on-disk
// filename (preserving exact case) so copies don't drift from the source.
const entries = fs.readdirSync(IMAGES_DIR);
function findOriginal(n) {
  const re = new RegExp(`^photo${n}\\.(jpe?g|png)$`, "i");
  return entries.find((f) => re.test(f)) || null;
}

(async () => {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
  fs.mkdirSync(FULL_DIR, { recursive: true });

  let count = 0;
  for (let n = FIRST; n <= LAST; n++) {
    const file = findOriginal(n);
    if (!file) continue; // gap in numbering — skip

    const src = path.join(IMAGES_DIR, file);
    const base = path.parse(file).name;

    // Thumbnail: auto-rotated from EXIF, resized, webp.
    await sharp(src)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(THUMBS_DIR, `${base}.webp`));

    // Full: copy the original (preserving its real filename/extension).
    fs.copyFileSync(src, path.join(FULL_DIR, file));

    console.log(`✓ ${file}`);
    count++;
  }

  console.log(`\nDone — ${count} photos processed.`);
})();
