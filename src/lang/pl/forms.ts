// The kind of a set of seconds, minutes or hours: the first of the
// answers' kinds that applies ("How a form is chosen"). A kind depends on
// how many values there are and how they are arranged, never on which.

import type {
  CadencePieces, Domain, Field, ScheduleFacts, SetDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';

/** The kinds a set of clock values can be, in the order they are tried. */
export type Kind = 'all' | 'allBut' | 'cadence' | 'cadencePieces' | 'less' |
  'list' | 'one' | 'pieces' | 'run' | 'tiling' | 'wrap';

/**
 * A set of clock values as it will be said. Every kind carries every
 * field, so that a sayer reads what it needs without asking the kind.
 */
export interface Form {
  kind: Kind;
  // The values, ascending.
  values: number[];
  // The first and last value as said: a run that wraps has `from > to`.
  from: number;
  to: number;
  // The step of the rhythm (of the base, for a rhythm less a value); 1
  // where every value in a stretch fires.
  interval: number;
  // A rhythm off the beat whose gaps are all equal.
  seamless: boolean;
  // One rhythm through the whole unit: every value, a tiling rhythm, or
  // either less one or two.
  steady: boolean;
  // What an exception takes away, and what it takes it from.
  removed: number[];
  base: Form | null;
  // The parts of pieces, ascending.
  parts: Form[];
}

type Maybe<T> = T | false | null | undefined;

// A field's set with everything the kinds are decided from.
interface FieldSet {
  // The candidates in the layout a run is read from: runs may wrap only
  // where the answers let them stay whole.
  cands: SetDescription[];
  domain: Domain;
  linear: SetDescription[];
  // The fewest values that make a tiling rhythm.
  minTiling: number;
  runsAndCadences: CadencePieces | null;
  values: number[];
}

const few = 4;
const minRun = 3;
const minRhythm = 5;
const minLeft = 7;
const maxListed = 12;

function make(kind: Kind, values: number[], extra: Partial<Form>): Form {
  return {
    base: null,
    from: values[0],
    interval: 1,
    kind,
    parts: [],
    removed: [],
    seamless: false,
    steady: false,
    to: values[values.length - 1],
    values,
    ...extra
  };
}

function pick<K extends SetDescription['kind']>(
  cands: SetDescription[],
  kind: K
): Extract<SetDescription, {kind: K}> | undefined {
  return cands.find(function ofKind(cand) {
    return cand.kind === kind;
  }) as Extract<SetDescription, {kind: K}> | undefined;
}

// A set standing alone, nothing wrapping: a part of pieces, or the base
// of an exception, in the form it would have by itself.
function alone(values: number[], set: FieldSet): Form {
  const cands = describeSet(values, set.domain, {linear: true});

  return formOf({...set, cands, linear: cands, runsAndCadences: null,
    values});
}

function whole(set: FieldSet): Maybe<Form> {
  return set.cands[0].kind === 'all' &&
    make('all', set.values, {steady: true});
}

function single(set: FieldSet): Maybe<Form> {
  return set.values.length === 1 && make('one', set.values, {});
}

// A rhythm that starts on the unit's first value and whose step divides
// the unit.
function tiling(set: FieldSet): Maybe<Form> {
  const found = pick(set.cands, 'cadence');

  return found && found.start === set.domain.min &&
    found.last + found.interval === set.domain.max + 1 &&
    set.values.length >= set.minTiling &&
    make('tiling', set.values, {interval: found.interval, steady: true});
}

function run(set: FieldSet): Maybe<Form> {
  const range = pick(set.cands, 'range');

  return range && range.from <= range.to && set.values.length >= minRun &&
    make('run', set.values, {});
}

function allBut(set: FieldSet): Maybe<Form> {
  const found = set.cands.find(function fromAll(cand) {
    return cand.kind === 'except' && cand.base.kind === 'all' &&
      cand.removed.length <= 2;
  }) as Extract<SetDescription, {kind: 'except'}> | undefined;

  return found && make('allBut', set.values, {
    base: make('all', denote(found.base, set.domain), {steady: true}),
    removed: found.removed,
    steady: true
  });
}

function fewValues(set: FieldSet): Maybe<Form> {
  return set.values.length <= few && make('list', set.values, {});
}

function wrap(set: FieldSet): Maybe<Form> {
  const range = pick(set.cands, 'range');

  return range && range.from > range.to &&
    make('wrap', set.values, {from: range.from, to: range.to});
}

// A rhythm that does not tile: seamless when its step divides the unit
// and it fills the unit from a start smaller than the step.
function cadence(set: FieldSet): Maybe<Form> {
  const found = pick(set.cands, 'cadence');
  const {max, min} = set.domain;

  return found && set.values.length >= minRhythm &&
    make('cadence', set.values, {
      interval: found.interval,
      seamless: (max - min + 1) % found.interval === 0 &&
        found.start - min < found.interval &&
        found.last + found.interval > max
    });
}

function pieces(set: FieldSet): Maybe<Form> {
  const found = pick(set.linear, 'pieces');

  return found && make('pieces', set.values, {
    parts: found.parts.map(function part(piece) {
      return alone(denote(piece, set.domain), set);
    })
  });
}

// A rhythm or run less one or two inner values, with enough left that the
// subtraction is worth it.
function less(set: FieldSet): Maybe<Form> {
  const found = set.cands.find(function inner(cand) {
    const kept = cand.kind === 'except' && cand.base.kind !== 'all' &&
      denote(cand.base, set.domain);

    return kept && cand.removed.length <= 2 &&
      !cand.removed.includes(kept[0]) &&
      !cand.removed.includes(kept[kept.length - 1]);
  }) as Extract<SetDescription, {kind: 'except'}> | undefined;
  const base = found && set.values.length >= minLeft &&
    alone(denote(found.base, set.domain), set);

  return found && base && make('less', set.values, {
    base,
    interval: base.interval,
    removed: found.removed,
    steady: base.kind === 'tiling'
  });
}

function runsAndCadences(set: FieldSet): Maybe<Form> {
  const found = set.runsAndCadences;

  return found && set.values.length > maxListed &&
    make('cadencePieces', set.values, {
      parts: found.parts.map(function part(piece) {
        return alone(denote(piece, set.domain), set);
      })
    });
}

function list(set: FieldSet): Form {
  return make('list', set.values, {});
}

const kinds = [
  whole, single, tiling, run, allBut, fewValues, wrap, cadence, pieces, less,
  runsAndCadences, list
];

function formOf(set: FieldSet): Form {
  return kinds.reduce<Maybe<Form>>(function first(found, kind) {
    return found || kind(set);
  }, null) as Form;
}

// Two points in every hour or minute are a rhythm; two hours a day are
// two times of day.
const minTiling: {[field: string]: number} = {hour: 3, minute: 2, second: 2};

/**
 * The form of a second, minute or hour field. Where `mayWrap` is false a
 * run is cut at the edge of its unit and its stretches are pieces.
 */
function fieldForm(
  facts: ScheduleFacts,
  field: Field,
  mayWrap: boolean
): Form {
  const domain = domainOf(field);
  const own = facts.analyses.candidates[field] as SetDescription[];
  const linear = candidatesAs(facts, field, {linear: true}) as
    SetDescription[];

  return formOf({
    cands: [linear, own][Number(mayWrap)],
    domain,
    linear,
    minTiling: minTiling[field],
    runsAndCadences: facts.analyses.cadencePieces[field],
    values: denote(own[own.length - 1], domain)
  });
}

/**
 * A tiling rhythm of few values as the list of them: the hours of «co
 * 6 godzin» under several minutes, the seconds 0 and 30 inside a minute.
 */
function asFew(form: Form): Form {
  return form.kind === 'tiling' && form.values.length <= few ?
    make('list', form.values, {}) :
    form;
}

export {asFew, fieldForm};
