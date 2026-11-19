// The small things every part of the sentence is built from: a list, a
// clock time, a name, a run of values.

import lexicon from './lexicon.js';
import type {IndonesianStyle} from './options.js';

const {dayParts, months, twoDigits, weekdays, words} = lexicon;

/** Something to say, or nothing. */
export type Maybe = string | false | null | undefined;

/** The words that are there, with a space between them. */
function phrase(...parts: Maybe[]): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * A list as EYD writes it: «A», «A dan B», «A, B, dan C». The joiner is
 * «dan» unless another is given.
 */
function list(items: string[], joiner: string = words.and): string {
  const last = items[items.length - 1];

  return items.length > 2 ?
    `${items.slice(0, -1).join(', ')}, ${joiner} ${last}` :
    items.join(` ${joiner} `);
}

// Which written form of a name a style asks for.
const widths: Array<'full' | 'short'> = ['full', 'short'];

function monthName(month: number, style: IndonesianStyle): string {
  return months[month][widths[Number(style.short)]];
}

/** A weekday as it is written after «hari»: never shortened. */
function fullWeekday(weekday: number): string {
  return weekdays[weekday].full;
}

/**
 * A weekday after «setiap» or «kecuali». Sunday, when it comes first, is
 * «hari Minggu», so that it is not read as a week.
 */
function weekdayName(weekday: number, first: boolean, style: IndonesianStyle):
  string {
  return first && weekday === 0 ?
    phrase(words.dayOf, fullWeekday(weekday)) :
    weekdays[weekday][widths[Number(style.short)]];
}

// The hour each part of the day begins at, latest first.
const partsOfTheDay: Array<[number, string]> = [
  [19, dayParts.night], [15, dayParts.afternoon], [11, dayParts.midday],
  [4, dayParts.morning], [0, dayParts.early]
];

function partOfTheDay(hour: number): string {
  return (partsOfTheDay.find(function begun([from]) {
    return hour >= from;
  }) as [number, string])[1];
}

/**
 * A clock time without «pukul»: «09.00», «09.00.30». On the 12-hour clock
 * the hour is counted to twelve, the minutes of a full hour are left out
 * and the part of the day follows («9 pagi», «5.45 sore»); the first hour
 * of the day keeps its two digits and its minutes («00.30 dini hari»).
 */
function clock(
  hour: number,
  minute: number,
  second: number | undefined,
  style: IndonesianStyle
): string {
  const spoken = style.hour12 && hour > 0;
  const seconds = typeof second === 'number' && twoDigits(second);
  const figures = [
    spoken ? String(hour % 12 || 12) : twoDigits(hour),
    !(spoken && minute === 0 && !seconds) && twoDigits(minute),
    seconds
  ];

  return phrase(figures.filter(Boolean).join(style.separator),
    style.hour12 && partOfTheDay(hour));
}

/** The runs of consecutive values in an ascending list, as their ends. */
function runsOf(values: number[]): Array<[number, number]> {
  const runs: Array<[number, number]> = [];

  values.forEach(function place(value) {
    const current = runs[runs.length - 1];

    if (current && current[1] === value - 1) {
      current[1] = value;
    }
    else {
      runs.push([value, value]);
    }
  });

  return runs;
}

export {clock, fullWeekday, list, monthName, phrase, runsOf, weekdayName};
