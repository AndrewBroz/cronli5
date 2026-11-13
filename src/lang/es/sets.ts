// How a set of field values is said. The core offers every compact
// description of a set; Spanish says a set in one of three ways: as every
// value, as a cadence, or as pieces (runs and listed values), the first
// two with or without a few values excepted. Which one is decided by
// counts alone (answers, "How a form is chosen"), never by which values
// are named.

import type {
  Domain, RangeDescription, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {describeSet} from '../../core/describe-set.js';

type Cadence = Extract<SetDescription, {kind: 'cadence'}>;
type Exception = Extract<SetDescription, {kind: 'except'}>;

/** A run of three values or more, or values named one by one. */
export type Part = RangeDescription | ValuesDescription;

/**
 * A set as Spanish says it. Every value and a cadence carry their first
 * and last value and their interval; pieces carry their parts. `removed`
 * holds the values excepted from every value or from a cadence.
 */
export interface Said {
  kind: 'all' | 'cadence' | 'parts';
  interval: number;
  start: number;
  last: number;
  parts: Part[];
  removed: number[];
}

/** The judgments one field makes about its sets. */
export interface Policy {
  domain: Domain;
  // Whether a run may cross the end of the cycle into its start.
  wraps: boolean;
  // Whether two values that cross the end of the cycle keep that order.
  pairWraps: boolean;
  // A run shorter than this is listed.
  minRun: number;
  // Whether a cadence of so many values is said as one.
  cadence(cadence: Cadence, count: number): boolean;
  // What one excepted value counts for; 0 where the field takes none.
  holeCost: number;
}

// A list longer than this may be replaced by an exception.
const LONGEST_LIST = 7;

// What a run names: its two ends. A cadence names as many.
const ENDS = 2;

// A joined run across the end of the cycle is a run from this length.
const SHORTEST_WRAP = 3;

/** Whether a part is a run. */
function isRange(part: Part): part is RangeDescription {
  return part.kind === 'range';
}

/** Whether a part is values named one by one. */
function isValues(part: Part): part is ValuesDescription {
  return part.kind === 'values';
}

/** Each part answered by the function for its kind. */
function mapParts<T>(
  parts: Part[],
  onRange: (from: number, to: number) => T,
  onValues: (values: number[]) => T
): T[] {
  return parts.map(function answer(part) {
    return isRange(part) ?
      onRange(part.from, part.to) :
      onValues(part.values);
  });
}

/** The maximal runs of consecutive values, in ascending order. */
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

// The runs in the order they are said: ascending, unless the field wraps
// and a run crosses the end of the cycle, which then comes first. Two
// values that cross are not a run, except where the field keeps the pair
// in that order and they are the whole set.
function runsOf(values: number[], policy: Policy): number[][] {
  const runs = linearRuns(values);
  const first = runs[0];
  const last = runs[runs.length - 1];
  const long = first.length + last.length >= SHORTEST_WRAP ||
    policy.pairWraps && runs.length === ENDS;
  const crosses = policy.wraps && runs.length > 1 && long &&
    first[0] === policy.domain.min &&
    last[last.length - 1] === policy.domain.max;

  return crosses ? [[...last, ...first], ...runs.slice(1, -1)] : runs;
}

// The set as parts: each long run a range, and the short runs between
// them gathered into lists.
function partsOf(values: number[], policy: Policy): Part[] {
  const parts: Part[] = [];

  runsOf(values, policy).forEach(function place(run) {
    const previous = parts[parts.length - 1];

    if (run.length >= policy.minRun) {
      parts.push({from: run[0], kind: 'range', to: run[run.length - 1]});
    }
    else if (previous && isValues(previous)) {
      previous.values.push(...run);
    }
    else {
      parts.push({kind: 'values', values: run.slice()});
    }
  });

  return parts;
}

/** How many things parts name: two for a run, one for each listed value. */
function thingsNamed(parts: Part[]): number {
  return mapParts(parts, function ends() {
    return ENDS;
  }, function each(values) {
    return values.length;
  }).reduce(function sum(total, named) {
    return total + named;
  }, 0);
}

// Whether an exception is one Spanish says: taken from every value, or
// from a cadence whose ends both fire (a hole in the middle).
function sayable(exception: Exception, values: number[]): boolean {
  const {base} = exception;

  return base.kind === 'all' || base.kind === 'cadence' &&
    base.start === values[0] && base.last === values[values.length - 1];
}

// The exception that names fewer things than the parts would. A tie goes
// to the exception only against a run that wraps. At most one is ever
// sayable: an exception from every value keeps more than half the
// values, and a cadence holds at most half of them.
function exceptionOf(
  values: number[],
  offered: SetDescription[],
  parts: Part[],
  policy: Policy
): Exception | undefined {
  const wrapped = mapParts(parts, function backwards(from, to) {
    return from > to;
  }, function never() {
    return false;
  }).some(Boolean);
  const limit = thingsNamed(parts) + Number(wrapped);
  const allowed = policy.holeCost > 0 && values.length > LONGEST_LIST;

  return offered.filter(function isSayable(candidate): candidate is Exception {
    return allowed && candidate.kind === 'except' &&
      sayable(candidate, values);
  }).map(function priced(exception) {
    const named = {all: 0, cadence: ENDS}[exception.base.kind as 'all'];

    return {
      cost: named + exception.removed.length * policy.holeCost,
      exception
    };
  }).filter(function cheaper(priced) {
    return priced.cost < limit;
  }).map(function unpriced(priced) {
    return priced.exception;
  })[0];
}

/** How many values a cadence has. */
function countOf(cadence: {interval: number; start: number; last: number}):
  number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/** A sorted, distinct set of field values as Spanish says it. */
function say(values: number[], policy: Policy): Said {
  const {domain} = policy;
  const offered = describeSet(values, domain);
  const whole: Said = {
    interval: 1,
    kind: 'all',
    last: domain.max,
    parts: [],
    removed: [],
    start: domain.min
  };
  const cadence = offered.find(function isCadence(candidate) {
    return candidate.kind === 'cadence';
  }) as Cadence | undefined;

  if (offered[0].kind === 'all') {
    return whole;
  }

  if (cadence && policy.cadence(cadence, countOf(cadence))) {
    return {...whole, ...cadence};
  }

  const parts = partsOf(values, policy);
  const exception = exceptionOf(values, offered, parts, policy);

  return exception ?
    {...whole, ...exception.base as Cadence, removed: exception.removed} :
    {...whole, kind: 'parts', parts};
}

export {
  countOf, isRange, isValues, linearRuns, mapParts, say, thingsNamed
};
