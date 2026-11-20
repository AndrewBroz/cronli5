// The words for moments: a clock time, a mark inside the hour or the
// minute, a span between two moments, a rhythm, a tight list of numbers
// under one unit, and the bracket that takes values out.

import type {KoreanStyle} from './options.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/**
 * A moment by the fields that are fixed in it. With an hour it is a clock
 * time; without one it is a mark inside every hour, or inside every
 * minute when only the second is given.
 */
export interface Time {
  hour?: number;
  minute?: number;
  second?: number;
}

/** How the time is said here. */
export interface Voice {
  // Whether a rhythm that fills its unit from the top is the step alone.
  bare: boolean;
  // Whether a rhythm is the spacing of moments that each hold something
  // finer, said with «간격으로».
  frame: boolean;
  style: KoreanStyle;
}

// Hangul syllables are laid out so that those with no final consonant
// come every 28th from the first.
const firstSyllable = 0xAC00;
const finals = 28;

// The markers of the 12-hour clock: none for hour 0, then the morning,
// hour 12 and the afternoon.
const markers = ['', words.am, words.noon, words.pm];
const hoursInDay = 24;

function isKnown(value?: number): value is number {
  return typeof value === 'number';
}

function join(...parts: unknown[]): string {
  return parts.filter(Boolean).join(' ');
}

/** A word with the particle its last sound takes: `[consonant, vowel]`. */
function after(word: string, particles: string[]): string {
  const final = (word.charCodeAt(word.length - 1) - firstSyllable) % finals;

  return `${word}${particles[Number(final === 0)]}`;
}

// An hour counted on past the end of the day (24 and up) is on the next
// day: a run of hours through midnight is laid out that way (answers,
// "Hours that run through midnight"). Its marker starts with «다음 날», so
// that the marker after it is always said again.
function markerOf(time: Time, voice: Voice): string {
  const hour = (time.hour ?? 0) % hoursInDay;

  return join(
    (time.hour ?? 0) >= hoursInDay && words.nextDay,
    voice.style.hour12 &&
      markers[Number(hour > 0) + Number(hour > 11) + Number(hour > 12)]
  );
}

function hourOf(hour: number, voice: Voice): number {
  const clock = hour % hoursInDay;

  return clock - 12 * Number(voice.style.hour12 && clock > 12);
}

// One moment. The minute is said when it is not zero or a second follows;
// a mark on the hour with no second is «정각». A second is said when it
// is not zero, or when it is all there is.
function sayTime(
  time: Time,
  marker: string,
  voice: Voice,
  unit = units.hour
): string {
  const {hour, minute, second} = time;
  const timed = isKnown(hour);

  return join(
    timed && marker,
    timed && `${hourOf(hour, voice)}${unit}`,
    isKnown(minute) && ((minute || second) && `${minute}${units.minute}` ||
      !timed && words.onTheHour),
    isKnown(second) && (second || !isKnown(minute)) &&
      `${second}${units.second}`
  );
}

/**
 * Moments said one after another: a marker is said on the first and again
 * only when it differs from the one before.
 */
function sayTimes(times: Time[], voice: Voice, unit = units.hour): string[] {
  return times.map(function each(time, at) {
    const marker = markerOf(time, voice);
    const before = at > 0 && markerOf(times[at - 1], voice);

    return sayTime(time, marker !== before && marker || '', voice, unit);
  });
}

/** A step: «15분마다», or «15분 간격으로» for the spacing of a frame. */
function rhythm(step: number, unit: string, voice: Voice): string {
  return `${step}${unit}` +
    (voice.frame && ` ${words.interval}` || words.every);
}

/** From the first moment that fires to the last, at a pace. */
function span(from: Time, to: Time, pace: string, voice: Voice): string {
  const [first, last] = sayTimes([from, to], voice);

  return `${first}${words.from} ${last}${words.until} ${pace}`;
}

/** Numbers or names joined tightly, with the unit once at the end. */
function tight(items: Array<number | string>, unit: string): string {
  return `${items.join(words.listMark)}${unit}`;
}

/** The bracket that takes things out, or nothing when there are none. */
function paren(items: string[]): string {
  return items.length > 0 && `(${items.join(', ')} ${words.except})` || '';
}

/**
 * A phrase with a note in its bracket: after what the bracket already
 * holds, so that two brackets never stand side by side.
 */
function noted(phrase: string, note: string, mark = ', '): string {
  return phrase.endsWith(')') ?
    `${phrase.slice(0, -1)}${mark}${note})` :
    `${phrase}(${note})`;
}

/**
 * Whole hours listed compactly: grouped by their marker in clock order,
 * the numbers of a group joined tightly and «시대» said once.
 */
function blocks(hours: number[], voice: Voice): string {
  const groups: number[][] = [];

  hours.forEach(function place(hour, at) {
    const same = at > 0 &&
      markerOf({hour: hours[at - 1]}, voice) === markerOf({hour}, voice);

    (same && groups[groups.length - 1] || groups[groups.push([]) - 1])
      .push(hour);
  });

  return groups.map(function say(group) {
    return join(markerOf({hour: group[0]}, voice),
      tight(group.map(function number(hour) {
        return hourOf(hour, voice);
      }), units.hourBlock));
  }).join(', ');
}

export {
  after, blocks, isKnown, join, noted, paren, rhythm, sayTime, sayTimes, span,
  tight
};
