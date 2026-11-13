// How Italian writes the small things every part of a description is made
// of: a list, a clock time with its preposition, a day number with its
// article, a weekday and a month by name, in the caller's style.

import type {ItalianStyle} from './options.js';
import type {Cadence, Part, Run} from './sets.js';
import lexicon from './lexicon.js';

const {months, twoDigits, units, weekdays, words} = lexicon;

/** A clock time; the second is shown only when it is given. */
interface Moment {
  hour: number;
  minute: number;
  second?: number | undefined;
}

// A preposition fused with the article, before most words and elided.
interface Fused {
  elided: string;
  full: string;
}

const AT: Fused = {elided: words.toElided, full: `${words.toHours} `};
const FROM: Fused = {elided: words.fromElided, full: `${words.fromHours} `};
const THE: Fused = {elided: words.theElided, full: `${words.the} `};
const TO_DAY: Fused = {elided: words.toElided, full: `${words.to} `};
const FROM_DAY: Fused = {elided: words.fromElided, full: `${words.from} `};

const STARTING: Fused =
  {elided: words.startingFromTheElided, full: `${words.startingFromThe} `};

// The day numbers whose names begin with a vowel: «l'8», «l'11».
const VOWEL_DAYS = [8, 11];

// The stretches of the day on the 12-hour clock, each from its first hour:
// how much the hour is lowered by and the part of the day said after it.
// Hours 0 and 12 stay as the 24-hour clock writes them.
const TWELVE_HOUR = [
  {from: 0, less: 0, part: ''},
  {from: 1, less: 0, part: ` ${words.morning}`},
  {from: 12, less: 0, part: ''},
  {from: 13, less: 12, part: ` ${words.afternoon}`},
  {from: 18, less: 12, part: ` ${words.evening}`}
];

/** Items joined as Italian lists them: commas, and «e» before the last. */
function list(items: string[], last: string = words.and): string {
  const head = items.slice(0, -1).join(', ');

  return [head, items[items.length - 1]].filter(Boolean).join(` ${last} `);
}

/** Phrases joined by spaces, the empty ones left out. */
function phrase(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * How one field says the items of its pieces. `strays`, when given, are
 * the words that introduce one single value and several after a run whose
 * closing preposition they would otherwise seem to continue.
 */
interface PieceWords {
  cadence(cadence: Cadence): string;
  // `first` says that the run is the first, or follows a cadence, whose
  // rate it must not seem to continue.
  // `resumes` says that it follows a cadence directly.
  run(run: Run, first: boolean, resumes: boolean): string;
  strays?: [string, string];
  values(values: number[]): string[];
}

/** Pieces said in order and joined as a list. */
function sayPieces(parts: Part[], say: PieceWords): string {
  let runs = 0;
  let afterRun = false;
  let afterCadence = false;
  const sayers = {
    cadence(part: Part): string[] {
      runs += 1;
      afterRun = false;
      afterCadence = true;

      return [say.cadence(part as Cadence)];
    },
    range(part: Part): string[] {
      const first = !afterRun;
      const resumes = afterCadence;

      runs += 1;
      afterRun = true;
      afterCadence = false;

      return [say.run(part as Run, first, resumes)];
    },
    values(part: Part): string[] {
      const {values} = part as {values: number[]};
      const items = say.values(values);
      const stray = runs > 0 && say.strays &&
        say.strays[Math.min(values.length, 2) - 1];

      return [phrase(stray, items[0]), ...items.slice(1)];
    }
  };

  return list(parts.flatMap(function each(part) {
    return sayers[part.kind](part);
  }));
}

/** A unit after «ogni»: alone, or after a number other than one. */
function every(interval: number, unit: keyof typeof units): string {
  return interval === 1 ?
    `${words.every} ${units[unit].one}` :
    `${words.every} ${interval} ${units[unit].many}`;
}

/** A day of the month as written: the first is «1º». */
function dayNumber(day: number): string {
  return day === 1 && words.first || String(day);
}

function withDay(fused: Fused, day: number): string {
  return (VOWEL_DAYS.includes(day) && fused.elided || fused.full) +
    dayNumber(day);
}

/** A day of the month with its article: «il 15», «l'8». */
function theDay(day: number): string {
  return withDay(THE, day);
}

/** The two ends of a run of days: «dal 1º al 7», «dall'8 all'11». */
function daySpan(from: number, to: number): string {
  return `${withDay(FROM_DAY, from)} ${withDay(TO_DAY, to)}`;
}

/** The day a cadence starts on: «a partire dal 1º», «a partire dall'8». */
function startingDay(day: number): string {
  return withDay(STARTING, day);
}

/** A day of the month after «a»: «al 15», «all'8». */
function toDay(day: number): string {
  return withDay(TO_DAY, day);
}

/** The words that depend on the caller's style. */
interface Speech {
  // «alle 9:00», «all'1:30».
  at(moment: Moment): string;
  // «9:00», «9:00:30», «1:00 del pomeriggio».
  clock(moment: Moment): string;
  // «giugno», «giu».
  month(month: number): string;
  // «dalle 9:00 alle 17:45».
  span(from: Moment, to: Moment): string;
  // «fino alle 22:45».
  until(moment: Moment): string;
  // «lunedì», «lun».
  weekday(weekday: number): string;
}

/** The words of one style. */
function speechOf(style: ItalianStyle): Speech {
  const form = style.short && 'short' || 'full';
  const stretches = style.hour12 && TWELVE_HOUR || TWELVE_HOUR.slice(0, 1);

  function shown(moment: Moment) {
    const [stretch] = stretches.filter(function reached(candidate) {
      return candidate.from <= moment.hour;
    }).slice(-1);

    return {hour: moment.hour - stretch.less, part: stretch.part};
  }

  function clock(moment: Moment): string {
    const {hour, part} = shown(moment);
    const seconds = [moment.second].filter(function given(second) {
      return typeof second === 'number';
    }) as number[];

    return [hour, twoDigits(moment.minute), ...seconds.map(twoDigits)]
      .join(style.separator) + part;
  }

  function after(fused: Fused, moment: Moment): string {
    return (shown(moment).hour === 1 && fused.elided || fused.full) +
      clock(moment);
  }

  function at(moment: Moment): string {
    return after(AT, moment);
  }

  return {
    at,
    clock,
    month(month) {
      return months[month][form];
    },
    span(from, to) {
      return `${after(FROM, from)} ${at(to)}`;
    },
    until(moment) {
      return `${words.until} ${at(moment)}`;
    },
    weekday(weekday) {
      return weekdays[weekday][form];
    }
  };
}

export type {Moment, PieceWords, Speech};
export {
  dayNumber, daySpan, every, list, phrase, sayPieces, speechOf,
  startingDay, theDay, toDay
};
