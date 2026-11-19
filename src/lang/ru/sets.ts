// Choosing how a set of values is described (answers, "How a form is
// chosen"): the first of an ordered list of kinds that the set's
// candidates offer. Nothing here knows any words.

import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote} from '../../core/index.js';

/** A description of a set: one of the candidates, or runs and cadences. */
export type Described = SetDescription | CadencePieces;

/** A part of a description made of several. */
export type Part = CadencePieces['parts'][number];

/** A set with one or two values removed from a simpler one. */
export type Exception = Extract<SetDescription, {kind: 'except'}>;

/** A condition, and what is said when it is the first to hold. */
export type Rule<Context, Said> =
  [(context: Context) => unknown, (context: Context) => Said];

/** A set to be described: its candidates and what a field allows. */
export interface Choosing {
  // Whether an exception's base may be a cadence.
  cadenceBase: boolean;
  count: number;
  domain: Domain;
  // The most values that are named one by one before anything else.
  few: number;
  // A value an exception may not remove (the first minute or second).
  guarded: number;
  // The candidates with nothing wrapping, in ascending order.
  linear: SetDescription[];
  // The candidates as the field gives them, where a run may wrap.
  own: SetDescription[];
  pieces: CadencePieces | null;
  // Whether a run that holds 3 or more values keeps the set from being
  // named value by value.
  runsFirst: boolean;
  // The most values named one by one when they hold no run of 3 or more
  // and are not every second value.
  scattered: number;
  wraps: boolean;
}

const longRun = 3;
const mostRemoved = 2;
const boundsNamed = 2;
const stepMargin = 2;

/** What the first rule that holds says. */
function firstRule<Context, Said>(
  rules: Array<Rule<Context, Said>>,
  context: Context
): Said {
  const [, say] = rules.find(function holds(rule) {
    return rule[0](context);
  }) as Rule<Context, Said>;

  return say(context);
}

/** The candidate of a kind, if the set has one. */
function kindOf<Kind extends SetDescription['kind']>(
  candidates: SetDescription[],
  kind: Kind
): Extract<SetDescription, {kind: Kind}> | undefined {
  return candidates.find(function isKind(candidate) {
    return candidate.kind === kind;
  }) as Extract<SetDescription, {kind: Kind}> | undefined;
}

/**
 * How many values a description stands for. The whole field is counted
 * without listing it: the year field holds thousands.
 */
function sizeOf(description: Described, domain: Domain): number {
  return description.kind === 'all' ?
    domain.max - domain.min + 1 :
    denote(description, domain).length;
}

/** The values of a set, from its candidates. */
function valuesOf(candidates: SetDescription[], domain: Domain): number[] {
  return denote(candidates[candidates.length - 1], domain);
}

/**
 * Whether a description is a rhythm that needs no start or end said: the
 * whole field, or a cadence from the field's first value that tiles it.
 */
function isBare(description: Described, domain: Domain): boolean {
  const size = domain.max - domain.min + 1;

  return description.kind === 'all' ||
    description.kind === 'cadence' && description.start === domain.min &&
    description.last + description.interval > domain.max &&
    size % description.interval === 0;
}

/** Whether a cadence takes every second value. */
function isAlternate(description: Described): boolean {
  return description.kind === 'cadence' && description.interval === 2;
}

// How many things a description in parts names: a range or a cadence its
// two ends, a list each of its values.
function namedBy(description: Described): number {
  const parts = (description as CadencePieces).parts as Part[];

  return parts.reduce(function add(sum, part) {
    return sum + (part.kind === 'values' ? part.values.length : boundsNamed);
  }, 0);
}

// An exception with one or two values removed whose base is of one of
// the kinds given.
function exceptionOn(choosing: Choosing, bases: string[]):
  Exception | undefined {
  return choosing.linear.find(function fits(candidate) {
    return candidate.kind === 'except' &&
      bases.includes(candidate.base.kind) &&
      candidate.removed.length <= mostRemoved &&
      !candidate.removed.includes(choosing.guarded);
  }) as Exception | undefined;
}

function hasLongRun(choosing: Choosing): boolean {
  const range = kindOf(choosing.linear, 'range');

  return Boolean(kindOf(choosing.linear, 'pieces')) ||
    Boolean(range) && choosing.count >= longRun;
}

// Each kind of description, as the set's candidates offer it or not.
const finders: {
  [kind: string]: (choosing: Choosing) => Described | false | null | undefined;
} = {
  all(choosing) {
    return kindOf(choosing.linear, 'all');
  },
  cadence(choosing) {
    return kindOf(choosing.linear, 'cadence');
  },
  // A set that is itself a cadence is said as one, with its ends, and
  // not as a longer cadence less a value.
  exception(choosing) {
    return !kindOf(choosing.linear, 'cadence') && exceptionOn(choosing,
      choosing.cadenceBase ? ['all', 'cadence'] : ['all']);
  },
  exceptionInRun(choosing) {
    const found = exceptionOn(choosing, ['range']);
    const pieces = kindOf(choosing.linear, 'pieces');
    const otherwise = pieces ? namedBy(pieces) : choosing.count;

    return found && boundsNamed + found.removed.length < otherwise && found;
  },
  few(choosing) {
    const step = kindOf(choosing.linear, 'cadence');
    const long = hasLongRun(choosing);
    const named = choosing.count <= choosing.few &&
      !(choosing.runsFirst && long) ||
      choosing.count <= choosing.scattered && !long &&
      !(step && isAlternate(step));

    return named && kindOf(choosing.linear, 'values');
  },
  // Runs and single values, or runs and steps together. A step is worked
  // out where a value is recognised, so the steps are said only where
  // they name at least two things fewer than the other way.
  pieces(choosing) {
    const plain = kindOf(choosing.linear, 'pieces');
    const otherwise = plain ? namedBy(plain) : choosing.count;
    const stepped = choosing.pieces &&
      namedBy(choosing.pieces) + stepMargin <= otherwise && choosing.pieces;

    return stepped || plain && namedBy(plain) < choosing.count && plain;
  },
  run(choosing) {
    return choosing.count >= longRun && kindOf(choosing.linear, 'range');
  },
  tiling(choosing) {
    const step = kindOf(choosing.linear, 'cadence');

    return step && isBare(step, choosing.domain) && step;
  },
  values(choosing) {
    return kindOf(choosing.linear, 'values');
  },
  wrapped(choosing) {
    const range = kindOf(choosing.own, 'range');

    return choosing.wraps && choosing.count >= longRun && range &&
      range.from > range.to && range;
  }
};

/**
 * A set to choose a description for, from its candidates as the field
 * gives them and with nothing wrapping.
 */
function choosingOf(
  views: {linear: SetDescription[]; own?: SetDescription[]},
  domain: Domain,
  opts: Partial<Choosing> = {}
): Choosing {
  return {
    cadenceBase: true,
    count: sizeOf(views.linear[views.linear.length - 1], domain),
    domain,
    few: 4,
    guarded: NaN,
    linear: views.linear,
    own: views.own ?? views.linear,
    pieces: null,
    runsFirst: false,
    scattered: 0,
    wraps: false,
    ...opts
  };
}

/** The first description, in the order given, that the set offers. */
function choose(order: string[], choosing: Choosing): Described {
  return order.reduce(function next(found: Described | null, kind) {
    return found || finders[kind](choosing) || null;
  }, null) as Described;
}

/** The runs of consecutive values in a list in ascending order. */
function runsOf(values: number[]): number[][] {
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

export type {CadenceDescription, RangeDescription, ValuesDescription};
export {
  choose, choosingOf, firstRule, isAlternate, isBare, kindOf, runsOf, sizeOf,
  valuesOf
};
