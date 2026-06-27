// Cadence analysis: recognizing arithmetic progressions and step strides in a
// field's values, and the segment accessors renderers use to reach them.
// Output-neutral and language-agnostic; renderers speak the cadence they find.

import type {Field, Schedule, Segment} from './schedule.js';

// A step segment of a classified field, carrying its `fires`/`interval`/
// `startToken`. The plan only routes step-shaped fields to step phrasing,
// where the first segment is always a step segment.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// Recognize an arithmetic progression in a sorted, distinct numeric set: a
// run of length >= 5 whose consecutive gaps are all equal and >= 2. Returns
// its {start, interval, last}; null for anything shorter, with a gap of one
// (a plain run, which reads as a range), or irregular. Output-neutral and
// language-agnostic: renderers use it to speak a bounded/offset step cadence
// ("every N from M [through K]") instead of enumerating the fires. The set is
// the field's full value list, which the core has already sorted and deduped.
function arithmeticStep(values: number[]):
  {start: number; interval: number; last: number} | null {
  if (values.length < 5) {
    return null;
  }

  const interval = values[1] - values[0];

  if (interval < 2) {
    return null;
  }

  for (let i = 2; i < values.length; i += 1) {
    if (values[i] - values[i - 1] !== interval) {
      return null;
    }
  }

  return {start: values[0], interval, last: values[values.length - 1]};
}

// A field's classified segments, or an empty list when the field is a
// wildcard or Quartz shape (no segments). Renderers reach a non-empty list
// only on the field shapes the analysis segmented; the empty fallback keeps
// callers that touch a possibly-unsegmented field (a `.map`/`.forEach`) safe.
function segmentsOf(schedule: Schedule, field: Field): Segment[] {
  return schedule.analyses.segments[field] ?? [];
}

// The first segment of a step field, narrowed to its step variant. The plan
// only routes step shapes here, whose (single) segment always classifies as a
// step; this asserts what the analysis guarantees but the type cannot express.
function stepSegment(schedule: Schedule, field: Field): StepSegment {
  return segmentsOf(schedule, field)[0] as StepSegment;
}

// The sorted numeric values a field's segments cover, or null if any segment
// is not a discrete single (a range or sub-step is not a plain fire list).
function singleValues(segments: Segment[]): number[] | null {
  const values: number[] = [];

  for (const segment of segments) {
    if (segment.kind !== 'single') {
      return null;
    }

    values.push(+segment.value);
  }

  return values;
}

// Whether an hour stride wraps the day cleanly from within its first interval
// (a `*/n` from the top, or a `m/n` offset with m < n that divides 24): such a
// stride has no distinct endpoint and keeps its bare or "from M" cadence. Every
// other stride — a uneven interval, or one starting at or past its interval (a
// bounded `a-b/n`) — is a bounded set the cadence pins both endpoints of.
function offsetCleanStride(
  stride: {start: number; interval: number}
): boolean {
  return stride.start < stride.interval && 24 % stride.interval === 0;
}

// An hour list's arithmetic progression, or null when its values are not a
// step the renderer should speak as a cadence. The core rewrites a uneven hour
// step (whose interval does not tile 24, e.g. `*/5` → 0,5,10,15,20) to its
// literal fire list, indistinguishable in the Schedule from a hand-written
// list; the renderer recovers the cadence from the values. A progression
// starting at zero is a `*/n` step however short (0,7,14,21 is `*/7`); a
// non-zero one is only a step when it is too long to be a deliberate clock-time
// list (e.g. 9,17 is two named times, not a cadence), the same length the
// minute/second list path uses. Interval one is a plain range, never a step.
function hourListStride(
  values: number[]
): {start: number; interval: number; last: number} | null {
  if (values.length < 2) {
    return null;
  }

  const interval = values[1] - values[0];

  if (interval < 2) {
    return null;
  }

  for (let i = 2; i < values.length; i += 1) {
    if (values[i] - values[i - 1] !== interval) {
      return null;
    }
  }

  if (values[0] !== 0 && values.length < 5) {
    return null;
  }

  return {interval, last: values[values.length - 1], start: values[0]};
}

export {
  arithmeticStep, hourListStride, offsetCleanStride, segmentsOf, singleValues,
  stepSegment
};
