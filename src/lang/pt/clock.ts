// A clock time as it is written, and the article that agrees with it. A
// time is feminine, and plural unless its hour is written 1; the two exact
// moments of a 12-hour clock are words with a gender of their own.

import type {Gender} from './lexicon.js';
import type {Led} from './phrases.js';
import lexicon from './lexicon.js';
import type {PortugueseStyle} from './options.js';

const {contractions, dayParts, twoDigits, words} = lexicon;

/** A written time and what an article before it agrees with. */
export interface Time {
  gender: Gender;
  number: 'plural' | 'singular';
  text: string;
}

// The words for 00:00 and 12:00 on a 12-hour clock, by half of the day.
const exactMoments: Time[] = [
  {gender: 'feminine', number: 'singular', text: words.midnight},
  {gender: 'masculine', number: 'singular', text: words.noon}
];

function isNumber(value: number | undefined): value is number {
  return typeof value === 'number';
}

// The part of the day an hour falls in.
function dayPart(hour: number): string {
  return dayParts.filter((part) => part.from <= hour).slice(-1)[0].text;
}

/**
 * A time of day, to the second when one is given. In 24-hour style every
 * part has two digits. In 12-hour style the hour has no leading zero, the
 * part of the day follows, and midnight and noon exactly are words.
 */
function timeOf(
  hour: number,
  minute: number,
  second: number | undefined,
  style: PortugueseStyle
): Time {
  const seconds = [second].filter(isNumber);

  if (style.hour12 && hour % 12 + minute + (second ?? 0) === 0) {
    return exactMoments[hour / 12];
  }

  const [written, tail] = style.hour12 ?
    [hour % 12 || Math.min(hour, 12), [dayPart(hour)]] :
    [twoDigits(hour), []];
  const digits = [written, ...[minute, ...seconds].map(twoDigits)].join(':');

  return {
    gender: 'feminine',
    number: Number(written) === 1 ? 'singular' : 'plural',
    text: [digits, ...tail].join(' ')
  };
}

/** A time as an item of a list, led by «à», «às» or «ao». */
function at(time: Time): Led {
  return {lead: contractions.a[time.number][time.gender], text: time.text};
}

/** A stretch from one time to another: «das 09:00 às 17:59». */
function fromTo(start: Time, finish: Time): string {
  const from = contractions.de[start.number][start.gender];
  const to = contractions.a[finish.number][finish.gender];

  return `${from} ${start.text} ${to} ${finish.text}`;
}

export {at, fromTo, timeOf};
