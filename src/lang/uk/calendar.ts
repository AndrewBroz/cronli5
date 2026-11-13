// The calendar parts: the year, the month and the day, and the note a
// day may add after the time. A date takes its month into the day part,
// and a single year follows the last month named, wherever that is.
//
// Which days and months exist is the core's to say: nothing here knows
// how long a month is or where the years end.

import type {
  CadenceDescription, DateReach, QuartzDate, QuartzWeekday,
  RangeDescription, ScheduleFacts, SetDescription, SetView, ValuesDescription
} from '../../core/schedule.js';
import type {
  Describing, Part, Said, Stepped, Table, Taste
} from './sets.js';
import {choose, partsOf, say, walk} from './sets.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {list, pieces} from './spelling.js';
import {candidatesAs} from '../../core/set-views.js';
import {dateReach} from '../../core/date-reach.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';

const {category, endings, months, nthWords, units, weekdays, words} = lexicon;

/** The calendar parts of a description. */
export interface Calendar {
  day: string;
  // Which days a word of the day part counts, said in brackets beside it.
  gloss: string;
  // The mark that closes the day part.
  mark: string;
  month: string;
  // Whether the pattern never fires: the day part then says so, and
  // nothing else is said.
  never: boolean;
  // What is said in brackets after the time.
  note: string;
  // Whether no calendar field is restricted.
  open: boolean;
  year: string;
}

// How names are written, and the single year that follows the last
// month named.
interface Naming {
  short: boolean;
  tail: string;
}

// The months as they are said.
interface Months {
  description: MonthDescription;
  // Whether the months are named one by one.
  named: boolean;
  restricted: boolean;
  // In the order they are said.
  values: number[];
}

// The days a side of the sentence names, and what it asks of the parts
// around it.
interface Arm {
  day: string;
  gloss: string;
  // Whether it ends in an exception, and so comes first beside the other
  // kind of day.
  leads: boolean;
  // The mark that closes the day part.
  mark: string;
  month: string;
  note: string;
}

// What the core says of days in the months and years a pattern reaches.
interface Reached {
  // Whether a day exists in one of them.
  exists(day: number): boolean;
  // Whether a set of days is every day they have.
  fills(days: number[]): boolean;
}

// Which kinds of day a pattern names, once the calendar has had its say.
interface Days {
  // Days of the month that are a restriction and can fire.
  dated: boolean;
  // Days of the month that can never fire.
  dead: boolean;
  // Whether the pattern names its months.
  inMonths: boolean;
  // Whether a month reached can lack the day a form is counted from.
  lacking: boolean;
  // A date arm that fires in leap years only.
  leap: boolean;
  weekly: boolean;
}

type MonthDescription = Exclude<SetDescription, {kind: 'cadence'}>;
type DayDescription = Exclude<SetDescription, {kind: 'all'}>;
type Listable = Describing<'pieces' | 'range' | 'values'>;

const yearDomain = domainOf('year');
const monthDomain = domainOf('month');
const dateDomain = domainOf('date');
const week = domainOf('weekday');

const anyMonth: Months = {
  description: {kind: 'all'},
  named: false,
  restricted: false,
  values: denote({kind: 'all'}, monthDomain)
};

function always(): boolean {
  return true;
}

function never(): boolean {
  return false;
}

function moreThanFour(described: unknown, count: number): boolean {
  return count > 4;
}

function ascending(a: number, b: number): number {
  return a - b;
}

function inclusive(...phrase: Array<string | number>): string {
  return [...phrase, words.inclusive].join(' ');
}

// The same item for each of a count, with a tail on the last.
function tailed(items: string[], tail: string): string[] {
  return [...items.slice(0, -1), items[items.length - 1] + tail];
}

// The first three of a cadence, which show its step.
function firstThree(cadence: CadenceDescription): number[] {
  return [0, 1, 2].map(function nth(index) {
    return cadence.start + index * cadence.interval;
  });
}

// Years.

const yearTaste: Taste = {base: always, cadence: moreThanFour, pieces: always};

function yearList(named: ValuesDescription): string {
  const noun = [words.yearLocative][named.values.length - 1] ??
    words.yearsLocative;

  return `${words.in} ${list(named.values)} ${noun}`;
}

// The field's first and last years are no part of a schedule: a run to
// the end has no end, and a run from the start has no start.
function yearRange(range: RangeDescription): string {
  if (range.open) {
    return `${words.startingFrom} ${range.from} ${words.year}`;
  }

  return inclusive(
    ...[words.from, range.from]
      .slice(2 * Number(range.from === yearDomain.min)),
    words.until, range.to, words.year);
}

// Every second year from the first is an idiom; four years or fewer are
// listed; any other cadence is its first three years and so on, to its
// last year if it stops.
function yearCadence(cadence: CadenceDescription): string {
  const {interval, last, start} = cadence;
  const parity = [words.evenYears, words.oddYears][start - yearDomain.min];
  const endless = Boolean(cadence.open);

  if (endless && interval === 2 && parity) {
    return `${words.in} ${parity}`;
  }

  if (!endless && (last - start) / interval < 4) {
    return yearList({kind: 'values', values: denote(cadence, yearDomain)});
  }

  return [
    words.in, firstThree(cadence).join(', '),
    words.yearsLocative, words.andSoOn,
    ...endless ? [] : [inclusive(words.until, last, words.year)]
  ].join(' ');
}

const yearSteps: Table<Stepped, string> =
  {cadence: yearCadence, range: yearRange, values: yearList};

// «В усі роки», or a run or a cadence, «крім» the years left out.
function yearsBut(except: Describing<'except'>): string {
  const base = except.base.kind === 'all' ?
    `${words.in} ${words.allYears}` :
    sayYears(except.base);
  const noun = [words.year][except.removed.length - 1] ?? words.years;

  return `${base}, ${words.except} ${list(except.removed)} ${noun}`;
}

const yearWords: Table<Said, string> = {
  all: () => '',
  cadence: yearCadence,
  cadencePieces: (parts) => parts.parts.map(function each(part) {
    return say(yearSteps, part);
  }).join(`, ${words.also} `),
  except: yearsBut,
  pieces: (parts) => pieces(parts.parts.map(function each(part) {
    return say(yearSteps, part);
  })),
  range: yearRange,
  values: yearList
};

function sayYears(years: Said): string {
  return say(yearWords, years);
}

// A year part that is more than a year, a list or an idiom is closed by
// a comma; one that ends «включно» is closed like any other part.
function yearPart(years: Said): string {
  const text = sayYears(years);
  const closed = ['cadencePieces', 'except'].includes(years.kind) ||
    text.includes(words.startingFrom) || text.endsWith(words.andSoOn);

  return text + ','.repeat(Number(closed));
}

// Months.

const monthTaste: Taste = {
  base: (base) => base.kind === 'all',
  cadence: never,
  pieces: always
};

// The months as they are said. Two months that are a run are said in the
// order of the run, across the turn of the year where it crosses it.
function monthsSaid(candidates: SetDescription[]): Months {
  const chosen = choose<MonthDescription>(candidates, monthDomain,
    monthTaste);
  const [whole] = candidates;
  const description: MonthDescription =
    chosen.kind === 'values' && whole.kind === 'range' ?
      {kind: 'values', values: walk(whole, monthDomain)} :
      chosen;
  const values = walk(description, monthDomain);

  return {
    description,
    named: description.kind === 'values' ||
      description.kind === 'range' && values.length <= 4,
    restricted: description.kind !== 'all',
    values
  };
}

// The months a day of the month can fire in, described afresh where
// some of the months reached have no such day.
function firingMonths(of: Months, reach: DateReach | null, view: SetView) {
  const skipped = reach ? reach.never : [];
  const firing = of.values.filter(function fires(month) {
    return !skipped.includes(month);
  }).sort(ascending);

  return of.restricted && firing.length < of.values.length ?
    monthsSaid(describeSet(firing, monthDomain, view)) :
    of;
}

function monthNames(
  values: number[],
  form: 'genitive' | 'locative',
  naming: Naming
): string[] {
  const written = ([form, 'short'] as const)[Number(naming.short)];

  return tailed(values.map(function name(value) {
    return months[value][written];
  }), naming.tail);
}

function monthRange(range: Describing<'range'>, naming: Naming): string {
  const [from, to] = monthNames([range.from, range.to], 'genitive', naming);

  return inclusive(words.from, from, words.until, to);
}

function monthList(named: ValuesDescription, naming: Naming): string {
  return `${words.in} ${list(monthNames(named.values, 'locative', naming))}`;
}

const monthParts: Table<Part, string, [Naming]> =
  {range: monthRange, values: monthList};

const monthWords: Table<MonthDescription, string, [Naming]> = {
  all: () => '',
  except: (except, naming) => [
    `${words.wholeYear},`, words.except,
    list(monthNames(except.removed, 'genitive', naming))
  ].join(' '),
  pieces: (parts, naming) => {
    const tails = tailed(parts.parts.map(function none() {
      return '';
    }), naming.tail);

    return pieces(parts.parts.map(function each(part, index) {
      return say(monthParts, part, {...naming, tail: tails[index]});
    }));
  },
  range: monthRange,
  values: monthList
};

// The month part. A heading closes with a colon; an exception is set off
// by a comma.
function monthPart(
  description: MonthDescription,
  naming: Naming,
  heading: boolean
): string {
  const text = say(monthWords, description, naming);
  const marks = [description.kind === 'except' ? ',' : '', ':'];

  return text && text + marks[Number(heading)];
}

// The months after a form of the day: named in the genitive, or «місяця».
function ofMonths(of: Months, naming: Naming): string {
  return of.restricted ?
    list(monthNames(of.values, 'genitive', naming)) :
    words.ofMonth;
}

// One day in each month: «1 січня та 1 липня».
function datesInFull(day: number, of: Months, naming: Naming): string {
  return list(monthNames(of.values, 'genitive', naming)
    .map(function date(name) {
      return `${day} ${name}`;
    }));
}

// Days of the month.

// What the core's calendar says of any set of days, in the months and
// years this pattern reaches.
function reachedBy(facts: ScheduleFacts): Reached {
  const {month, year} = facts.analyses.candidates;

  function reachOf(days: number[]): DateReach | null {
    return dateReach({kind: 'values'},
      {date: describeSet(days, dateDomain), month, year});
  }

  return {
    exists: (day) => day <= dateDomain.max && reachOf([day])?.fires !== false,
    fills: (days) => Boolean(reachOf(days)?.days?.everyDay)
  };
}

function ordinalDay(day: number): string {
  return day + endings.dayGenitive;
}

// The odd days or the even days: every second day from the 1st or the
// 2nd, to the end of every month reached.
function isParity(description: SetDescription, reached: Reached): boolean {
  return description.kind === 'cadence' && description.interval === 2 &&
    description.start <= 2 && !reached.exists(description.last + 2);
}

function isListable(description: SetDescription): description is Listable {
  return ['pieces', 'range', 'values'].includes(description.kind);
}

// The days a pattern names that some month it reaches has, and the
// description they are said by. Seven days of a regular set are listed,
// a run of days never wraps round the month, and «щодня, крім» is said
// of every day the months have.
function daysOf(facts: ScheduleFacts, reached: Reached): DayDescription {
  const {candidates, dateReach: reach} = facts.analyses;
  const own = reach && reach.days ?
    reach.days.candidates :
    candidates.date as SetDescription[];
  const offered = describeSet(denote(own[own.length - 1], dateDomain),
    dateDomain, {linear: true}).map(function overMonths(candidate) {
    return candidate.kind === 'except' && candidate.base.kind !== 'cadence' &&
      reached.fills(denote(candidate.base, dateDomain)) ?
      {
        base: {kind: 'all' as const},
        kind: 'except' as const,
        removed: candidate.removed.filter(reached.exists)
      } :
      candidate;
  });

  return choose<DayDescription>(offered, dateDomain, {
    base: (base) => base.kind === 'all' || isParity(base, reached),
    cadence: (cadence, count) => count > 7,
    pieces: always
  });
}

const dayParts: Table<Part, string, [(day: number) => string, string]> = {
  range: (range, form, unit) =>
    inclusive(words.from, form(range.from), words.until, form(range.to), unit),
  values: (named, form, unit) => `${list(named.values.map(form))} ${unit}`
};

// Days named by number, each piece with its unit: «числа», or the month.
function numbered(
  description: Listable,
  form: (day: number) => string,
  unitOf: (last: boolean) => string
): string {
  const parts = partsOf(description, dateDomain);

  return pieces(parts.map(function each(part, index) {
    return say(dayParts, part, form, unitOf(index === parts.length - 1));
  }));
}

function ordinalDays(description: Listable): string {
  return numbered(description, ordinalDay, function unit() {
    return words.daysOfMonth;
  });
}

// A long cadence of days is its first three days and so on, to the
// month's end or to its last day.
function dayCadence(cadence: Describing<'cadence'>, reached: Reached): string {
  const {interval, last, start} = cadence;

  if (isParity(cadence, reached)) {
    return `${words.onDays} ${[words.oddDays, words.evenDays][start - 1]}`;
  }

  return [
    firstThree(cadence).map(ordinalDay).join(', '),
    words.daysOfMonth, words.andSoOn,
    reached.exists(last + interval) ?
      inclusive(words.until, ordinalDay(last)) :
      words.toEndOfMonth
  ].join(' ');
}

function dayExcept(except: Describing<'except'>, reached: Reached): string {
  const removed = list(except.removed.map(ordinalDay));

  return except.base.kind === 'cadence' ?
    `${dayCadence(except.base, reached)}, ${words.except} ${removed}` :
    [
      `${words.everyDay},`, words.except, removed, words.daysOfMonth
    ].join(' ');
}

const dayWords: Table<DayDescription, string, [Reached]> = {
  cadence: dayCadence,
  except: dayExcept,
  pieces: ordinalDays,
  range: ordinalDays,
  values: ordinalDays
};

// Days named by number beside months that are named too: dates when the
// month is one or the day is one, days of those months for a list, and
// otherwise the days after the months, which are a heading when they are
// more than a list of names.
function datesInMonths(
  description: DayDescription,
  own: Arm,
  of: Months,
  naming: Naming
): Arm {
  const fused = {...own, mark: '', month: ''};
  const listed: MonthDescription = {kind: 'values', values: of.values};

  if (of.values.length === 1 && isListable(description)) {
    return {
      ...fused,
      day: numbered(description, String, function unit(last) {
        return monthNames(of.values, 'genitive',
          {...naming, tail: naming.tail.repeat(Number(last))})[0];
      })
    };
  }

  if (description.kind === 'values' && description.values.length === 1 &&
      of.values.length <= 4) {
    return {...fused, day: datesInFull(description.values[0], of, naming)};
  }

  if (description.kind === 'values' && of.named) {
    return {...fused, day: `${own.day} ${ofMonths(of, naming)}`};
  }

  return {
    ...own,
    month: of.named ?
      monthPart(listed, naming, false) :
      monthPart(of.description, naming, true)
  };
}

// Days of the month as one side of the sentence, with the months it is
// said for. With every month the days take «щомісяця» where they open
// the phrase; an idiom or an exception keeps its own words after any
// month phrase. An exception, or a cadence that says «і так далі», is
// closed by a comma.
function datesArm(
  description: DayDescription,
  reached: Reached,
  of: Months,
  naming: Naming
): Arm {
  const excepted = description.kind === 'except';
  const opens = !excepted || description.base.kind !== 'all';
  const idiom = isParity(description, reached);
  const own = {
    day: say(dayWords, description, reached),
    gloss: '',
    leads: excepted,
    mark: ','.repeat(Number(excepted || description.kind === 'cadence' &&
      !idiom)),
    month: [words.everyMonth].slice(0, Number(opens)).join(),
    note: ''
  };
  const byNumber = isListable(description) ||
    description.kind === 'cadence' && !idiom;

  if (!of.restricted) {
    return own;
  }

  return byNumber ?
    datesInMonths(description, own, of, naming) :
    {...own, month: monthPart(of.description, naming, false)};
}

// Quartz forms of the day of the month.

function nearestWeekday(
  form: Extract<QuartzDate, {kind: 'nearestWeekday'}>,
  of: Months,
  naming: Naming
): string {
  const target = of.restricted ?
    datesInFull(form.day, of, naming) :
    `${ordinalDay(form.day)} ${words.daysOfMonth}`;

  // A day that can be a month's last: the search never leaves the month.
  return [
    words.in, words.nearest, target, words.weekday,
    ...[words.sameMonth].slice(0, Number(form.day >= 28))
  ].join(' ');
}

const quartzDays: Table<QuartzDate, string, [Months, Naming]> = {
  beforeLast: (form, of, naming) => [
    ...form.days === 1 ?
      [words.in, words.penultimateDay] :
      [
        words.within, form.days, units.day[category(form.days)],
        words.beforeLastDayOf
      ],
    ofMonths(of, naming)
  ].join(' '),
  firstWeekday: (form, of, naming) =>
    `${words.in} ${words.firstWeekday} ${ofMonths(of, naming)}`,
  last: (form, of, naming) =>
    `${words.in} ${words.lastDay} ${ofMonths(of, naming)}`,
  lastWeekday: (form, of, naming) =>
    `${words.in} ${words.lastWeekday} ${ofMonths(of, naming)}`,
  nearestWeekday
};

// The forms that count Monday to Friday say which days those are.
const countsWeekdays: Array<QuartzDate['kind']> =
  ['firstWeekday', 'lastWeekday', 'nearestWeekday'];

function mondayToFriday(naming: Naming): string {
  const written = (['nominative', 'short'] as const)[Number(naming.short)];

  return weekdays[1][written] + words.through + weekdays[5][written];
}

const dayNominative: {[day: number]: string} = endings.dayNominative;

// What a form leaves a reader to work out, said after the time: the day
// a count from the month's end lands on in the longest month, and that a
// month must have the day a nearest weekday is counted from.
// The example is given only where every month is meant.
function landsOn(
  form: Extract<QuartzDate, {kind: 'beforeLast'}>,
  days: Days
): string {
  const longest = dateDomain.max;

  return form.days > 1 && !days.inMonths ?
    `${ordinalDay(longest - form.days)}, ${words.ifMonthHas} ${longest} ` +
      units.day[category(longest)] :
    '';
}

function needsTheDay(
  form: Extract<QuartzDate, {kind: 'nearestWeekday'}>,
  days: Days
): string {
  return days.lacking ?
    `${words.onlyInMonthsWith} ${form.day}${dayNominative[form.day]} ` +
      words.dayOfMonth :
    '';
}

function noNote(): string {
  return '';
}

const quartzNotes: Table<QuartzDate, string, [Days]> = {
  beforeLast: landsOn,
  firstWeekday: noNote,
  last: noNote,
  lastWeekday: noNote,
  nearestWeekday: needsTheDay
};

// A form names a day of each month, so «щомісяця» is said only where it
// has no «місяця» of its own. Its note is about the months the pattern
// reaches, and is not said where months are named: the form then names
// the months it can fire in itself, or stands under them.
function quartzArm(
  form: QuartzDate,
  of: Months,
  days: Days,
  naming: Naming
): Arm {
  const monthly = form.kind === 'nearestWeekday' && !of.restricted;
  const notes = [say(quartzNotes, form, days), ''];

  return {
    day: say(quartzDays, form, of, naming),
    gloss: [mondayToFriday(naming)]
      .slice(0, Number(countsWeekdays.includes(form.kind))).join(),
    leads: false,
    mark: '',
    month: [words.everyMonth].slice(0, Number(monthly)).join(),
    note: notes[Number(of.restricted)]
  };
}

// Weekdays.

const weekTaste: Taste = {base: never, cadence: never, pieces: never};

function weekdayName(
  day: number,
  form: 'accusative' | 'genitive',
  naming: Naming
): string {
  return weekdays[day][([form, 'short'] as const)[Number(naming.short)]];
}

// Recurring days: «щопонеділка та щосереди», or «по» and short names.
function recurring(named: ValuesDescription, naming: Naming): string {
  return naming.short ?
    `${words.onDays} ${list(named.values.map(function short(day) {
      return weekdayName(day, 'genitive', naming);
    }))}` :
    list(named.values.map(function every(day) {
      return weekdays[day].every;
    }));
}

// «Щотижня» says that a run comes round.
function weekRange(range: Describing<'range'>, naming: Naming): string {
  return inclusive(
    words.everyWeek,
    words.from, weekdayName(range.from, 'genitive', naming),
    words.until, weekdayName(range.to, 'genitive', naming));
}

const weekWords: Table<Part, string, [Naming]> =
  {range: weekRange, values: recurring};

// The weekdays as a side of the sentence, in a week that starts on
// Monday: one run of three days or more, or the days listed. Six days
// are every day but the seventh, unless days of the month stand beside
// them.
function weekdaysArm(
  facts: ScheduleFacts,
  alone: boolean,
  naming: Naming
): Omit<Arm, 'month'> {
  const described =
    candidatesAs(facts, 'weekday', {first: 1}) as SetDescription[];
  const [whole] = described;
  const days = denote(whole, week);
  const plain = {gloss: '', leads: false, mark: '', note: ''};

  if (alone && days.length === 6) {
    const missing = denote({kind: 'all'}, week).filter(function absent(day) {
      return !days.includes(day);
    });

    return {
      ...plain,
      day: [
        `${words.everyDay},`, words.except,
        weekdayName(missing[0], 'genitive', naming)
      ].join(' '),
      mark: ','
    };
  }

  const chosen = choose<Part>(described, week, weekTaste);
  // Two days that are a run are said in the order of the run.
  const said = whole.kind === 'range' && chosen.kind === 'values' ?
    {kind: 'values' as const, values: walk(whole, week)} :
    chosen;

  return {...plain, day: say(weekWords, said, naming)};
}

const lastWords = [words.lastMasculine, words.lastFeminine];
const genders = ['masculine', 'feminine'] as const;

const quartzWeekdays: Table<QuartzWeekday, string> = {
  last: (form) => lastWords[Number(weekdays[form.weekday].feminine)],
  nth: (form) =>
    nthWords[genders[Number(weekdays[form.weekday].feminine)]][form.nth - 1]
};

// «У другий понеділок червня», «в останню п'ятницю місяця».
function quartzWeekdayArm(
  form: QuartzWeekday,
  of: Months,
  naming: Naming
): Omit<Arm, 'month'> {
  return {
    day: [
      words.in, say(quartzWeekdays, form),
      weekdayName(form.weekday, 'accusative', naming),
      ofMonths(of, naming)
    ].join(' '),
    gloss: '',
    leads: false,
    mark: '',
    note: ''
  };
}

// The whole calendar.

// Which kinds of day are left to say. Days of the month that are every
// day the months have restrict nothing, and then neither kind of day is
// said; days no month reached has are not said either.
function daysNamed(facts: ScheduleFacts): Days {
  const {candidates, dateReach: reach, day} = facts.analyses;
  const found = reach ?? {
    days: null, everyYear: [], fires: true, leapYears: [], never: []
  };
  const everyDay = Boolean(found.days && found.days.everyDay);
  const [dated, weekly] = (['date', 'weekday'] as const)
    .map(function restricted(field) {
      const described = candidates[field] ?? [];

      return day[field] !== null && !everyDay &&
        described.slice(0, 1).every(function some(first) {
          return first.kind !== 'all';
        });
    });

  return {
    dated: dated && found.fires,
    dead: !found.fires,
    inMonths: (candidates.month as SetDescription[])[0].kind !== 'all',
    lacking: found.never.length + found.leapYears.length > 0,
    leap: !weekly && found.everyYear.length === 0 &&
      found.leapYears.length > 0,
    weekly
  };
}

// The two kinds of day a pattern may name, each as a side of the
// sentence; a kind that is not left to say is absent.
function armsOf(
  facts: ScheduleFacts,
  days: Days,
  of: Months,
  naming: Naming
) {
  const facet = facts.analyses.day;
  // Beside the other kind of day nothing is fused with the month.
  const beside = days.dated && days.weekly ? anyMonth : of;
  const reached = reachedBy(facts);
  const date = days.dated && (facet.date as {kind: string}).kind === 'values' ?
    datesArm(daysOf(facts, reached), reached, beside, naming) :
    days.dated &&
      quartzArm((facet.date as {form: QuartzDate}).form, beside, days, naming);
  const weekday = days.weekly &&
    ((facet.weekday as {kind: string}).kind === 'values' ?
      {
        ...weekdaysArm(facts, !days.dated, naming),
        month: monthPart(of.description, naming, false)
      } :
      {
        ...quartzWeekdayArm((facet.weekday as {form: QuartzWeekday}).form,
          beside, naming),
        month: ''
      });

  return {date, weekday};
}

// A weekday and a day of the month: the weekdays, «а також» the days of
// the month, set off by commas, under the months as a heading. Days of
// the month that end in an exception come first, so that it is not read
// against the weekdays too. Under a heading the days are not «щомісяця».
function either(weekday: Arm, date: Arm, of: Months, naming: Naming): Arm {
  const dates = [...[date.month].slice(Number(of.restricted)), date.day]
    .filter(Boolean).join(' ');
  const sides = [weekday.day, dates];
  const [first, second] = date.leads ? sides.reverse() : sides;

  return {
    day: `${first}, ${words.also} ${second}`,
    gloss: date.gloss,
    leads: false,
    mark: ',',
    month: monthPart(of.description, naming, true),
    note: date.note
  };
}

const nothing = {
  day: '', gloss: '', mark: '', month: '', never: false, note: '',
  open: false, year: ''
};

/**
 * The year, the month and the day of a description, each closed by its
 * mark, and the note that follows the time.
 */
function calendarOf(facts: ScheduleFacts, short: boolean): Calendar {
  const {analyses} = facts;
  const years = choose<Said>(analyses.candidates.year as SetDescription[],
    yearDomain, yearTaste, analyses.cadencePieces.year);
  const everyYear = years.kind === 'all';
  // A run of months wraps round the year only when every year is meant.
  const view = {linear: !everyYear};
  const days = daysNamed(facts);
  const reaching = monthsSaid(
    candidatesAs(facts, 'month', view) as SetDescription[]);
  // Alone, days of the month are said with the months they fire in.
  const of = days.dated && !days.weekly ?
    firingMonths(reaching, analyses.dateReach, view) :
    reaching;
  // A single year follows the last month named, in the genitive, where
  // the months are a list or one run: after pieces or an exception it
  // would be read with the last month alone.
  const attached = ['range', 'values'].includes(of.description.kind) &&
    years.kind === 'values' && years.values.length === 1;
  const [year, tail] = attached ?
    ['', ` ${walk(years, yearDomain)[0]} ${words.year}`] :
    [yearPart(years), ''];
  const naming = {short, tail};

  if (days.dead && !days.weekly) {
    return {
      ...nothing, day: `${words.never}: ${words.noSuchDate}`, never: true
    };
  }

  const {date, weekday} = armsOf(facts, days, of, naming);
  const none = {
    ...nothing, leads: false, month: monthPart(of.description, naming, false)
  };
  const arm = date && weekday ?
    either(weekday, date, of, naming) :
    date || weekday || none;
  // A date said with its months reads as one day unless it says that it
  // comes round every year.
  const yearly = everyYear && of.restricted && arm.month === '';

  return {
    day: arm.day,
    gloss: arm.gloss,
    mark: arm.mark,
    month: arm.month,
    never: false,
    note: [arm.note, words.leapYearsOnly][Number(days.leap)],
    open: arm === none && !of.restricted && everyYear,
    year: [year, words.everyYear][Number(yearly)]
  };
}

export {calendarOf};
