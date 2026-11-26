// Generates the favicon, the app icon and the og:image fallback from the brand logo files
// (docs/brand.md, "Placement"). Run after a logo file changes, then commit the outputs:
//   node scripts/make-icons.mjs
// Uses sharp, which Astro's image service already installs.
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const at = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const stacked = at("src/assets/logo/pima-logo-stacked-green.png");
const horizontal = at("src/assets/logo/pima-logo-horizontal-green.png");
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

// The symbol alone: pima-logo-stacked-green.png (950 × 1287) has the symbol in rows 0–810,
// a transparent gap, then the wordmark. Take the top 811 rows and trim the transparent sides.
// Two steps: in one sharp pipeline, trim would run before extract.
const top = await sharp(stacked).extract({ left: 0, top: 0, width: 950, height: 811 }).png().toBuffer();
const symbol = await sharp(top).trim({ background: transparent, threshold: 0 }).png().toBuffer();

/** The symbol scaled to fit `inner` px, centred on a `size` px square of `background`. */
async function icon(size, inner, background, out) {
  const art = await sharp(symbol).resize(inner, inner, { fit: "contain", background: transparent }).toBuffer();
  const canvas = await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
  // An opaque background leaves no transparent pixel: drop the alpha channel.
  const image = background.alpha ? sharp(canvas).flatten({ background }) : sharp(canvas);
  await image.png().toFile(at(out));
}

// Favicon: transparent, the symbol fills the square (no room to spare at 32 px).
await icon(32, 32, transparent, "public/favicon-32.png");
await icon(48, 48, transparent, "public/favicon-48.png");
// apple-touch-icon: opaque white (iOS fills transparency with black), symbol at 80 %.
await icon(180, 144, white, "public/apple-touch-icon.png");

// og:image fallback: 1200 × 630 white, the horizontal logo 600 px wide in the centre, so it
// also survives the centred square crop some platforms make (630 × 630).
const logo = await sharp(horizontal).resize({ width: 600 }).toBuffer();
const og = await sharp({ create: { width: 1200, height: 630, channels: 4, background: white } })
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toBuffer();
await sharp(og).flatten({ background: white }).png().toFile(at("src/assets/images/og-fallback.png"));
