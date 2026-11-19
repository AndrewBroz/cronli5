// Choosing among the core's descriptions of a set of values. A device
// counts the things a description would name, or says it cannot say it;
// the description that names the fewest is said, the earlier one on a
// tie. The counts depend on how many values there are and how they are
// arranged, never on which they are.

import type {
  CadencePieces, Domain, Field, RangeDescription, Schedule, SetDescription,
  SetView, ValuesDescription
} from '../../core/schedule.js';
import {
  denote, describeCadencePieces, describeSet
} from '../../core/describe-set.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';

/** A set as the core describes it: one description, or runs and cadences. */
type Described = SetDescription | CadencePieces;

type Kind = Described['kind'];

/** The description of one kind. */
type Of<K extends Kind> = Extract<Described, {kind: K}>;

type Cadence = Of<'cadence'>;

type Excepted = Of<'except'>;

/** One piece of a set said in pieces. */
type Part = RangeDescription | ValuesDescription;

/** One piece of a set said as runs and cadences together. */
type Stretch = CadencePieces['parts'][number];

/** What to do with a description of each kind. */
type Sayers<T> = {[K in Kind]?: (description: Of<K>) => T};

/** The things each kind of description names; a kind left out is unsayable. */
type Counts = Sayers<number>;

/** A field's values, with every compact description of them. */
interface View {
  all: boolean;
  domain: Domain;
  options: Described[];
  values: number[];
}

/** Apply the entry for the description's kind, if there is one. */
function say<T>(
  description: Described,
  sayers: Sayers<T>,
  otherwise?: T
): T {
  const sayer = sayers[description.kind] as
    ((given: Described) => T) | undefined;

  return sayer?.(description) ?? otherwise as T;
}

/** The count, when the condition for saying it holds. */
function when(condition: boolean, count: number): number {
  return condition ? count : Infinity;
}

function countOf(description: Described, counts: Counts): number {
  return say(description, counts, Infinity);
}

/** The description that names the fewest things, the earliest on a tie. */
function choose(view: View, counts: Counts): Described {
  return view.options.reduce(function fewer(best, option) {
    return countOf(option, counts) < countOf(best, counts) ? option : best;
  });
}

// Where a value comes when a cycle is walked from `first`.
function placeIn(value: number, domain: Domain, first: number): number {
  return (value - first + sizeOf(domain)) % sizeOf(domain);
}

// Pieces in the order they are said: ascending from the cycle's first
// value, a run that wraps round the cycle before all the others. Values
// listed together that turn the cycle are no run (two values in a row
// across the turn are listed), so each is a piece where it comes.
function inSpokenOrder(option: Described, domain: Domain, first: number):
  Described {
  function place(value: number): number {
    return placeIn(value, domain, first);
  }

  function placeOf(part: Part): number {
    return say(part, {
      range: (run) => place(run.from) -
        Number(place(run.from) > place(run.to)) * sizeOf(domain),
      values: (listed) => place(listed.values[0])
    });
  }

  function turns(part: Part): boolean {
    return say(part, {
      values: (listed) => place(listed.values[0]) > place(listed.values[1])
    }, false);
  }

  function apart(part: Part): Part[] {
    return turns(part) ?
      (part as ValuesDescription).values.map(
        (value): Part => ({kind: 'values', values: [value]})) :
      [part];
  }

  return say<Described>(option, {
    pieces: (pieces) => ({
      ...pieces,
      parts: pieces.parts.flatMap(apart)
        .sort((a, b) => placeOf(a) - placeOf(b))
    })
  }, option);
}

// Whether the run through the end of the cycle is the longer way round:
// it holds more than half the cycle. Such a run is every value but a few,
// and said from its start to its end it leaves the reader to work out
// which few.
function wrapsTheLongWay(values: number[], domain: Domain): boolean {
  const runs = runsOf(values);
  const [first] = runs;
  const last = runs[runs.length - 1];
  const joins = runs.length > 1 && first.from === domain.min &&
    last.to === domain.max;
  const through = first.to - first.from + last.to - last.from + 2;

  return joins && through * 2 > sizeOf(domain);
}

// Whether the descriptions of a set are laid out with nothing wrapping:
// where no run may wrap, and where the only wrap is the longer way round.
function linearly(
  values: number[],
  round: boolean,
  wraps: {anyLength?: boolean; domain: Domain}
): boolean {
  return !round ||
    wraps.anyLength !== true && wrapsTheLongWay(values, wraps.domain);
}

// A view from the core's descriptions, the runs and cadences last.
function viewed(
  values: number[],
  domain: Domain,
  found: {options: SetDescription[]; pieces: CadencePieces | null}
): View {
  const {options} = found;

  return {
    all: options[0].kind === 'all',
    domain,
    options: [...options, ...[found.pieces].filter(Boolean) as Described[]],
    values
  };
}

/**
 * A set of values, described afresh. A run wraps round the end of its
 * cycle only where `round` allows, and then only the shorter way unless
 * a run of `anyLength` may.
 */
function described(
  values: number[],
  domain: Domain,
  wraps: {anyLength?: boolean; round: boolean}
): View {
  const layout: SetView =
    {linear: linearly(values, wraps.round, {...wraps, domain})};

  return viewed(values, domain, {
    options: describeSet(values, domain, layout).map(
      (option) => inSpokenOrder(option, domain, domain.min) as
        SetDescription),
    pieces: describeCadencePieces(values, domain, layout)
  });
}

/**
 * A plain field's values and their descriptions, as the core lays them
 * out: with nothing wrapping where a run may not wrap round the end of
 * the cycle, and walked from `first` where the cycle has another start.
 */
function viewOf(
  schedule: Schedule,
  field: Field,
  wraps: {anyLength?: boolean; first?: number; round: boolean}
): View {
  const domain = domainOf(field);
  const own = schedule.analyses.candidates[field] as SetDescription[];
  const values = denote(own[own.length - 1], domain);
  const options = candidatesAs(schedule, field, {
    first: wraps.first,
    linear: linearly(values, wraps.round, {...wraps, domain})
  }) as SetDescription[];

  return viewed(values, domain, {
    options: options.map((option) => inSpokenOrder(option, domain,
      wraps.first ?? domain.min) as SetDescription),
    pieces: schedule.analyses.cadencePieces[field]
  });
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

/**
 * The things a set in pieces names: three for a cadence, two for a range
 * (one when it has no end), one for a value.
 */
function partsCount(pieces: {parts: Stretch[]}): number {
  return pieces.parts.reduce(function add(sum, part) {
    return sum + say(part, {
      cadence: () => 3,
      range: (run) => 2 - Number(run.open === true),
      values: (listed) => listed.values.length
    });
  }, 0);
}

function isRange(part: Stretch): part is RangeDescription {
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
  description: Described,
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
function spoken(description: Described, domain: Domain): number[] {
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

/** Whether an exception leaves the first and the last value of a cycle. */
function keepsEnds(excepted: Excepted, domain: Domain): boolean {
  return !excepted.removed.includes(domain.min) &&
    !excepted.removed.includes(domain.max);
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

export type {
  Cadence, Counts, Described, Excepted, Of, Part, Sayers, Stretch, View
};
export {
  around, choose, countOf, described, interior, isRange, isRun, isSingle,
  keepsEnds, lengthOf,
  members, partsCount, runsOf, say, single, singles, spoken, stretchesOf,
  tiling, viewOf, when
};
