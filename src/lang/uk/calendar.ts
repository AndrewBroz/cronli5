// The calendar parts: the year, the month and the day, and the note one
// Quartz form adds after the time. A date takes its month into the day
// part, and a single year follows the last month named, wherever that is.

import type {
  Analyses, Domain, QuartzDate, QuartzWeekday, SetDescription,
  ValuesDescription
} from '../../core/schedule.js';
import type {Describing, Part, Table, Taste} from './sets.js';
import {choose, partsOf, say, unwrapped, walk} from './sets.js';
import {denote, describeSet} from '../../core/describe-set.js';
import {list, pieces} from './spelling.js';
import lexicon from './lexicon.js';

const {category, endings, months, nthWords, units, weekdays, words} = lexicon;

/** The calendar parts of a description. */
export interface Calendar {
  day: string;
  month: string;
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
  // The mark that closes the day part.
  mark: string;
  month: string;
  note: string;
}

type MonthDescription = Exclude<SetDescription, {kind: 'cadence'}>;
type YearDescription = Exclude<SetDescription, {kind: 'except'}>;
type DayDescription = Exclude<SetDescription, {kind: 'all'}>;
type Listable = Describing<'pieces' | 'range' | 'values'>;

// The days of the month a pattern names, in the months it names.
interface Dates {
  description: SetDescription;
  domain: Domain;
}

const yearDomain: Domain = {cyclic: false, max: 9999, min: 1970};
const monthDomain: Domain = {cyclic: true, max: 12, min: 1};
const dateDomain: Domain = {cyclic: false, max: 31, min: 1};
// The week from Monday, 0, to Sunday, 6.
const week: Domain = {cyclic: true, max: 6, min: 0};

// The most days each month can have; there is no month 0.
const lengths = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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

function inclusive(...phrase: Array<string | number>): string {
  return [...phrase, words.inclusive].join(' ');
}

// The same item for each of a count, with a tail on the last.
function tailed(items: string[], tail: string): string[] {
  return [...items.slice(0, -1), items[items.length - 1] + tail];
}

// Years.

const yearTaste: Taste = {base: never, cadence: moreThanFour, pieces: always};

function yearList(named: ValuesDescription): string {
  const noun = [words.yearLocative][named.values.length - 1] ??
    words.yearsLocative;

  return `${words.in} ${list(named.values)} ${noun}`;
}

function yearRange(range: Describing<'range'>): string {
  return inclusive(words.from, range.from, words.until, range.to, words.year);
}

// Every second year from the first is an idiom; any other cadence is its
// first three years and so on, to its last year if it stops early.
function yearCadence(cadence: Describing<'cadence'>): string {
  const {interval, last, start} = cadence;
  const open = last + interval > yearDomain.max;
  const parity = [words.evenYears, words.oddYears][start - yearDomain.min];

  if (open && interval === 2 && parity) {
    return `${words.in} ${parity}`;
  }

  return [
    words.in, [start, start + interval, start + 2 * interval].join(', '),
    words.yearsLocative, words.andSoOn,
    ...open ? [] : [inclusive(words.until, last, words.year)]
  ].join(' ');
}

const yearParts: Table<Part, string> = {range: yearRange, values: yearList};

const yearWords: Table<YearDescription, string> = {
  all: () => '',
  cadence: yearCadence,
  pieces: (parts) => pieces(parts.parts.map(function each(part) {
    return say(yearParts, part);
  })),
  range: yearRange,
  values: yearList
};

// A year part that ends «включно» or «і так далі» is closed by a comma.
function yearPart(years: YearDescription): string {
  const text = say(yearWords, years);
  const closed = [words.inclusive, words.andSoOn].some(function ends(word) {
    return text.endsWith(word);
  });

  return text + ','.repeat(Number(closed));
}

// Months.

const monthTaste: Taste = {
  base: (base) => base.kind === 'all',
  cadence: never,
  pieces: always
};

// A run of months wraps round the year only when every year is meant.
function monthsOf(candidates: SetDescription[], everyYear: boolean): Months {
  const description = choose<MonthDescription>(
    everyYear ? candidates : unwrapped(candidates, monthDomain),
    monthDomain, monthTaste);
  const values = walk(description, monthDomain);

  return {
    description,
    named: description.kind === 'values' ||
      description.kind === 'range' && values.length <= 4,
    restricted: description.kind !== 'all',
    values
  };
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

// One day in each month that has it: «1 січня та 1 липня».
function datesInFull(day: number, of: Months, naming: Naming): string {
  const having = [of.values.filter(function has(month) {
    return lengths[month] >= day;
  }), of.values].find(function any(found) {
    return found.length > 0;
  }) as number[];

  return list(monthNames(having, 'genitive', naming).map(function date(name) {
    return `${day} ${name}`;
  }));
}

// Days of the month.

function ordinalDay(day: number): string {
  return day + endings.dayGenitive;
}

// The odd days or the even days: every second day from the 1st or the
// 2nd to the month's end.
function isParity(description: SetDescription, domain: Domain): boolean {
  return description.kind === 'cadence' && description.interval === 2 &&
    description.start <= 2 && description.last + 2 > domain.max;
}

function isListable(description: SetDescription): description is Listable {
  return ['pieces', 'range', 'values'].includes(description.kind);
}

// The days a pattern names, without those no month it names can have,
// and the description they are said by. Seven days of a regular set are
// listed, and a run of days never wraps round the month.
function daysOf(candidates: SetDescription[], inMonths: number[]): Dates {
  const max = Math.max(...inMonths.map(function length(month) {
    return lengths[month];
  }));
  const domain = {...dateDomain, max};
  const days = denote(candidates[0], dateDomain);
  const kept = [days.filter(function exists(day) {
    return day <= max;
  }), days].find(function any(found) {
    return found.length > 0;
  }) as number[];
  const description = choose(describeSet(kept, domain), domain, {
    base: (base) => base.kind === 'all' || isParity(base, domain),
    cadence: (cadence, count) => count > 7,
    pieces: always
  });

  return {description, domain};
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

// A long cadence of days is its first day and the step, to the month's
// end or to its last day.
function dayCadence(cadence: Describing<'cadence'>, domain: Domain): string {
  const {interval, last, start} = cadence;

  if (isParity(cadence, domain)) {
    return `${words.in} ${[words.oddDays, words.evenDays][start - 1]}`;
  }

  return [
    `${ordinalDay(start)} ${words.daysOfMonth},`, words.thenEvery,
    words.every, interval, units.day[category(interval)],
    last + interval > domain.max ?
      words.toEndOfMonth :
      inclusive(words.until, ordinalDay(last))
  ].join(' ');
}

function dayExcept(except: Describing<'except'>, domain: Domain): string {
  const removed = list(except.removed.map(ordinalDay));

  return except.base.kind === 'cadence' ?
    `${dayCadence(except.base, domain)}, ${words.except} ${removed}` :
    [
      `${words.everyDay},`, words.except, removed, words.daysOfMonth
    ].join(' ');
}

const dayWords: Table<DayDescription, string, [Domain]> = {
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
// month phrase.
function datesArm(dates: Dates, of: Months, naming: Naming): Arm {
  const description = dates.description as DayDescription;
  const excepted = description.kind === 'except';
  const opens = !excepted || description.base.kind !== 'all';
  const own = {
    day: say(dayWords, description, dates.domain),
    mark: ','.repeat(Number(excepted)),
    month: [words.everyMonth].slice(0, Number(opens)).join(),
    note: ''
  };
  const byNumber = isListable(description) ||
    description.kind === 'cadence' && !isParity(description, dates.domain);

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

const dayNominative: {[day: number]: string} = endings.dayNominative;

// What a form leaves a reader to work out, said after the time: the day
// a count from the month's end lands on, and that a month must have the
// day a nearest weekday is counted from.
function landsOn(form: Extract<QuartzDate, {kind: 'beforeLast'}>): string {
  return form.days > 1 ?
    `(${ordinalDay(31 - form.days)}, ${words.ifMonthHas} 31 ` +
      `${units.day[category(31)]})` :
    '';
}

function needsTheDay(
  form: Extract<QuartzDate, {kind: 'nearestWeekday'}>
): string {
  return form.day > 28 ?
    `(${words.onlyInMonthsWith} ${form.day}${dayNominative[form.day]} ` +
      `${words.dayOfMonth})` :
    '';
}

function noNote(): string {
  return '';
}

const quartzNotes: Table<QuartzDate, string> = {
  beforeLast: landsOn,
  firstWeekday: noNote,
  last: noNote,
  lastWeekday: noNote,
  nearestWeekday: needsTheDay
};

// A form names a day of each month, so «щомісяця» is said only where it
// has no «місяця» of its own; its note is said only with every month.
function quartzArm(form: QuartzDate, of: Months, naming: Naming): Arm {
  const monthly = form.kind === 'nearestWeekday' && !of.restricted;

  return {
    day: say(quartzDays, form, of, naming),
    mark: '',
    month: [words.everyMonth].slice(0, Number(monthly)).join(),
    note: of.restricted ? '' : say(quartzNotes, form)
  };
}

// Weekdays.

const weekTaste: Taste = {
  base: never,
  cadence: never,
  pieces: (count) => count > 4
};

const weekIdioms: {[run: string]: string} =
  {'0-4': words.weekdays, '5-6': words.weekends};

// A weekday's name in a case, from its place in the week from Monday.
function weekdayName(
  day: number,
  form: 'accusative' | 'genitive',
  naming: Naming
): string {
  const written = ([form, 'short'] as const)[Number(naming.short)];

  return weekdays[(day + 1) % 7][written];
}

// Recurring days: «щопонеділка та щосереди», or «по» and short names.
function recurring(days: number[], naming: Naming): string {
  return naming.short ?
    `${words.onDays} ${list(days.map(function short(day) {
      return weekdayName(day, 'genitive', naming);
    }))}` :
    list(days.map(function every(day) {
      return weekdays[(day + 1) % 7].every;
    }));
}

function weekRange(range: Describing<'range'>, naming: Naming): string {
  return inclusive(
    words.from, weekdayName(range.from, 'genitive', naming),
    words.until, weekdayName(range.to, 'genitive', naming));
}

const weekParts: Table<Part, string, [Naming]> = {
  range: weekRange,
  values: (named, naming) => recurring(named.values, naming)
};

// «Щотижня» says that a run comes round, once for all the pieces.
const weekWords: Table<Part | Describing<'pieces'>, string, [Naming]> = {
  pieces: (parts, naming) =>
    `${words.everyWeek} ${pieces(parts.parts.map(function each(part) {
      return say(weekParts, part, naming);
    }))}`,
  range: (range, naming) => `${words.everyWeek} ${weekRange(range, naming)}`,
  values: (named, naming) => recurring(named.values, naming)
};

// The weekdays as a side of the sentence. Six days are every day but the
// seventh, unless days of the month stand beside them.
function weekdaysArm(
  candidates: SetDescription[],
  alone: boolean,
  naming: Naming
): Omit<Arm, 'month'> {
  const days = denote(candidates[0], week).map(function fromMonday(day) {
    return (day + 6) % 7;
  }).sort(function ascending(a, b) {
    return a - b;
  });
  const described = describeSet(days, week);
  const [whole] = described;
  const idiom = whole.kind === 'range' &&
    weekIdioms[`${whole.from}-${whole.to}`];

  if (idiom) {
    return {day: `${words.in} ${idiom}`, mark: '', note: ''};
  }

  if (alone && days.length === 6) {
    const missing = denote({kind: 'all'}, week).filter(function absent(day) {
      return !days.includes(day);
    });

    return {
      day: [
        `${words.everyDay},`, words.except,
        weekdayName(missing[0], 'genitive', naming)
      ].join(' '),
      mark: ',',
      note: ''
    };
  }

  const chosen = choose<Part | Describing<'pieces'>>(described, week,
    weekTaste);
  // A single run is said in its own order, from Sunday into Monday.
  const said = whole.kind === 'range' && chosen.kind === 'values' ?
    {kind: 'values' as const, values: walk(whole, week)} :
    chosen;

  return {day: say(weekWords, said, naming), mark: '', note: ''};
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
      weekdayName((form.weekday + 6) % 7, 'accusative', naming),
      ofMonths(of, naming)
    ].join(' '),
    mark: '',
    note: ''
  };
}

// The whole calendar.

// The two kinds of day a pattern may name, each as a side of the
// sentence; a kind it does not restrict is absent.
function armsOf(analyses: Analyses, of: Months, naming: Naming) {
  const {candidates, day: facts} = analyses;
  const dates = candidates.date && daysOf(candidates.date, of.values);
  const dated = !dates || dates.description.kind !== 'all';
  // Where the days of the month named are every day the months have,
  // either kind of day is every day, and the weekdays say nothing.
  const weekly = (dated || !facts.union) &&
    (!candidates.weekday || candidates.weekday[0].kind !== 'all');
  // Beside the other kind of day nothing is fused with the month.
  const beside = dated && weekly ? anyMonth : of;
  const date = dated && (dates ?
    datesArm(dates, beside, naming) :
    quartzArm((facts.date as {form: QuartzDate}).form, beside, naming));
  const weekday = weekly && (candidates.weekday ?
    {
      ...weekdaysArm(candidates.weekday, !dated, naming),
      month: monthPart(of.description, naming, false)
    } :
    {
      ...quartzWeekdayArm((facts.weekday as {form: QuartzWeekday}).form,
        beside, naming),
      month: ''
    });

  return {date, weekday};
}

// A weekday and a day of the month: the weekdays, «а також» the days of
// the month, set off by commas, under the months as a heading. Under a
// heading the days are not «щомісяця», and a note about a month's length
// has no place.
function either(weekday: Arm, date: Arm, of: Months, naming: Naming): Arm {
  const monthly = of.restricted ? {month: '', note: ''} : date;

  return {
    day: [`${weekday.day},`, words.also, monthly.month, date.day]
      .filter(Boolean).join(' '),
    mark: ',',
    month: monthPart(of.description, naming, true),
    note: monthly.note
  };
}

/**
 * The year, the month and the day of a description, each closed by its
 * mark, and the note that follows the time.
 */
function calendarOf(analyses: Analyses, short: boolean): Calendar {
  const {candidates} = analyses;
  const years = choose<YearDescription>(candidates.year as SetDescription[],
    yearDomain, yearTaste);
  const of = monthsOf(candidates.month as SetDescription[],
    years.kind === 'all');
  // A single year follows the last month named, in the genitive.
  const attached = of.restricted && years.kind === 'values' &&
    years.values.length === 1;
  const [year, tail] = attached ?
    ['', ` ${walk(years, yearDomain)[0]} ${words.year}`] :
    [yearPart(years), ''];
  const naming = {short, tail};
  const {date, weekday} = armsOf(analyses, of, naming);
  const none = {
    day: '', mark: '', month: monthPart(of.description, naming, false),
    note: ''
  };
  const arm = date && weekday ?
    either(weekday, date, of, naming) :
    date || weekday || none;

  return {
    day: arm.day + arm.mark,
    month: arm.month,
    note: arm.note,
    open: arm === none && !of.restricted && years.kind === 'all',
    year
  };
}

export {calendarOf};
