// Choosing among the core's descriptions of a set of values. A device
// counts the things a description would name, or says it cannot say it;
// the description that names the fewest is said, the earlier one on a
// tie. The counts depend on how many values there are and how they are
// arranged, never on which they are.

import type {
  Domain, Field, RangeDescription, Schedule, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';

type Kind = SetDescription['kind'];

/** The description of one kind. */
type Of<K extends Kind> = Extract<SetDescription, {kind: K}>;

type Cadence = Of<'cadence'>;

type Excepted = Of<'except'>;

/** One piece of a set said in pieces. */
type Part = RangeDescription | ValuesDescription;

/** What to do with a description of each kind. */
type Sayers<T> = {[K in Kind]?: (description: Of<K>) => T};

/** The things each kind of description names; a kind left out is unsayable. */
type Counts = Sayers<number>;

/** A field's values, with every compact description of them. */
interface View {
  all: boolean;
  domain: Domain;
  options: SetDescription[];
  values: number[];
}

/** Apply the entry for the description's kind, if there is one. */
function say<T>(
  description: SetDescription,
  sayers: Sayers<T>,
  otherwise?: T
): T {
  const sayer = sayers[description.kind] as
    ((given: SetDescription) => T) | undefined;

  return sayer?.(description) ?? otherwise as T;
}

/** The count, when the condition for saying it holds. */
function when(condition: boolean, count: number): number {
  return condition ? count : Infinity;
}

function countOf(description: SetDescription, counts: Counts): number {
  return say(description, counts, Infinity);
}

// Whether a description is a run that wraps round the end of its cycle.
function wrapsRound(description: SetDescription): boolean {
  return say(description, {range: (run) => run.from > run.to}, false);
}

/**
 * The description that names the fewest things, the earliest on a tie.
 * One tie goes the other way: an exception is said in place of a run that
 * wraps round its cycle, which leaves the reader to work out what is
 * missing.
 */
function choose(view: View, counts: Counts): SetDescription {
  return view.options.reduce(function fewer(best, option) {
    const count = countOf(option, counts);
    const least = countOf(best, counts);
    const overWrap = count === least && count < Infinity &&
      option.kind === 'except' && wrapsRound(best);

    return count < least || overWrap ? option : best;
  });
}

// Where a part comes when pieces are said: in ascending order of its
// first value, a run that wraps round the cycle before all the others.
function placeOf(part: Part, domain: Domain): number {
  return say(part, {
    range: (run) => run.from - Number(run.from > run.to) * sizeOf(domain),
    values: (listed) => listed.values[0]
  });
}

function inSpokenOrder(option: SetDescription, domain: Domain):
  SetDescription {
  return say(option, {
    pieces: (pieces) => ({
      ...pieces,
      parts: pieces.parts.slice().sort(function earlier(a, b) {
        return placeOf(a, domain) - placeOf(b, domain);
      })
    })
  }, option);
}

/** A set of values, described afresh in a domain. */
function described(values: number[], domain: Domain): View {
  const options = describeSet(values, domain).map(
    (option) => inSpokenOrder(option, domain));

  return {all: options[0].kind === 'all', domain, options, values};
}

/**
 * A plain field's values and their descriptions. Where a run may not wrap
 * round the end of the cycle, the values are described in ascending order.
 */
function viewOf(schedule: Schedule, field: Field, wraps: boolean): View {
  const domain = domainOf(field);
  const given = schedule.analyses.candidates[field] as SetDescription[];

  return described(denote(given[given.length - 1], domain),
    {...domain, cyclic: domain.cyclic && wraps});
}

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

/** How many values a range holds, round the cycle if it wraps. */
function lengthOf(range: RangeDescription, domain: Domain): number {
  const size = sizeOf(domain);

  return ((range.to - range.from) % size + size) % size + 1;
}

/** How many values a cadence holds. */
function members(cadence: Cadence): number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/** The things a set in pieces names: two for a range, one for a value. */
function partsCount(pieces: Of<'pieces'>): number {
  return pieces.parts.reduce(function add(sum, part) {
    return sum + say(part, {
      range: () => 2,
      values: (listed) => listed.values.length
    });
  }, 0);
}

function isRange(part: Part): part is RangeDescription {
  return part.kind === 'range';
}

/** One value as a stretch that starts and ends on it. */
function single(value: number): RangeDescription {
  return {from: value, kind: 'range', to: value};
}

function singles(values: number[]): RangeDescription[] {
  return values.map(single);
}

function isSingle(stretch: RangeDescription): boolean {
  return stretch.from === stretch.to;
}

function isRun(stretch: RangeDescription): boolean {
  return stretch.from !== stretch.to;
}

/** The unbroken runs of ascending values. */
function runsOf(values: number[]): RangeDescription[] {
  const runs: RangeDescription[] = [];

  values.forEach(function place(value) {
    const current = runs[runs.length - 1];

    if (current && current.to === value - 1) {
      current.to = value;
    }
    else {
      runs.push(single(value));
    }
  });

  return runs;
}

/**
 * The stretches a description is said as, in spoken order: its ranges
 * whole, and its listed values gathered as `gather` gathers them.
 */
function stretchesOf(
  description: SetDescription,
  gather: (values: number[]) => RangeDescription[]
): RangeDescription[] {
  return say(description, {
    pieces: (pieces) =>
      pieces.parts.flatMap((part) => stretchesOf(part, gather)),
    range: (range) => [range],
    values: (listed) => gather(listed.values)
  }, []);
}

/** The values of a description in the order they are said. */
function spoken(description: SetDescription, domain: Domain): number[] {
  return say(description, {
    pieces: (pieces) => pieces.parts.flatMap((part) => spoken(part, domain)),
    range: (range) => Array.from(
      {length: lengthOf(range, domain)},
      (_, index) => domain.min +
        (range.from - domain.min + index) % sizeOf(domain)),
    values: (listed) => listed.values
  }, []);
}

/**
 * The interval of a cadence that fills its cycle from the start (every
 * value is 1), or 0 when the values are no such cadence.
 */
function tiling(view: View): number {
  const size = sizeOf(view.domain);
  const interval = size / view.values.length;
  const tiles = view.values.every(function onBeat(value, index) {
    return value === view.domain.min + index * interval;
  });

  return Number(tiles) * interval % size;
}

/**
 * Whether an exception is one a cadence may take: a hole in the middle. A
 * cadence missing values at an end is a cadence with other bounds. Any
 * other base may miss values anywhere.
 */
function interior(excepted: Excepted): boolean {
  return say(excepted.base, {
    cadence: (base) => excepted.removed.every(function inside(value) {
      return value > base.start && value < base.last;
    })
  }, true);
}

/**
 * A cadence with holes, as what is left each side of them: a stretch of
 * three values or more by its two ends, anything shorter value by value.
 */
function around(excepted: Excepted, domain: Domain): RangeDescription[] {
  const groups: number[][] = [[]];

  denote(excepted.base, domain).forEach(function place(value) {
    if (excepted.removed.includes(value)) {
      groups.push([]);
    }
    else {
      groups[groups.length - 1].push(value);
    }
  });

  return groups.flatMap(function bounded(group) {
    return group.length > 2 ?
      [{from: group[0], kind: 'range', to: group[group.length - 1]}] :
      singles(group);
  });
}

export type {Cadence, Counts, Excepted, Of, Part, Sayers, View};
export {
  around, choose, countOf, described, interior, isRange, isRun, isSingle,
  lengthOf,
  members, partsCount, runsOf, say, single, singles, spoken, stretchesOf,
  tiling, viewOf, when
};
