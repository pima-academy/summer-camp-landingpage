// The founder timeline's scroll-driven dots (FounderStory, ve-chung-toi), run once per page by
// BaseLayout. Keep this file erasable-only TS: node imports it directly in scripts/timeline-dots.test.mjs.

interface Box {
  top: number;
  height: number;
}

/**
 * Progress of a `[data-timeline-dot]` element (old IX2 "Timeline Circle [Scroll]"), 0 to 1.
 * The scroll position is 0 when the dot's top reaches the viewport bottom and 1 when its
 * bottom leaves the viewport top; the progress goes from 0 to 1 between 0.45 and 0.5. The
 * script writes it to the dot's `--timeline-dot-progress`, and the section's CSS mixes the
 * dot's colour from it (idle grey to PiMA Green), so no colour lives here.
 */
export function timelineDotProgress(box: Box, viewportHeight: number): number {
  const position = (viewportHeight - box.top) / (viewportHeight + box.height);
  return Math.min(1, Math.max(0, (position - 0.45) / 0.05));
}

/** `data-timeline-dot`: `--timeline-dot-progress` follows the scroll position (see timelineDotProgress). */
export function initTimelineDots(): void {
  const dots = [...document.querySelectorAll<HTMLElement>("[data-timeline-dot]")];
  if (dots.length === 0) return;
  let queued = false;
  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    for (const dot of dots) {
      const progress = timelineDotProgress(dot.getBoundingClientRect(), vh);
      dot.style.setProperty("--timeline-dot-progress", String(progress));
    }
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
}
