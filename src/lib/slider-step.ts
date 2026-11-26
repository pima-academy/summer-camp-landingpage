// Movement rules of the Slider component, ported from webflow.js's slider
// ("slide" animation). Every instance on the site has slides as wide as the
// mask, so each slide is one page and positions are counted in slide widths:
// a position of -2 means `transform: translateX(-200%)` on that slide.
// Kept free of DOM code (and erasable-only TS) so node can unit-test it.

export interface SliderState {
  /** Current slide. */
  index: number;
  /** Position every slide was last moved to (= -index, except mid-wrap). */
  offset: number;
  /** Slide left off to one side by an infinite wrap, put back on the next move. */
  shifted: number | null;
}

export interface SlideMove {
  /** Jump here first, without a transition. */
  from?: number;
  /** Then slide here. */
  to: number;
}

export const initialState: SliderState = { index: 0, offset: 0, shifted: null };

/**
 * Moves to slide `requested` (may be -1 or `count` from prev/next). Out-of-range
 * requests wrap around; with `infinite` the wrap continues in the same direction
 * instead of rewinding across all slides. `moves[k]` is the move for slide k;
 * empty when the slide does not change.
 */
export function step(
  state: SliderState,
  requested: number,
  count: number,
  infinite: boolean,
): { state: SliderState; moves: SlideMove[] } {
  const previous = state.index;
  let index = requested;
  let wrap: { others: number; from: number; to: number } | null = null;
  if (index < 0) {
    index = count - 1;
    if (infinite) wrap = { others: -count, from: 0, to: 1 };
  } else if (index >= count) {
    index = 0;
    if (infinite) wrap = { others: 1, from: -(count - 1), to: -count };
  }
  if (index === previous) return { state, moves: [] };

  const to = index === 0 ? 0 : -index; // never -0
  const moves: SlideMove[] = [];
  let shifted: number | null = null;
  for (let k = 0; k < count; k++) {
    if (wrap) {
      moves.push(k === previous ? { from: wrap.from, to: wrap.to } : { from: wrap.others, to });
    } else if (infinite && k === state.shifted) {
      moves.push({ from: state.offset, to });
    } else {
      moves.push({ to });
    }
  }
  if (wrap) shifted = previous;
  return { state: { index, offset: to, shifted }, moves };
}
