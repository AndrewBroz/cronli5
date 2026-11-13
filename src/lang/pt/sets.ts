// How a set of field values is said: as every value, a run, a cadence,
// several pieces, a list, or one of those with a few values excepted. The
// core offers every description, laid out for the week Portuguese readers
// have and with or without runs that pass the end of a cycle; the
// judgments among them are Portuguese's own, and each field supplies the
// few that differ for it.

import type {
  CadenceDescription, Domain, RangeDescription, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import {denote, describeCadencePieces, describeSet}
  from '../../core/describe-set.js';

/** An evenly spaced set. */
export type Cadence = CadenceDescription;

type Except = Extract<SetDescription, {kind: 'except'}>;

/** A run, a list or a cadence: what a set in several pieces is made of. */
export type Part = Cadence | RangeDescription | ValuesDescription;

/** A set in several pieces, each said in its own way. */
export interface Pieces {
  kind: 'pieces';
  parts: Part[];
}

/** A description with nothing excepted from it. */
export type Plain = Part | Pieces | {kind: 'all'};

/** What a field allows when one of its sets is said. */
export interface Rules {
  // How many things a cadence names as this field says it, and 0 where
  // the field cannot say it as a cadence at all.
  cadence(cadence: Cadence): number;
  domain: Domain;
  // Whether a set may be said as this simpler one with values excepted.
  excepts(base: SetDescription): boolean;
  // The value the field is walked from, where that is not its lowest: the
  // day the week starts on.
  first?: number;
  // The most values a run that passes the end of the cycle may have.
  longestWrap: number;
  // Runs and strays are said as pieces only for more values than this.
  piecesOver: number;
  // Whether a long list may be said as runs and cadences together.
  steps: boolean;
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

// Runs and cadences together replace a list of more values than this.
const longestListHeld = 7;

// A cadence inside several pieces names its interval and both its ends.
const cadenceNames = 3;

// How many values a run has, round the end of the cycle where it wraps.
function runLength(range: RangeDescription, domain: Domain): number {
  const {max, min} = domain;
  const size = max - min + 1;

  return ((range.to - range.from) % size + size) % size + 1;
}

// Whether a run passes from the last value of the walk to the first.
function wraps(range: RangeDescription, rules: Rules): boolean {
  const {max, min} = rules.domain;
  const size = max - min + 1;
  const start = rules.first ?? min;

  return (range.from - start + size) % size > (range.to - start + size) % size;
}

/** The pieces a description is said in: its parts, or itself alone. */
function partsOf(said: Plain | SetDescription): Part[] {
  return said.kind === 'pieces' ? said.parts : [said as Part];
}

// The run of a layout that passes the end of the cycle, where the field
// lets one do so and it is short enough to be said as one run.
function wrappedRun(layout: SetDescription[], rules: Rules):
  RangeDescription | undefined {
  return layout.flatMap(partsOf).find(
    (part): part is RangeDescription => part.kind === 'range' &&
      wraps(part, rules) && runLength(part, rules.domain) >= shortestRun &&
      runLength(part, rules.domain) <= rules.longestWrap);
}

/** Lists that have come to stand side by side are one list. */
function merged(parts: Part[], part: Part): Part[] {
  const previous = parts[parts.length - 1];

  if (previous && previous.kind === 'values' && part.kind === 'values') {
    return [...parts.slice(0, -1),
      {kind: 'values', values: [...previous.values, ...part.values]}];
  }

  return [...parts, part];
}

// Pieces in the order they are said: the run that passes the end of the
// cycle first, then the rest as the walk meets them.
function ordered(parts: Part[], rules: Rules): Part[] {
  const at = Math.max(0, parts.findIndex(
    (part) => part.kind === 'range' && wraps(part, rules)));

  return [...parts.slice(at), ...parts.slice(0, at)].reduce(merged, []);
}

// The set by its runs alone, as one of the offered descriptions: a range
// of three values or more, pieces where the field says pieces for so many
// values, and a list otherwise.
function byRuns(offered: SetDescription[], values: number[], rules: Rules):
  Plain {
  const range = offered.find(
    (candidate): candidate is RangeDescription => candidate.kind === 'range' &&
      values.length >= shortestRun);
  const pieces = offered.find(
    (candidate): candidate is Extract<SetDescription, {kind: 'pieces'}> =>
      candidate.kind === 'pieces' && values.length > rules.piecesOver);
  const listed = offered[offered.length - 1] as ValuesDescription;

  const laid: Plain | undefined = pieces &&
    {kind: 'pieces', parts: ordered(pieces.parts, rules)};

  return range || laid || listed;
}

// How many things each kind of description names: a value or an end of a
// range is one, every value is one, and an exception is its base and one
// for each value excepted. A run that passes the end of its cycle is one
// more than its two ends.
const counters: {[Kind in SetDescription['kind']]: Counter<Kind>} = {
  all: () => 1,
  cadence: (said, rules) => rules.cadence(said),
  except: (said, rules) => thingsIn(said.base, rules) + said.removed.length,
  pieces: (said, rules) => said.parts.reduce(
    (sum, part) => sum + thingsIn(part, rules), 0),
  range: (said, rules) => 2 + Number(wraps(said, rules)),
  values: (said) => said.values.length
};

function thingsIn(said: Plain | SetDescription, rules: Rules): number {
  const count = counters[said.kind] as Counter<SetDescription['kind']>;

  return count(said as SetDescription, rules);
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
    (offered.base.kind !== 'range' ||
      runLength(offered.base, rules.domain) <= rules.longestWrap ||
      !wraps(offered.base, rules)) &&
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

// A cadence with holes in it, as its stretches between the holes.
function betweenHoles(hole: Except, domain: Domain): Part[] {
  const base = hole.base as Cadence;
  const stretches = denote(base, domain).reduce(
    function place(runs: number[][], value) {
      if (hole.removed.includes(value)) {
        runs.push([]);
      }
      else {
        runs[runs.length - 1].push(value);
      }

      return runs;
    }, [[]]);

  return stretches.filter((run) => run.length > 0).map(
    function asPart(run): Part {
      return run.length < shortestRun ?
        {kind: 'values', values: run} :
        {...base, last: run[run.length - 1], start: run[0]};
    }).reduce(merged, []);
}

// How many things runs and cadences together name, and none at all where
// one part's values fall among another's: nobody holds those.
function namedBy(parts: Part[], rules: Rules): number {
  const apart = parts.every((part, index) => index === 0 ||
    Math.max(...denote(parts[index - 1], rules.domain)) <
      Math.min(...denote(part, rules.domain)));

  return apart ?
    parts.reduce((sum, part) => sum +
      (part.kind === 'cadence' ? cadenceNames : thingsIn(part, rules)), 0) :
    Infinity;
}

// A long list as runs and cadences together, where the field says those
// and they name fewer things than the list has values: the core's own
// split, or a cadence cut at its holes, whichever names fewer.
function stepped(
  values: number[],
  offered: SetDescription[],
  rules: Rules
): Plain | null {
  const found = describeCadencePieces(
    values, rules.domain, {first: rules.first});
  const [best] = [
    ...found ? [found.parts] : [],
    ...offered.filter((candidate): candidate is Except =>
      candidate.kind === 'except' && candidate.base.kind === 'cadence')
      .map((hole) => betweenHoles(hole, rules.domain))
  ].map((parts) => ({named: namedBy(parts, rules), parts}))
    .sort((a, b) => a.named - b.named);

  return rules.steps && values.length > longestListHeld && best &&
    best.named < values.length ?
    {kind: 'pieces', parts: best.parts} :
    null;
}

/**
 * How a sorted set of values is said under a field's rules. A cadence the
 * field can say is said; otherwise the set goes by its runs, one of which
 * may pass the end of the cycle where the field lets it. An exception
 * replaces either when it names fewer things, and a long list gives way to
 * runs and cadences together.
 */
function choose(values: number[], rules: Rules): Chosen {
  const {domain, first} = rules;
  const round = describeSet(values, domain, {first});
  const offered = rules.wrap && wrappedRun(round, rules) ?
    round :
    describeSet(values, domain, {first, linear: true});
  const cadence = round.find((candidate): candidate is Cadence =>
    candidate.kind === 'cadence' && rules.cadence(candidate) > 0);
  const plain = [offered[0]].find(isWhole) || cadence ||
    byRuns(offered, values, rules);
  const limit = thingsIn(plain, rules);
  const [hole] = offered
    .filter((candidate): candidate is Except =>
      isHole(candidate, values, rules, limit))
    .sort((a, b) => thingsIn(a, rules) - thingsIn(b, rules));
  const {base, removed} = hole || {
    base: plain.kind === 'values' && stepped(values, offered, rules) || plain,
    removed: []
  };

  return {
    first: Math.min(...values, ...removed),
    last: Math.max(...values, ...removed),
    removed,
    said: base as Plain,
    values
  };
}

// The first and last value of each maximal run of consecutive values.
function runEnds(values: number[]): number[][] {
  return values.reduce(function place(runs: number[][], value) {
    const current = runs[runs.length - 1];

    if (current && value === current[1] + 1) {
      current[1] = value;
    }
    else {
      runs.push([value, value]);
    }

    return runs;
  }, []);
}

/** The first and last value of every run in a description, as it is said. */
function stretchesOf(said: Plain, domain: Domain): number[][] {
  const parts = partsOf(said);

  // Cadences may land beside one another's values, so their runs are
  // those of all the values together.
  if (parts.some((part) => part.kind === 'cadence')) {
    return runEnds(parts.flatMap((part) => denote(part, domain))
      .sort((a, b) => a - b));
  }

  return parts.flatMap(function ends(part) {
    return part.kind === 'range' ?
      [[part.from, part.to]] :
      runEnds(denote(part, domain));
  });
}

/** The values of a run, a list or pieces, in the order they are said. */
function inOrder(said: Plain, domain: Domain): number[] {
  return partsOf(said).flatMap(function each(part) {
    const {max, min} = domain;

    return part.kind === 'range' ?
      Array.from({length: runLength(part, domain)},
        (_, index) => min + (part.from - min + index) % (max - min + 1)) :
      denote(part, domain);
  });
}

/**
 * A rule for a cadence said with its two ends: sayable when it has more
 * values than a list may, and then it names its interval and both ends.
 */
function withEnds(longestList: number): (cadence: Cadence) => number {
  return (cadence) => cadenceNames * Number(steps(cadence) > longestList);
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
  choose, firesOn, inOrder, merged, partsOf, restricts, steps, stretchesOf,
  withEnds
};
