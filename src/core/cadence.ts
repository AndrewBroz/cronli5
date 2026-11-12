// Cadence analysis: recognizing arithmetic progressions and step strides in a
// field's values, and the segment accessors renderers use to reach them.
// Output-neutral and language-agnostic; renderers speak the cadence they find.

import type {
  Field, HourStride, PlanNode, Schedule, Segment
} from './schedule.js';

// A step segment of a classified field, carrying its `fires`/`interval`/
// `startToken`. The plan only routes step-shaped fields to step phrasing,
// where the first segment is always a step segment.
type StepSegment = Extract<Segment, {kind: 'step'}>;

// The composeSeconds plan node: a meaningful second over a coarser rest.
type ComposeSecondsPlan = Extract<PlanNode, {kind: 'composeSeconds'}>;

// An arithmetic progression in a sorted, distinct numeric set: consecutive
// gaps all equal and >= 2 (a gap of one is a plain run, which reads as a
// range). Returns its {start, interval, last}; null for a set shorter than
// two values or irregular. Callers apply their own length policy: a
// minute/second list must be long enough to beat enumeration, an hour list
// from zero is a stride however short.
function progressionOf(values: number[]):
  {start: number; interval: number; last: number} | null {
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

  return {start: values[0], interval, last: values[values.length - 1]};
}

// Recognize an arithmetic progression long enough (>= 5 values) to beat
// enumerating the fires. Output-neutral and language-agnostic: renderers use
// it to speak a bounded/offset step cadence ("every N from M [through K]")
// instead of the list. The set is the field's full value list, which the core
// has already sorted and deduped.
function arithmeticStep(values: number[]):
  {start: number; interval: number; last: number} | null {
  return values.length >= 5 ? progressionOf(values) : null;
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
  const stride = progressionOf(values);

  if (!stride) {
    return null;
  }

  return stride.start !== 0 && values.length < 5 ? null : stride;
}

// The hour field's stride as a precomputed fact, or null when the hour is
// not a cadence: a lone step segment yields its stride directly (two or
// more fires — a bounded step that fires once is a single value, not a
// stride); an all-single list yields one only when its values form a step
// progression, so an irregular list like 9,17 keeps enumerating.
function hourStrideFact(segments: Segment[] | null): HourStride | null {
  const stride = hourSegmentStride(segments ?? []);

  return stride && {...stride, offsetClean: offsetCleanStride(stride)};
}

// The raw {start, interval, last} of an hour segment list, or null.
function hourSegmentStride(segments: Segment[]):
  {start: number; interval: number; last: number} | null {
  if (segments.length === 1 && segments[0].kind === 'step') {
    const segment = segments[0];

    if (segment.fires.length < 2) {
      return null;
    }

    const start = segment.startToken === '*' ?
      0 :
      +segment.startToken.split('-')[0];

    return {
      interval: segment.interval,
      last: segment.fires[segment.fires.length - 1],
      start
    };
  }

  const values = singleValues(segments);

  return values && hourListStride(values);
}

// The minute field's stride for a confinement frame, or null when the minute
// is not a stepped cadence. A `step`-shaped field (`*/6`) reads its segment;
// a `list`-shaped field the core enumerated from a uneven step (`2/7` →
// 2,9,…,58) recovers the progression from its values.
function minuteStride(schedule: Schedule):
  {start: number; interval: number; last: number} | null {
  if (schedule.shapes.minute === 'step') {
    const segment = stepSegment(schedule, 'minute');
    const start = segment.startToken === '*' ?
      0 :
      +segment.startToken.split('-')[0];

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
  arithmeticStep, hourListStride, hourStrideFact, isEveryOtherMinuteSeconds,
  isSteppedMinuteSeconds, minuteStride, offsetCleanStride,
  secondsConfinesMinute, segmentsOf, singleValues, stepSegment
};
