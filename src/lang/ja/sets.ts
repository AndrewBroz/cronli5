// Choosing among the core's descriptions of a set of values, and laying a
// chosen description out as runs and stray values. No
// words are chosen here: each field says what it can say, and how much a
// reader has to hold for each way of saying it.

import type {
  CadencePieces, Domain, RangeDescription, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeCadencePieces, describeSet}
  from '../../core/describe-set.js';

/** A way of describing a set: one of the core's, or runs and cadences. */
export type Chosen = SetDescription | CadencePieces;

/** The kinds of description the core offers. */
export type Kind = Chosen['kind'];

/** The description of one kind. */
export type Described<K extends Kind> = Extract<Chosen, {kind: K}>;

/** An evenly spaced set. */
export type Cadence = Described<'cadence'>;

/** One piece of a set said in pieces: a run, or values that stand alone. */
export type Piece = RangeDescription | ValuesDescription;

/** One part of a set said as runs and cadences together. */
export type Part = Cadence | Piece;

/** A description that is not an exception: what one is taken from. */
export type Core = Exclude<Chosen, Described<'except'>>;

/** Such a description where runs and cadences together are not offered. */
export type Plain = Exclude<Core, CadencePieces>;

type Cases<D extends Chosen, R> = {
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
  // Whether a set may be said as runs and cadences together.
  mixed: boolean;
  // Whether a value may be named as left out; any may when this is absent.
  removable?: (value: number) => boolean;
  // The fewest values a run needs before it is said as a range.
  shortestRange: number;
}

/**
 * A set laid out along its field: runs with both ends and a step, and
 * values that stand alone.
 */
export interface Spread {
  runs: Run[];
  strays: number[];
}

/** A run: its first value, its last, and the step between its values. */
export type Run = [from: number, to: number, step: number];

/** Whether every run of a spread has the same step. */
function even(spread: Spread): boolean {
  return spread.runs.every((run) => run[2] === spread.runs[0][2]);
}

/**
 * Whether a spread, said aloud, ends in something joined on after its
 * first run: stray values, or a run with a step of its own. What is said
 * straight after such an end is read with that last piece alone.
 */
function trails(spread: Spread): boolean {
  return spread.runs.length > 0 && spread.strays.length > 0 || !even(spread);
}

/** A spread with every run at one step; as it stands when that is zero. */
function paced(spread: Spread, step: number): Spread {
  return step > 0 ?
    {...spread, runs: spread.runs.map(([from, to]): Run => [from, to, step])} :
    spread;
}

const empty: Spread = {runs: [], strays: []};

/** The answer a table gives for a description's kind. */
function match<D extends Chosen, R>(
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

function isList(part: Part): part is ValuesDescription {
  return part.kind === 'values';
}

// How many values a range has.
function lengthOf(range: RangeDescription, domain: Domain): number {
  return range.from <= range.to ?
    range.to - range.from + 1 :
    denote(range, domain).length;
}

function ascending(a: number, b: number): number {
  return a - b;
}

// How many things a description names: a range its two ends, a list each
// of its values, an exception its base and each value left out, and every
// value nothing.
function cost(description: Chosen, say: Say): number {
  function total(parts: Part[]): number {
    return parts.reduce((sum, part) => sum + cost(part, say), 0);
  }

  return match(description, {
    all: () => 0,
    cadence: say.cadence,
    cadencePieces: (pieces) => total(pieces.parts),
    except: (exception) => cost(exception.base, say) +
      exception.removed.length,
    pieces: (pieces) => total(pieces.parts),
    range: () => 2,
    values: (list) => list.values.length
  });
}

function sayable(description: SetDescription, say: Say): boolean {
  const removable = say.removable ?? (() => true);

  return match(description, {
    all: () => true,
    cadence: (cadence) => say.cadence(cadence) < Infinity,
    except: (exception) => say.exceptions &&
      exception.removed.every(removable) && sayable(exception.base, say),
    pieces: () => say.shortestRange < Infinity,
    range: (range) => lengthOf(range, say.domain) >= say.shortestRange,
    values: () => true
  });
}

// The description that names the fewest things; the earliest on a tie.
function cheapest(offered: SetDescription[], say: Say): SetDescription {
  return offered.slice(1).reduce(function fewer(best, next) {
    return cost(next, say) < cost(best, say) ? next : best;
  }, offered[0]);
}

/** A set as the core describes it, in every layout a choice looks at. */
export interface Offer {
  // How many values the set has.
  count: number;
  // Its descriptions as the field lays them out, where a run may wrap.
  described: SetDescription[];
  // Its descriptions with nothing wrapped.
  linear: SetDescription[];
  // The set as runs and cadences together, if it is that.
  mixed: () => CadencePieces | null;
}

/**
 * The description a set is said by, among those offered. A plain range is
 * always the range. An exception is said when it replaces more than four
 * values and names fewer things than any way that does not wrap; otherwise
 * the way that names the fewest things. Runs and cadences together are
 * said where the field can say them and they name fewer things still.
 */
function choose(offer: Offer, say: Say): Chosen {
  function able(descriptions: SetDescription[], excepted: boolean):
    SetDescription[] {
    return descriptions.filter((description) => sayable(description, say) &&
      description.kind === 'except' === excepted);
  }

  const exceptions = able(offer.described, true);
  const straight = able(offer.linear, false);
  const replaces = exceptions.length > 0 && offer.count > 4 &&
    straight[0].kind !== 'range' &&
    cost(cheapest(exceptions, say), say) < cost(cheapest(straight, say), say);
  const best = replaces ?
    cheapest(exceptions, say) :
    cheapest(able(offer.described, false), say);
  const mixed = say.mixed ? offer.mixed() : null;

  return mixed && cost(mixed, say) < cost(best, say) ? mixed : best;
}

/** The description a field says a set of its values by. */
function pick(values: number[], say: Say): Chosen {
  return choose({
    count: values.length,
    described: describeSet(values, say.domain),
    linear: describeSet(values, say.domain, {linear: true}),
    mixed: () => describeCadencePieces(values, say.domain)
  }, say);
}

/**
 * The description of a set where nothing may be left out: what would be
 * an exception is said as the runs that remain, in ascending order.
 */
function positive(values: number[], say: Say): Chosen {
  const chosen = pick(values, say);
  const plainly = {
    ...say,
    domain: {...say.domain, cyclic: false},
    exceptions: false
  };

  return chosen.kind === 'except' ? pick(values, plainly) : chosen;
}

// Where a part stands among the others: by its first value. A run that
// wraps starts after every other part, and so comes last.
function rank(part: Part): number {
  return match(part, {
    cadence: (cadence) => cadence.start,
    range: (range) => range.from,
    values: (list) => Math.min(...list.values)
  });
}

/**
 * The parts of a set said in pieces, in the order they are said: ascending
 * by first value, so that a run that wraps is last.
 */
function inOrder<P extends Part>(parts: P[]): P[] {
  return parts.map(function tidy(part): P {
    return {...part, ...isList(part) && {
      values: part.values.slice().sort(ascending)
    }};
  }).sort((a, b) => rank(a) - rank(b));
}

function runsInOrder(runs: Run[]): Run[] {
  return runs.slice().sort((a, b) => a[0] - b[0]);
}

/**
 * A description laid out. A cadence of no more than `listed` values is
 * its values; a longer one is a run with a step. Runs and cadences
 * together are each laid out so, the runs in order and the values that
 * stand alone after them.
 */
function spreadOf(description: Core, domain: Domain, listed: number): Spread {
  function together(parts: Part[]): Spread {
    const spreads = parts.map((part) => spreadOf(part, domain, listed));

    return {
      runs: runsInOrder(spreads.flatMap((spread) => spread.runs)),
      strays: spreads.flatMap((spread) => spread.strays).sort(ascending)
    };
  }

  return match<Core, Spread>(description, {
    all: () => ({...empty, runs: [[domain.min, domain.max, 1]]}),
    cadence(cadence) {
      return stepsOf(cadence) > listed ?
        {...empty,
          runs: [[cadence.start, cadence.last, cadence.interval]]} :
        {...empty, strays: denote(cadence, domain)};
    },
    cadencePieces: (pieces) => together(pieces.parts),
    pieces: (pieces) => together(pieces.parts),
    range: (range) => ({...empty, runs: [[range.from, range.to, 1]]}),
    values: (list) => ({...empty, strays: list.values})
  });
}

// Runs in order, with a run that starts where the one before it stops,
// at the same step, taken into it.
function joinedRuns(runs: Run[]): Run[] {
  return runsInOrder(runs).reduce<Run[]>(
    function join(joined, run) {
      const before = joined[joined.length - 1];

      return before && run[0] === before[1] + 1 && run[2] === before[2] ?
        [...joined.slice(0, -1), [before[0], run[1], run[2]]] :
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
    (value): Run => [value, value, 1]);

  return {
    ...spread,
    runs: joinedRuns([...spread.runs, ...filled]).map(
      ([from, to, step]) => [from * size + lo, to * size + hi, step]),
    strays: spread.strays.filter(() => !whole).map(
      (value) => value * size + lo)
  };
}

/** Several spreads of the same step, each moved along by an offset. */
function gather(spread: Spread, offsets: number[]): Spread {
  return {
    ...spread,
    runs: offsets.flatMap((offset) => spread.runs.map(
      ([from, to, step]): Run => [from + offset, to + offset, step])),
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
  choose, cost, even, gather, inOrder, lift, match, paced, pick, positive,
  spreadOf, stepsOf, tiling, trails, wraps
};
