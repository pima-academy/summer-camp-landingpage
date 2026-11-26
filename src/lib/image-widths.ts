// `widths` for a fluid <Image> (spec #15, Images): the standard candidates capped at
// the source width, plus the source width itself when it is under 2000 px (Astro does
// not add it). Plain, erasable TypeScript so `node --test` can import it directly.

const STANDARD = [500, 800, 1080, 1600, 2000];

export function fluidWidths(src: { width: number }): number[] {
  const below = STANDARD.filter((w) => w < src.width);
  return src.width <= 2000 ? [...below, src.width] : below;
}
