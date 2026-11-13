// The year, the month and the day: everything said before the time. A day
// of the month joins its month as a date does; a weekday, or 毎日, follows
// the month with の; a date and a weekday together are said side by side.
// Which months and years a day of the month can fire in is the core's to
// say, and is read from its facts.

import type {
  DateReach, QuartzDate, QuartzWeekday, RangeDescription, Schedule,
  SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {JapaneseStyle} from './options.js';
import {bracketed, leftOut, listOf, noted, when} from './phrases.js';
import type {
  Cadence, Chosen, Core, Described, Part, Piece, Plain, Say
} from './sets.js';
import {choose, inOrder, match, pick, positive, stepsOf} from './sets.js';

const {marks, units, words} = lexicon;

/**
 * What the calendar part ends in, which decides how the time joins it:
 * nothing, a bare 毎日, several days that share the time, or anything else.
 */
export type Lead = 'everyDay' | 'none' | 'other' | 'shared';

/**
 * The parts before the time, each ending in what joins it to the next. A
 * schedule that never runs says so in place of them all, and has no time.
 */
export interface Calendar {
  day: string;
  lead: Lead;
  month: string;
  runs: boolean;
  year: string;
}

/** What the time asks of the day part: whether to say 毎日. */
export interface TimeNeeds {
  // A cadence of minutes or seconds runs through every hour.
  allDay: boolean;
  // The hours are anything but every hour.
  restricted: boolean;
}

// A phrase for days of the month.
interface DayPhrase {
  // The dates it lists, when it is a plain list.
  dates: number[];
  // Whether it follows its month directly, as a date is written.
  direct: boolean;
  // What follows it in brackets.
  notes: string[];
  // What it names that not every month has, said where a month lacks it.
  rare: string;
  // Whether it holds a range of dates, which closes with いずれも.
  shared: boolean;
  text: string;
}

// One of the two day fields: its phrase when it names days after a month
// (dates and Quartz forms), 毎週 and its weekdays, the weekdays or form
// named alone, and what it leaves out of every day.
interface DaySide {
  named: string;
  out: string;
  phrase: DayPhrase | null;
  weekly: string;
}

type Dated = Omit<Calendar, 'lead' | 'runs'>;

interface Context {
  // Whether this is the second side of a pair, where 毎年 is not repeated.
  again: boolean;
  facts: Schedule;
  // Whether the days named come only in leap years.
  leap: boolean;
  months: number[];
  needs: TimeNeeds;
  // When the day of the month can fire. Where the core has nothing to
  // say, it fires in every month reached, every year.
  reach: DateReach;
  style: JapaneseStyle;
  year: Chosen;
}

// The months said positively, the months left out of every month, whether
// they are a plain list, and whether they are written as part of a date.
interface MonthWords {
  dated: boolean;
  listed: boolean;
  out: string;
  text: string;
}

// What follows the year: a month written as part of a date, a month
// phrase that stands apart from it, or a day.
type After = 'apart' | 'day' | 'month';

interface Way<Given extends unknown[], Said> {
  fits: (...given: Given) => boolean;
  say: (...given: Given) => Said;
}

type Quartz<Form extends {kind: string}> = {
  [K in Form['kind']]: (
    form: Extract<Form, {kind: K}>, style: JapaneseStyle
  ) => DayPhrase
};

// How far the days named run, as the months reached let them: the days the
// field names that none of those months has, the last day the longest of
// them is known to have, and whether there is only one month.
interface Reach {
  lacking: number[];
  single: boolean;
  top: number;
}

const dates = domainOf('date');
const everyMonth = 12;

// The most dates and years named one by one, or written in full.
const mostNamed = 7;

// The first day some months lack, and the first that can be a month's last.
const firstLacking = 29;
const firstLast = 28;

// Cron's numbers for the days a nearest-weekday form moves from and to.
const sunday = 0;
const monday = 1;
const friday = 5;
const saturday = 6;

const yearSay: Say = {
  cadence: () => 2,
  domain: domainOf('year'),
  exceptions: true,
  mixed: 'any',
  shortestRange: 3
};

const noPhrase: DayPhrase = {
  dates: [], direct: true, notes: [], rare: '', shared: false, text: ''
};

const noSide: DaySide = {named: '', out: '', phrase: null, weekly: ''};

// Months have a word for every second one, and no other cadence. Before a
// date they are never a range.
function monthSay(cyclic: boolean, ranges: boolean): Say {
  return {
    cadence: (cadence) => [Infinity, 2][Number(
      cadence.interval === 2 && stepsOf(cadence) === 6)],
    domain: {...domainOf('month'), cyclic},
    exceptions: true,
    mixed: 'never',
    shortestRange: ranges ? 3 : Infinity
  };
}

// Every second day is a word; any other cadence of days is its dates. A
// day that some months lack is not named as left out where months are
// named: whether they have it is not known.
function daySay(top: number, cyclic: boolean, removable: boolean): Say {
  return {
    cadence: (cadence) => [stepsOf(cadence), 2][Number(
      cadence.interval === 2)],
    domain: {cyclic, max: top, min: dates.min},
    exceptions: true,
    mixed: 'apart',
    removable: (day) => removable || day < firstLacking,
    shortestRange: 3
  };
}

function weekdayName(weekday: number, style: JapaneseStyle): string {
  const name = lexicon.weekdays[weekday];

  return style.short ? name.short : name.full;
}

function isSaid(text: string): boolean {
  return text.length > 0;
}

function ascending(a: number, b: number): number {
  return a - b;
}

// How a cadence among other parts is said: whether as its values, which
// then join the other values that stand alone, and in what words if not.
// What leads the parts can be said in ways that what follows cannot: a
// word after a later part would be read with all the parts before it.
interface PartSay {
  cadence: (cadence: Cadence, leads: boolean) => string;
  listed: (cadence: Cadence, leads: boolean) => boolean;
  range: (range: RangeDescription) => string;
}

// The values of a cadence that does not pass the end of its field.
function valuesOf(cadence: Cadence): number[] {
  return Array.from({length: stepsOf(cadence)},
    (step, index) => cadence.start + index * cadence.interval);
}

// The parts of a set said in pieces, in the order they are said, each by
// its own phrase and joined by と. The values named one by one are one
// list, wherever among the parts they come from.
function sayParts(given: Part[], say: PartSay, unit: string): string {
  const [first] = inOrder(given);

  function leads(cadence: Cadence): boolean {
    return (first as Partial<Cadence>).start === cadence.start;
  }

  const listed = given.filter((part): part is Cadence =>
    part.kind === 'cadence' && say.listed(part, leads(part)));
  const values = given.flatMap((part) => match<Part, number[]>(part, {
    cadence: (cadence) => valuesOf(cadence).filter(
      () => listed.includes(cadence)),
    range: () => [],
    values: (list) => list.values
  }));
  const named: Part[] = values.length > 0 ? [{kind: 'values', values}] : [];
  const settled = given.filter((part) => part.kind !== 'values' &&
    !listed.includes(part as Cadence)).concat(named);

  return inOrder(settled).map((part) => match(part, {
    cadence: (cadence) => say.cadence(cadence, leads(cadence)),
    range: say.range,
    values: (list) => listOf(list.values.map((value) => value + unit))
  })).join(words.and);
}

// Years.

function yearName(year: number): string {
  return year + units.year;
}

// A run of years. One with no end names only its start.
function yearRange(range: RangeDescription): string {
  return yearName(range.from) + (range.open ?
    words.fromOn :
    marks.range + yearName(range.to));
}

// Whether a cadence of years is named year by year: a few years that
// stop, unless they are every second year and can be said by that word.
function yearsListed(cadence: Cadence, leads: boolean): boolean {
  return cadence.open !== true && stepsOf(cadence) <= mostNamed &&
    !(cadence.interval === 2 && leads);
}

// A cadence of years that is not named year by year: every second year
// by its word, with its start or its ends where it does not cover every
// year; any other by its rule, with its first years in brackets. Among
// other parts the word is said only of the part that leads them, since
// after another part it would be read with both.
function yearCadence(cadence: Cadence, leads: boolean): string {
  const {interval, last, start} = cadence;
  const open = cadence.open === true;
  const whole = open && start - yearSay.domain.min < interval;
  const closed = when(!open, yearName(last));
  const rule = yearName(start) + words.from +
    when(!open, closed + words.to) + interval + units.year +
    words.yearsEvery + marks.open +
    listOf([start, start + interval].map(yearName)) + marks.ellipsis +
    closed + marks.close;
  const parity = when(!whole,
    yearRange({...cadence, from: start, kind: 'range', to: last}) +
    words.of) + [words.evenYears, words.oddYears][start % 2];

  return interval === 2 && leads ? parity : rule;
}

const yearParts: PartSay = {
  cadence: yearCadence, listed: yearsListed, range: yearRange
};

// The years, and what joins them to a month: nothing after one year, の
// after a list, and の毎年 after a span or several pieces, which would
// otherwise be read as ending on the date.
function yearWords(years: Core): {text: string; toMonth: string} {
  const span = words.of + words.everyYear;

  function pieces(parts: Part[]): {text: string; toMonth: string} {
    return {text: sayParts(parts, yearParts, units.year), toMonth: span};
  }

  return match(years, {
    all: () => ({text: words.everyYear, toMonth: ''}),
    cadence: (cadence) => ({
      text: sayParts([cadence], yearParts, units.year), toMonth: words.of
    }),
    cadencePieces: (mixed) => pieces(mixed.parts),
    pieces: (plain) => pieces(plain.parts),
    range: (range) => ({text: yearRange(range), toMonth: span}),
    values: (list) => ({
      text: listOf(list.values.map(yearName)),
      toMonth: when(list.values.length > 1, words.of)
    })
  });
}

// The year part: the years left out of every year, which stand in front
// with whatever else is left out, and the years said, with what joins
// them to what follows. Every year is 毎年 before a month, once, and is
// otherwise not said; days that come only in leap years say so in its
// place, or after the years named.
function yearLead(context: Context, after: After):
  {out: string; text: string} {
  const exception = context.year as Partial<Described<'except'>>;
  const core = (exception.base ?? context.year) as Core;
  const said = yearWords(core);
  const removed = listOf((exception.removed ?? []).map(yearName));
  const leap = when(context.leap, words.leapYear + words.of);
  const joins: Record<After, string> = {
    apart: said.toMonth || words.of,
    day: words.of,
    month: said.toMonth
  };

  if (core.kind === 'all') {
    return {
      out: removed,
      text: leap || when(after !== 'day' && !context.again, said.text)
    };
  }

  return {
    out: '',
    text: said.text + bracketed([removed]) +
      (context.leap ? words.of + leap : joins[after])
  };
}

// Everything left out, in front, and then the years.
function lead(context: Context, after: After, out: string[] = []): string {
  const year = yearLead(context, after);

  return leftOut([year.out, ...out]) + year.text;
}

// The description the years are said by, among the core's own.
function yearOf(facts: Schedule): Chosen {
  const offered = facts.analyses.candidates.year as SetDescription[];
  const listed = offered[offered.length - 1] as Partial<ValuesDescription>;

  return choose({
    count: (listed.values ?? []).length,
    described: offered,
    linear: offered,
    mixed: () => facts.analyses.cadencePieces.year
  }, yearSay);
}

// Months.

function monthRange(range: RangeDescription): string {
  return range.from + units.month + marks.range +
    when(range.from > range.to, words.nextYear) + range.to + units.month;
}

function monthNames(months: number[]): string {
  return listOf(months.map((month) => month + units.month));
}

// The months said positively, and the months left out of every month.
function monthWords(months: Chosen): MonthWords {
  const exception = months as Partial<Described<'except'>>;
  const core = (exception.base ?? months) as Plain;
  const removed = monthNames(exception.removed ?? []);
  const text = match<Plain, string>(core, {
    all: () => '',
    cadence: (cadence) =>
      [words.evenMonths, words.oddMonths][cadence.start % 2],
    pieces: (pieces) => inOrder(pieces.parts).map((part) => match(part, {
      range: monthRange,
      values: (list) => monthNames(list.values)
    })).join(words.and),
    range: monthRange,
    values: (list) => monthNames(list.values)
  });
  const plain = !isSaid(removed) &&
    (core.kind === 'values' || core.kind === 'range');

  return core.kind === 'all' ?
    {dated: false, listed: false, out: removed, text} :
    {
      dated: plain,
      listed: plain && core.kind === 'values',
      out: '',
      text: text + bracketed([removed])
    };
}

// The months as they are said before a weekday or 毎日, where a range
// stays a range, or before a date, where it does not.
function monthsOf(context: Context, ranges: boolean): MonthWords {
  const say = monthSay(context.year.kind === 'all', ranges);

  return monthWords(pick(context.months, say));
}

// Days of the month.

function dayNames(days: number[]): string {
  return listOf(days.map((day) => day + units.day));
}

// A list of dates. A long cadence is its first three dates, …, and its
// last, which shows the interval and both ends.
function dayList(days: number[], spaced: boolean): DayPhrase {
  const text = spaced && days.length > mostNamed ?
    dayNames(days.slice(0, 3)) + marks.ellipsis + dayNames(days.slice(-1)) :
    dayNames(days);

  return {...noPhrase, dates: days, text};
}

// A range of dates. One that runs to the end of the months reached ends
// 末日 unless a single month is named, since shorter months stop short of
// the day it would name.
function dayRange(range: RangeDescription, reach: Reach): string {
  const {from, to} = range;
  const end = to === reach.top && !reach.single ?
    words.lastDay :
    to + units.day;

  return from + units.day + marks.range + when(from > to, words.nextMonth) +
    end;
}

// Every second day: the word alone when it covers the month, and inside
// the run it covers otherwise. It covers the month when it starts with it
// and no later day of its kind exists in the months reached.
function dayParity(cadence: Cadence, reach: Reach): DayPhrase {
  const next = cadence.last + cadence.interval;
  const whole = cadence.start <= cadence.interval &&
    (next > reach.top || reach.lacking.includes(next));
  const run = cadence.start + units.day + marks.range + cadence.last +
    units.day + words.of;

  return {
    ...noPhrase,
    direct: !whole,
    text: when(!whole, run) +
      [words.evenDays, words.oddDays][cadence.start % 2]
  };
}

// A cadence of days alone: every second day by its word, any other by
// its dates.
function dayCadence(cadence: Cadence, reach: Reach): DayPhrase {
  return cadence.interval === 2 ?
    dayParity(cadence, reach) :
    dayList(valuesOf(cadence), true);
}

// Whether a cadence of days among other parts joins the dates named one
// by one: a few dates, unless they are every second day and lead the
// parts, where the word can be said of them.
function daysListed(cadence: Cadence, leads: boolean): boolean {
  return stepsOf(cadence) <= mostNamed && !(cadence.interval === 2 && leads);
}

// Days that do not cover their months: every day is never said here.
type Days = Exclude<Core, {kind: 'all'}>;

function dayPhrase(days: Days, reach: Reach): DayPhrase {
  function sayRange(range: RangeDescription): string {
    return dayRange(range, reach);
  }

  // Several pieces share the time; dates that all came to one list do
  // not.
  function pieces(parts: Part[]): DayPhrase {
    const text = sayParts(parts, {
      cadence: (cadence, leads) => (cadence.interval === 2 && leads ?
        dayParity(cadence, reach) :
        dayList(valuesOf(cadence), true)).text,
      listed: daysListed,
      range: sayRange
    }, units.day);

    return {...noPhrase, shared: text.includes(words.and), text};
  }

  return match(days, {
    cadence: (cadence) => dayCadence(cadence, reach),
    cadencePieces: (mixed) => pieces(mixed.parts),
    pieces: (plain) => pieces(plain.parts),
    range: (range) => ({...noPhrase, shared: true, text: sayRange(range)}),
    values: (list) => dayList(list.values, false)
  });
}

// Every second day with days missing, where nothing may be left out: the
// runs that remain, each keeping the word inside the run it covers.
function parityRuns(cadence: Cadence, days: number[], reach: Reach):
  DayPhrase {
  const steps = days.map((day) => (day - cadence.start) / cadence.interval);

  function dayAt(step: number): number {
    return cadence.start + step * cadence.interval;
  }

  const runs = describeSet(steps, {cyclic: false, max: dates.max, min: 0})
    .find((description) => description.kind === 'pieces') as
    Partial<Described<'pieces'>> | undefined;
  const parts = runs?.parts ?? [{kind: 'values', values: steps} as Piece];

  return {
    ...noPhrase,
    text: inOrder(parts).map((part) => match(part, {
      range: (range) => dayParity(
        {...cadence, last: dayAt(range.to), start: dayAt(range.from)},
        reach).text,
      values: (list) => dayNames(list.values.map(dayAt))
    })).join(words.and)
  };
}

// Where a day moves to when it falls on the days named: 土曜日・日曜日の場
// 合は直前の金曜日.
function moved(from: number[], to: string, style: JapaneseStyle): string {
  return listOf(from.map((weekday) => weekdayName(weekday, style))) +
    words.after + to;
}

// A day kept to Monday through Friday inside its month, said as the day
// and where it moves to from a Saturday or a Sunday. The last day of a
// month moves back to Friday, the first forward to Monday, and any other
// to the nearer of the two, except that a day which is its month's last
// moves back from a Sunday too.
function keptToTheWeek(day: number, style: JapaneseStyle): string[] {
  const back = words.justBefore + weekdayName(friday, style);
  const on = words.justAfter + weekdayName(monday, style);
  const nearer = [
    moved([saturday], words.dayBefore + words.of +
      weekdayName(friday, style), style),
    moved([sunday], words.nextDay + words.of + weekdayName(monday, style),
      style),
    when(day >= firstLast, words.but + day + units.day + words.subject +
      words.lastDay + words.alsoBeing + moved([sunday], back, style))
  ];
  const ends: {[at: number]: string[]} = {
    [dates.max]: [moved([saturday, sunday], back, style)],
    [dates.min]: [moved([saturday, sunday], on, style)]
  };

  return ends[day] ?? nearer;
}

const quartzDates: Quartz<QuartzDate> = {
  // So many days before the last, which a month must be long enough for.
  beforeLast: (form) => ({
    ...noPhrase,
    rare: form.days + 1 + units.day,
    text: words.lastDay + words.of + (form.days === 1 ?
      words.dayBefore :
      form.days + words.daysBefore)
  }),
  firstWeekday: (form, style) => ({
    ...noPhrase,
    notes: keptToTheWeek(dates.min, style),
    text: dates.min + units.day
  }),
  last: () => ({...noPhrase, text: words.lastDay}),
  lastWeekday: (form, style) => ({
    ...noPhrase,
    notes: keptToTheWeek(dates.max, style),
    text: words.lastDay
  }),
  // The nearest weekday fires only in months that have the day.
  nearestWeekday: (form, style) => ({
    ...noPhrase,
    notes: keptToTheWeek(form.day, style),
    rare: form.day + units.day,
    text: form.day + units.day
  })
};

// The fifth of a weekday is the last a month can have, and not every
// month has one.
const mostInMonth = 5;

const quartzWeekdays: Quartz<QuartzWeekday> = {
  last: (form, style) => ({
    ...noPhrase,
    direct: false,
    text: words.lastNamed + weekdayName(form.weekday, style)
  }),
  nth(form, style) {
    const text = words.nth + form.nth + weekdayName(form.weekday, style);

    return {
      ...noPhrase,
      direct: false,
      rare: when(form.nth === mostInMonth, text),
      text
    };
  }
};

function quartzPhrase<Form extends {kind: string}>(
  table: Quartz<Form>,
  form: Form,
  style: JapaneseStyle
): DayPhrase {
  const say = table[form.kind as Form['kind']] as
    (given: Form, style: JapaneseStyle) => DayPhrase;

  return say(form, style);
}

// The day a run past the end of its field starts on; zero when the
// description holds no such run.
function wrapStart(description: Chosen): number {
  return match(description, {
    all: () => 0,
    cadence: () => 0,
    cadencePieces: () => 0,
    except: (exception) => wrapStart(exception.base),
    pieces: (pieces) => Math.max(...pieces.parts.map(wrapStart)),
    range: (range) => Number(range.from > range.to) * range.from,
    values: () => 0
  });
}

// What a day phrase names that not every month has, said under 毎月 where
// the day-of-month field skips some month or year it reaches.
function rareness(context: Context, rare: string): string {
  const {reach} = context;

  return when(context.months.length === everyMonth &&
    reach.never.length + reach.leapYears.length > 0, rare);
}

// What a day phrase says of the years it fires in, where February fires
// only in leap years: beside other months, of February; and beside a
// weekday, where the years cannot lead both sides, of itself.
function leapNotes(context: Context): string[] {
  const {everyYear, leapYears} = context.reach;
  const named = context.months.length < everyMonth && leapYears.length > 0;
  const only = words.leapYear + words.only;

  return [
    when(named && everyYear.length > 0,
      monthNames(leapYears) + words.topic + only),
    when(named && everyYear.length === 0 &&
      context.facts.analyses.day.union, only)
  ];
}

// A Quartz form of the day of the month.
function quartzDateSide(context: Context): DaySide {
  const {day} = context.facts.analyses;
  const phrase = quartzPhrase(quartzDates,
    (day.date as {form: QuartzDate}).form, context.style);

  return {
    ...noSide,
    phrase: {
      ...phrase,
      notes: [...phrase.notes, ...leapNotes(context)],
      rare: rareness(context, phrase.rare)
    }
  };
}

// The days of the month that exist in a month reached, and how far they
// run. Where the field names the day after the last of them, and no month
// reached has it, that last day is the end of the longest month.
function daysReached(context: Context): {days: number[]; reach: Reach} {
  const own = context.facts.analyses.candidates.date as SetDescription[];
  const named = denote(own[0], dates);
  const days = denote((context.reach.days?.candidates ?? own)[0], dates);
  const lacking = named.filter((date) => !days.includes(date));
  const last = days[days.length - 1];

  return {
    days,
    reach: {
      lacking,
      single: context.months.length === 1,
      top: lacking.includes(last + 1) ? last : dates.max
    }
  };
}

// The description the days are said by. A run past the end of the month
// is said as one only where every month and year fires, and only from a
// day every month has. A day that some months lack is named as left out
// only where the months' end is known.
function daysChosen(context: Context, days: number[], reach: Reach):
  {chosen: Chosen; say: Say} {
  const all = context.months.length === everyMonth;
  const known = all || reach.top < dates.max;
  const cyclic = all && context.year.kind === 'all' &&
    wrapStart(pick(days, daySay(reach.top, true, known))) < firstLacking;
  const say = daySay(reach.top, cyclic, known);

  return {chosen: pick(days, say), say};
}

// The day-of-month field as a plain set of days: those the months
// reached have. Beside a weekday nothing is left out; alone, days left
// out of every day are an exception that rests on 毎日, and any other
// exception follows in brackets.
function plainDateSide(context: Context): DaySide {
  const {union} = context.facts.analyses.day;
  const {days, reach} = daysReached(context);
  const {chosen, say} = daysChosen(context, days, reach);
  const exception = chosen as Partial<Described<'except'>>;
  const core = (exception.base ?? chosen) as Core;
  const removed = dayNames(exception.removed ?? []);

  if (core.kind === 'all' && !union) {
    return {...noSide, out: removed};
  }

  const said = union ?
    core.kind === 'cadence' && isSaid(removed) && parityRuns(core, days,
      reach) || dayPhrase(positive(days, say) as Days, reach) :
    dayPhrase(core as Days, reach);

  return {
    ...noSide,
    phrase: {
      ...said,
      notes: [when(!union, leftOut([removed])), ...leapNotes(context)],
      rare: rareness(context, days[0] + units.day)
    }
  };
}

function dateSide(context: Context): DaySide {
  return context.facts.analyses.candidates.date ?
    plainDateSide(context) :
    quartzDateSide(context);
}

// The day-of-week field, walked from Monday with Sunday last. Three or
// more days in a row are a range, also across Sunday into Monday; six
// days that cross are the seventh left out of every day, unless they
// stand beside a date; and anything else is a list.
function weekdaySide(context: Context): DaySide {
  const {candidates, day} = context.facts.analyses;

  function name(weekday: number): string {
    return weekdayName(weekday, context.style);
  }

  if (!candidates.weekday) {
    const phrase = quartzPhrase(quartzWeekdays,
      (day.weekday as {form: QuartzWeekday}).form, context.style);

    return {...noSide, named: phrase.text, phrase};
  }

  const offered = candidatesAs(context.facts, 'weekday', {first: monday}) as
    SetDescription[];
  const listed = offered[offered.length - 1] as Partial<ValuesDescription>;
  const days = listed.values ?? [];
  const week = domainOf('weekday').max + 1;
  const runs = offered.filter(
    (description) => description.kind === 'range') as RangeDescription[];
  // Counted from Monday, a run that crosses the week's end starts later
  // than it stops.
  const crosses = runs.some((run) =>
    (run.from + week - monday) % week > (run.to + week - monday) % week);
  const sixth = days.length === week - 1 && crosses && !day.union;
  const missing = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekday) => !days.includes(weekday));
  const text = days.length > 2 && runs.map(
    (run) => name(run.from) + marks.range + name(run.to))[0] ||
    listOf(days.map(name));

  return {
    ...noSide,
    named: text,
    out: when(sixth, listOf(missing.map(name))),
    weekly: when(days.length > 0 && !sixth, words.everyWeek + text)
  };
}

function fullDates(context: Context, phrase: DayPhrase): string {
  return listOf(context.months.flatMap((month) => phrase.dates.map(
    (date) => month + units.month + date + units.day)));
}

// A day phrase with its notes, and with what it names that a month may
// lack: said of the months that have it, or of the years where one month
// is named.
function withNotes(context: Context, phrase: DayPhrase): string {
  const having = context.months.length === 1 ?
    words.inYearsWith :
    words.inMonthsWith;

  return noted([
    when(isSaid(phrase.rare), phrase.rare + having + words.only),
    ...phrase.notes
  ]);
}

// A month before a phrase that names its days as a date does.
const datedWays: Array<Way<[Context, DayPhrase], Dated>> = [
  {
    // Every month: 毎月.
    fits: (context) => context.months.length === everyMonth,
    say: (context, phrase) => ({
      day: words.everyMonth + phrase.text + withNotes(context, phrase),
      month: '',
      year: lead(context, 'day')
    })
  },
  {
    // One month: the phrase follows it as a date is written, or after の.
    fits: (context) => context.months.length === 1,
    say: (context, phrase) => ({
      day: when(!phrase.direct, words.of) + phrase.text +
        withNotes(context, phrase),
      month: context.months[0] + units.month,
      year: lead(context, 'month')
    })
  },
  {
    // Most months: the few left out, in front of the years and 毎月.
    fits: (context) => isSaid(monthsOf(context, false).out),
    say: (context, phrase) => ({
      day: phrase.text + withNotes(context, phrase),
      month: words.everyMonth,
      year: lead(context, 'day', [monthsOf(context, false).out])
    })
  },
  {
    // A few dates in named months: each written in full with its month.
    // A date some months lack is written so only when it is the one date,
    // since the months named are then those that have it.
    fits: (context, phrase) => monthsOf(context, false).listed &&
      isSaid(fullDates(context, phrase)) &&
      context.months.length * phrase.dates.length <= mostNamed &&
      phrase.dates.slice(1).every((date) => date < firstLacking),
    say: (context, phrase) => ({
      day: fullDates(context, phrase) + withNotes(context, phrase),
      month: '',
      year: lead(context, 'month')
    })
  },
  {
    // Otherwise the months, の, and the phrase.
    fits: () => true,
    say: (context, phrase) => ({
      day: phrase.text + withNotes(context, phrase),
      month: monthsOf(context, false).text + words.of,
      year: lead(context, monthsOf(context, false).dated ? 'month' : 'apart')
    })
  }
];

function dated(context: Context, phrase: DayPhrase): Calendar {
  const way = datedWays.find((candidate) =>
    candidate.fits(context, phrase)) as (typeof datedWays)[0];
  const said = way.say(context, phrase);

  return {...said, lead: phrase.shared ? 'shared' : 'other', runs: true};
}

// A month before a weekday phrase or 毎日, which keep their own 毎. What
// is left out of every day, month or year stands in front of the whole,
// and a date left out keeps 毎月 only where no month is said.
function loose(context: Context, sides: DaySide[]): Calendar {
  const [date, weekday] = sides;
  const months = monthsOf(context, true);
  const after = isSaid(months.text) && (months.dated ? 'month' : 'apart') ||
    'day';
  const year = yearLead(context, after);
  const out = [
    year.out,
    months.out,
    when(isSaid(date.out),
      when(!isSaid(months.text), words.everyMonth) + date.out) + weekday.out
  ];
  const everyDay = !isSaid(weekday.weekly) && (out.some(isSaid) ||
    context.needs.restricted || context.needs.allDay &&
    isSaid(months.text + year.text));

  return {
    day: weekday.weekly + when(everyDay, words.everyDay),
    lead: isSaid(weekday.weekly) && 'other' || everyDay && 'everyDay' ||
      'none',
    month: when(isSaid(months.text), months.text + words.of),
    runs: true,
    year: leftOut(out) + year.text
  };
}

// Either side of a date and a weekday together, with its month and its
// named year.
function sideOf(context: Context, side: DaySide): Calendar {
  return side.phrase ?
    dated(context, side.phrase) :
    loose(context, [noSide, side]);
}

// A date and a weekday that must both match: the dates, and of them the
// days that fall on the weekdays, said as a condition on the dates.
function fallingOn(context: Context, phrase: DayPhrase, weekday: DaySide):
  Calendar {
  const date = dated(context, phrase);

  return {
    ...date,
    day: date.day + words.among + weekday.named + words.falling,
    lead: 'other'
  };
}

// A date and a weekday together: each side carries the month, and the
// year when it is named; 毎年 is said once, at the head.
function together(contexts: Context[], sides: DaySide[]): Calendar {
  const date = sideOf(contexts[0], sides[0]);
  const weekday = sideOf({...contexts[1], again: true}, sides[1]);

  return {
    ...date,
    day: date.day + words.also + weekday.year + weekday.month + weekday.day,
    lead: 'shared'
  };
}

// A day of the month that never comes: the schedule never runs, and the
// description says that, with the months named and the day they lack.
function never(context: Context): Calendar {
  const {candidates, day} = context.facts.analyses;
  const lacked = candidates.date ?
    dayNames(denote(candidates.date[0], dates)) :
    quartzPhrase(quartzDates, (day.date as {form: QuartzDate}).form,
      context.style).text;
  // The years are said where they are named; 毎年 is not.
  const year = [yearLead(context, 'month').text].filter(
    (text) => text !== words.everyYear).join('');

  return {
    day: words.never + marks.open + year + monthNames(context.months) +
      words.runsAt + lacked + words.lacks + marks.close,
    lead: 'none',
    month: '',
    runs: false,
    year: ''
  };
}

// The parts for a schedule that runs. Days that are every day of their
// months are no restriction: beside a weekday they are every day, or, where
// both must match, the weekday alone. A date that must match a weekday is
// said with the weekdays as a condition on it; a day that never comes
// leaves a weekday beside it to stand alone; and the months a day of the
// month is said of are those it fires in.
function running(context: Context): Calendar {
  const {reach} = context;
  const {both, union} = context.facts.analyses.day;
  const everyDay = reach.days?.everyDay === true;
  const paired = union && reach.fires && !everyDay;
  const firing = [...reach.everyYear, ...reach.leapYears].sort(ascending);
  const forDates: Context = {
    ...context,
    leap: reach.everyYear.length === 0 && !paired,
    months: context.months.length < everyMonth ? firing : context.months
  };
  const date = reach.fires && !everyDay ? dateSide(forDates) : noSide;
  const weekday = everyDay && !both ? noSide : weekdaySide(context);

  function alone(): Calendar {
    return both && date.phrase &&
      fallingOn(forDates, date.phrase, weekday) ||
      date.phrase && dated(forDates, date.phrase) ||
      weekday.phrase && dated(context, weekday.phrase) ||
      loose(context, [date, weekday]);
  }

  return paired ? together([forDates, context], [date, weekday]) : alone();
}

/** The year, month and day parts of the sentence. */
function calendarPart(
  facts: Schedule,
  needs: TimeNeeds,
  style: JapaneseStyle
): Calendar {
  const {candidates, dateReach, day} = facts.analyses;
  const months = denote((candidates.month as SetDescription[])[0],
    domainOf('month'));
  const reach = dateReach ?? {
    days: null, everyYear: months, fires: true, firesInOtherYears: true,
    leapYears: [], never: []
  };
  const context: Context = {
    again: false, facts, leap: false, months, needs, reach, style,
    year: yearOf(facts)
  };

  return reach.fires || day.union ? running(context) : never(context);
}

export {calendarPart};
