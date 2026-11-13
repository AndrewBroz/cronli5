// Choosing how a set of values is said. The core offers every compact
// description of a set; a field counts the things each one names and the
// fewest wins, under the limits the answers give for that field.

import {describeSet} from '../../core/describe-set.js';
import type {Domain, SetDescription} from '../../core/schedule.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** A set description of one kind. */
export type Described<Kind extends SetDescription['kind']> =
  Extract<SetDescription, {kind: Kind}>;

/** A part of a set said in pieces: a run, or values on their own. */
export type Piece = Described<'pieces'>['parts'][number];

/** How a field counts what a description names. */
export interface Counting {
  // The things a cadence of so many values names; infinite where the
  // field has no way to say it.
  cadence(cadence: Described<'cadence'>, count: number): number;
  // Pieces replace a list only when it has more values than this.
  listed: number;
  // The most values an exception may take away.
  removable: number;
}

// A run names its two ends.
const runEnds = 2;

// What a cadence said with both its ends, or as a series, names.
const boundedCadence = 3;

/** Items joined as German lists them: commas, then «und». */
function list(items: string[]): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${words.and} `);
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
function restOf(description: SetDescription) {
  const {base = description, removed = []} =
    description as Partial<Described<'except'>>;

  return {base, removed};
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

const naming: {
  [Kind in SetDescription['kind']]:
  (description: Described<Kind>, count: number, counting: Counting) => number
} = {
  all() {
    return 0;
  },
  cadence(cadence, _count, counting) {
    return counting.cadence(
      cadence, (cadence.last - cadence.start) / cadence.interval + 1);
  },
  // Only every value and a cadence are bases an exception is said from,
  // and a cadence that is only missing its first or last values is said
  // with its ends.
  except(exception, count, counting) {
    const {base, removed} = exception;
    const {last, start} = base as Partial<Described<'cadence'>>;

    return removed.length > counting.removable || base.kind === 'range' ||
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
  range(range, count) {
    const inside = count > runEnds ? -1 : Infinity;

    return range.from > range.to ? runEnds : inside;
  },
  values(_values, count) {
    return count;
  }
};

function thingsNamed(
  description: SetDescription,
  count: number,
  counting: Counting
): number {
  return naming[description.kind](description as never, count, counting);
}

/**
 * The description of a set that names the fewest things. A tie goes to a
 * wrapped run, then to the list of values, then to the core's order.
 */
function settle(
  values: number[],
  domain: Domain,
  counting: Counting
): SetDescription {
  const step = (domain.max + 1) / values.length;
  const tiling = values.length > 1 && values.every(function onBeat(value, at) {
    return value === at * step;
  });
  // Two values that halve the cycle are a cadence too (minutes 0 and 30),
  // which a field that does not wrap would not be offered.
  const beat: SetDescription[] = [
    {interval: step, kind: 'cadence' as const, last: domain.max + 1 - step,
      start: 0}
  ].filter(function onBeat() {
    return tiling;
  });
  const described = describeSet(values, domain);
  const runs = described.filter(function isRun(description) {
    return description.kind === 'range';
  });

  return [...runs, ...described.slice(-1), ...beat, ...described].reduce(
    function fewer(best, description) {
      return thingsNamed(description, values.length, counting) <
        thingsNamed(best, values.length, counting) ? description : best;
    }
  );
}

/**
 * The same for a field whose runs may not wrap round its cycle. A set
 * that is one run only by wrapping is then an exception or pieces, never
 * a list where it can be pieces.
 */
function settleUnwrapped(
  values: number[],
  domain: Domain,
  counting: Counting
): SetDescription {
  const [round] = describeSet(values, {...domain, cyclic: true});
  const split = round.kind === 'range' && round.from > round.to;

  return settle(values, domain, split ? {...counting, listed: 0} : counting);
}

export {
  boundedCadence, join, list, longerThan, restOf, runsOf, settle,
  settleUnwrapped, thingsNamed, unsayable
};
