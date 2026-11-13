// The year, the month and the day: everything said before the time. A day
// of the month joins its month as a date does; a weekday, or 毎日, follows
// the month with の; a date and a weekday together are said side by side.

import type {
  Analyses, QuartzDate, QuartzWeekday, SetDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {JapaneseStyle} from './options.js';
import {bracketed, leftOut, listOf, when} from './phrases.js';
import type {Cadence, Core, Described, Part, Say} from './sets.js';
import {inOrder, match, pick, positive, stepsOf} from './sets.js';

const {marks, units, words} = lexicon;

/**
 * What the calendar part ends in, which decides how the time joins it:
 * nothing, a bare 毎日, several days that share the time, or anything else.
 */
export type Lead = 'everyDay' | 'none' | 'other' | 'shared';

/** The parts before the time, each ending in what joins it to the next. */
export interface Calendar {
  day: string;
  lead: Lead;
  month: string;
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
  // The day a month must have for the phrase to fire in it, if not all do.
  needs: number;
  // Whether it holds a range of dates, which closes with いずれも.
  shared: boolean;
  text: string;
}

// One of the two day fields: its phrase when it names days after a month
// (dates and Quartz forms), 毎週 and its weekdays, and what it leaves out
// of every day.
interface DaySide {
  out: string;
  phrase: DayPhrase | null;
  weekly: string;
}

type Dated = Omit<Calendar, 'lead'>;

interface Context {
  analyses: Analyses;
  months: number[];
  needs: TimeNeeds;
  style: JapaneseStyle;
  year: SetDescription;
}

// The months said positively, the months left out of every month, and
// whether the months are a plain list.
interface MonthWords {
  listed: boolean;
  out: string;
  text: string;
}

interface Way<Given extends unknown[], Said> {
  fits: (...given: Given) => boolean;
  say: (...given: Given) => Said;
}

type Quartz<Form extends {kind: string}> = {
  [K in Form['kind']]: (
    form: Extract<Form, {kind: K}>, style: JapaneseStyle
  ) => DayPhrase
};

// The longest each month can be; February keeps the 29th.
const monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const longestMonth = 31;

// The most dates and years named one by one, or written in full.
const mostNamed = 7;

// The first day some months lack, and the first that can be a month's last.
const firstLacking = 29;
const firstLast = 28;

const yearSay: Say = {
  cadence: () => 2,
  domain: domainOf('year'),
  exceptions: true,
  shortestRange: 3
};

const noPhrase: DayPhrase = {
  dates: [], direct: true, needs: 0, shared: false, text: ''
};

const noSide: DaySide = {out: '', phrase: null, weekly: ''};

// Months have a word for every second one, and no other cadence. Before a
// date they are never a range.
function monthSay(cyclic: boolean, ranges: boolean): Say {
  return {
    cadence: (cadence) => [Infinity, 2][Number(
      cadence.interval === 2 && stepsOf(cadence) === 6)],
    domain: {...domainOf('month'), cyclic},
    exceptions: true,
    shortestRange: ranges ? 3 : Infinity
  };
}

// Every second day is a word; any other cadence of days is its dates.
function daySay(last: number, cyclic: boolean): Say {
  return {
    cadence: (cadence) => [stepsOf(cadence), 2][Number(
      cadence.interval === 2)],
    domain: {cyclic, max: last, min: 1},
    exceptions: true,
    shortestRange: 3
  };
}

function weekdayName(weekday: number, style: JapaneseStyle): string {
  const name = lexicon.weekdays[weekday % 7];

  return style.short ? name.short : name.full;
}

function isSaid(text: string): boolean {
  return text.length > 0;
}

// The parts of a range or of pieces, in the order they are said, each by
// its own phrase and joined by と.
function sayParts(
  parts: Part[],
  sayRange: (from: number, to: number) => string,
  unit: string
): string {
  return inOrder(parts).map((part) => match(part, {
    range: (range) => sayRange(range.from, range.to),
    values: (list) => listOf(list.values.map((value) => value + unit))
  })).join(words.and);
}

// Years.

function yearRange(from: number, to: number): string {
  return to === yearSay.domain.max ?
    from + units.year + words.fromOn :
    from + units.year + marks.range + to + units.year;
}

// A cadence of years: every second year by its word, with its start or
// its ends where it does not cover every year; a few years by name; any
// other by its rule, with its first years in brackets.
function yearCadence(cadence: Cadence): string {
  const {interval, last, start} = cadence;
  const open = last + interval > yearSay.domain.max;
  const whole = open && start - interval < yearSay.domain.min;
  const years = denote(cadence, yearSay.domain)
    .map((year) => year + units.year);
  const rule = start + units.year + words.from +
    when(!open, last + units.year + words.to) + interval + units.year +
    words.yearsEvery + marks.open + listOf(years.slice(0, 2)) +
    marks.ellipsis + when(!open, last + units.year) + marks.close;
  const parity = when(!whole, yearRange(start, open ? yearSay.domain.max :
    last) + words.of) + [words.evenYears, words.oddYears][start % 2];
  const few = years.length <= mostNamed ? listOf(years) : rule;

  return interval === 2 ? parity : few;
}

// The years, and what joins them to a month: nothing after one year, の
// after a list, and の毎年 after a span, which would otherwise be read as
// ending on the date.
function yearWords(years: Core): {text: string; toMonth: string} {
  const span = words.of + words.everyYear;

  return match(years, {
    all: () => ({text: words.everyYear, toMonth: ''}),
    cadence: (cadence) => ({text: yearCadence(cadence), toMonth: words.of}),
    pieces: (pieces) => ({
      text: sayParts(pieces.parts, yearRange, units.year), toMonth: span
    }),
    range: (range) => ({
      text: yearRange(range.from, range.to), toMonth: span
    }),
    values: (list) => ({
      text: listOf(list.values.map((year) => year + units.year)),
      toMonth: when(list.values.length > 1, words.of)
    })
  });
}

// The year part with what joins it to the next: its own join before a
// month, の before anything else. Every year is 毎年 before a month and is
// otherwise not said.
function yearLead(context: Context, toMonth: boolean): string {
  const exception = context.year as Partial<Described<'except'>>;
  const core = (exception.base ?? context.year) as Core;
  const said = yearWords(core);
  const removed = listOf((exception.removed ?? []).map(
    (year) => year + units.year));
  const text = core.kind === 'all' ?
    when(isSaid(removed) || toMonth, leftOut([removed]) + said.text) :
    said.text + bracketed([removed]);
  const named = isSaid(removed) || core.kind !== 'all';

  return text + (toMonth ? said.toMonth : when(named, words.of));
}

// Months.

function monthRange(from: number, to: number): string {
  return from + units.month + marks.range + when(from > to, words.nextYear) +
    to + units.month;
}

function monthNames(months: number[]): string {
  return listOf(months.map((month) => month + units.month));
}

// The months said positively, and the months left out of every month.
function monthWords(months: SetDescription): MonthWords {
  const exception = months as Partial<Described<'except'>>;
  const core = (exception.base ?? months) as Core;
  const removed = monthNames(exception.removed ?? []);
  const text = match<Core, string>(core, {
    all: () => '',
    cadence: (cadence) =>
      [words.evenMonths, words.oddMonths][cadence.start % 2],
    pieces: (pieces) => sayParts(pieces.parts, monthRange, units.month),
    range: (range) => monthRange(range.from, range.to),
    values: (list) => monthNames(list.values)
  });
  const listed = core.kind === 'values' && !isSaid(removed);

  return core.kind === 'all' ?
    {listed, out: removed, text} :
    {listed, out: '', text: text + bracketed([removed])};
}

// The months as they are said before a weekday or 毎日, where a range
// stays a range, or before a date, where it does not.
function monthsOf(context: Context, ranges: boolean, plainly: boolean):
  MonthWords {
  const say = monthSay(context.year.kind === 'all', ranges);
  const choose = plainly ? positive : pick;

  return monthWords(choose(context.months, say));
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

// A range of dates. One that ends on the 31st ends 末日 unless a single
// month is named, since shorter months stop short of it.
function dayRange(from: number, to: number, single: boolean): string {
  const last = to === longestMonth && !single ?
    words.lastDay :
    to + units.day;

  return from + units.day + marks.range + when(from > to, words.nextMonth) +
    last;
}

// Every second day: the word alone when it covers the month, and inside
// the run it covers otherwise.
function dayParity(cadence: Cadence, last: number): DayPhrase {
  const whole = cadence.start <= cadence.interval &&
    cadence.last + cadence.interval > last;
  const run = cadence.start + units.day + marks.range + cadence.last +
    units.day + words.of;

  return {
    ...noPhrase,
    direct: !whole,
    text: when(!whole, run) +
      [words.evenDays, words.oddDays][cadence.start % 2]
  };
}

function dayPhrase(days: Core, last: number, single: boolean): DayPhrase {
  function sayRange(from: number, to: number): string {
    return dayRange(from, to, single);
  }

  return match<Core, DayPhrase>(days, {
    // Every day of a named month, beside a weekday: the month's own span.
    all: () => ({...noPhrase, shared: true, text: sayRange(1, last)}),
    cadence(cadence) {
      return cadence.interval === 2 ?
        dayParity(cadence, last) :
        dayList(denote(cadence, domainOf('date')), true);
    },
    pieces: (pieces) => ({
      ...noPhrase,
      shared: true,
      text: sayParts(pieces.parts, sayRange, units.day)
    }),
    range: (range) => ({
      ...noPhrase, shared: true, text: sayRange(range.from, range.to)
    }),
    values: (list) => dayList(list.values, false)
  });
}

// Every second day with days missing, where nothing may be left out: the
// runs that remain, each keeping the word inside the run it covers.
function parityRuns(cadence: Cadence, days: number[], last: number):
  DayPhrase {
  const steps = days.map((day) => (day - cadence.start) / cadence.interval);

  function dayAt(step: number): number {
    return cadence.start + step * cadence.interval;
  }

  const runs = describeSet(steps, {cyclic: false, max: longestMonth, min: 0})
    .find((description) => description.kind === 'pieces') as
    Partial<Described<'pieces'>> | undefined;
  const parts = runs?.parts ?? [{kind: 'values', values: steps} as Part];

  return {
    ...noPhrase,
    text: inOrder(parts).map((part) => match(part, {
      range: (range) => dayParity(
        {...cadence, last: dayAt(range.to), start: dayAt(range.from)},
        last).text,
      values: (list) => dayNames(list.values.map(dayAt))
    })).join(words.and)
  };
}

// The day a weekday from Monday to Friday is: 平日, with the days it
// covers in brackets, since the word alone leaves out public holidays.
function workingDay(style: JapaneseStyle): string {
  return words.workingDay + marks.open + weekdayName(1, style) + marks.range +
    weekdayName(5, style) + marks.close;
}

const quartzDates: Quartz<QuartzDate> = {
  // So many days before the last. Not every month is long enough to have
  // the day once it is 28 or more before.
  beforeLast: (form) => ({
    ...noPhrase,
    needs: Number(form.days >= firstLast) * (form.days + 1),
    text: words.lastDay + words.of + (form.days === 1 ?
      words.dayBefore :
      form.days + words.daysBefore)
  }),
  firstWeekday: (form, style) => ({
    ...noPhrase, direct: false, text: words.firstOf + workingDay(style)
  }),
  last: () => ({...noPhrase, text: words.lastDay}),
  lastWeekday: (form, style) => ({
    ...noPhrase, direct: false, text: words.lastOf + workingDay(style)
  }),
  // The nearest weekday never leaves its month, which is said where the
  // day can be the month's last; and it fires only in months that have
  // the day.
  nearestWeekday: (form, style) => ({
    ...noPhrase,
    needs: Number(form.day >= firstLacking) * form.day,
    text: form.day + units.day + words.runsAt +
      when(form.day >= firstLast, words.withinMonth) + words.nearest +
      workingDay(style)
  })
};

const quartzWeekdays: Quartz<QuartzWeekday> = {
  last: (form, style) => ({
    ...noPhrase,
    direct: false,
    text: words.lastNamed + weekdayName(form.weekday, style)
  }),
  nth: (form, style) => ({
    ...noPhrase,
    direct: false,
    text: words.nth + form.nth + weekdayName(form.weekday, style)
  })
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

// The day-of-month field. Under a single named month the dates that month
// never has are left out and the rest described afresh. Beside a weekday
// nothing is left out; alone, days left out of every day are an exception
// that rests on 毎日, and any other exception follows in brackets.
function dateSide(context: Context): DaySide {
  const {candidates, day} = context.analyses;
  const single = context.months.length === 1;
  const last = single ? monthLengths[context.months[0] - 1] : longestMonth;
  const cyclic = context.months.length === monthLengths.length &&
    context.year.kind === 'all';
  const say = daySay(last, cyclic);

  if (!candidates.date) {
    return {
      out: '',
      phrase: quartzPhrase(quartzDates,
        (day.date as {form: QuartzDate}).form, context.style),
      weekly: ''
    };
  }

  const all = denote(candidates.date[0], domainOf('date'));
  const days = [all.filter((date) => date <= last), all].find(
    (dates) => dates.length > 0) as number[];
  const chosen = pick(days, say) as Partial<Described<'except'>>;
  const core = (chosen.base ?? chosen) as Core;
  const removed = dayNames(chosen.removed ?? []);

  if (day.union) {
    return {
      out: '',
      phrase: core.kind === 'cadence' && isSaid(removed) ?
        parityRuns(core, days, last) :
        dayPhrase(positive(days, say) as Core, last, single),
      weekly: ''
    };
  }

  const said = dayPhrase(core, last, single);

  return core.kind === 'all' ?
    {out: removed, phrase: null, weekly: ''} :
    {out: '', phrase: {...said, text: said.text + bracketed([removed])},
      weekly: ''};
}

// The day-of-week field. Weekdays are said in week order from Monday,
// Sunday last: three or more in a row are a range, six that are not are
// the seventh left out of every day, and anything else is a list.
function weekdaySide(context: Context): DaySide {
  const {candidates, day} = context.analyses;

  function name(weekday: number): string {
    return weekdayName(weekday + 1, context.style);
  }

  if (!candidates.weekday) {
    return {
      out: '',
      phrase: quartzPhrase(quartzWeekdays,
        (day.weekday as {form: QuartzWeekday}).form, context.style),
      weekly: ''
    };
  }

  const week = [0, 1, 2, 3, 4, 5, 6];
  const days = denote(candidates.weekday[0], domainOf('weekday'))
    .map((weekday) => (weekday + 6) % 7).sort((a, b) => a - b);
  const run = days.length > 2 &&
    days[days.length - 1] - days[0] === days.length - 1;
  const missing = week.filter((weekday) => !days.includes(weekday));
  const text = run ?
    name(days[0]) + marks.range + name(days[days.length - 1]) :
    listOf(days.map(name));
  const out = when(missing.length === 1 && !run && !day.union,
    listOf(missing.map(name)));

  return {
    out,
    phrase: null,
    weekly: when(missing.length > 0 && !isSaid(out), words.everyWeek + text)
  };
}

// A month before a phrase that names its days as a date does.
const datedWays: Array<Way<[Context, DayPhrase, boolean], Dated>> = [
  {
    // Every month: 毎月, which gives way to the months that have the day
    // where not all do.
    fits: (context) => context.months.length === monthLengths.length,
    say: (context, phrase) => ({
      day: (phrase.needs > 0 ?
        phrase.needs + units.day + words.inMonthsWith + marks.comma :
        words.everyMonth) + phrase.text,
      month: '',
      year: yearLead(context, false)
    })
  },
  {
    // One month: the phrase follows it as a date is written, or after の.
    fits: (context) => context.months.length === 1,
    say: (context, phrase) => ({
      day: when(!phrase.direct, words.of) + phrase.text,
      month: context.months[0] + units.month,
      year: yearLead(context, true)
    })
  },
  {
    // Most months: the few left out, in front of 毎月.
    fits: (context, phrase, plainly) =>
      isSaid(monthsOf(context, false, plainly).out),
    say: (context, phrase, plainly) => ({
      day: phrase.text,
      month: leftOut([monthsOf(context, false, plainly).out]) +
        words.everyMonth,
      year: yearLead(context, false)
    })
  },
  {
    // A few dates in named months: each written in full with its month,
    // those the month has.
    fits: (context, phrase, plainly) =>
      monthsOf(context, false, plainly).listed &&
      isSaid(fullDates(context, phrase)) &&
      context.months.length * phrase.dates.length <= mostNamed,
    say: (context, phrase) => ({
      day: fullDates(context, phrase),
      month: '',
      year: yearLead(context, true)
    })
  },
  {
    // Otherwise the months, の, and the phrase.
    fits: () => true,
    say: (context, phrase, plainly) => ({
      day: phrase.text,
      month: monthsOf(context, false, plainly).text + words.of,
      year: yearLead(context, true)
    })
  }
];

function fullDates(context: Context, phrase: DayPhrase): string {
  return listOf(context.months.flatMap((month) => phrase.dates.filter(
    (date) => date <= monthLengths[month - 1]).map(
    (date) => month + units.month + date + units.day)));
}

function dated(context: Context, phrase: DayPhrase, plainly: boolean):
  Calendar {
  const way = datedWays.find((candidate) =>
    candidate.fits(context, phrase, plainly)) as (typeof datedWays)[0];
  const said = way.say(context, phrase, plainly);

  return {...said, lead: phrase.shared ? 'shared' : 'other'};
}

// A month before a weekday phrase or 毎日, which keep their own 毎. What
// is left out of every day stands in front of the whole, and a date left
// out keeps 毎月 only where no month is said; months left out with nothing
// else stand straight before 毎週 or 毎日.
function loose(context: Context, sides: DaySide[], plainly: boolean):
  Calendar {
  const [date, weekday] = sides;
  const months = monthsOf(context, true, plainly);
  const out = when(isSaid(date.out),
    when(!isSaid(months.text), words.everyMonth) + date.out) + weekday.out;
  const everyDay = !isSaid(weekday.weekly) && (isSaid(months.out + out) ||
    context.needs.restricted || context.needs.allDay &&
    isSaid(months.text + yearLead(context, false)));

  return {
    day: weekday.weekly + when(everyDay, words.everyDay),
    lead: isSaid(weekday.weekly) && 'other' || everyDay && 'everyDay' ||
      'none',
    month: when(isSaid(months.text), months.text + words.of) +
      when(!isSaid(out), leftOut([months.out])),
    year: when(isSaid(out), leftOut([months.out, out])) +
      yearLead(context, isSaid(months.text))
  };
}

// Either side of a date and a weekday together, with its month and its
// named year.
function sideOf(context: Context, side: DaySide): Calendar {
  return side.phrase ?
    dated(context, side.phrase, true) :
    loose(context, [noSide, side], true);
}

// A date and a weekday together: each side carries the month, and the
// year when it is named; 毎年 is said once, at the head.
function together(context: Context, sides: DaySide[]): Calendar {
  const [date, weekday] = sides.map((side) => sideOf(context, side));

  return {
    ...date,
    day: date.day + words.also +
      when(context.year.kind !== 'all', weekday.year) + weekday.month +
      weekday.day,
    lead: 'shared'
  };
}

/** The year, month and day parts of the sentence. */
function calendarPart(
  analyses: Analyses,
  needs: TimeNeeds,
  style: JapaneseStyle
): Calendar {
  const {candidates} = analyses;
  const years = candidates.year as SetDescription[];
  const context: Context = {
    analyses,
    months: denote((candidates.month as SetDescription[])[0],
      domainOf('month')),
    needs,
    style,
    year: years[0].kind === 'all' ?
      years[0] :
      pick(denote(years[0], yearSay.domain), yearSay)
  };
  const sides = [dateSide(context), weekdaySide(context)];
  const phrased = sides.find((side) => side.phrase !== null);

  if (analyses.day.union) {
    return together(context, sides);
  }

  return phrased ?
    dated(context, phrased.phrase as DayPhrase, false) :
    loose(context, sides, false);
}

export {calendarPart};
