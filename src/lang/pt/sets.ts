// How a set of field values is said: as every value, a run, a cadence,
// several pieces, a list, or one of those with a few values excepted. The
// core offers the arithmetic; the judgments here are Portuguese's own, and
// each field supplies the few that differ for it.

import type {
  Domain, RangeDescription, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';

/** An evenly spaced set. */
export type Cadence = Extract<SetDescription, {kind: 'cadence'}>;

type Except = Extract<SetDescription, {kind: 'except'}>;

/** A run or a list: what a set in several pieces is made of. */
export type Part = RangeDescription | ValuesDescription;

/** A description with nothing excepted from it. */
export type Plain = Exclude<SetDescription, Except>;

/** What a field allows when one of its sets is said. */
export interface Rules {
  // How many things a cadence names as this field says it, and 0 where
  // the field cannot say it as a cadence at all.
  cadence(cadence: Cadence): number;
  domain: Domain;
  // Whether a set may be said as this simpler one with values excepted.
  excepts(base: SetDescription): boolean;
  // Runs and strays are said as pieces only for more values than this.
  piecesOver: number;
  // Whether a run may leave the top of the field and resume at the bottom.
  wrap: boolean;
}

/**
 * A set as it will be said, the values excepted from that, its own
 * values, and the least and greatest value of what is said: a window
 * drawn round the set runs between those, whatever is excepted inside it.
 */
export interface Chosen {
  first: number;
  last: number;
  removed: number[];
  said: Plain;
  values: number[];
}

type Counter<Kind> =
  (said: Extract<SetDescription, {kind: Kind}>, rules: Rules) => number;

// A run of fewer values than this is listed, not said as a range.
const shortestRun = 3;

// An exception replaces a list of more values than this.
const longestListKept = 4;

// The maximal runs of consecutive values, in ascending order.
function linearRuns(values: number[]): number[][] {
  return values.reduce(function place(runs: number[][], value) {
    const current = runs[runs.length - 1];

    if (current && value === current[current.length - 1] + 1) {
      current.push(value);
    }
    else {
      runs.push([value]);
    }

    return runs;
  }, []);
}

// The runs as they are said: in ascending order, except that a run which
// wraps round the field, where the field may wrap, is one run and is first.
function runsOf(values: number[], rules: Rules): number[][] {
  const runs = linearRuns(values);
  const [first] = runs;
  const last = runs[runs.length - 1];
  const joins = rules.wrap && runs.length > 1 &&
    first[0] === rules.domain.min &&
    last[last.length - 1] === rules.domain.max &&
    first.length + last.length >= shortestRun;

  return joins ? [[...last, ...first], ...runs.slice(1, -1)] : runs;
}

// Long runs as ranges, and the short runs between them gathered into lists.
function gather(parts: Part[], run: number[]): Part[] {
  const previous = parts[parts.length - 1];

  if (run.length >= shortestRun) {
    parts.push({from: run[0], kind: 'range', to: run[run.length - 1]});
  }
  else if (previous && previous.kind === 'values') {
    previous.values.push(...run);
  }
  else {
    parts.push({kind: 'values', values: run.slice()});
  }

  return parts;
}

// The set by its runs alone: one range, one list, or pieces where the
// field says pieces for so many values, and a list where it does not.
function byRuns(values: number[], rules: Rules): Plain {
  const parts = runsOf(values, rules).reduce(gather, []);

  if (parts.length === 1) {
    return parts[0];
  }

  return values.length > rules.piecesOver ?
    {kind: 'pieces', parts} :
    {kind: 'values', values};
}

// How many things each kind of description names: a value or an end of a
// range is one, every value is one, and an exception is its base and one
// for each value excepted.
const counters: {[Kind in SetDescription['kind']]: Counter<Kind>} = {
  all: () => 1,
  cadence: (said, rules) => rules.cadence(said),
  except: (said, rules) => thingsIn(said.base, rules) + said.removed.length,
  pieces: (said, rules) => said.parts.reduce(
    (sum, part) => sum + thingsIn(part, rules), 0),
  range: () => 2,
  values: (said) => said.values.length
};

function thingsIn(said: SetDescription, rules: Rules): number {
  const count = counters[said.kind] as Counter<SetDescription['kind']>;

  return count(said, rules);
}

// Whether an offered description is an exception this set may be said as:
// it replaces a long enough list, its base can be said, every value it
// excepts lies inside the set, and it names fewer things than the limit.
function isHole(
  offered: SetDescription,
  values: number[],
  rules: Rules,
  limit: number
): offered is Except {
  return offered.kind === 'except' && values.length > longestListKept &&
    rules.excepts(offered.base) && thingsIn(offered.base, rules) > 0 &&
    thingsIn(offered, rules) < limit &&
    (offered.base.kind !== 'cadence' || offered.removed.every(
      (value) => value > values[0] && value < values[values.length - 1]));
}

function isWhole(said: SetDescription): said is {kind: 'all'} {
  return said.kind === 'all';
}

/** How many values a cadence has. */
function steps(cadence: Cadence): number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/**
 * How a sorted set of values is said under a field's rules. A cadence the
 * field can say is said; otherwise the set goes by its runs. An exception
 * replaces either when it names fewer things, and a run that wraps round
 * the field gives way to an exception that names as few.
 */
function choose(values: number[], rules: Rules): Chosen {
  const offered = describeSet(values, {...rules.domain, cyclic: rules.wrap});
  const cadence = describeSet(values, {...rules.domain, cyclic: true})
    .find((candidate): candidate is Cadence =>
      candidate.kind === 'cadence' && rules.cadence(candidate) > 0);
  const plain = [offered[0]].find(isWhole) || cadence ||
    byRuns(values, rules);
  const limit = thingsIn(plain, rules) +
    Number(plain.kind === 'range' && plain.from > plain.to);
  const [hole = {base: plain, removed: []}] = offered
    .filter((candidate): candidate is Except =>
      isHole(candidate, values, rules, limit))
    .sort((a, b) => thingsIn(a, rules) - thingsIn(b, rules));

  return {
    first: Math.min(...values, ...hole.removed),
    last: Math.max(...values, ...hole.removed),
    removed: hole.removed,
    said: hole.base as Plain,
    values
  };
}

/** The pieces a description is said in: its parts, or itself alone. */
function partsOf(said: Plain): Part[] {
  return said.kind === 'pieces' ? said.parts : [said as Part];
}

/** The first and last value of every run in a description, as it is said. */
function stretchesOf(said: Plain): number[][] {
  return partsOf(said).flatMap(function ends(part) {
    return part.kind === 'range' ?
      [[part.from, part.to]] :
      linearRuns(part.values).map((run) => [run[0], run[run.length - 1]]);
  });
}

// A range's values in the order it is said, wrapping where it wraps.
function walked(range: RangeDescription, domain: Domain): number[] {
  const size = domain.max - domain.min + 1;
  const length = ((range.to - range.from) % size + size) % size + 1;

  return Array.from({length},
    (_, index) => domain.min + (range.from - domain.min + index) % size);
}

/** The values of a run, a list or pieces, in the order they are said. */
function inOrder(said: Plain, domain: Domain): number[] {
  return partsOf(said).flatMap(function each(part) {
    return part.kind === 'range' ? walked(part, domain) : part.values;
  });
}

/**
 * A rule for a cadence said with its two ends: sayable when it has more
 * values than a list may, and then it names its interval and both ends.
 */
function withEnds(longestList: number): (cadence: Cadence) => number {
  return (cadence) => 3 * Number(steps(cadence) > longestList);
}

/** Whether a field narrows its values: a Quartz form or less than all. */
function restricts(candidates: SetDescription[] | null): boolean {
  return candidates === null || candidates[0].kind !== 'all';
}

/** The values a plain field fires on, in ascending order. */
function firesOn(candidates: SetDescription[] | null, domain: Domain):
  number[] {
  const [first] = candidates as SetDescription[];

  return denote(first, domain);
}

export {
  choose, firesOn, inOrder, partsOf, restricts, steps, stretchesOf, withEnds
};
