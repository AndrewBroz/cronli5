// The small parts every phrase is made of: lists, numbers with their
// nouns, ordinals written in digits, clock times, and the names of months
// and weekdays in the case a phrase asks for.

import lexicon from './lexicon.js';
import type {MonthName, Unit, WeekdayName} from './lexicon.js';
import type {RussianStyle} from './options.js';

const {endings, months, units, weekdays, words} = lexicon;

/** The case a month's name is said in. */
export type MonthCase = 'accusative' | 'genitive' | 'prepositional';

/** The case a weekday's name is said in. */
export type WeekdayCase =
  'accusative' | 'dativePlural' | 'genitive' | 'nominative';

/**
 * The clock times of one sentence: after «в», and after «с», «до» and
 * «кроме». A sentence whose seconds ride in its clock times shows them in
 * every one: the first second fired where a stretch starts, the last
 * where it ends.
 */
export interface Clock {
  at(hour: number, minute: number, second?: number): string;
  // Hours named as the stretches they are, not as moments: «1, 4 и 9
  // часов».
  hours(values: number[]): string;
  but(hour: number, minute: number, second?: number): string;
  from(hour: number, minute: number, second?: number): string;
  to(hour: number, minute: number, second?: number): string;
}

/** The text when the condition holds, and nothing otherwise. */
function when(condition: unknown, text: string): string {
  return condition ? text : '';
}

/** The parts that are said, joined by a space. */
function spaced(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/** A phrase and a clause set off from it by a comma. */
function clausal(...parts: string[]): string {
  return parts.filter(Boolean).join(', ');
}

/** Commas, and «и» (or «или») before the last item. */
function list(items: string[], last = words.and): string {
  return [items.slice(0, -1).join(', '), ...items.slice(-1)]
    .filter(Boolean).join(` ${last} `);
}

/** The form of a unit a number takes: one, a few or many. */
function counted(count: number, unit: Unit): string {
  const ones = count % 10;
  const teen = count % 100 > 10 && count % 100 < 15;

  return when(!teen && ones === 1, unit.one) ||
    when(!teen && ones > 1 && ones < 5, unit.few) || unit.many;
}

/** A number and its unit: «2 часа», «5 минут», «21 минуту». */
function amount(count: number, unit: Unit): string {
  return `${count} ${counted(count, unit)}`;
}

/** A number as an ordinal in digits: «1-го», «55-ю». */
function ordinal(value: number, ending: keyof typeof endings): string {
  return `${value}-${endings[ending]}`;
}

/** «С», or «со» before «вторника», «среды» and the 2nd as an ordinal. */
function fromWord(cluster: boolean): string {
  return cluster ? words.fromBeforeCluster : words.from;
}

/** A month's name in a case, or its short form, which is not declined. */
function monthName(month: number, form: MonthCase, style: RussianStyle):
  string {
  const name = months[month] as MonthName;

  return when(style.short, name.short ?? '') || name[form];
}

/** A weekday's name in a case, or its short form, which is not declined. */
function weekdayName(day: number, form: WeekdayCase, style: RussianStyle):
  string {
  const name: WeekdayName = weekdays[day];

  return style.short ? name.short : name[form];
}

// The part of the day an hour of the 12-hour clock is said with, by the
// first hour that no longer belongs to it.
const partsOfDay: Array<[number, string]> = [
  [4, words.night], [12, words.morning], [17, words.afternoon],
  [24, words.evening]
];

function partOfDay(hour: number): string {
  const [, part] = partsOfDay.find(function holds(entry) {
    return hour < entry[0];
  }) as [number, string];

  return part;
}

// A time in digits: «9:00», «09:00:30».
function digits(time: number[], style: RussianStyle, padded: boolean):
  string {
  const [hour, ...rest] = time;

  return [
    padded ? lexicon.twoDigits(hour) : String(hour),
    ...rest.map(lexicon.twoDigits)
  ].join(style.separator);
}

// A time of the spoken 12-hour clock: on the hour the number, «часов» and
// the part of the day (one o'clock is «час» with no number); otherwise the
// digits and the part of the day. `bound` is the form after «с», «до» and
// «кроме».
function spoken(time: number[], bound: boolean, style: RussianStyle): string {
  const [hour, minute, second] = time;
  const twelve = (hour + 11) % 12 + 1;
  const onTheHour = minute === 0 && typeof second === 'undefined';
  const boundNoun = twelve === 1 ? units.hour.few : units.hour.many;
  const noun = bound ? boundNoun : counted(twelve, units.hour);

  return spaced(
    onTheHour ?
      spaced(when(twelve > 1, String(twelve)), noun) :
      digits([twelve, ...time.slice(1)], style, false),
    partOfDay(hour));
}

// One clock time. The hour from 0:00 keeps its digits under the 12-hour
// clock, which never pads an hour.
function clockTime(time: number[], bound: boolean, style: RussianStyle):
  string {
  return style.hour12 && time[0] > 0 ?
    spoken(time, bound, style) :
    digits(time, style, style.padHour && !style.hour12);
}

/**
 * The clock times of a sentence. With no seconds given none is shown;
 * with one, every time carries it; with a first and a last, a stretch
 * starts on the first and ends on the last.
 */
function clockOf(style: RussianStyle, seconds: number[] = []): Clock {
  const [first] = seconds;
  const last = seconds[seconds.length - 1];

  function timeOf(hour: number, minute: number, second?: number): number[] {
    return [hour, minute, second].filter(function shown(part) {
      return typeof part === 'number';
    }) as number[];
  }

  return {
    at(hour, minute, second = first) {
      return clockTime(timeOf(hour, minute, second), false, style);
    },
    but(hour, minute, second = first) {
      return clockTime(timeOf(hour, minute, second), true, style);
    },
    hours(values) {
      return style.hour12 ?
        list(values.map(function said(hour) {
          return hour > 0 ? spoken([hour, 0], false, style) :
            amount(hour, units.hour);
        })) :
        spaced(list(values.map(String)),
          counted(values[values.length - 1], units.hour));
    },
    from(hour, minute, second = first) {
      return clockTime(timeOf(hour, minute, second), true, style);
    },
    to(hour, minute, second = last) {
      return clockTime(timeOf(hour, minute, second), true, style);
    }
  };
}

/** A piece of a phrase, and whether it is itself a list with «и». */
export interface Piece {
  list: boolean;
  text: string;
}

/**
 * Pieces in order: commas, and «и» before the last, or «, а также» where
 * a piece beside that join is itself a list with «и».
 */
function joined(pieces: Piece[]): string {
  return pieces.slice(1).reduce(function add(text, piece, at) {
    const final = at === pieces.length - 2;
    const also = final && (piece.list || pieces[at].list);

    return text + (when(!final, ', ') || when(also, `, ${words.andAlso} `) ||
      ` ${words.and} `) + piece.text;
  }, pieces[0].text);
}

/** «С … до …» between two clock times. */
function between(start: string, end: string): string {
  return `${words.from} ${start} ${words.until} ${end}`;
}

export {
  amount, between, clausal, clockOf, counted, fromWord, joined, list,
  monthName,
  ordinal, spaced, weekdayName, when
};
