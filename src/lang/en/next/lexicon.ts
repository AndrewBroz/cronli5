// The English lexicon: every word the renderer says, with its length as
// spoken, in syllables: "27" is four syllables and "7th" is two. The
// vocabulary of a cron description is closed, so the lengths are stated
// here rather than computed, except for the regular number words, which
// are built from their parts. The lengths are a record of how the words
// sound; phrasings are chosen by how many things they name, which the
// renderer counts for itself.

import type {Spoken} from '../../../core/select.js';

function spoken(text: string, length: number): Spoken {
  return {length, text};
}

// Syllables of the number words zero to nineteen.
const smallSyllables =
  [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3, 1, 2, 2, 2, 2, 3, 2, 2];

// Syllables of twenty, thirty … ninety, by their tens digit.
const tensSyllables: {[tens: number]: number} =
  {2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 3, 8: 2, 9: 2};

// Syllables of the ordinal words first to nineteenth.
const smallOrdinalSyllables =
  [0, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 3, 1, 2, 2, 2, 2, 3, 2, 2];

// The words that stand for an interval after "every": "every other hour",
// "every third month".
const intervalWords: {[interval: number]: Spoken} = {
  2: spoken('other', 2),
  3: spoken('third', 1),
  4: spoken('fourth', 1),
  5: spoken('fifth', 1),
  6: spoken('sixth', 1),
  7: spoken('seventh', 2),
  8: spoken('eighth', 1),
  9: spoken('ninth', 1),
  10: spoken('tenth', 1),
  11: spoken('eleventh', 3),
  12: spoken('twelfth', 1)
};

// How many syllables a whole number from 0 to 99 takes to say.
function numberSyllables(value: number): number {
  if (value < 20) {
    return smallSyllables[value];
  }

  const ones = value % 10;

  return tensSyllables[(value - ones) / 10] +
    (ones === 0 ? 0 : smallSyllables[ones]);
}

/** A count or position as digits, with the length of its number word. */
function cardinal(value: number): Spoken {
  return spoken(String(value), numberSyllables(value));
}

// The suffix a day of the month takes: 1st, 2nd, 3rd, 4th, 11th, 21st.
function ordinalSuffix(value: number): string {
  const ones = value % 10;
  const teens = value % 100 >= 11 && value % 100 <= 13;

  if (teens || ones === 0 || ones > 3) {
    return 'th';
  }

  return ['', 'st', 'nd', 'rd'][ones];
}

/** A day of the month as digits with its suffix, read as an ordinal. */
function ordinal(value: number): Spoken {
  const ones = value % 10;
  const tens = (value - ones) / 10;
  let length = smallOrdinalSyllables[value];

  if (value >= 20) {
    // "Twentieth" and "thirtieth" are three syllables; otherwise the tens
    // word and the ordinal of the ones.
    length = ones === 0 ?
      tensSyllables[tens] + 1 :
      tensSyllables[tens] + smallOrdinalSyllables[ones];
  }

  return spoken(value + ordinalSuffix(value), length);
}

/** The word for an interval of 2 to 12: "other", "third", "twelfth". */
function intervalWord(interval: number): Spoken {
  return intervalWords[interval];
}

/**
 * The minutes (or seconds) inside a clock time, always two digits. Under
 * ten they are read "oh five".
 */
function clockMinute(value: number): Spoken {
  return value < 10 ?
    spoken(`0${value}`, 1 + smallSyllables[value]) :
    spoken(String(value), numberSyllables(value));
}

/**
 * A year, read in pairs ("twenty thirty"), or as "two thousand seven" for
 * the first years of a millennium.
 */
function year(value: number): Spoken {
  const lastTwo = value % 100;
  const firstTwo = (value - lastTwo) / 100;
  const thousands = firstTwo % 10 === 0;

  if (thousands && lastTwo < 10) {
    // "Two thousand", "two thousand seven".
    return spoken(String(value), numberSyllables(firstTwo / 10) + 2 +
      (lastTwo === 0 ? 0 : smallSyllables[lastTwo]));
  }

  if (lastTwo === 0) {
    // "Nineteen hundred".
    return spoken(String(value), numberSyllables(firstTwo) + 2);
  }

  return spoken(String(value), numberSyllables(firstTwo) +
    (lastTwo < 10 ? 1 + smallSyllables[lastTwo] : numberSyllables(lastTwo)));
}

/** A name in its full and short written forms; both are said the same. */
interface Name {
  full: Spoken;
  short: Spoken;
}

/** A weekday, with the plural a recurring day takes ("on Mondays"). */
interface WeekdayName extends Name {
  plural: Spoken;
  shortPlural: Spoken;
}

function monthName(text: string, length: number): Name {
  return {full: spoken(text, length), short: spoken(text.slice(0, 3), length)};
}

function weekdayName(text: string, length: number): WeekdayName {
  const short = text.slice(0, 3);

  return {
    full: spoken(text, length),
    plural: spoken(`${text}s`, length),
    short: spoken(short, length),
    shortPlural: spoken(`${short}s`, length)
  };
}

// Indexed by month number; there is no month 0.
const months: Name[] = [
  monthName('', 0),
  monthName('January', 4),
  monthName('February', 4),
  monthName('March', 1),
  monthName('April', 2),
  monthName('May', 1),
  monthName('June', 1),
  monthName('July', 2),
  monthName('August', 2),
  monthName('September', 3),
  monthName('October', 3),
  monthName('November', 3),
  monthName('December', 3)
];

// Indexed by cron's weekday number: 0 is Sunday.
const weekdays: WeekdayName[] = [
  weekdayName('Sunday', 2),
  weekdayName('Monday', 2),
  weekdayName('Tuesday', 2),
  weekdayName('Wednesday', 2),
  weekdayName('Thursday', 2),
  weekdayName('Friday', 2),
  weekdayName('Saturday', 3)
];

// Each unit, alone and after a number other than one.
const units = {
  day: {many: spoken('days', 1), one: spoken('day', 1)},
  hour: {many: spoken('hours', 1), one: spoken('hour', 1)},
  minute: {many: spoken('minutes', 2), one: spoken('minute', 2)},
  month: {many: spoken('months', 1), one: spoken('month', 1)},
  second: {many: spoken('seconds', 2), one: spoken('second', 2)},
  year: {many: spoken('years', 1), one: spoken('year', 1)}
};

// The function words and fixed phrases, each with its spoken length. The
// range word, the a.m./p.m. forms and the word for 12:00 belong to the
// style table; their lengths are here under the role they play.
const words = {
  and: spoken('and', 1),
  at: spoken('at', 1),
  before: spoken('before', 2),
  during: spoken('during', 2),
  evenDays: spoken('even-numbered days', 5),
  evenYears: spoken('even-numbered years', 5),
  every: spoken('every', 2),
  except: spoken('except', 2),
  forOneMinute: spoken('for one minute', 4),
  from: spoken('from', 1),
  in: spoken('in', 1),
  last: spoken('last', 1),
  midnight: spoken('midnight', 2),
  nearest: spoken('nearest', 2),
  oddDays: spoken('odd-numbered days', 4),
  oddYears: spoken('odd-numbered years', 4),
  of: spoken('of', 1),
  on: spoken('on', 1),
  past: spoken('past', 1),
  the: spoken('the', 1),
  until: spoken('until', 2),
  weekday: spoken('weekday', 2),
  weekdays: spoken('weekdays', 2),
  weekends: spoken('weekends', 2)
};

// Spoken lengths of the words a style table supplies, by the role each
// plays: "a.m." and "p.m." are two syllables however they are written.
const styleLengths = {
  meridiem: 2,
  midday: 2,
  noon: 1,
  through: 1,
  to: 1
};

// The ordinal words a Quartz "nth weekday" uses: "the second Monday".
const nthWords: Spoken[] = [
  spoken('', 0),
  spoken('first', 1),
  spoken('second', 2),
  spoken('third', 1),
  spoken('fourth', 1),
  spoken('fifth', 1)
];

/**
 * A rough syllable count for a word the tables do not hold, such as the
 * range word of a custom style: one per group of vowels, at least one.
 */
function estimateSyllables(text: string): number {
  return Math.max(1, (text.toLowerCase().match(/[aeiouy]+/gu) || []).length);
}

const lexicon = {
  cardinal,
  clockMinute,
  estimateSyllables,
  intervalWord,
  months,
  nthWords,
  ordinal,
  styleLengths,
  units,
  weekdays,
  words,
  year
};

export type {Name, WeekdayName};
export default lexicon;
