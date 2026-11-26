// FROZEN copy of src/lib/animate.ts for the camp pages (#60): do not edit; see src/camp/README.md.
// Decorative animations, run once per page by CampLayout. CSS lives in ./styles/animations.css.

interface Box {
  top: number;
  height: number;
}

const GREY = [217, 218, 219];

/**
 * Background colour of a `[data-timeline-dot]` element (old IX2 "Timeline Circle [Scroll]").
 * Progress is 0 when the dot's top reaches the viewport bottom and 1 when its bottom leaves
 * the viewport top; the colour goes from rgb(217,218,219) to black between 0.45 and 0.5.
 */
export function timelineDotColor(box: Box, viewportHeight: number): string {
  const progress = (viewportHeight - box.top) / (viewportHeight + box.height);
  const t = Math.min(1, Math.max(0, (progress - 0.45) / 0.05));
  const [r, g, b] = GREY.map((c) => Math.round(c * (1 - t)));
  return `rgb(${r}, ${g}, ${b})`;
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

/** `data-timeline-dot`: background colour follows the scroll position (see timelineDotColor). */
function initTimelineDots(): void {
  const dots = [...document.querySelectorAll<HTMLElement>("[data-timeline-dot]")];
  if (dots.length === 0) return;
  let queued = false;
  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    for (const dot of dots) dot.style.backgroundColor = timelineDotColor(dot.getBoundingClientRect(), vh);
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
