// PROTOTYPE (#51): full-page shots of / for each brand variant at 390/820/1440.
// Needs the dev server (PORT, default 4321) or `astro preview`. Output: shots/proto/.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
const OUT = "shots/proto";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const v of (process.argv[2] ?? "0,A,B,C").split(",")) {
  for (const w of [390, 820, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`http://localhost:${process.env.PORT ?? 4321}/?variant=${v}`, { waitUntil: "networkidle" });
    await p.evaluate(async () => {
      const pause = (ms) => new Promise((ok) => setTimeout(ok, ms));
      for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = "eager";
      for (let i = 0; i < 200; i++) {
        const before = scrollY;
        scrollBy({ top: Math.round(innerHeight * 0.7), behavior: "instant" });
        await pause(150);
        if (scrollY === before) break;
      }
      await pause(1500);
      scrollTo({ top: 0, behavior: "instant" });
      await pause(500);
    });
    await p.screenshot({ path: `${OUT}/${v}_${w}.png`, fullPage: true, animations: "disabled" });
    await p.close();
  }
}
await b.close();
