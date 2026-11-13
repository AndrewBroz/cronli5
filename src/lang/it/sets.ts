// The order of choice: which of the core's descriptions of a set of values
// Italian says. It depends on how many values there are and how they are
// arranged, never on which values they are. No words live here.

import type {
  CadenceDescription, CadencePieces, Domain, Field, RangeDescription,
  ScheduleFacts, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {denote} from '../../core/describe-set.js';

type Run = RangeDescription;
type Cadence = CadenceDescription;
type Values = ValuesDescription;
type Part = Run | Cadence | Values;
type Whole = {kind: 'all'};

/** A cadence or every value, with one or two values left out. */
interface Exception {
  kind: 'except';
  base: Whole | Cadence | Run;
  removed: number[];
}

/** Runs, cadences and single values said one after another. */
interface Pieces {
  kind: 'pieces';
  parts: Part[];
}

/** The description of a set that Italian says. */
type Form = Whole | Run | Cadence | Exception | Pieces | Values;

/** What decides the choice for one field. */
interface Limits {
  // Whether a cadence is long enough to be said as one.
  cadence(cadence: Cadence): boolean;
  // The set as runs and cadences together, when the core offers that.
  mixed?: CadencePieces | null;
  // Whether an exception may be said at all.
  plain?: boolean;
}

// The most values an exception leaves out.
const MOST_REMOVED = 2;

// The fewest values a run has to be said as a range.
const SHORTEST_RUN = 3;

function found<Kind extends SetDescription['kind']>(
  candidates: SetDescription[],
  kind: Kind
): Extract<SetDescription, {kind: Kind}> | undefined {
  return candidates.find(function isKind(candidate) {
    return candidate.kind === kind;
  }) as Extract<SetDescription, {kind: Kind}> | undefined;
}

/** How many values a cadence has. */
function countOf(cadence: Cadence): number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/** Whether a cadence fills its field with no break at the field's edge. */
function tiles(cadence: Cadence, domain: Domain): boolean {
  return (domain.max - domain.min + 1) % cadence.interval === 0 &&
    cadence.start - domain.min < cadence.interval &&
    cadence.last + cadence.interval > domain.max;
}

/** The maximal runs of consecutive values, in the order given. */
function runsIn(values: number[]): number[][] {
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

/**
 * The runs of a set in the order its candidates walk them: a run that
 * passes the end of its field is one run, from its start.
 */
function runsOf(candidates: SetDescription[], domain: Domain): number[][] {
  const size = domain.max - domain.min + 1;

  function walk(run: Run): number[] {
    const length = (run.to - run.from + size) % size + 1;

    return Array.from({length}, function at(unused, index) {
      return domain.min + (run.from - domain.min + index) % size;
    });
  }

  const range = found(candidates, 'range');
  const pieces = found(candidates, 'pieces');
  const named = denote(candidates[candidates.length - 1], domain);

  return firstOf<number[][]>([
    range && [walk(range)],
    pieces && pieces.parts.flatMap(function runsOfPart(part) {
      return part.kind === 'range' ? [walk(part)] : runsIn(part.values);
    }),
    runsIn(named)
  ]);
}

// How many things pieces or a list say one after another.
function itemsIn(parts: Part[]): number {
  return parts.reduce(function add(sum, part) {
    return sum + (part.kind === 'values' && part.values.length || 1);
  }, 0);
}

/** The first of several options that is there at all. */
function firstOf<T>(options: Array<T | false | '' | null | undefined>): T {
  return options.find(Boolean) as T;
}

// A run as it is said: a range from three values, two values otherwise,
// in the order the run has them.
function runForm(range: Run | undefined, count: number): Form | undefined {
  return range && firstOf<Form>([
    count >= SHORTEST_RUN && range,
    {kind: 'values', values: [range.from, range.to]}
  ]);
}

// The first exception that leaves out one or two values of a base of the
// kind asked for: every value, or a cadence long enough to be said.
function exceptionIn(
  candidates: SetDescription[],
  limits: Limits,
  base: 'all' | 'cadence'
): Exception | undefined {
  return candidates.find(function qualifies(candidate) {
    return !limits.plain && candidate.kind === 'except' &&
      candidate.removed.length <= MOST_REMOVED &&
      candidate.base.kind === base &&
      (base === 'all' || limits.cadence(candidate.base as Cadence));
  }) as Exception | undefined;
}

// Whether a part holds a value.
function holds(part: Part, value: number): boolean {
  const {from, to} = part as Run;
  const {interval, last, start} = part as Cadence;
  const tests = {
    cadence() {
      return value >= start && value <= last &&
        (value - start) % interval === 0;
    },
    range() {
      return value >= from && value <= to;
    },
    values() {
      return (part as Values).values.includes(value);
    }
  };

  return tests[part.kind]();
}

// Runs and cadences together, when they say the set in fewer items than
// the plain pieces or the list would. A cadence too short to be said as
// one is given as its values, less any that another part already holds.
function mixedForm(limits: Limits, domain: Domain, plain: Part[]):
  Pieces | false {
  const offered = (limits.mixed || {parts: []}).parts;
  const parts = offered.map(function sayable(part) {
    return part.kind === 'cadence' && !limits.cadence(part) && {
      kind: 'values' as const,
      values: denote(part, domain).filter(function unshared(value) {
        return !offered.some(function alsoHolds(other) {
          return other !== part && holds(other, value);
        });
      })
    } || part;
  });

  return parts.length > 0 && itemsIn(parts) < itemsIn(plain) &&
    {kind: 'pieces', parts};
}

/**
 * A field's candidates as they are read: cut at the field's edge and in
 * ascending order, unless a run may pass the edge and one does, which is
 * then kept whole.
 */
function readAs(facts: ScheduleFacts, field: Field, mayWrap: boolean):
  SetDescription[] {
  const wrapped = candidatesAs(facts, field, {}) as SetDescription[];
  const pieces = found(wrapped, 'pieces') || {parts: []};
  const passes = [found(wrapped, 'range'), ...pieces.parts].some(
    function backwards(run) {
      return run?.kind === 'range' && run.from > run.to;
    }
  );

  return mayWrap && passes ?
    wrapped :
    candidatesAs(facts, field, {linear: true}) as SetDescription[];
}

/**
 * The form a set is said in, from its candidates under the view its field
 * is read in: every value, one value, every value less one or two, a run,
 * a cadence long enough, such a cadence less one or two, pieces, and last
 * a list.
 */
function choose(
  candidates: SetDescription[],
  domain: Domain,
  limits: Limits
): Form {
  const named = candidates[candidates.length - 1];

  if (named.kind !== 'values') {
    return {kind: 'all'};
  }

  const count = named.values.length;
  const cadence = found(candidates, 'cadence');
  const pieces = found(candidates, 'pieces') as Pieces | undefined;

  return firstOf<Form>([
    count === 1 && named,
    exceptionIn(candidates, limits, 'all'),
    runForm(found(candidates, 'range'), count),
    cadence && limits.cadence(cadence) && cadence,
    exceptionIn(candidates, limits, 'cadence'),
    mixedForm(limits, domain, pieces?.parts || [named]),
    pieces,
    named
  ]);
}

// Whether a run of weekdays, read from Monday, passes from Sunday to
// Monday.
function crossesWeek(run: Run): boolean {
  return (run.from + 6) % 7 > (run.to + 6) % 7;
}

// A run of weekdays as it is said: two days as a list, a run inside the
// week as a range, and one across its end only when it is short.
function weekdayRun(range: Run | undefined, count: number): Form | undefined {
  return range && firstOf<Form | undefined>([
    count < SHORTEST_RUN &&
      {kind: 'values', values: [range.from, range.to]},
    (!crossesWeek(range) || count <= SHORTEST_RUN + 1) && range
  ]);
}

// Every day less one or two, or four days that are a run with one day out
// of its middle.
function weekdayException(candidates: SetDescription[], count: number):
  Exception | undefined {
  const exceptions = candidates.filter(function isException(candidate) {
    return candidate.kind === 'except';
  }) as Exception[];

  return exceptions.find(function ofEveryDay(candidate) {
    return candidate.base.kind === 'all' &&
      candidate.removed.length <= MOST_REMOVED;
  }) || exceptions.find(function ofRun(candidate) {
    return candidate.base.kind === 'range' &&
      candidate.removed.length === 1 && count === SHORTEST_RUN + 1;
  });
}

/**
 * The form a set of weekdays is said in, read from Monday: one day, two
 * days that touch, a run inside the week, a short run across its end,
 * every day less one or two, a run from Monday with one day out of its
 * middle, pieces inside the week, and last a list. Only a single run is
 * ever read across the end of the week.
 */
function chooseWeekdays(facts: ScheduleFacts): Form {
  const wrapped = candidatesAs(facts, 'weekday', {first: 1}) as [];
  const candidates = candidatesAs(facts, 'weekday',
    {first: 1, linear: true}) as SetDescription[];
  const named = candidates[candidates.length - 1] as Values;
  const count = named.values.length;

  return firstOf<Form>([
    count === 1 && named,
    weekdayRun(found(wrapped, 'range'), count),
    weekdayException(candidates, count),
    found(candidates, 'pieces') as Pieces | undefined,
    named
  ]);
}

export type {Cadence, Exception, Form, Limits, Part, Pieces, Run, Values};
export {
  choose, chooseWeekdays, countOf, firstOf, readAs, runsIn, runsOf, tiles
};
