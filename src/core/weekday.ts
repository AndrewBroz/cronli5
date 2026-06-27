// Weekday display ordering: present weekdays Monday-first (Sunday last),
// independent of the Schedule's canonical Sunday=0 order. Display-only.

import type {Segment} from './schedule.js';

// The display sort key for a canonical weekday number: Monday (1) first,
// Sunday (0) last. The Schedule keeps Sunday=0 canonical; this is display-only.
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
// "Sunday and Saturday". Display-only: the Schedule / canonical order is
// unchanged (a fresh array is returned). A step expands to its fires as singles
// so the days sort into the list; a range stays one unit and keeps its own
// bounds order (a wrap range is not reordered into a list), sorting by its
// opening bound — so a lone range sorts to a one-element list and is unchanged.
// The sort is stable, so equal opening days keep input order.
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

export {orderWeekdaysForDisplay};
