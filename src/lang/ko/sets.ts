// How one field's set of values is described. The core offers every
// compact description of the set; this takes the first that the answers
// allow, in their order: the whole field, one value, all but one or two,
// one run, a cadence, a cadence less one or two, pieces, a short list,
// and past the list's ceiling whatever names least.

import type {
  CadenceDescription, CadencePieces, Domain, Field, ScheduleFacts,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeCadencePieces, describeSet}
  from '../../core/describe-set.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';

/** A description of a set, the runs-and-cadences one included. */
export type Described = SetDescription | CadencePieces;

/** A set with a few values taken out of a simpler one. */
export type Except = Extract<SetDescription, {kind: 'except'}>;

/** A field's set of values, with what the core says of it. */
export interface FieldSet {
  candidates: SetDescription[];
  domain: Domain;
  split: CadencePieces | null;
  values: number[];
}

/** What a place in the sentence lets a set be said as. */
export interface Choice {
  // Whether "all but a few" may be said.
  allBut?: boolean;
  // Whether a cadence that fills its unit from its first value is kept
  // as a cadence however few its values.
  bare?: boolean;
  // The longest list that is still said as a list.
  ceiling: number;
  // Whether the unit's first or last value, missing, moves the end of a
  // run and is no exception.
  edges?: boolean;
  // A cadence of this many values or fewer is a list.
  few: number;
  // Whether a cadence less one or two values may be said.
  lessCadence?: boolean;
  // Whether runs and cadences together may be said.
  split?: boolean;
  // Whether they may be said however many parts they have. Elsewhere only
  // two parts are said, with at most one value beside them: more are
  // rhythms found by chance in scattered values, and the list is easier.
  splitFreely?: boolean;
}

type Rule =
  (set: FieldSet, how: Choice) => Described | false | null | undefined;

function ofKind<Kind extends SetDescription['kind']>(
  candidates: SetDescription[],
  kind: Kind
): Extract<SetDescription, {kind: Kind}> | undefined {
  return candidates.find(function isKind(candidate) {
    return candidate.kind === kind;
  }) as Extract<SetDescription, {kind: Kind}> | undefined;
}

function listOf(values: number[]): ValuesDescription {
  return {kind: 'values', values};
}

// A set from its candidates, laid out with nothing wrapping.
function asSet(
  candidates: SetDescription[],
  domain: Domain,
  split: (values: number[]) => CadencePieces | null
): FieldSet {
  const values = denote(candidates[candidates.length - 1], domain);

  return {candidates, domain, split: split(values), values};
}

/** A field's set as the core describes it, cut at the edge of its unit. */
function fieldOf(facts: ScheduleFacts, field: Field): FieldSet {
  return asSet(
    candidatesAs(facts, field, {linear: true}) as SetDescription[],
    domainOf(field),
    function known() {
      return facts.analyses.cadencePieces[field];
    }
  );
}

/** A set of a field's values from its candidates over any domain. */
function setFrom(candidates: SetDescription[], domain: Domain): FieldSet {
  return asSet(candidates, domain, function found(values) {
    return describeCadencePieces(values, domain);
  });
}

/** Any set of a field's values, described the same way. */
function setOf(values: number[], domain: Domain): FieldSet {
  return setFrom(describeSet(values, domain, {linear: true}), domain);
}

/** The maximal runs of adjacent values, ascending. */
function runsOf(values: number[]): number[][] {
  const runs: number[][] = [];

  values.forEach(function place(value, at) {
    const joined = at > 0 && values[at - 1] === value - 1;

    (joined && runs[runs.length - 1] || runs[runs.push([]) - 1]).push(value);
  });

  return runs;
}

/** Whether a cadence fills its unit: it comes round to itself evenly. */
function tiles(cadence: CadenceDescription, domain: Domain): boolean {
  return (domain.max - domain.min + 1) % cadence.interval === 0 &&
    cadence.start - domain.min < cadence.interval &&
    cadence.last + cadence.interval > domain.max;
}

// The step of a rhythm that fills its unit from the unit's first value
// (every value, or a cadence that tiles from there), or 0 for any other
// set. This is the rhythm that is said bare.
function stepOf(form: Described, domain: Domain): number {
  return form.kind === 'all' && 1 ||
    form.kind === 'cadence' && form.start === domain.min &&
    tiles(form, domain) && form.interval || 0;
}

/**
 * The name of every second value, by whether the values are even or odd:
 * a cadence by two from one of the unit's first two values to its end.
 * Empty for any other set.
 */
function parityOf(form: Described, domain: Domain, names: string[]): string {
  return form.kind === 'cadence' && form.interval === 2 &&
    form.start - domain.min < 2 && form.last + 2 > domain.max &&
    names[form.start % 2] || '';
}

/** A set without its exception, and the values the exception removes. */
function baseOf(form: Described): Described {
  return (form as Partial<Except>).base ?? form;
}

function removedOf(form: Described): number[] {
  return (form as Partial<Except>).removed ?? [];
}

/** Whether a set is every value, or every value but some. */
function isOpen(form: Described): boolean {
  return baseOf(form).kind === 'all';
}

/** The first and last value and the step of a run, a cadence or a unit. */
function endsOf(form: Described, domain: Domain):
  {interval: number; last: number; start: number} {
  const loose = form as {
    from?: number; interval?: number; last?: number; start?: number;
    to?: number;
  };

  return {
    interval: loose.interval ?? 1,
    last: loose.last ?? loose.to ?? domain.max,
    start: loose.start ?? loose.from ?? domain.min
  };
}

function touchesEdge(removed: number[], domain: Domain): boolean {
  return removed.includes(domain.min) || removed.includes(domain.max);
}

// Every value but some, where that may be said here.
function exceptAll(set: FieldSet, how: Choice): Except | false | undefined {
  const found = set.candidates.find(function fromAll(candidate) {
    return candidate.kind === 'except' && candidate.base.kind === 'all';
  }) as Except | undefined;

  return how.allBut && found &&
    !(how.edges && touchesEdge(found.removed, set.domain)) && found;
}

const rules: Rule[] = [
  function whole(set) {
    const [first] = set.candidates;

    return first.kind === 'all' && first;
  },
  function single(set) {
    return set.values.length === 1 && listOf(set.values);
  },
  function allButFew(set, how) {
    const found = exceptAll(set, how);

    return found && found.removed.length <= 2 && found;
  },
  // Two adjacent values are a list; three or more are a range.
  function oneRun(set) {
    const range = ofKind(set.candidates, 'range');

    return range && (set.values.length > 2 && range || listOf(set.values));
  },
  function cadence(set, how) {
    const found = ofKind(set.candidates, 'cadence');
    const kept = found && (found.open || set.values.length > how.few ||
      how.bare && stepOf(found, set.domain) > 0);

    return found && (kept && found || listOf(set.values));
  },
  function cadenceLessFew(set, how) {
    return how.lessCadence && set.candidates.find(function less(candidate) {
      return candidate.kind === 'except' &&
        candidate.base.kind === 'cadence' && candidate.removed.length <= 2;
    });
  },
  // Pieces, while the values between its runs are few enough to list.
  function pieces(set, how) {
    const found = ofKind(set.candidates, 'pieces');
    const loose = (found?.parts ?? []).flatMap(function between(part) {
      return (part as Partial<ValuesDescription>).values ?? [];
    });

    return found && loose.length <= how.ceiling && found;
  },
  function shortList(set, how) {
    return set.values.length <= how.ceiling && listOf(set.values);
  },
  function runsAndCadences(set, how) {
    const parts = set.split?.parts ?? [];
    const loose = parts.flatMap(function listed(part) {
      return (part as Partial<ValuesDescription>).values ?? [];
    });
    const plain = parts.length <= 2 && loose.length <= 1;

    return how.split && (how.splitFreely || plain) && set.split;
  },
  function allButSome(set, how) {
    const found = exceptAll(set, how);

    return found && found.removed.length < set.values.length && found;
  },
  function everyValue(set) {
    return listOf(set.values);
  }
];

/** The description a set is said by: the first the place allows. */
function choose(set: FieldSet, how: Choice): Described {
  return rules.reduce<Described | false | null | undefined>(
    function first(found, rule) {
      return found || rule(set, how);
    }, false) as Described;
}

export {
  baseOf, choose, endsOf, fieldOf, isOpen, listOf, ofKind, parityOf,
  removedOf, runsOf, setFrom, setOf, stepOf, tiles, touchesEdge
};
