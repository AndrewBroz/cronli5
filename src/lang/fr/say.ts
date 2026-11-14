// How French puts words in a row: a phrase, a list, a count of a unit, a
// written time. Nothing here knows what a schedule is.

import lexicon from './lexicon.js';
import type {FrenchStyle} from './options.js';

const {symbols, twoDigits, words: w} = lexicon;

/** What goes before an item, or before a whole list: «à», «en», «le». */
type Lead = (text: string) => string;

/** A unit as the lexicon holds it. */
type Unit = typeof lexicon.units.minute;

/** A moment of the day. */
interface Moment {
  hour: number;
  minute: number;
  second: number;
}

/** The text, or nothing when the condition does not hold. */
function given(condition: boolean, text: string): string {
  return condition ? text : '';
}

/** The words that are there, a space between them. */
function phrase(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/** The text behind its lead, or nothing when there is no text. */
function after(lead: string, text: string): string {
  return text && lead + text;
}

/**
 * Items in a row: commas, then «et» (or the word given) before the last,
 * with no comma.
 */
function conjoin(items: string[], link: string = w.and): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${link} `);
}

/** A word that leads whatever follows it. */
function led(lead: string): Lead {
  return (text) => phrase(lead, text);
}

/**
 * A list: two items each take their lead («à 9 h et à 17 h»), three or
 * more share one («à 8 h, 12 h et 18 h»).
 */
function series(items: string[], lead: Lead, shared: Lead = lead): string {
  const each = items.map((item) => lead(item));

  return items.length > 2 ? shared(conjoin(items)) : conjoin(each);
}

/** So many of a unit, never padded: «1 seconde», «30 secondes». */
function counted(count: number, unit: Unit): string {
  return phrase(String(count), count === 1 ? unit.one : unit.many);
}

/** Numbers in a row, the unit after the last: «10 et 45 secondes». */
function tally(numbers: number[], unit: Unit): string {
  return conjoin([
    ...numbers.slice(0, -1).map(String),
    ...numbers.slice(-1).map((last) => counted(last, unit))
  ]);
}

/** A cadence: «toutes les minutes», «toutes les 15 minutes». */
function every(interval: number, unit: Unit): string {
  return phrase(unit.every, given(interval > 1, String(interval)),
    unit.many);
}

// The part of the day the spoken clock puts after each hour. Midnight and
// noon take none: on the hour they are words, and otherwise bare numbers.
const dayParts = [
  '', ...new Array<string>(11).fill(w.morning),
  '', ...new Array<string>(5).fill(w.afternoon),
  ...new Array<string>(6).fill(w.evening)
];

const namedHours: {[hour: number]: string} = {0: w.midnight, 12: w.noon};

/**
 * A time, written down to its last unit that is not zero: «9 h»,
 * «9 h 05», «9 h 00 min 30 s». On the spoken clock each time carries its
 * own part of the day, after the whole time.
 */
function written(moment: Moment, style: FrenchStyle): string {
  const {hour, minute, second} = moment;
  const finer = phrase(
    given(minute + second > 0, twoDigits(minute)),
    given(second > 0,
      phrase(symbols.minute, twoDigits(second), symbols.second)));
  const spokenHour = String(hour && (hour - 1) % 12 + 1);
  const spoken = !finer && namedHours[hour] ||
    phrase(spokenHour, symbols.hour, finer, dayParts[hour]);

  return style.hour12 ? spoken : phrase(String(hour), symbols.hour, finer);
}

export type {Lead, Moment, Unit};
export {after, conjoin, counted, every, given, led, phrase, series, tally,
  written};
