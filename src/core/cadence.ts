// Cadence analysis: recognizing arithmetic progressions and step strides in a
// field's values, and the segment accessors renderers use to reach them.
// Output-neutral and language-agnostic; renderers speak the cadence they find.

import type {Field, PlanNode, Schedule, Segment} from './schedule.js';

// A step segment of a classified field, carrying its `fires`/`interval`/
// `startToken`. The plan only routes step-shaped fields to step phrasing,
// where the first segment is always a step segment.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// The composeSeconds plan node: a meaningful second over a coarser rest.
type ComposeSecondsPlan = Extract<PlanNode, {kind: 'composeSeconds'}>;

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

// The three branches of the stride/cadence decision tree, supplied by a
// renderer as its own words. The core picks the branch; the language owns the
// prose. `bare` is the clean cadence ("every N <unit>"); `offset` names only
// the start (a clean wrap with no distinct endpoint); `bounded` pins both
// endpoints (a non-wrapping set). Each is a thunk so the renderer evaluates
// only the branch the core selects (e.g. a stateful bound formatter is never
// constructed for the bare case). The words differ per language — case
// inflection, a measure word, a trailing idiom — so the leaves stay here, not
// in core.
interface StrideParts {
  bare(): string;
  offset(): string;
  bounded(): string;
}

// The last value a stride reaches within `[0, cycle)`: the largest value below
// the cycle that is congruent to `start` modulo `interval`. A clean, full-field
// stride runs to this tile; a bounded one (`a-b/n`) stops short of it, and that
// shortfall is what distinguishes the open cadence from a bounded set.
function lastTileOf(start: number, interval: number, cycle: number): number {
  return cycle - 1 - (cycle - 1 - start) % interval;
}

// Choose the stride/cadence branch for a step over a `cycle`-long field and
// emit the renderer's words for it. A clean stride from the top of the cycle is
// the bare cadence; a uniform offset (start within the first interval, the
// interval still tiling the cycle) names only its start, since it wraps cleanly
// with no distinct endpoint; a non-uniform stride (start >= interval, an
// interval that does not tile the cycle, or one whose last fire stops short of
// the cycle's final tile — a bounded `a-b/n`) pins both endpoints so the
// bounded, non-wrapping set reads unambiguously. This is the one decision tree
// every renderer's `renderStride`/`hourStrideCadence` shared (cycle 60 for
// minute/second, 24 for the hour); the branch lives here once, the prose in
// each language's `parts`.
function renderStride(
  spec: {start: number; interval: number; last: number; cycle: number},
  parts: StrideParts
): string {
  const {start, interval, last, cycle} = spec;
  // A stride wraps the full field only when it both tiles the cycle and runs to
  // the cycle's last tile; one that stops short (`0-20/2`, last 20 of 22) is a
  // bounded set, not the open `*/n`, so it keeps its endpoint-pinning cadence.
  const open = cycle % interval === 0 && last === lastTileOf(start, interval,
    cycle);

  if (start === 0 && open) {
    return parts.bare();
  }

  if (start < interval && open) {
    return parts.offset();
  }

  return parts.bounded();
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

// The minute field's stride for a confinement frame, or null when the minute
// is not a stepped cadence. A `step`-shaped field (`*/6`) reads its segment;
// a `list`-shaped field the core enumerated from a uneven step (`2/7` →
// 2,9,…,58) recovers the progression from its values.
function minuteStride(schedule: Schedule):
  {start: number; interval: number; last: number} | null {
  if (schedule.shapes.minute === 'step') {
    const segment = stepSegment(schedule, 'minute');
    const start = segment.startToken === '*' ? 0 : +segment.startToken;

    return {interval: segment.interval, last:
      segment.fires[segment.fires.length - 1], start};
  }

  const values = singleValues(segmentsOf(schedule, 'minute'));

  return values && arithmeticStep(values);
}

// Whether a clock-point second (a single, range, or list) confines a
// restricted minute under an open hour. A single second under a single
// minute folds into a clock time instead, and a second list the core
// enumerated from a step (`*/15` → 0,15,30,45) is really a stride cadence —
// spoken and confined by the cadence path, not a clock-point clause.
function secondsConfinesMinute(schedule: Schedule): boolean {
  const {second, minute, hour} = schedule.shapes;

  if (second === 'list') {
    const values = singleValues(segmentsOf(schedule, 'second'));

    if (values && arithmeticStep(values)) {
      return false;
    }
  }

  const clockPoint = second === 'single' || second === 'range' ||
    second === 'list';

  return clockPoint && minute !== 'wildcard' && hour === 'wildcard' &&
    !(second === 'single' && minute === 'single');
}

// A wildcard second over an unoffset `*/2` minute with a wildcard hour: the
// two cadences read as contradictory side by side, so a renderer binds them
// into one phrase.
function isEveryOtherMinuteSeconds(
  schedule: Schedule,
  plan: ComposeSecondsPlan
): boolean {
  if (plan.rest.kind !== 'minuteFrequency' ||
      schedule.shapes.second !== 'wildcard' ||
      schedule.shapes.hour !== 'wildcard') {
    return false;
  }

  const minuteStep = stepSegment(schedule, 'minute');

  return minuteStep.startToken === '*' && minuteStep.interval === 2;
}

// Whether a stepped minute fills a wildcard hour under a wildcard or stepped
// second — the shape a renderer's stride-confinement frame handles (`*/2`
// stays with its own every-other idiom, see above).
function isSteppedMinuteSeconds(
  schedule: Schedule,
  plan: ComposeSecondsPlan
): boolean {
  return (plan.rest.kind === 'minuteFrequency' ||
    plan.rest.kind === 'multipleMinutes') &&
    (schedule.shapes.second === 'wildcard' ||
      schedule.shapes.second === 'step') &&
    schedule.shapes.hour === 'wildcard' &&
    schedule.pattern.minute !== '*/2' &&
    minuteStride(schedule) !== null;
}

export {
  arithmeticStep, hourListStride, isEveryOtherMinuteSeconds,
  isSteppedMinuteSeconds, minuteStride, offsetCleanStride, renderStride,
  secondsConfinesMinute, segmentsOf, singleValues, stepSegment
};
export type {StrideParts};
