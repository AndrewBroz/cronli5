// Small shared utilities for the core.

import type {Segment} from './ir.js';

function includes(str: string | number, sub: string): boolean {
  return ('' + str).indexOf(sub) !== -1;
}

// De-duplicate, preserving first-occurrence order.
function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

// Whether a string consists solely of digits.
function isNonNegativeInteger(value: string): boolean {
  const digits = /^\d+$/;

  return digits.test(value);
}

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

// The display sort key for a canonical weekday number: Monday (1) first,
// Sunday (0) last. The IR keeps Sunday=0 canonical; this is display-only.
function weekdayDisplayKey(value: number): number {
  return value === 0 ? 7 : value;
}

// A weekday display segment: a single day or a (possibly wrap) range. Steps
// are flattened away into singles before sorting, so the result is only these
// two kinds; each renderer turns them into names exactly as it does today.
type WeekdaySegment =
  | {kind: 'single'; value: string}
  | {kind: 'range'; bounds: [string, string]};

// Reorder weekday segments Monday-first (Sunday last) for display, so a weekend
// list reads "Saturday and Sunday" rather than the canonical Sunday-first
// "Sunday and Saturday". Display-only: the IR / canonical order is unchanged (a
// fresh array is returned). A step expands to its fires as singles so the days
// sort into the list; a range stays one unit and keeps its own bounds order (a
// wrap range is not reordered into a list), sorting by its opening bound — so a
// lone range sorts to a one-element list and is unchanged. The sort is stable,
// so equal opening days keep input order.
function orderWeekdaysForDisplay(segments: Segment[]): WeekdaySegment[] {
  const flattened: WeekdaySegment[] = segments.flatMap(function flat(segment) {
    return segment.kind === 'step' ?
      segment.fires.map(function single(value): WeekdaySegment {
        return {kind: 'single', value: '' + value};
      }) :
      [segment];
  });

  function key(segment: WeekdaySegment): number {
    return segment.kind === 'range' ?
      weekdayDisplayKey(+segment.bounds[0]) :
      weekdayDisplayKey(+segment.value);
  }

  return flattened
    .map(function index(segment, position): [WeekdaySegment, number] {
      return [segment, position];
    })
    .sort(function byDisplayKey(a, b): number {
      return key(a[0]) - key(b[0]) || a[1] - b[1];
    })
    .map(function unwrap(pair): WeekdaySegment {
      return pair[0];
    });
}

// Resolve a numeric or named field token (e.g. '5' or 'FRI') to its number.
function toFieldNumber(
  token: string,
  numberMap?: {[name: string]: number}
): number {
  // A non-numeric token is always a name, and only the named fields (month,
  // weekday) reach here. They always have an associated `numberMap`.
  return isNonNegativeInteger(token) ? +token : numberMap![token.toUpperCase()];
}
export {
  arithmeticStep, includes, isNonNegativeInteger, orderWeekdaysForDisplay,
  toFieldNumber, unique
};
