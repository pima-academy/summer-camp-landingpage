// Decorative animations, run once per page by BaseLayout. CSS lives in src/styles/animations.css.
// Keep this file erasable-only TS: node imports it directly in scripts/animate.test.mjs.

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

/**
 * `data-animate="fade-up" | "slide-in-left"`: adds `is-animated` the first time the element
 * enters the viewport, then stops watching it. animations.css hides the start state only
 * under `html.js-ready` and `prefers-reduced-motion: no-preference`.
 */
function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-animate]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-animated"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-animated");
      observer.unobserve(entry.target);
    }
  });
  targets.forEach((el) => observer.observe(el));
}

/** `data-timeline-dot`: `--timeline-dot-progress` follows the scroll position (see timelineDotProgress). */
function initTimelineDots(): void {
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

export function initAnimations(): void {
  initReveal();
  initTimelineDots();
}
