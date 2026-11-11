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

// An exception needs at least this many values kept: one or two values are
// only ever named.
const minKeptForException = 3;

// A cadence, and a run worth calling a range inside several pieces, need
// at least this many values.
const minProgression = 3;

function integersBetween(from: number, to: number, step = 1): number[] {
  const values: number[] = [];

  for (let value = from; value <= to; value += step) {
    values.push(value);
  }

  return values;
}

function without(values: number[], removed: number[]): number[] {
  return values.filter(function kept(value) {
    return !removed.includes(value);
  });
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

// The maximal runs of consecutive values, in order.
function runsOf(values: number[]): number[][] {
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

// One range covering the whole set: a plain run, or in a cyclic field a
// run that leaves the top of the domain and resumes at the bottom.
function rangeOf(runs: number[][], domain: Domain): RangeDescription | null {
  const [first] = runs;
  const last = runs[runs.length - 1];

  if (runs.length === 1) {
    return first.length > 1 ?
      {from: first[0], kind: 'range', to: first[first.length - 1]} :
      null;
  }

  const wraps = runs.length === 2 && domain.cyclic &&
    first[0] === domain.min && last[last.length - 1] === domain.max;

  return wraps ?
    {from: last[0], kind: 'range', to: first[first.length - 1]} :
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

// A simpler base with a few values removed, for each base that contains
// the set and loses fewer values than it keeps.
function exceptionsOf(values: number[], domain: Domain): SetDescription[] {
  if (values.length < minKeptForException) {
    return [];
  }

  const first = values[0];
  const last = values[values.length - 1];
  const coversDomain = first === domain.min && last === domain.max;
  const bases: SetDescription[] = [
    {kind: 'all'},
    ...coversDomain ? [] : [{from: first, kind: 'range' as const, to: last}],
    ...cadenceBases(values, domain)
  ];
  const found: SetDescription[] = [];

  bases.forEach(function tryBase(base) {
    const removed = without(denote(base, domain), values);

    if (removed.length > 0 && removed.length < values.length) {
      found.push({base, kind: 'except', removed});
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
  if (values.length === domain.max - domain.min + 1) {
    return [{kind: 'all'}];
  }

  const runs = runsOf(values);
  const range = rangeOf(runs, domain);
  const candidates: Array<SetDescription | null> = [
    range,
    cadenceOf(values),
    range ? null : piecesOf(runs),
    ...exceptionsOf(values, domain),
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
      });
    case 'except':
      return without(denote(description.base, domain), description.removed);
    default:
      return description.values.slice();
  }
}

export {denote, describeSet};
