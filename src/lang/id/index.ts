// The Indonesian renderer. A description is three parts in one order
// (answers 2.1): the day, the time, and a closing part with the months
// and years everything is said of, where a date moves to, and what is
// left out.

import type {Language, Schedule, SetDescription}
  from '../../core/schedule.js';
import {monthNames, monthsOf, scopeLeftOut, scopeOf, yearsOf}
  from './closing.js';
import type {Host} from './dates.js';
import type {Days} from './days.js';
import {daysOf} from './days.js';
import type {Part} from './forms.js';
import {isValues} from './forms.js';
import lexicon from './lexicon.js';
import type {IndonesianOptions, IndonesianStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {monthName, phrase} from './say.js';
import type {Time} from './time.js';
import {timeOf} from './time.js';

const {units, words} = lexicon;

/** The three parts of a description, each with the comma that follows. */
export interface Parts {
  closing: string;
  day: string;
  time: string;
}

// A member of the closing part, and whether a comma comes before it.
interface Clause {
  comma: boolean;
  text: string;
}

const nothingJoins: Host = {month: '', months: '', year: ''};

function isOpen(candidates: SetDescription[] | null): boolean {
  return candidates?.[0].kind === 'all';
}

// What of the months and the year may join the day part: one month a
// plain date, the months a form counted inside the month, and one year
// one day in one month. Nothing joins a side of a union, and no year
// joins a day that depends on two fields.
function hostOf(schedule: Schedule, months: Part, years: Part, opts:
  IndonesianOptions): Host {
  const named = months.base.kind !== 'all';
  const oneMonth = months.values.length === 1;
  const oneYear = isValues(years.base) && years.values.length === 1;

  return {
    month: phrase(oneMonth && monthName(months.values[0], opts.style)),
    months: phrase(named && units.month,
      named && monthNames(months.values, opts.style)),
    year: phrase(oneMonth && oneYear && !schedule.analyses.day.both &&
      String(years.values[0]))
  };
}

// The day part, the months and the years, with what of the months and
// the year the day part has said itself.
function calendarOf(schedule: Schedule, opts: IndonesianOptions) {
  const {candidates, day, dateReach} = schedule.analyses;
  const years = yearsOf(schedule);
  const monthsOpen = isOpen(candidates.month);
  // A month that lacks the date is not named, unless a weekday fires in
  // it all the same; a run of months past December is cut at January
  // beside a year.
  const months = monthsOf(schedule, monthsOpen || day.union,
    !isOpen(candidates.year));
  const union = day.union && !day.dateAddsNothing &&
    !dateReach?.days?.everyDay;
  const days = daysOf({
    facts: schedule,
    host: union ? nothingJoins : hostOf(schedule, months, years, opts),
    monthsNamed: months.base.kind !== 'all',
    monthsOpen,
    style: opts.style,
    union
  });

  return {days, scope: {...days, months, style: opts.style, years}};
}

// The closing part as its members, in order: the months and years, the
// leap years a date is confined to, where a date moves to, and what is
// left out. An exception that follows another at once is joined to it by
// «dan kecuali»; anything else that follows takes a comma.
function closingOf(calendar: ReturnType<typeof calendarOf>, time: Time):
  Clause[] {
  const {days, scope} = calendar;
  const governed = scopeOf(scope);
  const said: Clause[] = [
    {
      comma: days.union || time.clause || time.left.length > 0,
      text: phrase(days.union && governed && words.bothOfThem, governed)
    },
    {comma: true, text: phrase(days.leap && words.leapYearsOnly)},
    {comma: true, text: days.moved}
  ].filter(function present(clause) {
    return clause.text;
  });
  const left = [...days.left, ...scopeLeftOut(scope)];
  const follows = said.length === 0 && time.left.length > 0;

  return [...said, ...left.map(function exception(text, index): Clause {
    return index > 0 || follows ?
      {comma: false, text: phrase(words.andExcept, text)} :
      {comma: true, text: phrase(words.except, text)};
  })];
}

// The time with what is left out of it: «setiap jam, kecuali pukul 03.00
// dan kecuali …».
function timeSaid(time: Time): string {
  return [time.text, ...time.left.map(function exception(text, index) {
    return index > 0 ?
      ` ${phrase(words.andExcept, text)}` :
      `, ${phrase(words.except, text)}`;
  })].join('');
}

// Whether the day is followed by a comma: always after some day phrases,
// and otherwise before any time that does not begin with «pukul».
function commaAfterDay(days: Days, time: Time): boolean {
  return days.comma || !time.text.startsWith(`${words.oClock} `);
}

/**
 * The parts of a description: the day, the time and the closing part,
 * each with the comma that follows it, if any. Joined by spaces they are
 * the description.
 */
function describeParts(schedule: Schedule, opts: IndonesianOptions): Parts {
  const {dateReach, day} = schedule.analyses;

  // A date that exists in no month the pattern reaches: it never fires,
  // and no time is said.
  if (dateReach && !dateReach.fires && !day.union) {
    return {
      closing: '',
      day: dateReach.firesInOtherYears ?
        words.neverInTheseYears :
        words.never,
      time: ''
    };
  }

  const calendar = calendarOf(schedule, opts);
  const time = timeOf(schedule, opts.style);
  const closing = closingOf(calendar, time);
  // «setiap hari» when no day is named and the time is not a rhythm that
  // runs round the clock.
  const named = calendar.days.text || phrase(!time.round && words.everyDay);

  return {
    closing: closing.map(function join(clause, index) {
      return index > 0 && clause.comma ? `, ${clause.text}` : clause.text;
    }).reduce(function spaced(text, clause) {
      return clause.startsWith(',') ? text + clause : phrase(text, clause);
    }, ''),
    day: named && commaAfterDay(calendar.days, time) ? `${named},` : named,
    time: closing.length > 0 && closing[0].comma ?
      `${timeSaid(time)},` :
      timeSaid(time)
  };
}

function describe(schedule: Schedule, opts: IndonesianOptions): string {
  const parts = describeParts(schedule, opts);

  return phrase(parts.day, parts.time, parts.closing);
}

// A schedule that never fires has sentences of its own.
const sentences: {[description: string]: string} = {
  [words.never]: words.neverSentence,
  [words.neverInTheseYears]: words.neverInTheseYearsSentence
};

const indonesian: Language<IndonesianStyle, 'id'> = {
  code: 'id',
  defaultStyle: 'id',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions,
  sentence(description) {
    return sentences[description] || `${words.runs} ${description}.`;
  },
  style,
  styles
};

export type {IndonesianStyle};
export {describeParts, styles};
export default indonesian;
