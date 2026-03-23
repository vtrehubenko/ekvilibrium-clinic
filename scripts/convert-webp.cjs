const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIRS = ["public/img/doctors", "public/img/stories"];

async function convert() {
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

    for (const file of files) {
      const src = path.join(dir, file);
      const dest = path.join(dir, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));

      if (fs.existsSync(dest)) {
        console.log(`skip (exists): ${dest}`);
        continue;
      }

      await sharp(src).webp({ lossless: true }).toFile(dest);

      const srcSize = fs.statSync(src).size;
      const destSize = fs.statSync(dest).size;
      const saved = (((srcSize - destSize) / srcSize) * 100).toFixed(1);
      console.log(`${src} → ${dest}  (${saved}% smaller)`);
    }
  }
}

convert().catch(console.error);
