// Choosing among the core's descriptions of a set of values, in the order
// the answers give, and walking a description in the order it is said.

import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';

/** One kind of description. */
export type Describing<K extends SetDescription['kind']> =
  Extract<SetDescription, {kind: K}>;

/** A description that is no base with exceptions. */
export type Plain = Exclude<SetDescription, {kind: 'except'}>;

/** A piece of a set: a run, or values named one by one. */
export type Part = RangeDescription | ValuesDescription;

/** A part of runs and cadences said together. */
export type Stepped = CadenceDescription | Part;

/** Anything a field may be said as. */
export type Said = SetDescription | CadencePieces;

interface Tagged {
  kind: string;
}

/** What to do with each kind of a tagged thing. */
export type Table<D extends Tagged, R, A extends unknown[] = []> = {
  [K in D['kind']]: (tagged: Extract<D, {kind: K}>, ...rest: A) => R
};

/** What a field can say, beyond what every field can. */
export interface Taste {
  // Whether a set with values missing may be said as this base «крім».
  base(base: SetDescription): boolean;
  // Whether a regular set of so many values is said as a cadence.
  cadence(cadence: Describing<'cadence'>, count: number): boolean;
  // Whether leaving out so many values is said before a run that wraps
  // round the cycle; any number, where a field does not say.
  gap?(count: number): boolean;
  // Whether a set of so many values may be said in pieces.
  pieces(count: number): boolean;
}

/** The table's entry for a tagged thing's kind, applied to it. */
function say<D extends Tagged, R, A extends unknown[]>(
  table: Table<D, R, A>,
  tagged: D,
  ...rest: A
): R {
  const entry = table[tagged.kind as D['kind']] as unknown as
    (tagged: D, ...rest: A) => R;

  return entry(tagged, ...rest);
}

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

// How many values a run has, round the cycle if it wraps.
function lengthOf(range: RangeDescription, domain: Domain): number {
  const size = sizeOf(domain);

  return ((range.to - range.from) % size + size) % size + 1;
}

// How many things a description names: a run or a cadence its two ends,
// a list each value, a base with exceptions its own and each one left out.
const naming: Table<SetDescription, number> = {
  all: () => 0,
  cadence: () => 2,
  except: (except) => thingsNamed(except.base) + except.removed.length,
  pieces: (parts) => parts.parts.reduce(function sum(total, part) {
    return total + thingsNamed(part);
  }, 0),
  range: () => 2,
  values: (listed) => listed.values.length
};

function thingsNamed(description: SetDescription): number {
  return say(naming, description);
}

// What a choice is measured against: how many values the set has, and
// how many things its pieces would name.
interface Measure {
  count: number;
  domain: Domain;
  pieces: number;
  // Whether the set is one run that wraps round the cycle.
  wrapping: boolean;
}

// A run of two is never a range, and an exception is worth its
// subtraction only above four values and where it names fewer things
// than the pieces would. Beside a run that wraps, the field says how
// many values may be left out.
const sayable: Table<SetDescription, boolean, [Measure, Taste]> = {
  all: () => true,
  cadence: (cadence, measure, taste) => taste.cadence(cadence, measure.count),
  except: (except, measure, taste) => measure.count > 4 &&
    thingsNamed(except) < measure.pieces && taste.base(except.base) &&
    (!measure.wrapping || !taste.gap || taste.gap(except.removed.length)),
  pieces: (parts, measure, taste) => taste.pieces(measure.count),
  range: (range, measure) => lengthOf(range, measure.domain) >= 3,
  values: () => true
};

// The order of choice. A run that wraps round the cycle is said only
// where no base with exceptions is.
const ranks: {[kind in SetDescription['kind']]: number} =
  {all: 0, cadence: 2, except: 3, pieces: 5, range: 1, values: 6};

function rank(description: SetDescription): number {
  return ranks[description.kind] +
    3 * Number(description.kind === 'range' && wraps(description));
}

function isPieces(
  description: SetDescription
): description is Describing<'pieces'> {
  return description.kind === 'pieces';
}

// The same pieces in the order they are said: ascending, and from the
// run that wraps round the cycle where one does, which is the set walked
// from that run's first value; with no such run nothing wraps.
function inOrder(
  found: Describing<'pieces'>,
  domain: Domain
): SetDescription[] {
  const wrapped = found.parts.find(wraps) as RangeDescription | undefined;

  return describeSet(denote(found, domain), domain,
    wrapped ? {first: wrapped.from} : {linear: true}).filter(isPieces);
}

// The longest list a reader is given before runs and cadences together
// are said in its place.
const LONGEST_LIST = 7;

/**
 * The description a field says, among the core's candidates, by the
 * order of choice. Runs and cadences together, where the core offers
 * them, are said in place of a longer list that names more things.
 */
function choose<D extends Said = SetDescription>(
  candidates: SetDescription[],
  domain: Domain,
  taste: Taste,
  stepped: CadencePieces | null = null
): D {
  const offered = candidates.flatMap(function ordered(candidate) {
    return isPieces(candidate) ? inOrder(candidate, domain) : [candidate];
  });
  const count = denote(candidates[0], domain).length;
  const rival = stepped && count > LONGEST_LIST ?
    stepped.parts.reduce(function sum(total, part) {
      return total + thingsNamed(part);
    }, 0) :
    Infinity;
  const measure = {
    count,
    domain,
    pieces: Math.min(rival, ...offered.filter(isPieces).map(thingsNamed)),
    wrapping: candidates[0].kind === 'range' && wraps(candidates[0])
  };
  const [best] = offered.filter(function canSay(candidate) {
    return say(sayable, candidate, measure, taste);
  }).sort(function byRank(a, b) {
    return rank(a) - rank(b);
  });

  return (rival < thingsNamed(best) ? stepped : best) as D;
}

const walks: Table<Said, number[], [Domain]> = {
  all: denote,
  cadence: denote,
  cadencePieces: denote,
  except: (except, domain) =>
    walk(except.base, domain).filter(function kept(value) {
      return !except.removed.includes(value);
    }),
  pieces: (parts, domain) => parts.parts.flatMap(function each(part) {
    return walk(part, domain);
  }),
  range: (range, domain) =>
    Array.from({length: lengthOf(range, domain)}, function nth(_, index) {
      return (range.from - domain.min + index) % sizeOf(domain) + domain.min;
    }),
  values: (named) => named.values
};

/** The values of a description in the order they are said. */
function walk(description: Said, domain: Domain): number[] {
  return say(walks, description, domain);
}

/** The unbroken runs among values, in the order given. */
function runsOf(values: number[], domain: Domain): number[][] {
  const runs: number[][] = [];

  values.forEach(function place(value, index) {
    const next = (values[index - 1] - domain.min + 1) % sizeOf(domain) +
      domain.min;

    if (value === next) {
      runs[runs.length - 1].push(value);
    }
    else {
      runs.push([value]);
    }
  });

  return runs;
}

function ends(cadence: CadenceDescription): Part[] {
  return [{from: cadence.start, kind: 'range', to: cadence.last}];
}

const parting: Table<Plain | CadencePieces, Part[], [Domain]> = {
  all: (all, domain) => [{from: domain.min, kind: 'range', to: domain.max}],
  cadence: ends,
  cadencePieces: (parts, domain) => parts.parts.flatMap(function each(part) {
    return partsOf(part, domain);
  }),
  pieces: (parts) => parts.parts,
  range: (range) => [range],
  values: (named) => [named]
};

/** A description as the stretches and the single values it is said in. */
function partsOf(description: Plain | CadencePieces, domain: Domain): Part[] {
  return say(parting, description, domain);
}

const wrapping: Table<Said, boolean> = {
  all: () => false,
  cadence: () => false,
  cadencePieces: () => false,
  except: (except) => wraps(except.base),
  pieces: (parts) => parts.parts.some(wraps),
  range: (range) => range.from > range.to,
  values: () => false
};

/** Whether a description is said with a run that wraps round its cycle. */
function wraps(description: Said): boolean {
  return say(wrapping, description);
}

export {choose, partsOf, runsOf, say, walk, wraps};
