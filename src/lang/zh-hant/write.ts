// How the small things are written: a clock time in each style, a list, a
// run, a rate, a bracket, and the one space the language sets (answers,
// "Parts and joins").

import type {Span} from './forms.js';
import type {ZhHantStyle} from './options.js';
import lexicon from './lexicon.js';

const {twoDigits, units, words} = lexicon;

/** A moment of the day. Its second is null where seconds are not shown. */
export interface Moment {
  hour: number;
  minute: number;
  second: number | null;
}

/** The units a rate is counted in. */
export type RateUnit = 'hour' | 'minute' | 'second';

const everyUnit: Record<RateUnit, string> = {
  hour: words.everyHour,
  minute: words.everyMinute,
  second: words.everySecond
};

/**
 * A word and then a clock time, set off by a half-width space where the
 * time begins with a digit (a 12-hour time begins with its part of the
 * day and stands close).
 */
function wordThenClock(word: string, time: string): string {
  return word + ((/^\d/u).test(time) ? ' ' : '') + time;
}

/** A clock time and then a word, set off where the time ends in a digit. */
function clockThenWord(time: string, word: string): string {
  return time + ((/\d$/u).test(time) ? ' ' : '') + word;
}

function list(items: string[]): string {
  return items.join(words.listMark);
}

/** A list whose last item is joined by another word. */
function series(items: string[], final: string): string {
  return [list(items.slice(0, -1)), ...items.slice(-1)]
    .filter(Boolean).join(final);
}

function bracketed(text: string): string {
  return words.bracketOpen + text + words.bracketClose;
}

/**
 * What is left out, in brackets; nothing when nothing is. Only a clock
 * time ends in a digit, and is set off from the word after it.
 */
function excepting(text: string): string {
  return text && bracketed(clockThenWord(text, words.except));
}

function dayPartOf(hour: number): string {
  return lexicon.dayParts.filter(function begun(part) {
    return part.from <= hour;
  }).slice(-1)[0].word;
}

// An hour of the 12-hour clock with its part of the day.
function twelveHour(hour: number): string {
  return dayPartOf(hour) + String(hour % 12 || 12);
}

/** A clock time, as the style writes one. */
function clock(moment: Moment, style: ZhHantStyle): string {
  const colon = style.separator === ':';
  const plain = colon ? twoDigits(moment.hour) : String(moment.hour);
  const hour = style.hour12 ? twelveHour(moment.hour) : plain;
  const shown = moment.second === null ?
    [moment.minute] :
    [moment.minute, moment.second];
  const digits = shown.map(twoDigits);
  const unitsOf = [units.minute.position, units.second.position];
  // In the units of the clock an hour on the dot says no minutes, unless
  // seconds follow.
  const said = moment.minute > 0 || shown.length > 1 ? digits : [];
  const inUnits = hour + units.hour.position +
    said.map(function withUnit(part, at) {
      return part + unitsOf[at];
    }).join('');

  return colon ? [hour, ...digits].join(':') : inUnits;
}

/** Hours named as what holds minutes: one unit, or each with its part. */
function hoursNamed(hours: number[], style: ZhHantStyle): string {
  const unit = units.hour.position;

  return style.hour12 ?
    series(hours.map(function withPart(hour) {
      return twelveHour(hour) + unit;
    }), words.and) :
    list(hours.map(String)) + unit;
}

/**
 * A stretch between two clock times. The mark stands close against both,
 * unless the end is on the next day.
 */
function stretch(
  from: string,
  to: string,
  style: ZhHantStyle,
  nextDay = false
): string {
  const mark = style.separator === ':' ? words.rangeMark : words.to;

  return from + mark + (nextDay ? wordThenClock(words.nextDay, to) : to);
}

/** Two clock times as a stretch, or as the one moment they both are. */
function gap(from: string, to: string, style: ZhHantStyle): string {
  return from === to ? from : stretch(from, to, style);
}

/** A rate: every unit, or every so many. */
function rate(unit: RateUnit, interval: number, once = words.once): string {
  const counted = words.every + interval + units[unit].length;

  return (interval === 1 ? everyUnit[unit] : counted) + once;
}

/**
 * A run of values with their unit, or one value: the end carries a word
 * when the run passes the end of its cycle.
 */
function spanText(span: Span, unit: string, next: string): string {
  const later = span.from > span.to ? next : '';

  return span.from === span.to ?
    span.from + unit :
    span.from + unit + words.to + later + span.to + unit;
}

export {
  bracketed, clock, clockThenWord, excepting, gap, hoursNamed, list, rate,
  series, spanText, stretch, wordThenClock
};
