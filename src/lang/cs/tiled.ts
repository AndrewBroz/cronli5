// Hours that tile the day: a cadence whose step divides the day, from
// midnight or from a start inside its first step. They are said bare,
// «každé 2 hodiny» or «každé 2 hodiny od 1:00», and the minutes follow
// apart from them, in the short forms of a place in the hour: the hour is
// «celá hodina» without «každá», and a stretch stands before its rhythm.

import type {
  CadenceDescription, CadencePieces, RangeDescription, SetDescription
} from '../../core/schedule.js';
import type {Clock, Opening} from './clock.js';
import {at, between, clock} from './clock.js';
import type {CzechStyle} from './options.js';
import type {Described} from './sets.js';
import {
  cadenceCount, comesRound, counted, enoughForARun, everyUnit, listed,
  ofKind, partsJoiner, runsOf, shortList, spaced, stretchOf
} from './sets.js';
import lexicon from './lexicon.js';

const {hourParity, units, words} = lexicon;

const lastMinute = 59;
const halfPast = 30;
const mostListedTimes = 6;

// The step of the even and the odd hours.
const stepOfTwo = 2;

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
    listed([words.exceptEveryFullHour, moments].filter(Boolean));
}

// A run of minutes in each even or odd hour, after its rhythm.
function runInParity(run: RangeDescription, rhythm: string, start: number):
  string {
  const length = String(run.to - run.from + 1);
  const edge =
    !run.from && words.inTheFirst || run.to === lastMinute && words.inTheLast;

  return edge && spaced(rhythm, edge, length, words.minutesLocative,
    hourParity.each[start]) ||
    spaced(rhythm, words.from, String(run.from), words.to, String(run.to),
      units.minute.many, hourParity.after[start], words.inclusive);
}

// The rhythm of minutes that fill the hour: every minute, or a rhythm that
// tiles it from zero, with or without a minute or two removed.
function rhythmOf(minutes: Clock, rhythm: string): string {
  const {form} = minutes;
  const base = form.kind === 'except' && form.base || form;
  const step = base.kind === 'cadence' && stepFromZero(base) ||
    form.kind === 'values' && form.values.length > 1 && minutes.tiles &&
    minutes.step;

  return base.kind === 'all' && rhythm ||
    step && everyUnit(step, units.minute) || '';
}

// The step of a cadence of minutes that tiles the hour from zero, or 0.
function stepFromZero(cadence: CadenceDescription): number {
  return Number(!cadence.start &&
    cadence.last + cadence.interval === lastMinute + 1) * cadence.interval;
}

/**
 * The minutes over a step of two hours, which are the even or the odd
 * hours: a rhythm in them or a run in each, and a minute or two removed;
 * empty for any other set, and for any other step.
 */
function parityApart(tiling: Tiling, minutes: Clock, rhythm: string): string {
  const {form} = minutes;
  const {interval, start} = tiling.cadence;
  const base = form.kind === 'except' && form.base || form;
  const step = rhythmOf(minutes, rhythm);
  const said = interval === stepOfTwo &&
    (step && spaced(step, hourParity.within[start]) ||
      base.kind === 'range' && runInParity(base, rhythm, start));

  return said && [said, form.kind === 'except' && removedApart(form.removed)]
    .filter(Boolean).join(', ') || '';
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
    spaced(words.except, listed(removed.map(function onClock(hour) {
      return clock([hour, minute, ...second], style);
    })));

  return removed.length && (times ||
    spaced(words.exceptTheSpan, listed(runsOf(removed).map(
      function whole(run) {
        return between([run.from, 0], [run.to, lastMinute], style);
      }
    )))) || '';
}

/**
 * The head of the time part over hours that tile the day: the even or the
 * odd hours under a rhythm of minutes; the bare cadence with «v půl» for
 * minute 30; otherwise the bare cadence and the minutes after «vždy».
 */
function tiledHead(tiling: Tiling, minutes: Clock, shown: {
  rhythm: string;
  second: number[];
  style: CzechStyle;
}): string {
  const {rhythm, second, style} = shown;
  const hours = tiledHours(tiling, style);
  const half = !second.length && String(minutes.values) === String(halfPast);
  const minute = minutesApart(minutes, rhythm, second);

  return parityApart(tiling, minutes, rhythm) ||
    half && spaced(hours, words.atTheHalf) ||
    [hours, minute && spaced(words.always, minute)].filter(Boolean)
      .join(', ');
}

/**
 * The hours named once, or null: a list of hours beside more than one
 * minute, from three hours, or in two hours where a
 * list of minutes that is no rhythm would make more than six clock times.
 */
function namedOf(hours: Clock, minutes: Clock): number[] | null {
  const {form} = minutes;
  const many = hours.values.length > 2 ||
    form.kind === 'values' && !minutes.step &&
    form.values.length * hours.values.length > mostListedTimes;

  return hours.form.kind === 'values' && hours.values.length > 1 &&
    minutes.values.length > 1 && many && hours.values || null;
}

// A run of minutes before hours named once: the first minutes after
// each, or from one place to another.
function runSpan(from: number, to: number): string {
  return !from && spaced(words.inTheFirst, String(to + 1),
    words.minutesLocative) ||
    spaced(words.from, String(from), words.to, String(to),
      units.minute.many, words.inclusive);
}

// Pieces of minutes before hours named once: each run or cadence with
// its stretch (the first rhythm once among runs alone, each its own where
// cadences sit among them), and single minutes after «ještě».
function piecesOnce(found: CadencePieces): string {
  const {parts} = found;
  const own = found.kind === 'cadencePieces';
  const firstRun = parts.findIndex(function isRun(part) {
    return part.kind === 'range';
  });

  return parts.map(function part(each, index) {
    const {first, last, step} = each.kind !== 'values' &&
      stretchOf(each as CadenceDescription) || {first: 0, last: 0, step: 0};

    return step && spaced(
      (own || index === firstRun) && everyUnit(step, units.minute) || '',
      runSpan(first, last)) || singlesOnce(each, index);
  }).filter(Boolean).join(` ${partsJoiner(parts)} `);
}

// Single minutes among pieces, after «ještě» when they follow another
// part; the full hour is said by the named hours.
function singlesOnce(part: CadencePieces['parts'][number], index: number):
  string {
  const later = (part as {values: number[]}).values.filter(Boolean);

  return later.length && spaced(index && words.still || '',
    counted(later, units.minute)) || '';
}

/**
 * The minutes said once before hours named once: so many minutes after
 * each hour, or a stretch of minutes from each. `rhythm` is what every
 * minute of a stretch is said as.
 */
function namedHead(hours: number[], minutes: Clock, shown: {
  rhythm: string;
  style: CzechStyle;
}): {opening: Opening; text: string} {
  const {rhythm, style} = shown;
  const named = listed(hours.map(function onTheHour(hour) {
    return clock([hour, 0], style);
  }));
  const after = spaced(words.after, named);
  const onTheHours = at(hours.map(function full(hour) {
    return [hour, 0];
  }), style);
  const through = `, ${spaced(words.always, words.forOneHour, words.from,
    named)}`;

  function plain(text: string): {opening: Opening; text: string} {
    return {opening: '', text};
  }

  function said(found: Described): {opening: Opening; text: string} {
    const cadence = found as CadenceDescription;
    const run = found as RangeDescription;
    const values = (found as {values: number[]}).values || [];
    const later = values.filter(Boolean);
    const kinds: {[kind: string]: () => {opening: Opening; text: string}} = {
      all: () => plain(rhythm + through),
      cadence: () => plain(
        !cadence.start && cadence.last + cadence.interval > lastMinute &&
          everyUnit(cadence.interval, units.minute) + through ||
        spaced(everyUnit(cadence.interval, units.minute),
          runSpan(cadence.start, cadence.last), after)),
      except: () => {
        const base = said((found as {base: Described}).base);

        return {
          ...base,
          text: `${base.text}, ${
            removedApart((found as {removed: number[]}).removed)}`
        };
      },
      pieces: () => {
        const {parts} = found as {parts: CadencePieces['parts']};
        // The full hour among them is the named hours themselves, and
        // the rest is said after them.
        const full = parts[0].kind === 'values' && !parts[0].values[0];

        return plain(spaced(full && spaced(onTheHours, words.and,
          words.always) || '', piecesOnce(found as CadencePieces),
        full && words.afterThem || after));
      },
      range: () => plain(spaced(rhythm, runSpan(run.from, run.to), after)),
      values: () => minutes.tiles && found === minutes.form &&
        plain(everyUnit(minutes.step, units.minute) + through) ||
        !values[0] && plain(spaced(onTheHours, words.and, words.always,
          counted(later, units.minute), words.afterThem)) ||
        {opening: 'always', text: spaced(counted(values, units.minute), after)}
    };

    kinds.cadencePieces = kinds.pieces;

    return kinds[found.kind]();
  }

  return said(minutes.form);
}

export {namedHead, namedOf, removedHours, tiledHead, tilingOf};
