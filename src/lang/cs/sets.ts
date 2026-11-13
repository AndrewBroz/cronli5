// How a set of values is said: the order in which the core's descriptions
// of a set are tried, the same for every field that has no order of its
// own, and the small pieces of grammar every part of the sentence shares.

import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import type {Unit} from './lexicon.js';
import {denote, describeCadencePieces} from '../../core/index.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** Any description of a set the core offers. */
export type Described = SetDescription | CadencePieces;

/** One description of a kind, among several. */
type OfKind<Kind> = Extract<Described, {kind: Kind}>;

// A run needs this many values to be said as a range, and a cadence that
// starts after the bottom of its field to be heard as a rhythm.
const enoughForARun = 3;

// A set of this many values or fewer is read off as a list.
const shortList = 4;

// A cadence that does not come round is listed up to this many values.
const longestListedCadence = 7;

// Runs and cadences together are said when they are at most this many parts.
const mostParts = 3;

// An exception to the whole field names at most this many values.
const fewMissing = 2;

// How many things a range or a cadence names: its two ends.
const endsNamed = 2;

/** Items joined by commas, the last by «a» or another word. */
function listed(items: string[], last: string = words.and): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${last} `);
}

/** Words joined by spaces, the empty ones left out. */
function spaced(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/** The form of a unit after a number: «1 minutu», «2 minuty», «5 minut». */
function unitAfter(count: number, unit: Unit): string {
  return [unit.many, unit.one, unit.few, unit.few, unit.few][count] ||
    unit.many;
}

/** Numbers as a list with the unit in the form the last one asks for. */
function counted(values: number[], unit: Unit): string {
  return spaced(listed(values.map(String)),
    unitAfter(values[values.length - 1], unit));
}

/** A rhythm: «každou minutu», «každé 2 hodiny», «každých 15 minut». */
function everyUnit(step: number, unit: Unit): string {
  const every = [words.everyMany, words.everyOne, words.everyFew,
    words.everyFew, words.everyFew][step] || words.everyMany;

  return [every, step, unitAfter(step, unit)].filter(function said(part) {
    return part !== 1;
  }).join(' ');
}

/** The first description of a kind among the candidates. */
function ofKind<Kind extends Described['kind']>(
  candidates: Described[],
  kind: Kind
): OfKind<Kind> | undefined {
  return candidates.find(function isKind(candidate) {
    return candidate.kind === kind;
  }) as OfKind<Kind> | undefined;
}

/** A run or a cadence as its first and last value and its step. */
function stretchOf(part: RangeDescription | CadenceDescription):
  {first: number; last: number; step: number} {
  return 'interval' in part ?
    {first: part.start, last: part.last, step: part.interval} :
    {first: part.from, last: part.to, step: 1};
}

/** How many values a cadence has. */
function cadenceCount(cadence: CadenceDescription): number {
  return (cadence.last - cadence.start) / cadence.interval + 1;
}

/**
 * Whether a cadence comes round evenly: the gap from its last value back
 * to its first, round the field, is its step.
 */
function comesRound(cadence: CadenceDescription, domain: Domain): boolean {
  return cadence.start + domain.max - domain.min + 1 - cadence.last ===
    cadence.interval;
}

/** The maximal runs of consecutive values, in ascending order. */
function runsOf(values: number[]): RangeDescription[] {
  const runs: RangeDescription[] = [];

  values.forEach(function place(value) {
    const current = runs[runs.length - 1];

    if (current && value === current.to + 1) {
      current.to = value;
    }
    else {
      runs.push({from: value, kind: 'range', to: value});
    }
  });

  return runs;
}

// How many things a description names: a list each value, pieces two per
// range and one per single value, an exception its base and each removed
// value.
function named(found: Described): number {
  const counts: {[kind: string]: () => number} = {
    cadence: () => endsNamed,
    cadencePieces: () => (found as CadencePieces).parts.map(named)
      .reduce((sum, count) => sum + count, 0),
    except: () => named((found as OfKind<'except'>).base) +
      (found as OfKind<'except'>).removed.length,
    pieces: () => (found as OfKind<'pieces'>).parts.map(named)
      .reduce((sum, count) => sum + count, 0),
    range: () => endsNamed,
    values: () => (found as ValuesDescription).values.length
  };

  return (counts[found.kind] || (() => 0))();
}

/**
 * The runs and cadences a long set is made of, when they are few: more
 * than seven values in at most three parts, and null for any other set.
 */
function togetherIn(candidates: SetDescription[], domain: Domain):
  CadencePieces | null {
  const values = denote(candidates[candidates.length - 1], domain);
  const found = values.length > longestListedCadence &&
    describeCadencePieces(values, domain);

  return found && found.parts.length <= mostParts ? found : null;
}

const tieOrder = ['pieces', 'except', 'cadencePieces', 'values'];

/**
 * Whichever of the exceptions, the pieces and the plain list names the
 * fewest things; on a tie pieces, then an exception, then the list.
 */
function fewestNamed(candidates: Described[]): Described {
  return tieOrder.flatMap(function inOrder(kind) {
    return candidates.filter(function isKind(candidate) {
      return candidate.kind === kind;
    });
  }).reduce(function fewer(best, candidate) {
    return named(candidate) < named(best) ? candidate : best;
  });
}

/** What the generic order may do for a field. */
export interface Order {
  // The values the field can take.
  domain: Domain;
  // Whether one or two missing values are said as an exception.
  exceptions: boolean;
  // Whether a cadence can come round: the units of the clock do.
  rounds: boolean;
  // Runs and cadences together, where the field says them.
  together?: CadencePieces | null;
}

// A cadence as the generic order says it: itself when it comes round
// evenly or is long, and otherwise its values as a list.
function cadenceSaid(candidates: SetDescription[], order: Order):
  Described | undefined {
  const list = candidates[candidates.length - 1];
  const cadence = ofKind(candidates, 'cadence');
  const rhythm = cadence && (named(list) > longestListedCadence ||
    order.rounds && comesRound(cadence, order.domain));

  return cadence && (rhythm ? cadence : list);
}

// The exception of one or two values to the whole field, where the field
// says one.
function fewMissingOf(candidates: SetDescription[], order: Order):
  Described | undefined {
  return candidates.find(function missesFew(candidate) {
    return order.exceptions && candidate.kind === 'except' &&
      candidate.base.kind === 'all' && candidate.removed.length <= fewMissing;
  });
}

/**
 * The description the generic order says: the whole field, one value, an
 * exception of one or two values, a run, a short list, a cadence (listed
 * when it is short and does not come round), and otherwise whatever
 * names the fewest things. A cadence said as a list comes back as its
 * values.
 */
function chosen(candidates: SetDescription[], order: Order): Described {
  const list = candidates[candidates.length - 1];
  const size = named(list);
  const range = size >= enoughForARun && ofKind(candidates, 'range');
  const short = size <= shortList && list;

  return ofKind(candidates, 'all') || size === 1 && list ||
    fewMissingOf(candidates, order) || range || short ||
    cadenceSaid(candidates, order) ||
    fewestNamed([...candidates, ...order.together ? [order.together] : []]);
}

export {
  cadenceCount, chosen, comesRound, counted, enoughForARun, everyUnit,
  fewestNamed, listed, longestListedCadence, ofKind, runsOf, spaced,
  stretchOf, togetherIn, unitAfter
};
