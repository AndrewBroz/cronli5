// Choosing among the core's descriptions of a set of values, and laying a
// chosen description out as runs and stray values. No
// words are chosen here: each field says what it can say, and how much a
// reader has to hold for each way of saying it.

import type {
  Domain, RangeDescription, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';

/** The kinds of description the core offers. */
export type Kind = SetDescription['kind'];

/** The description of one kind. */
export type Described<K extends Kind> = Extract<SetDescription, {kind: K}>;

/** An evenly spaced set. */
export type Cadence = Described<'cadence'>;

/** One piece of a set said in pieces. */
export type Part = RangeDescription | ValuesDescription;

/** A description that is not an exception: what one is taken from. */
export type Core = Exclude<SetDescription, Described<'except'>>;

type Cases<D extends SetDescription, R> = {
  [K in D['kind']]: (description: Extract<D, {kind: K}>) => R
};

/** What a field can say, and what each way of saying it costs a reader. */
export interface Say {
  // How many things a cadence names; Infinity when it has no phrase.
  cadence: (cadence: Cadence) => number;
  // The values the field can take; a cyclic one may wrap round its end.
  domain: Domain;
  // Whether a set may be said as a simpler one with values left out.
  exceptions: boolean;
  // The fewest values a run needs before it is said as a range.
  shortestRange: number;
}

/**
 * A set laid out along its field: runs with both ends and a step, and
 * values that stand alone.
 */
export interface Spread {
  runs: Array<[number, number]>;
  step: number;
  strays: number[];
}

const empty: Spread = {runs: [], step: 1, strays: []};

// Further than any field reaches: puts a run that wraps before the rest.
const beyond = 1e6;

/** The answer a table gives for a description's kind. */
function match<D extends SetDescription, R>(
  description: D,
  cases: Cases<D, R>
): R {
  const kind: D['kind'] = description.kind;
  const answer = cases[kind] as (given: D) => R;

  return answer(description);
}

/** How many values a cadence has. */
function stepsOf(cadence: Cadence): number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/** Whether a description is a range that runs past the end of its field. */
function wraps(description: SetDescription): boolean {
  return description.kind === 'range' && description.from > description.to;
}

function isRange(part: Part): part is RangeDescription {
  return part.kind === 'range';
}

function isList(part: Part): part is ValuesDescription {
  return part.kind === 'values';
}

function ascending(a: number, b: number): number {
  return a - b;
}

// How many things a description names: a range its two ends, a list each
// of its values, an exception its base and each value left out, and every
// value nothing.
function cost(description: SetDescription, say: Say): number {
  return match(description, {
    all: () => 0,
    cadence: say.cadence,
    except: (exception) => cost(exception.base, say) +
      exception.removed.length,
    pieces: (pieces) => pieces.parts.reduce(
      (sum, part) => sum + cost(part, say), 0),
    range: () => 2,
    values: (list) => list.values.length
  });
}

function sayable(description: SetDescription, say: Say): boolean {
  return match(description, {
    all: () => true,
    cadence: (cadence) => say.cadence(cadence) < Infinity,
    except: (exception) => say.exceptions && sayable(exception.base, say),
    pieces: () => say.shortestRange < Infinity,
    range: (range) =>
      denote(range, say.domain).length >= say.shortestRange,
    values: () => true
  });
}

// The description that names the fewest things; the earliest on a tie.
function cheapest(offered: SetDescription[], say: Say): SetDescription {
  return offered.slice(1).reduce(function fewer(best, next) {
    return cost(next, say) < cost(best, say) ? next : best;
  }, offered[0]);
}

/**
 * The description a field says its values by. A plain range is always the
 * range. An exception is said when it replaces more than four values and
 * names fewer things than any other way, a range that wraps aside;
 * otherwise the way that names the fewest things.
 */
function pick(values: number[], say: Say): SetDescription {
  const offered = describeSet(values, say.domain).filter(
    (description) => sayable(description, say));
  const plain = offered.filter(
    (description) => description.kind !== 'except');
  const straight = plain.filter((description) => !wraps(description));
  const exceptions = offered.filter(
    (description) => description.kind === 'except');
  const replaces = exceptions.length > 0 && values.length > 4 &&
    straight[0].kind !== 'range' &&
    cost(cheapest(exceptions, say), say) < cost(cheapest(straight, say), say);

  return replaces ? cheapest(exceptions, say) : cheapest(plain, say);
}

/**
 * The description of a set where nothing may be left out: what would be
 * an exception is said as the runs that remain, in ascending order.
 */
function positive(values: number[], say: Say): SetDescription {
  const chosen = pick(values, say);
  const plainly = {
    ...say,
    domain: {...say.domain, cyclic: false},
    exceptions: false
  };

  return chosen.kind === 'except' ? pick(values, plainly) : chosen;
}

// Where a part stands among the others: by its first value, a run that
// wraps before all.
function rank(part: Part): number {
  const first = (part as Partial<RangeDescription>).from ??
    Math.min(...(part as ValuesDescription).values);

  return first - Number(wraps(part)) * beyond;
}

/**
 * The parts of a set said in pieces, in the order they are said: ascending
 * by first value, a run that wraps first.
 */
function inOrder(parts: Part[]): Part[] {
  return parts.map(function tidy(part): Part {
    return {...part, ...isList(part) && {
      values: part.values.slice().sort(ascending)
    }};
  }).sort((a, b) => rank(a) - rank(b));
}

function runsInOrder(runs: Array<[number, number]>): Array<[number, number]> {
  return runs.slice().sort(function byStart(a, b) {
    return a[0] - Number(a[0] > a[1]) * beyond -
      (b[0] - Number(b[0] > b[1]) * beyond);
  });
}

/**
 * A description laid out. A cadence of no more than `listed` values is
 * its values; a longer one is a run with a step.
 */
function spreadOf(description: Core, domain: Domain, listed: number): Spread {
  return match<Core, Spread>(description, {
    all: () => ({...empty, runs: [[domain.min, domain.max]]}),
    cadence(cadence) {
      return stepsOf(cadence) > listed ?
        {...empty, runs: [[cadence.start, cadence.last]],
          step: cadence.interval} :
        {...empty, strays: denote(cadence, domain)};
    },
    pieces: (pieces) => ({
      ...empty,
      runs: runsInOrder(pieces.parts.filter(isRange).map(
        (range): [number, number] => [range.from, range.to])),
      strays: pieces.parts.filter(isList).flatMap((list) => list.values)
        .sort(ascending)
    }),
    range: (range) => ({...empty, runs: [[range.from, range.to]]}),
    values: (list) => ({...empty, strays: list.values})
  });
}

// Runs in order, with a run that starts where the one before it stops
// taken into it.
function joinedRuns(runs: Array<[number, number]>): Array<[number, number]> {
  return runsInOrder(runs).reduce<Array<[number, number]>>(
    function join(joined, run) {
      const before = joined[joined.length - 1];

      return before && run[0] === before[1] + 1 ?
        [...joined.slice(0, -1), [before[0], run[1]]] :
        [...joined, run];
    }, []);
}

/**
 * A spread carried into a finer unit: each value becomes `size` of them,
 * a run reaching from the first edge of its first value to the second
 * edge of its last. With `whole`, a stray value becomes a run of its own,
 * or part of the run beside it.
 */
function lift(
  spread: Spread,
  size: number,
  edges: [number, number],
  whole: boolean
): Spread {
  const [lo, hi] = edges;
  const filled = spread.strays.filter(() => whole).map(
    (value): [number, number] => [value, value]);

  return {
    ...spread,
    runs: joinedRuns([...spread.runs, ...filled]).map(
      ([from, to]) => [from * size + lo, to * size + hi]),
    strays: spread.strays.filter(() => !whole).map(
      (value) => value * size + lo)
  };
}

/** Several spreads of the same step, each moved along by an offset. */
function gather(spread: Spread, offsets: number[]): Spread {
  return {
    ...spread,
    runs: offsets.flatMap((offset) => spread.runs.map(
      ([from, to]): [number, number] => [from + offset, to + offset])),
    strays: offsets.flatMap(
      (offset) => spread.strays.map((value) => value + offset))
  };
}

/**
 * The interval a set tiles its cycle by, starting from the first value of
 * the cycle: 15 for minutes 0, 15, 30 and 45, 1 for every value. Zero when
 * it does not tile; one value alone is no cadence.
 */
function tiling(values: number[], size: number): number {
  const interval = size / values.length;
  const tiles = values.length > 1 &&
    values.every((value, index) => value === index * interval);

  return Number(tiles) * interval;
}

export {
  cost, gather, inOrder, lift, match, pick, positive, spreadOf, stepsOf, tiling,
  wraps
};
