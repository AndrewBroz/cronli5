// The small grammar every part of a Polish description shares: lists,
// a numeral with its unit, a rhythm after «co», and a clock time.

import lexicon from './lexicon.js';
import type {Unit} from './lexicon.js';
import type {PolishStyle} from './options.js';

const {dayParts, units, words} = lexicon;

/** A clock time of an hour and a minute, with a second when one is given. */
export type Clock = (
  hour: number, minute: number, second: number | null
) => string;

/** «a, b i c»: commas, then the joining word before the last. */
function listed(items: Array<number | string>, last = words.and): string {
  const texts = items.map(String);

  return [texts.slice(0, -1).join(', '), texts[texts.length - 1]]
    .filter(Boolean).join(` ${last} `);
}

/** «A oraz B», «A, B oraz C»: a list of pieces. */
function pieced(items: string[]): string {
  return listed(items, words.andPieces);
}

/** The form of a unit that a numeral takes: «minutę», «minuty», «minut». */
function unitFor(count: number, unit: Unit, short: boolean): string {
  const few = count % 10 >= 2 && count % 10 <= 4 &&
    (count % 100 < 12 || count % 100 > 14);
  const full = [unit.many, unit.one, unit.few][
    Number(count === 1) + 2 * Number(few)];

  return [full, unit.short][Number(short)];
}

/** A numeral and its unit: «5 minut», «2 minuty», «15 min». */
function counted(count: number, unit: Unit, short: boolean): string {
  return `${count} ${unitFor(count, unit, short)}`;
}

/**
 * A numeral and its unit after «do», in the genitive: «42 minut»,
 * «1 minuty».
 */
function upTo(count: number, unit: Unit, short: boolean): string {
  const full = [unit.ofMany, unit.ofOne][Number(count === 1)];

  return `${count} ${[full, unit.short][Number(short)]}`;
}

/** Several numerals and the unit the last one takes: «5, 20 i 42 minuty». */
function distances(values: number[], unit: Unit, short: boolean): string {
  return `${listed(values)} ` +
    `${unitFor(values[values.length - 1], unit, short)}`;
}

/** A rhythm: «co minutę», «co 2 godziny», «co 15 minut». */
function every(step: number, unit: Unit, short: boolean): string {
  return `${words.every} ` +
    `${[counted(step, unit, short), unit.one][Number(step === 1)]}`;
}

// The part of the day each hour carries on the 12-hour count; the hour
// after midnight carries none.
const partOfHour = [
  '',
  ...Array<string>(3).fill(dayParts.night),
  ...Array<string>(8).fill(dayParts.morning),
  ...Array<string>(6).fill(dayParts.afternoon),
  ...Array<string>(6).fill(dayParts.evening)
];
const noon = 12;

/** The clock a style writes: 24-hour, or 12-hour with its part of the day. */
function clockFor(style: PolishStyle): Clock {
  return function clock(hour, minute, second) {
    const told = hour - noon * Number(style.hour12 && hour > noon);
    const shown = [told, minute, second].filter(function given(part) {
      return part !== null;
    });
    const digits = shown.map(function padded(part, at) {
      return [String, lexicon.twoDigits][Number(at > 0)](part as number);
    });
    const part = style.hour12 &&
      (hour === noon && minute === 0 && dayParts.noon || partOfHour[hour]);

    // A time that shows seconds keeps colons: «9.00.30» reads as a date.
    return [digits.join([style.separator, ':'][shown.length - 2]), part]
      .filter(Boolean).join(' ');
  };
}

export {clockFor, counted, distances, every, listed, pieced, unitFor, units,
  upTo, words};
