// How a set of field values is said: one order of choice for every field
// (answers, "How a form is chosen"). It looks at how many values there are
// and how they lie, never at which values they are, and it chooses among
// the descriptions the core offers.

import {denote} from '../../core/describe-set.js';
import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';

/** A description of a set that the renderer has a way of saying. */
export type Form = SetDescription | CadencePieces;

/** A base with a few values left out. */
export type Except = Extract<SetDescription, {kind: 'except'}>;

/** A form that is not a base with values left out. */
export type Plain = Exclude<Form, Except>;

/** Runs and single values. */
export type Pieces = Extract<SetDescription, {kind: 'pieces'}>;

/** One member of a set said in several parts. */
export type Member =
  RangeDescription | CadenceDescription | ValuesDescription;

/** What a field's sets may be said as. */
export interface Habits {
  // How many values are still named one by one.
  limit: number;
  // Whether runs and single values are said together. The seven weekdays
  // never are: a few are named, and more are every day less one or two.
  pieces: boolean;
  // Whether a rhythm is said with nothing but its step.
  bare(cadence: CadenceDescription, domain: Domain): boolean;
  // Whether a rhythm is one a reader holds whole, so that a value or two
  // can be left out of it.
  beat(cadence: CadenceDescription, domain: Domain): boolean;
  // Whether the field is ever said as a rhythm with its ends.
  rhythm: boolean;
}

/** A field's set of values, with every description the core has of it. */
export interface FieldSet {
  candidates: SetDescription[];
  domain: Domain;
  habits: Habits;
  // The set as runs and rhythms together, when it is that.
  mixed: CadencePieces | null;
}

/** A field's set as it is said: a form, and what is left out of it. */
export interface Part {
  // The form the set is said in, or the base of one with values left out.
  base: Plain;
  removed: number[];
  // The rhythm that fills the cycle, when the set is one.
  tiling?: CadenceDescription;
  // The values of the set, in the order the core lists them.
  values: number[];
}

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

/**
 * Whether a rhythm starts within its first step and runs to the end of
 * its cycle.
 */
function fills(cadence: CadenceDescription, domain: Domain): boolean {
  return cadence.start - domain.min < cadence.interval &&
    cadence.last + cadence.interval > domain.max;
}

/** Whether a rhythm fills its cycle with a step that divides it. */
function tiles(cadence: CadenceDescription, domain: Domain): boolean {
  return fills(cadence, domain) && sizeOf(domain) % cadence.interval === 0;
}

function tilesFromTheTop(cadence: CadenceDescription, domain: Domain):
  boolean {
  return tiles(cadence, domain) && cadence.start === domain.min;
}

// Hours are a rhythm of the day only from three of them: two are named.
function tilesTheDay(cadence: CadenceDescription, domain: Domain): boolean {
  return tiles(cadence, domain) && cadence.last > cadence.start +
    cadence.interval;
}

// All the odd or all the even days of the month.
function everySecondDay(cadence: CadenceDescription, domain: Domain):
  boolean {
  return cadence.interval === 2 && fills(cadence, domain);
}

function never(): boolean {
  return false;
}

/** The habits of each field (answers 3.10 and the order of choice). */
const habits = {
  date: {
    bare: everySecondDay, beat: everySecondDay, limit: 7, pieces: true,
    rhythm: true
  },
  hour: {
    bare: tilesTheDay, beat: tilesTheDay, limit: 4, pieces: true,
    rhythm: true
  },
  minute: {
    bare: tilesFromTheTop, beat: tiles, limit: 4, pieces: true, rhythm: true
  },
  month: {bare: never, beat: never, limit: 6, pieces: true, rhythm: false},
  second: {
    bare: tilesFromTheTop, beat: tiles, limit: 4, pieces: true, rhythm: true
  },
  weekday: {bare: never, beat: never, limit: 4, pieces: false, rhythm: false},
  year: {bare: never, beat: never, limit: 5, pieces: true, rhythm: true}
};

function isRange(form: Form): form is RangeDescription {
  return form.kind === 'range';
}

function isCadence(form: Form): form is CadenceDescription {
  return form.kind === 'cadence';
}

function isPieces(form: Form): form is Pieces {
  return form.kind === 'pieces';
}

function isExcept(form: Form): form is Except {
  return form.kind === 'except';
}

function isValues(form: Form): form is ValuesDescription {
  return form.kind === 'values';
}

// The first and last value of a run or a rhythm.
function endsOf(base: SetDescription): number[] {
  const ends = {from: NaN, last: NaN, start: NaN, to: NaN, ...base};

  return [ends.from, ends.to, ends.start, ends.last];
}

// Whether every value left out lies inside the base, so that the base's
// own ends still fire.
function leftOutInside(found: Except): boolean {
  const ends = endsOf(found.base);

  return found.removed.every(function inside(value) {
    return !ends.includes(value);
  });
}

// How many values pieces name one by one.
function singlesIn(pieces: Pieces): number {
  return pieces.parts.filter(isValues).reduce(function count(sum, part) {
    return sum + part.values.length;
  }, 0);
}

// A rhythm with values left out of it, as the stretches of the rhythm
// that are left: the odd days less the 15th are the odd days from the 1st
// to the 13th and from the 17th to the 31st.
function stretchesLeft(found: Except): CadencePieces {
  const base = found.base as CadenceDescription;
  const step = base.interval;
  const edges = [base.start - step, ...found.removed, base.last + step];
  const parts: Member[] = [];

  edges.slice(1).forEach(function between(edge, at) {
    const start = edges[at] + step;
    const last = edge - step;

    if (start < last) {
      parts.push({interval: step, kind: 'cadence', last, start});
    }
    else if (start === last) {
      parts.push({kind: 'values', values: [start]});
    }
  });

  return {kind: 'cadencePieces', parts};
}

// Whether a base with values left out is a rhythm a reader holds whole,
// less one or two values inside it.
function isBrokenBeat(found: Except, set: FieldSet): boolean {
  return isCadence(found.base) && set.habits.beat(found.base, set.domain) &&
    found.removed.length <= 2 && leftOutInside(found);
}

// Whether a base with values left out is every value, a run or a rhythm
// less one or two.
function lacksAFew(found: Except, set: FieldSet): boolean {
  const few = found.removed.length <= 2;

  return few && found.base.kind === 'all' ||
    few && isRange(found.base) && leftOutInside(found) ||
    isBrokenBeat(found, set);
}

// A set said with an exception: every value but one first, then (after a
// run has had its turn) a whole less one or two. An arm of a union takes
// no exception; there a rhythm with values missing is said by the
// stretches of it that are left.
function withAnException(set: FieldSet, positive: boolean) {
  const excepts = set.candidates.filter(isExcept);
  const broken = excepts.find(function beat(found) {
    return isBrokenBeat(found, set);
  });
  const butOne = excepts.find(function lacksOne(found) {
    return found.base.kind === 'all' && found.removed.length === 1;
  });
  const butAFew = excepts.find(function lacks(found) {
    return lacksAFew(found, set);
  });

  return positive ?
    {butAFew: broken && stretchesLeft(broken), butOne: null} :
    {butAFew, butOne};
}

// A list is short when it is within the field's limit and holds no three
// values in a row. Weekdays are named even with three in a row among
// them, unless they are one run.
function shortList(set: FieldSet, listed: ValuesDescription) {
  const run = set.candidates.find(isRange);
  const count = listed.values.length;
  const inARow = set.habits.pieces && set.candidates.some(isPieces) ||
    run && count > 2;

  return count <= set.habits.limit && !inARow && listed;
}

// Runs and single values, and the runs and rhythms together that are
// tried before them when their single values are too many to name.
function inParts(set: FieldSet, count: number) {
  const pieces = set.habits.pieces && set.candidates.find(isPieces);
  const few = pieces && singlesIn(pieces) <= set.habits.limit;

  return [
    few && pieces,
    set.habits.rhythm && count > 6 && set.mixed,
    pieces
  ];
}

/**
 * The form a set is said in. `positive` is for a set that may not be said
 * with an exception (an arm of a union): it is then said by what is in
 * it.
 */
function choose(set: FieldSet, positive = false): Form {
  const {candidates, domain} = set;
  const rules = set.habits;
  const [whole] = candidates;
  const listed = candidates[candidates.length - 1] as ValuesDescription;

  if (whole.kind === 'all') {
    return whole;
  }

  const count = listed.values.length;
  const cadence = candidates.find(isCadence);
  const {butAFew, butOne} = withAnException(set, positive);
  const options: Array<Form | false | null | undefined> = [
    count === 1 && listed,
    cadence && rules.bare(cadence, domain) && cadence,
    shortList(set, listed),
    butOne,
    candidates.find(isRange),
    butAFew,
    rules.rhythm && cadence,
    ...inParts(set, count),
    listed
  ];

  return options.find(Boolean) as Form;
}

/** A set in its chosen form, apart from the values left out of it. */
function partOf(set: FieldSet, positive = false): Part {
  const form = choose(set, positive);
  const {base, removed} = isExcept(form) ? form : {base: form, removed: []};

  return {
    base: base as Plain,
    removed,
    tiling: [base, ...set.candidates].filter(isCadence).find(
      function fillsTheCycle(cadence) {
        return tiles(cadence, set.domain);
      }
    ),
    values: denote(set.candidates[set.candidates.length - 1], set.domain)
  };
}

export {fills, habits, isCadence, isRange, isValues, partOf, tiles};
