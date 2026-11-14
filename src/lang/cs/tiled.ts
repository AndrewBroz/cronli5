// Hours that tile the day: a cadence whose step divides the day, from
// midnight or from a start inside its first step. They are said bare,
// «každé 2 hodiny» or «každé 2 hodiny od 1:00», and the minutes follow
// apart from them, in the short forms of a place in the hour: the hour is
// «celá hodina» without «každá», and a stretch stands before its rhythm.

import type {
  CadenceDescription, CadencePieces, RangeDescription, SetDescription
} from '../../core/schedule.js';
import type {Clock} from './clock.js';
import {between, clock} from './clock.js';
import type {CzechStyle} from './options.js';
import type {Described} from './sets.js';
import {
  cadenceCount, comesRound, counted, enoughForARun, everyUnit, listed,
  ofKind, partsJoiner, runsOf, shortList, spaced
} from './sets.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

const lastMinute = 59;

/** The cadence the hours tile the day with, and the hours removed from it. */
export interface Tiling {
  cadence: CadenceDescription;
  removed: number[];
}

/**
 * The tiling of the hours, or null. From midnight it needs three hours,
 * from a later start more than the four a list holds; an exception of a
 * few hours to such a cadence tiles too.
 */
function tilingOf(hours: Clock, candidates: SetDescription[]): Tiling | null {
  const {domain, form} = hours;
  const removed = form.kind === 'except' && form.removed || [];
  const base = form.kind === 'except' && form.base || form;
  const cadence = base.kind === 'cadence' && base ||
    form.kind === 'values' && ofKind(candidates, 'cadence');

  return cadence && tiles(cadence, domain) && {cadence, removed} || null;
}

// Whether a cadence tiles the day: it comes round evenly, with three
// hours from midnight or, from a later start, more than a list holds.
function tiles(cadence: CadenceDescription, domain: Clock['domain']):
  boolean {
  const fewest = cadence.start && shortList + 1 || enoughForARun;

  return comesRound(cadence, domain) && cadenceCount(cadence) >= fewest;
}

/** The bare cadence of the hours, with its start when it starts later. */
function tiledHours(tiling: Tiling, style: CzechStyle): string {
  const {interval, start} = tiling.cadence;

  return spaced(everyUnit(interval, units.hour),
    start && spaced(words.from, clock([start, 0], style)) || '');
}

// A run of minutes before its rhythm: the first or last minutes of the
// hour, or from one place to another.
function runApart(run: RangeDescription, rhythm: string): string {
  const length = String(run.to - run.from + 1);
  const edge =
    !run.from && words.inTheFirst || run.to === lastMinute && words.inTheLast;

  return edge &&
    spaced(edge, length, words.minutesLocative, words.ofTheHour, rhythm) ||
    `${spaced(words.from, String(run.from), words.to, String(run.to),
      units.minute.many, words.afterTheFullHour, words.inclusive)}, ${rhythm}`;
}

// A cadence of minutes from its first place to its last, before its
// rhythm; one that tiles the hour from zero is every minute of it.
function cadenceApart(cadence: CadenceDescription): string {
  const rhythm = everyUnit(cadence.interval, units.minute);
  const span = cadence.start && spaced(words.from, String(cadence.start),
    words.to, String(cadence.last), units.minute.many,
    words.afterTheFullHour) ||
    spaced(words.fromTheFullHour, words.to, String(cadence.last),
      units.minute.many, words.afterIt);

  return !cadence.start && cadence.last + cadence.interval === lastMinute + 1 &&
    spaced(words.forOneHour, rhythm) ||
    `${spaced(span, words.inclusive)}, ${rhythm}`;
}

// Minutes as places from the full hour: «15 a 45 minut po celé hodině»,
// «v celou hodinu a 15 a 45 minut po ní».
function valuesApart(values: number[], second: number[]): string {
  const later = values.filter(Boolean);
  const lead = !values[0] && later.length > 0;
  const counts = [
    later.length && counted(later, units.minute),
    second.length && counted(second, units.second)
  ].filter(Boolean);

  return counts.length && spaced(lead && words.onTheFullHour || '',
    lead && words.and || '', counts.join(` ${words.and} `),
    lead && words.afterIt || words.afterTheFullHour) || '';
}

// Removed minutes after the base: the full hour and moments after it.
function removedApart(removed: number[]): string {
  const later = removed.filter(Boolean);
  const moments = later.length && spaced(words.theMoment,
    counted(later, units.minute),
    removed[0] && words.afterTheFullHour || words.afterIt) || '';

  return removed[0] && spaced(words.except, moments) ||
    listed([words.exceptTheFullHour, moments].filter(Boolean));
}

/**
 * The minutes said apart from hours that tile the day, without their
 * «vždy»: empty for minute 0 alone. `rhythm` is what every minute of a
 * stretch is said as («každou minutu», or the seconds' rhythm), and
 * `second` the one second that joins a single minute.
 */
function minutesApart(minutes: Clock, rhythm: string, second: number[]):
  string {
  const {form} = minutes;

  function said(found: Described): string {
    const kinds: {[kind: string]: () => string} = {
      all: () => spaced(words.forOneHour, rhythm),
      cadence: () => cadenceApart(found as CadenceDescription),
      except: () => `${said((found as {base: Described}).base)}, ${
        removedApart((found as {removed: number[]}).removed)}`,
      pieces: () => (found as {parts: Described[]}).parts.map(
        function part(each, index) {
          return each.kind === 'values' && spaced(index && words.still || '',
            valuesApart(each.values, []) || words.onTheFullHour) ||
            said(each);
        }
      ).join(` ${partsJoiner((found as CadencePieces).parts)} `),
      range: () => runApart(found as RangeDescription, rhythm),
      values: () => valuesApart((found as {values: number[]}).values, second)
    };

    kinds.cadencePieces = kinds.pieces;

    return kinds[found.kind]();
  }

  return minutes.tiles && form.kind === 'values' && form.values.length > 1 &&
    spaced(words.forOneHour, everyUnit(minutes.step, units.minute)) ||
    said(form);
}

/**
 * The hours removed from a tiling: clock times at one minute, and whole
 * hours otherwise.
 */
function removedHours(tiling: Tiling, minutes: Clock, shown: {
  second: number[];
  style: CzechStyle;
}): string {
  const {removed} = tiling;
  const [minute] = minutes.values;
  const {second, style} = shown;

  const times = minutes.values.length === 1 &&
    spaced(words.except, listed(removed.map(function at(hour) {
      return clock([hour, minute, ...second], style);
    })));

  return removed.length && (times ||
    spaced(words.exceptTheSpan, listed(runsOf(removed).map(
      function whole(run) {
        return between([run.from, 0], [run.to, lastMinute], style);
      }
    )))) || '';
}

export {minutesApart, removedHours, tiledHours, tilingOf};
