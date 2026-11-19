// How a set of field values is said. The core offers every compact
// description of a set; Spanish says a set in one of three ways: as every
// value, as a cadence, or as pieces (runs, cadences between two ends and
// listed values), the first two with or without a few values excepted.
// Which one is decided by counts alone (answers, "How a form is chosen"),
// never by which values are named.

import type {
  CadenceDescription, Domain, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {
  denote, describeCadencePieces, describeSet
} from '../../core/describe-set.js';

type Cadence = CadenceDescription;
type Exception = Extract<SetDescription, {kind: 'except'}>;

/**
 * A stretch of values from one end to another: every one of them, or
 * every `interval`-th. `endless` marks one that reaches the end of a
 * field that does not cycle, and `unbegun` one that starts where such a
 * field starts: that end is not worth naming.
 */
export interface Run {
  kind: 'range';
  from: number;
  to: number;
  interval: number;
  endless: boolean;
  unbegun: boolean;
}

/** A run, or values named one by one. */
export type Part = Run | ValuesDescription;

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
  // Whether a cadence goes on to the end of a field that does not cycle.
  endless: boolean;
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
  // Whether a value missing at the very start or end of the cycle may be
  // said as an exception from every value. Where a window of clock times
  // would name that moment, it may not.
  edgeHoles: boolean;
  // How many of its first values a cadence names when it is said; none
  // of them can be excepted.
  shown: number;
  // Whether runs and cadences may be said together as pieces.
  mixes: boolean;
}

// A list longer than this may be replaced by an exception.
const LONGEST_LIST = 7;

// What a run names: its two ends. A cadence names as many.
const ENDS = 2;

// A joined run across the end of the cycle is a run from this length.
const SHORTEST_WRAP = 3;

/** A run of every value from one end to the other, both worth naming. */
function runOf(from: number, to: number, more: Partial<Run> = {}): Run {
  return {
    endless: false, from, interval: 1, kind: 'range', to, unbegun: false,
    ...more
  };
}

/** Whether a part is a run. */
function isRange(part: Part): part is Run {
  return part.kind === 'range';
}

/** Whether a part is a cadence between two ends. */
function isStepped(part: Part): boolean {
  return isRange(part) && part.interval > 1;
}

/** Whether a part is values named one by one. */
function isValues(part: Part): part is ValuesDescription {
  return part.kind === 'values';
}

/** Each part answered by the function for its kind. */
function mapParts<T>(
  parts: Part[],
  onRange: (from: number, to: number, run: Run) => T,
  onValues: (values: number[]) => T
): T[] {
  return parts.map(function answer(part) {
    return isRange(part) ?
      onRange(part.from, part.to, part) :
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

// Whether the core marks a description as running to the end of a field
// that does not cycle.
function isEndless(offered: SetDescription[]): boolean {
  return offered.some(function open(candidate) {
    const runs = candidate.kind === 'pieces' ? candidate.parts : [candidate];

    return runs.some(function marked(run) {
      return run.kind === 'range' && run.open === true;
    });
  });
}

// Parts with their neighbouring lists gathered into one.
function gathered(parts: Part[]): Part[] {
  const found: Part[] = [];

  parts.forEach(function place(part) {
    const previous = found[found.length - 1];

    if (isValues(part) && previous && isValues(previous)) {
      previous.values.push(...part.values);
      previous.values.sort(function ascending(a, b) {
        return a - b;
      });
    }
    else {
      found.push(isValues(part) ?
        {kind: 'values', values: part.values.slice()} :
        part);
    }
  });

  return found;
}

// The set as parts: each long run a range, and the short runs between
// them gathered into lists. In a field that does not cycle, a run from
// its first value has no start worth naming and a run the core marks as
// open has no end.
function partsOf(values: number[], offered: SetDescription[], policy: Policy):
  Part[] {
  const {domain} = policy;
  const runs = runsOf(values, policy);
  const endless = isEndless(offered);

  return gathered(runs.map(function place(run, index): Part {
    return run.length >= policy.minRun ?
      runOf(run[0], run[run.length - 1], {
        endless: endless && index === runs.length - 1,
        unbegun: !domain.cyclic && run[0] === domain.min
      }) :
      {kind: 'values', values: run};
  }));
}

/** How many values a cadence has. */
function countOf(cadence: {interval: number; start: number; last: number}):
  number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

// The set as the core finds it in runs and cadences together: a cadence
// the field would say as one keeps its two ends, and any shorter one is
// listed with the other loose values.
function coreMixed(values: number[], policy: Policy): Part[] {
  const found = describeCadencePieces(values, policy.domain);

  return (found ? found.parts : []).map(function place(part): Part {
    if (part.kind === 'cadence') {
      return policy.cadence(part, countOf(part)) ?
        runOf(part.start, part.last,
          {endless: part.open === true, interval: part.interval}) :
        {kind: 'values', values: denote(part, policy.domain)};
    }

    // A run the core offers here has three values or more.
    return part.kind === 'range' ?
      runOf(part.from, part.to, {endless: part.open === true}) :
      part;
  });
}

// One cadence with holes in it, as the stretches of the cadence between
// the holes: «los días impares del 1 al 13 y del 17 al 31». A stretch of
// fewer than three values is listed.
function cadenceStretches(offered: SetDescription[], policy: Policy): Part[] {
  const holed = offered.find(function onCadence(candidate) {
    return candidate.kind === 'except' && candidate.base.kind === 'cadence';
  }) as Exception | undefined;
  const base = (holed ? holed.base : {interval: 1}) as Cadence;
  const removed = new Set(holed ? holed.removed : []);
  const stretches: number[][] = [[]];

  (holed ? denote(base, policy.domain) : []).forEach(function place(value) {
    if (removed.has(value)) {
      stretches.push([]);
    }
    else {
      stretches[stretches.length - 1].push(value);
    }
  });

  return stretches.filter(function some(stretch) {
    return stretch.length > 0;
  }).map(function asPart(stretch, index, kept): Part {
    const last = stretch[stretch.length - 1];

    return stretch.length >= SHORTEST_WRAP ?
      runOf(stretch[0], last, {
        endless: base.open === true && index === kept.length - 1,
        interval: base.interval
      }) :
      {kind: 'values', values: stretch};
  });
}

// Whether each run begins after the run before it ends. A reader cannot
// hold two cadences that run through each other inside a cycle; only the
// years, which have no end, are said that way. A listed value may fall
// anywhere.
function inOrder(parts: Part[], policy: Policy): boolean {
  const runs = parts.filter(isRange);

  return !policy.domain.cyclic || runs.every(function after(run, index) {
    return index === 0 || run.from > runs[index - 1].to;
  });
}

// The set as runs and cadences together, in the way that names the
// fewest things, and on a tie as one cadence in its stretches; nothing
// where the field does not say sets so, or no cadence between two ends
// is left among the parts.
function mixedOf(values: number[], offered: SetDescription[], policy: Policy):
  Part[] {
  const ways = policy.mixes ?
    [cadenceStretches(offered, policy), coreMixed(values, policy)] :
    [];

  return ways.map(gathered).filter(function usable(parts) {
    return parts.some(isStepped) && inOrder(parts, policy);
  }).sort(function fewest(a, b) {
    return thingsNamed(a) - thingsNamed(b);
  })[0] ?? [];
}

/**
 * How many things parts name: two for a run, one for a run with an end
 * not worth naming, one for each listed value.
 */
function thingsNamed(parts: Part[]): number {
  return mapParts(parts, function ends(from, to, run) {
    return ENDS - Number(run.endless || run.unbegun);
  }, function each(values) {
    return values.length;
  }).reduce(function sum(total, named) {
    return total + named;
  }, 0);
}

// Whether an exception is one Spanish says. Taken from every value, the
// hole may be at an end of the cycle only where the field allows it.
// Taken from a cadence, both ends of the cadence fire and so does every
// value the cadence shows when it is said.
function sayable(exception: Exception, values: number[], policy: Policy):
  boolean {
  const {base, removed} = exception;
  const {domain} = policy;

  if (base.kind === 'all') {
    return policy.edgeHoles ||
      !removed.includes(domain.min) && !removed.includes(domain.max);
  }

  return base.kind === 'cadence' &&
    base.start === values[0] && base.last === values[values.length - 1] &&
    removed[0] >= base.start + policy.shown * base.interval;
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
): {cost: number; exception: Exception} | undefined {
  const wrapped = mapParts(parts, function backwards(from, to) {
    return from > to;
  }, function never() {
    return false;
  }).some(Boolean);
  const limit = thingsNamed(parts) + Number(wrapped);
  const allowed = policy.holeCost > 0 && values.length > LONGEST_LIST;

  return offered.filter(function isSayable(candidate): candidate is Exception {
    return allowed && candidate.kind === 'except' &&
      sayable(candidate, values, policy);
  }).map(function priced(exception) {
    const named = {all: 0, cadence: ENDS}[exception.base.kind as 'all'];

    return {
      cost: named + exception.removed.length * policy.holeCost,
      exception
    };
  }).filter(function cheaper(priced) {
    return priced.cost < limit;
  })[0];
}

// The pieces a set is said as when it is neither every value nor one
// cadence: runs and cadences together where that names fewer things than
// runs and listed values do, and replaces a list longer than seven.
function piecesOf(
  values: number[],
  offered: SetDescription[],
  parts: Part[],
  policy: Policy
): Part[] {
  const mixed = mixedOf(values, offered, policy);
  const fewer = mixed.length > 0 && values.length > LONGEST_LIST &&
    thingsNamed(mixed) < thingsNamed(parts);

  return fewer ? mixed : parts;
}

/** A sorted, distinct set of field values as Spanish says it. */
function say(values: number[], policy: Policy): Said {
  const {domain} = policy;
  const offered = describeSet(values, domain);
  const whole: Said = {
    endless: false,
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
    return {...whole, ...cadence, endless: cadence.open === true};
  }

  const parts = partsOf(values, offered, policy);
  const pieces = piecesOf(values, offered, parts, policy);
  const priced = exceptionOf(values, offered, parts, policy);

  // An exception names one simpler set, so it wins a tie with pieces
  // that mix runs and cadences.
  return priced && priced.cost <= thingsNamed(pieces) ?
    {
      ...whole,
      ...priced.exception.base as Cadence,
      endless: (priced.exception.base as Cadence).open === true,
      removed: priced.exception.removed
    } :
    {...whole, kind: 'parts', parts: pieces};
}

export {
  countOf, isRange, isStepped, isValues, linearRuns, mapParts, runOf, say,
  thingsNamed
};
