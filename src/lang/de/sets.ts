// Choosing how a set of values is said. The core offers every compact
// description of a set; a field counts the things each one names and the
// fewest wins, under the limits the answers give for that field.

import type {CadencePieces, SetDescription} from '../../core/schedule.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** A set description of one kind. */
export type Described<Kind extends SetDescription['kind']> =
  Extract<SetDescription, {kind: Kind}>;

/** Anything a set is said as: a description, or runs and cadences. */
export type Sayable = CadencePieces | SetDescription;

/** A part of a set said in pieces: a run, or values on their own. */
export type Piece = Described<'pieces'>['parts'][number];

/** How a field counts what a description names. */
export interface Counting {
  // The things a cadence of so many values names; infinite where the
  // field has no way to say it.
  cadence(cadence: Described<'cadence'>, count: number): number;
  // Pieces replace a list only when it has more values than this.
  listed: number;
  // Where a value stands in the cycle as the field's readers walk it, if
  // not at its own number: a run wraps when it ends before it starts.
  place?(value: number): number;
  // The most values an exception may take away from every value.
  removable: number;
}

// A run names its two ends.
const runEnds = 2;

// What a cadence said with both its ends, or as a series, names.
const boundedCadence = 3;

/** Items joined as German lists them: commas, then «und» or what is given. */
function list(items: string[], last: string = words.and): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${last} `);
}

/** The parts that are there, with single spaces between them. */
function join(parts: Array<string | false>): string {
  return parts.filter(Boolean).join(' ');
}

/** The first and last value of each unbroken run, in ascending order. */
function runsOf(values: number[]): number[][] {
  const runs: number[][] = [];

  values.forEach(function place(value) {
    const current = runs[runs.length - 1];

    if (current && value === current[1] + 1) {
      current[1] = value;
    }
    else {
      runs.push([value, value]);
    }
  });

  return runs;
}

/** The set a description rests on, and the values taken away from it. */
function restOf(description: Sayable): {base: Sayable; removed: number[]} {
  const {base = description, removed = []} =
    description as Partial<Described<'except'>>;

  return {base, removed};
}

function asItIs(value: number): number {
  return value;
}

/**
 * A cadence said with its ends, where it has more values than a list of
 * them can hold.
 */
function longerThan(limit: number): Counting['cadence'] {
  return function count(_cadence, values) {
    return values > limit ? boundedCadence : Infinity;
  };
}

/** A field that has no cadence: its values are named. */
function unsayable(): number {
  return Infinity;
}

// What a part of runs and cadences together names: a run its ends,
// values themselves, and a cadence its ends and its step, or its values
// where they are few enough to be said in full.
const partNamed = {
  cadence(cadence: Described<'cadence'>): number {
    const steps = (cadence.last - cadence.start) / cadence.interval + 1;

    return steps > boundedCadence + 1 ? boundedCadence : steps;
  },
  range(): number {
    return runEnds;
  },
  values(values: Described<'values'>): number {
    return values.values.length;
  }
};

const naming: {
  [Kind in Sayable['kind']]: (
    description: Extract<Sayable, {kind: Kind}>,
    count: number,
    counting: Counting
  ) => number
} = {
  all() {
    return 0;
  },
  cadence(cadence, _count, counting) {
    return counting.cadence(
      cadence, (cadence.last - cadence.start) / cadence.interval + 1);
  },
  // Runs and cadences together replace a list as pieces do.
  cadencePieces(pieces, count, counting) {
    return count > counting.listed ?
      pieces.parts.reduce(function sum(total, part) {
        return total + partNamed[part.kind](part as never);
      }, 0) :
      Infinity;
  },
  // Only every value and a cadence are bases an exception is said from,
  // and a cadence that is only missing its first or last values is said
  // with its ends.
  except(exception, count, counting) {
    const {base, removed} = exception;
    const {last, start} = base as Partial<Described<'cadence'>>;

    return base.kind === 'all' && removed.length > counting.removable ||
      base.kind === 'range' ||
      removed.includes(start as number) || removed.includes(last as number) ?
      Infinity :
      removed.length + thingsNamed(base, count, counting);
  },
  pieces(pieces, count, counting) {
    return count > counting.listed ?
      pieces.parts.reduce(function sum(total, part) {
        return total + ((part as Described<'values'>).values?.length ??
          runEnds);
      }, 0) :
      Infinity;
  },
  // A run that stays inside its cycle is always said as the run, and a
  // run of two values is the two values. A run that wraps names its ends.
  range(range, count, counting) {
    const inside = count > runEnds ? -1 : Infinity;
    const place = counting.place ?? asItIs;

    return place(range.from) > place(range.to) ? runEnds : inside;
  },
  values(_values, count) {
    return count;
  }
};

function thingsNamed(
  description: Sayable,
  count: number,
  counting: Counting
): number {
  return naming[description.kind](description as never, count, counting);
}

/**
 * Runs and cadences together, where they can be said one after another:
 * each stretch begins after the one before it has ended. The core's parts
 * may run through one another, and a reader cannot follow those. Single
 * values count as stretches unless they are `loose`, said after the rest.
 */
function inSuccession(
  pieces: CadencePieces | null,
  loose: boolean
): Sayable[] {
  const extents = [pieces].flatMap(function partsOf(found) {
    return found ? found.parts : [];
  }).flatMap(function extentOf(part) {
    const {last, start, from = start, to = last, values = []} =
      part as Partial<Described<'cadence'> & Described<'range'> &
      Described<'values'>>;

    return part.kind === 'values' ?
      values.filter(function counted() {
        return !loose;
      }).map(function single(value) {
        return [value, value];
      }) :
      [[from as number, to as number]];
  }).sort(function byFirst(a, b) {
    return a[0] - b[0];
  });

  return extents.length > 0 && extents.every(function after(extent, at) {
    return at === 0 || extent[0] > extents[at - 1][1];
  }) ? [pieces as CadencePieces] : [];
}

/** How many values a set holds, from the candidates that describe it. */
function sizeOf(candidates: SetDescription[]): number {
  const {values = []} =
    candidates[candidates.length - 1] as Partial<Described<'values'>>;

  return values.length;
}

/**
 * The description of a set that names the fewest things, from the core's
 * candidates and any others the field can say. A tie goes to a run, then
 * to the list of values, then to the core's order, then to the others.
 */
function settle(
  candidates: SetDescription[],
  counting: Counting,
  others: Sayable[] = []
): Sayable {
  const count = sizeOf(candidates);
  const runs = candidates.filter(function isRun(description) {
    return description.kind === 'range';
  });

  return [...runs, ...candidates.slice(-1), ...candidates, ...others].reduce(
    function fewer(best, description) {
      return thingsNamed(description, count, counting) <
        thingsNamed(best, count, counting) ? description : best;
    }
  );
}

/**
 * The same for a field whose runs may not wrap round its cycle, from its
 * candidates as the cycle has them and with nothing wrapped. A set that is
 * one run only by wrapping, and whose two stretches are each a run, is
 * then an exception or pieces, never a list.
 */
function settleUnwrapped(
  round: SetDescription[],
  linear: SetDescription[],
  counting: Counting,
  others: Sayable[] = []
): Sayable {
  const [whole] = round;
  const split = whole.kind === 'range' && whole.from > whole.to &&
    linear.some(function allRuns(description) {
      return description.kind === 'pieces' &&
        description.parts.every(function isRun(part) {
          return part.kind === 'range';
        });
    });

  return settle(linear, split ? {...counting, listed: 0} : counting, others);
}

export {
  boundedCadence, inSuccession, join, list, longerThan, restOf, runsOf,
  settle,
  settleUnwrapped, sizeOf, thingsNamed, unsayable
};
