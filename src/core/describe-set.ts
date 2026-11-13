// Set description: every compact way a set of field values can be said.
// "The odd days" is a short description of a set; take one day away and the
// short description is gone unless something like "the odd days except the
// 15th" is on offer. Finding those descriptions is arithmetic and is the
// same for every language, so it lives here. Which candidates a language
// can say, and which one reads best aloud, is the language's decision.

import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  SetDescription, SetView, ValuesDescription
} from './schedule.js';

type Cadence = CadenceDescription;
type Part = CadencePieces['parts'][number];
type Described = SetDescription | CadencePieces;

// How one description of a set is laid out: whether a run may wrap round
// the cycle, and whether the field ends (a run or cadence reaching the end
// of a field that does not cycle has no end to name).
interface Layout {
  wraps: boolean;
  ends: boolean;
}

// A cadence, and a run worth calling a range inside several pieces, need
// at least this many values.
const minProgression = 3;

// How many things a range or a cadence names: its two ends, or its start
// and its interval.
const boundsNamed = 2;

// How many of the values after one are tried as the next step of a
// progression from it, when a set is split into runs and cadences.
const intervalsTried = 4;

function integersBetween(from: number, to: number, step = 1): number[] {
  const values: number[] = [];

  for (let value = from; value <= to; value += step) {
    values.push(value);
  }

  return values;
}

function ascending(a: number, b: number): number {
  return a - b;
}

function without(values: number[], removed: number[]): number[] {
  const dropped = new Set(removed);

  return values.filter(function kept(value) {
    return !dropped.has(value);
  });
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

// How many values lie strictly between the end of one run and the start of
// the next, going round the cycle.
function gapAfter(run: number[], next: number[], domain: Domain): number {
  const size = sizeOf(domain);

  return ((next[0] - run[run.length - 1] - 1) % size + size) % size;
}

// The maximal runs of consecutive values, in ascending order.
function linearRuns(values: number[]): number[][] {
  const runs: number[][] = [];

  values.forEach(function place(value) {
    const current = runs[runs.length - 1];

    if (current && value === current[current.length - 1] + 1) {
      current.push(value);
    }
    else {
      runs.push([value]);
    }
  });

  return runs;
}

// The maximal runs of consecutive values, in the order a speaker would
// walk them. In a cyclic field a run that leaves the top of the domain and
// resumes at the bottom is one run, and the walk starts after the widest
// gap, so "10 p.m. through 2 a.m." stays whole whatever else is in the set.
// The gap across the top of the domain wins a tie, which keeps an ordinary
// set in ascending order.
function runsOf(values: number[], domain: Domain, wraps: boolean):
  number[][] {
  const runs = linearRuns(values);
  const last = runs[runs.length - 1];

  if (!wraps || runs.length === 1) {
    return runs;
  }

  const joins = runs[0][0] === domain.min &&
    last[last.length - 1] === domain.max;
  const ring = joins ?
    [...runs.slice(1, -1), [...last, ...runs[0]]] :
    runs;
  let start = 0;
  let widest = gapAfter(ring[ring.length - 1], ring[0], domain);

  ring.slice(1).forEach(function compare(run, index) {
    const gap = gapAfter(ring[index], run, domain);

    if (gap > widest) {
      widest = gap;
      start = index + 1;
    }
  });

  return [...ring.slice(start), ...ring.slice(0, start)];
}

// A range, marked open when it runs to the end of a field that ends.
function rangeBetween(from: number, to: number, domain: Domain, ends: boolean):
  RangeDescription {
  return ends && to === domain.max ?
    {from, kind: 'range', open: true, to} :
    {from, kind: 'range', to};
}

// A cadence, marked open when a field that ends has no room for another
// value after its last.
function cadenceFrom(
  bounds: {start: number; last: number; interval: number},
  domain: Domain,
  ends: boolean
): Cadence {
  const {interval, last, start} = bounds;

  return ends && last + interval > domain.max ?
    {interval, kind: 'cadence', last, open: true, start} :
    {interval, kind: 'cadence', last, start};
}

// One range covering the whole set, when the set is a single run of two or
// more values. `from > to` when the run wraps around.
function rangeOf(runs: number[][], domain: Domain, ends: boolean):
  RangeDescription | null {
  const [only] = runs;

  return runs.length === 1 && only.length > 1 ?
    rangeBetween(only[0], only[only.length - 1], domain, ends) :
    null;
}

// The evenly spaced cadence the values form, if they form one. Three
// values make a cadence anywhere. Two do only when they tile a cyclic
// field (minutes 0 and 30, hours 0 and 12): there the pair really is
// "every 30 minutes", where minutes 0 and 20 are just two values.
function cadenceOf(values: number[], domain: Domain, ends: boolean):
  Cadence | null {
  const interval = values[1] - values[0];
  const even = interval > 1 && values.every(function spaced(value, index) {
    return index === 0 || value - values[index - 1] === interval;
  });
  const tilesAsPair = values.length === 2 && domain.cyclic &&
    interval * 2 === sizeOf(domain) && values[0] - domain.min < interval;

  return even && (values.length >= minProgression || tilesAsPair) ?
    cadenceFrom({interval, last: values[values.length - 1],
      start: values[0]}, domain, ends) :
    null;
}

// The set as several pieces: long runs as ranges, and the short runs
// between them gathered into lists.
function piecesOf(runs: number[][], domain: Domain, ends: boolean):
  SetDescription | null {
  const worthwhile = runs.length > 1 && runs.some(function isLong(run) {
    return run.length >= minProgression;
  });

  if (!worthwhile) {
    return null;
  }

  const parts: Array<RangeDescription | ValuesDescription> = [];

  runs.forEach(function place(run) {
    const previous = parts[parts.length - 1];

    if (run.length >= minProgression) {
      parts.push(rangeBetween(run[0], run[run.length - 1], domain, ends));
    }
    else if (previous && previous.kind === 'values') {
      previous.values.push(...run);
    }
    else {
      parts.push({kind: 'values', values: run.slice()});
    }
  });

  return {kind: 'pieces', parts};
}

// The longest evenly spaced progression that starts at `values[at]` and
// steps to one of the next few values still unplaced, as the values it
// takes. A lone value when nothing follows.
function longestProgression(
  values: number[],
  at: number,
  unplaced: Set<number>
): number[] {
  const start = values[at];
  let best = [start];
  let tried = 0;

  for (let next = at + 1;
    next < values.length && tried < intervalsTried; next += 1) {
    if (unplaced.has(values[next])) {
      const interval = values[next] - start;
      const found = [];

      for (let value = start; unplaced.has(value); value += interval) {
        found.push(value);
      }

      tried += 1;
      best = found.length > best.length ? found : best;
    }
  }

  return best;
}

// How many things a part names: a range or cadence two, a list each of
// its values.
function namedBy(part: Part): number {
  return part.kind === 'values' ? part.values.length : boundsNamed;
}

function firstOf(part: Part): number {
  if (part.kind === 'values') {
    return part.values[0];
  }

  return part.kind === 'range' ? part.from : part.start;
}

// A progression as a part, a range when it steps by one; its values are
// placed.
function placeProgression(
  taken: number[],
  unplaced: Set<number>,
  domain: Domain,
  ends: boolean
): Part {
  const [start, second] = taken;
  const last = taken[taken.length - 1];

  taken.forEach(function placed(member) {
    unplaced.delete(member);
  });

  return second - start === 1 ?
    rangeBetween(start, last, domain, ends) :
    cadenceFrom({interval: second - start, last, start}, domain, ends);
}

// The values still unplaced as progressions: from the lowest, the longest
// progression there is, and so on; values on no progression gathered into
// one list. Parts already found are kept, and all are put in order of
// their first value.
function progressionParts(
  values: number[],
  found: {parts: Part[]; unplaced: Set<number>},
  domain: Domain,
  ends: boolean
): Part[] {
  const {unplaced} = found;
  const parts = found.parts.slice();
  const loose: number[] = [];

  values.forEach(function place(value, at) {
    if (!unplaced.has(value)) {
      return;
    }

    const taken = longestProgression(values, at, unplaced);

    if (taken.length < minProgression) {
      unplaced.delete(value);
      loose.push(value);

      return;
    }

    parts.push(placeProgression(taken, unplaced, domain, ends));
  });

  return [
    ...parts, ...loose.length ? [{kind: 'values' as const, values: loose}] : []
  ].sort(function byFirst(a, b) {
    return firstOf(a) - firstOf(b);
  });
}

// A set while its progressions are being taken: every value, and those
// no part has yet.
interface Placing {
  present: Set<number>;
  unplaced: Set<number>;
}

// The progression from a value by an interval through every value of the
// set, placed or not, cut after the last member still unplaced, with how
// many of its members are unplaced.
function progressionThrough(start: number, interval: number, set: Placing):
  {covers: number; taken: number[]} {
  const members = [];
  let covers = 0;
  let length = 0;

  for (let value = start; set.present.has(value); value += interval) {
    members.push(value);

    if (set.unplaced.has(value)) {
      covers += 1;
      length = members.length;
    }
  }

  return {covers, taken: members.slice(0, length)};
}

// The progression from `values[at]` to one of the next few values that
// takes in most of the values still unplaced. It may pass through values
// another part has: two cadences that cross share the values where they
// meet. With `fresh`, a progression that the value one step below is also
// on is passed over: it is the tail of a longer one, which is found from
// where that one starts.
function widestProgression(
  values: number[],
  at: number,
  set: Placing,
  fresh = false
): {covers: number; taken: number[]} {
  const start = values[at];

  return values.slice(at + 1, at + 1 + intervalsTried)
    .map(function interval(next) {
      return next - start;
    })
    .filter(function starts(interval) {
      return !(fresh && set.present.has(start - interval));
    })
    .reduce(function widest(best, interval) {
      const found = progressionThrough(start, interval, set);

      return found.covers > best.covers ? found : best;
    }, {covers: 1, taken: [start]});
}

// The progressions of a set taken widest first, wherever each starts, and
// what they leave unplaced. Taking from the lowest value first lets a
// stray value claim a few members of a long cadence above it (1984, then
// every 2nd year from 2042: 1984, 2042, 2100 are 58 apart) and break that
// cadence into many, and lets the first of two cadences that cross break
// the second. Every value is queued under how many unplaced values the
// widest progression starting at it takes in; that can only fall as
// values are placed, so one that has fallen is queued again lower down.
function widestFirst(values: number[], domain: Domain, ends: boolean):
  {parts: Part[]; unplaced: Set<number>} {
  const set = {present: new Set(values), unplaced: new Set(values)};
  const parts: Part[] = [];
  const queued: number[][] = [];

  function queue(at: number, covers: number): void {
    queued[covers] = [...queued[covers] || [], at];
  }

  values.forEach(function measure(value, at) {
    queue(at, widestProgression(values, at, set, true).covers);
  });

  for (let covers = queued.length - 1; covers >= minProgression;
    covers -= 1) {
    (queued[covers] || []).sort(ascending).forEach(function take(at) {
      const found = set.unplaced.has(values[at]) ?
        widestProgression(values, at, set) :
        {covers: 0, taken: []};

      if (found.covers >= covers) {
        parts.push(placeProgression(found.taken, set.unplaced, domain,
          ends));
      }
      else {
        queue(at, found.covers);
      }
    });
  }

  return {parts, unplaced: set.unplaced};
}

// How many values a part holds. No part wraps.
function sizeOfPart(part: Part): number {
  if (part.kind === 'values') {
    return part.values.length;
  }

  return part.kind === 'range' ?
    part.to - part.from + 1 :
    (part.last - part.start) / part.interval + 1;
}

// What a way of splitting a set of so many values costs a reader, most
// important first: how many things it names, how many values two parts
// both hold, and how many values are left in a list.
function costOf(parts: Part[], count: number): number[] {
  const sum = {held: 0, loose: 0, named: 0};

  parts.forEach(function add(part) {
    sum.held += sizeOfPart(part);
    sum.loose += part.kind === 'values' ? part.values.length : 0;
    sum.named += namedBy(part);
  });

  return [sum.named, sum.held - count, sum.loose];
}

// Whether one cost is less than another, by the first number that
// differs.
function costsLess(cost: number[], other: number[]): boolean {
  const differs = cost.findIndex(function unequal(amount, at) {
    return amount !== other[at];
  });

  return differs >= 0 && cost[differs] < other[differs];
}

// The set as runs and cadences together, three ways: with every long run
// taken as a range first, where there is one; with the widest
// progressions in the whole set taken first, which keeps a long cadence
// whole beside stray values and keeps two cadences that cross as two; and
// with the longest progression taken from each value in turn, lowest
// first. The last two find a cadence that passes through runs (every 2nd
// year from 2030, and 2031). The one that costs least is offered, the
// earlier of these on a tie, and only when it has a cadence among several
// parts. Only the widest-first way has parts that share a value. Nothing
// wraps here: a wrapped run is kept whole by the plain pieces.
function cadencePiecesOf(values: number[], domain: Domain, ends: boolean):
  CadencePieces | null {
  const long = linearRuns(values).filter(function isLong(run) {
    return run.length >= minProgression;
  });
  const ranges = long.map(function asRange(run) {
    return rangeBetween(run[0], run[run.length - 1], domain, ends);
  });
  const layouts = [
    ...long.length ?
      [{parts: ranges, unplaced: new Set(without(values, long.flat()))}] :
      [],
    widestFirst(values, domain, ends),
    {parts: [], unplaced: new Set(values)}
  ].map(function split(found) {
    const parts = progressionParts(values, found, domain, ends);

    return {cost: costOf(parts, values.length), parts};
  });
  const {parts} = layouts.reduce(function cheapest(best, layout) {
    return costsLess(layout.cost, best.cost) ? layout : best;
  });
  const hasCadence = parts.some(function isCadence(part) {
    return part.kind === 'cadence';
  });

  return hasCadence && parts.length > 1 ?
    {kind: 'cadencePieces', parts} :
    null;
}

// The cadences the values sit on with some positions unfilled: the one
// spanning the values themselves, then that one extended to the domain's
// bounds when it differs.
function cadenceBases(values: number[], domain: Domain, ends: boolean):
  Cadence[] {
  const interval = values.slice(1).reduce(function fold(divisor, value, at) {
    return greatestCommonDivisor(divisor, value - values[at]);
  }, 0);

  if (interval < 2) {
    return [];
  }

  const [start] = values;
  const last = values[values.length - 1];
  const lowest = domain.min + (start - domain.min) % interval;
  const highest = last + Math.floor((domain.max - last) / interval) * interval;
  const spanning = cadenceFrom({interval, last, start}, domain, ends);

  return lowest === start && highest === last ?
    [spanning] :
    [spanning,
      cadenceFrom({interval, last: highest, start: lowest}, domain, ends)];
}

// How many values a base stands for, without listing them: the whole
// domain can be thousands of years.
function countOf(base: SetDescription, domain: Domain): number {
  switch (base.kind) {
    case 'all':
      return sizeOf(domain);
    case 'range':
      return ((base.to - base.from) % sizeOf(domain) + sizeOf(domain)) %
        sizeOf(domain) + 1;
    case 'cadence':
      return (base.last - base.start) / base.interval + 1;
    default:
      return denote(base, domain).length;
  }
}

// A simpler base with a few values removed. Offered only when it names
// fewer things than the plain list would: the base's own bounds plus each
// removed value, against each value kept. "The odd days except the 15th"
// names three things in place of fifteen; "1 through 5 except 2 and 4"
// names four in place of three and is never offered.
function exceptionsOf(
  values: number[],
  runs: number[][],
  domain: Domain,
  ends: boolean
): SetDescription[] {
  const lastRun = runs[runs.length - 1];
  const bases: SetDescription[] = [
    {kind: 'all'},
    rangeBetween(runs[0][0], lastRun[lastRun.length - 1], domain, ends),
    ...cadenceBases(values, domain, ends)
  ];
  const found: SetDescription[] = [];

  bases.forEach(function tryBase(base) {
    const total = countOf(base, domain);
    const removedCount = total - values.length;
    const named = base.kind === 'all' ? 0 : boundsNamed;
    const redundant = base.kind === 'range' && total === sizeOf(domain);

    if (!redundant && removedCount > 0 &&
        named + removedCount < values.length) {
      found.push({
        base,
        kind: 'except',
        removed: without(denote(base, domain), values)
      });
    }
  });

  return found;
}

// Every description of a sorted, distinct set under one layout.
function describeLaidOut(values: number[], domain: Domain, layout: Layout):
  SetDescription[] {
  if (values.length === sizeOf(domain)) {
    return [{kind: 'all'}];
  }

  const {ends} = layout;
  const runs = runsOf(values, domain, layout.wraps);
  const range = rangeOf(runs, domain, ends);
  const candidates: Array<SetDescription | null> = [
    range,
    cadenceOf(values, domain, ends),
    range ? null : piecesOf(runs, domain, ends),
    ...exceptionsOf(values, runs, domain, ends),
    {kind: 'values', values: values.slice()}
  ];

  return candidates.filter(function present(candidate) {
    return candidate !== null;
  }) as SetDescription[];
}

// A description with every value in it replaced.
function withValues<T extends Described>(
  description: T,
  replace: (value: number) => number
): T {
  const found: Described = description;

  switch (found.kind) {
    case 'all':
      return description;
    case 'range':
      return {...description, from: replace(found.from),
        to: replace(found.to)};
    case 'cadence':
      return {...description, last: replace(found.last),
        start: replace(found.start)};
    case 'pieces':
    case 'cadencePieces':
      return {...description, parts: found.parts.map(function each(part) {
        return withValues(part, replace);
      })};
    case 'except':
      return {...description, base: withValues(found.base, replace),
        removed: found.removed.map(replace)};
    default:
      return {...description, values: found.values.map(replace)};
  }
}

// A view of a domain: the layout its descriptions follow, the set as it
// lies when the field is walked from the view's first value, and the way
// back from a description of that to the field's own numbers. A field
// walked from its own lowest value is left exactly as it is.
function viewOf(domain: Domain, opts: SetView) {
  const size = sizeOf(domain);
  const shift = domain.cyclic ? (opts.first ?? domain.min) - domain.min : 0;

  return {
    layout: {ends: !domain.cyclic, wraps: domain.cyclic && !opts.linear},
    moved(values: number[]): number[] {
      return shift === 0 ? values : values.map(function back(value) {
        return domain.min + (value - domain.min - shift + size) % size;
      }).sort(ascending);
    },
    restored<T extends Described>(found: T): T {
      return shift === 0 ? found : withValues(found, function forward(value) {
        return domain.min + (value - domain.min + shift) % size;
      });
    }
  };
}

/**
 * Every compact description of a sorted, distinct set of field values, in a
 * fixed order (the order a tie between equally short phrasings is settled
 * in): the whole field, a range, a cadence, pieces, a base with exceptions,
 * and the values themselves.
 *
 * A view lays the same set out another way. Walked from `first`, a cyclic
 * field is described as if `first` were its lowest value: every value in
 * the result is still the field's own number, but order, runs and wraps
 * are relative to `first`. Under `linear` nothing wraps.
 */
function describeSet(values: number[], domain: Domain, opts: SetView = {}):
  SetDescription[] {
  const view = viewOf(domain, opts);

  return describeLaidOut(view.moved(values), domain, view.layout)
    .map(view.restored);
}

/**
 * A sorted, distinct set as runs and cadences together, or null when that
 * has no cadence or is a single part. A view's `first` walks a cyclic
 * field from that value.
 */
function describeCadencePieces(
  values: number[],
  domain: Domain,
  opts: SetView = {}
): CadencePieces | null {
  const view = viewOf(domain, opts);
  const found = cadencePiecesOf(view.moved(values), domain, view.layout.ends);

  return found && view.restored(found);
}

// The values of a cadence that passes the top of its field, which only a
// view walked from another value has.
function aroundTheTop(cadence: Cadence, domain: Domain): number[] {
  const values = [cadence.start];
  let value = cadence.start;

  while (value !== cadence.last) {
    value += cadence.interval;
    value -= value > domain.max ? sizeOf(domain) : 0;
    values.push(value);
  }

  return values.sort(ascending);
}

/** The sorted, distinct values a description stands for. */
function denote(description: Described, domain: Domain): number[] {
  switch (description.kind) {
    case 'all':
      return integersBetween(domain.min, domain.max);
    case 'range':
      return description.from <= description.to ?
        integersBetween(description.from, description.to) :
        [
          ...integersBetween(domain.min, description.to),
          ...integersBetween(description.from, domain.max)
        ];
    case 'cadence':
      return description.start <= description.last ?
        integersBetween(
          description.start, description.last, description.interval) :
        aroundTheTop(description, domain);
    case 'pieces':
    case 'cadencePieces':
      // Two cadences that cross share a value, which is one value.
      return [...new Set(description.parts.flatMap(
        function partValues(part) {
          return denote(part, domain);
        }
      ))].sort(ascending);
    case 'except':
      return without(denote(description.base, domain), description.removed);
    default:
      return description.values.slice();
  }
}

export {denote, describeCadencePieces, describeSet};
