// The form a field's set of values is said in. The core offers every
// compact description of a set; this chooses among them in the one order
// the answers give ("How a form is chosen"), by how many values there are
// and how they are arranged, never by which values they are.

import type {
  CadenceDescription, Domain, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/index.js';

/** A run of consecutive values; one value when its two ends are the same. */
export interface Span {
  from: number;
  to: number;
  // The run reaches the end of a field that has one, and names only a start.
  open?: boolean;
}

// Every form carries its values in ascending order.
interface Valued {
  values: number[];
}

/** Evenly spaced values. */
export interface CadenceForm extends Valued {
  kind: 'cadence';
  // No value of the cycle is missing before its start or after its last.
  fills: boolean;
  // It starts on the first value of the cycle.
  fromFirst: boolean;
  interval: number;
  last: number;
  open: boolean;
  start: number;
  // It fills the cycle and its interval divides the cycle, so every gap
  // is the same, the one across the end of the cycle too.
  tiles: boolean;
}

/** One run of values, which may pass the end of its cycle. */
export interface RangeForm extends Valued, Span {
  kind: 'range';
  wraps: boolean;
}

/** A simpler set with one or two values taken out. */
export interface ExceptForm extends Valued {
  kind: 'except';
  base: Form;
  removed: number[];
}

/** Runs and single values together, in the order they are said. */
export interface PiecesForm extends Valued {
  kind: 'pieces';
  spans: Span[];
}

/** The form chosen for a set of values. */
export type Form =
  | Valued & {kind: 'all'}
  | Valued & {kind: 'one'}
  | Valued & {kind: 'list'}
  | CadenceForm
  | RangeForm
  | ExceptForm
  | PiecesForm;

/** What a field lets a set of its values be said as. */
export interface Reading {
  domain: Domain;
  // The value the cycle is walked from, when not its lowest.
  first?: number;
  // The fewest values that make a run.
  run: number;
  // Whether two neighbours beside other values are a run of their own.
  pairs?: boolean;
  pieces?: boolean;
  // Whether a cadence with a value or two missing is said as that.
  exceptCadence?: boolean;
  // Whether a cadence is said as a cadence.
  steps(cadence: CadenceForm): boolean;
}

/** One way of saying each form, in a context. */
export type Sayers<Context, Result> = {
  [Kind in Form['kind']]:
  (form: Extract<Form, {kind: Kind}>, context: Context) => Result;
};

type Found = Form | false | null | undefined;
type SetKind = SetDescription['kind'];

function sizeOf(domain: Domain): number {
  return domain.max - domain.min + 1;
}

function ofKind<K extends SetKind>(candidates: SetDescription[], kind: K) {
  return candidates.find(function isKind(candidate) {
    return candidate.kind === kind;
  }) as Extract<SetDescription, {kind: K}> | undefined;
}

function cadenceForm(found: CadenceDescription, reading: Reading):
  CadenceForm {
  const {domain} = reading;
  const {interval, last, start} = found;
  const fills = start - domain.min < interval && last + interval > domain.max;

  return {
    fills,
    fromFirst: start === domain.min,
    interval,
    kind: 'cadence',
    last,
    open: Boolean(found.open),
    start,
    tiles: fills && sizeOf(domain) % interval === 0,
    values: denote(found, domain)
  };
}

function whole(candidates: SetDescription[], values: number[]): Found {
  return ofKind(candidates, 'all') && {kind: 'all', values};
}

function single(candidates: SetDescription[], values: number[]): Found {
  return values.length === 1 && {kind: 'one', values};
}

function stepped(
  candidates: SetDescription[],
  values: number[],
  reading: Reading
): Found {
  const found = ofKind(candidates, 'cadence');
  const form = found && cadenceForm(found, reading);

  return form && reading.steps(form) && form;
}

// Where a value comes in the walk of its cycle.
function placeOf(value: number, reading: Reading): number {
  const size = sizeOf(reading.domain);

  return (value - (reading.first ?? reading.domain.min) + size) % size;
}

function wrapped(
  candidates: SetDescription[],
  values: number[],
  reading: Reading
): Found {
  const found = ofKind(candidates, 'range');

  return found && values.length >= reading.run && {
    from: found.from,
    kind: 'range',
    open: Boolean(found.open),
    to: found.to,
    values,
    wraps: placeOf(found.from, reading) > placeOf(found.to, reading)
  };
}

function straight(
  candidates: SetDescription[],
  values: number[],
  reading: Reading
): Found {
  const run = wrapped(candidates, values, reading) as RangeForm | undefined;

  return run && !run.wraps && run;
}

// One or two values taken from the whole field, or from a cadence where
// the field says cadences, with more than four values left.
function excepted(
  candidates: SetDescription[],
  values: number[],
  reading: Reading
): Found {
  return values.length > 4 && candidates.flatMap(function each(candidate) {
    return candidate.kind === 'except' ? [candidate] : [];
  }).map(function asForm(found): ExceptForm {
    return {
      base: formOf([found.base], reading),
      kind: 'except',
      removed: found.removed,
      values
    };
  }).find(function sayable(form) {
    return form.removed.length <= 2 && (form.base.kind === 'all' ||
      form.base.kind === 'cadence' && Boolean(reading.exceptCadence));
  });
}

/**
 * The runs among values in the order given: each value alone, or with
 * its neighbour where the field takes two neighbours for a run.
 */
function runsIn(values: number[], reading: Reading): Span[] {
  const size = sizeOf(reading.domain);
  const spans: Span[] = [];

  values.forEach(function place(value) {
    const current = spans[spans.length - 1];

    if (reading.pairs && current && (value - current.to + size) % size === 1) {
      current.to = value;
    }
    else {
      spans.push({from: value, to: value});
    }
  });

  return spans;
}

function inPieces(
  candidates: SetDescription[],
  values: number[],
  reading: Reading
): Found {
  const found = reading.pieces && ofKind(candidates, 'pieces');

  // Pieces are said in ascending order of their first value, a run that
  // passes the end of its cycle with the rest.
  return found && {
    kind: 'pieces',
    spans: found.parts.flatMap(function spansOfPart(part): Span[] {
      return part.kind === 'range' ? [part] : runsIn(part.values, reading);
    }).sort(function byFirst(a, b) {
      return a.from - b.from;
    }),
    values
  };
}

function listed(candidates: SetDescription[], values: number[]): Found {
  return {kind: 'list', values};
}

// The order of choice. A set that is itself a cadence is said as one
// before it is said as a longer cadence with its last values missing.
const attempts = [
  whole, single, stepped, straight, excepted, wrapped, inPieces, listed
];

/** The form a set of values is said in, from the core's candidates. */
function formOf(candidates: SetDescription[], reading: Reading): Form {
  const values = denote(candidates[candidates.length - 1], reading.domain);

  return attempts.reduce<Found>(function first(found, attempt) {
    return found || attempt(candidates, values, reading);
  }, null) as Form;
}

/** A form said in the way its kind is said. */
function sayBy<Context, Result>(
  sayers: Sayers<Context, Result>,
  form: Form,
  context: Context
): Result {
  const say = sayers[form.kind] as (form: Form, context: Context) => Result;

  return say(form, context);
}

/** What an exception is taken from; any other form itself. */
function coreOf(form: Form): Form {
  return form.kind === 'except' ? form.base : form;
}

/** The values an exception leaves out; none for any other form. */
function removedOf(form: Form): number[] {
  return form.kind === 'except' ? form.removed : [];
}

function ownSpans(form: PiecesForm | RangeForm): Span[] {
  return form.kind === 'range' ? [form] : form.spans;
}

function eachAlone(form: Form): Span[] {
  return form.values.map(function alone(value) {
    return {from: value, to: value};
  });
}

const spanSayers: Sayers<null, Span[]> = {
  all: eachAlone,
  cadence: eachAlone,
  except: eachAlone,
  list: eachAlone,
  one: eachAlone,
  pieces: ownSpans,
  range: ownSpans
};

/** A form's runs: its own where it has them, else each value alone. */
function spansOf(form: Form): Span[] {
  return sayBy(spanSayers, form, null);
}

export {coreOf, formOf, removedOf, runsIn, sayBy, spansOf};
