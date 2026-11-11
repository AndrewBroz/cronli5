// Set description: every compact way a set of field values can be said.
// "The odd days" is a short description of a set; take one day away and the
// short description is gone unless something like "the odd days except the
// 15th" is on offer. Finding those descriptions is arithmetic and is the
// same for every language, so it lives here. Which candidates a language
// can say, and which one reads best aloud, is the language's decision.

import type {
  Domain, RangeDescription, SetDescription, ValuesDescription
} from './schedule.js';

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;

// A cadence, and a run worth calling a range inside several pieces, need
// at least this many values.
const minProgression = 3;

// How many things a range or a cadence names: its two ends, or its start
// and its interval.
const boundsNamed = 2;

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
function runsOf(values: number[], domain: Domain): number[][] {
  const runs = linearRuns(values);
  const last = runs[runs.length - 1];

  if (!domain.cyclic || runs.length === 1) {
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

// One range covering the whole set, when the set is a single run of two or
// more values. `from > to` when the run wraps around.
function rangeOf(runs: number[][]): RangeDescription | null {
  const [only] = runs;

  return runs.length === 1 && only.length > 1 ?
    {from: only[0], kind: 'range', to: only[only.length - 1]} :
    null;
}

// The evenly spaced cadence the values form, if they form one.
function cadenceOf(values: number[]): Cadence | null {
  const interval = values[1] - values[0];
  const even = values.length >= minProgression && interval > 1 &&
    values.every(function spaced(value, index) {
      return index === 0 || value - values[index - 1] === interval;
    });

  return even ?
    {interval, kind: 'cadence', last: values[values.length - 1],
      start: values[0]} :
    null;
}

// The set as several pieces: long runs as ranges, and the short runs
// between them gathered into lists.
function piecesOf(runs: number[][]): SetDescription | null {
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
      parts.push({from: run[0], kind: 'range', to: run[run.length - 1]});
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

// The cadences the values sit on with some positions unfilled: the one
// spanning the values themselves, then that one extended to the domain's
// bounds when it differs.
function cadenceBases(values: number[], domain: Domain): Cadence[] {
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
  const spanning: Cadence = {interval, kind: 'cadence', last, start};

  return lowest === start && highest === last ?
    [spanning] :
    [spanning, {interval, kind: 'cadence', last: highest, start: lowest}];
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
  domain: Domain
): SetDescription[] {
  const lastRun = runs[runs.length - 1];
  const bases: SetDescription[] = [
    {kind: 'all'},
    {from: runs[0][0], kind: 'range', to: lastRun[lastRun.length - 1]},
    ...cadenceBases(values, domain)
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

/**
 * Every compact description of a sorted, distinct set of field values, in a
 * fixed order (the order a tie between equally short phrasings is settled
 * in): the whole field, a range, a cadence, pieces, a base with exceptions,
 * and the values themselves.
 */
function describeSet(values: number[], domain: Domain): SetDescription[] {
  if (values.length === sizeOf(domain)) {
    return [{kind: 'all'}];
  }

  const runs = runsOf(values, domain);
  const range = rangeOf(runs);
  const candidates: Array<SetDescription | null> = [
    range,
    cadenceOf(values),
    range ? null : piecesOf(runs),
    ...exceptionsOf(values, runs, domain),
    {kind: 'values', values: values.slice()}
  ];

  return candidates.filter(function present(candidate) {
    return candidate !== null;
  }) as SetDescription[];
}

/** The sorted, distinct values a description stands for. */
function denote(description: SetDescription, domain: Domain): number[] {
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
      return integersBetween(
        description.start, description.last, description.interval);
    case 'pieces':
      return description.parts.flatMap(function partValues(part) {
        return denote(part, domain);
      }).sort(ascending);
    case 'except':
      return without(denote(description.base, domain), description.removed);
    default:
      return description.values.slice();
  }
}

export {denote, describeSet};
