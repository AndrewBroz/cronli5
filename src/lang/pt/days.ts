// The two sides of the calendar part that name days: the weekdays and the
// days of the month, each as a set of values or as a Quartz form.

import type {
  Analyses, DateArm, QuartzDate, QuartzWeekday, RangeDescription, WeekdayArm
} from '../../core/schedule.js';
import type {Cadence, Chosen, Plain, Rules} from './sets.js';
import type {PortugueseStyle} from './options.js';
import {choose, firesOn, withEnds} from './sets.js';
import {counted, ifAny, led, list, spaced} from './phrases.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {numbered} from './stretch.js';
import {weekdayName} from './names.js';

const {contractions, nthWords, units, weekdays, words} = lexicon;

/** One side of the calendar part: the days it names and what trails them. */
export interface Side {
  // What follows «exceto» for the days this side leaves out.
  excepted: string[];
  // Whether a month or a year has no noun here to attach to with «de»,
  // and so leads the sentence.
  leads: boolean;
  // How the side stands to its month. A date says «de cada mês» when no
  // month is named and nothing under a leading month; a Quartz form
  // cannot stand without its month; anything else takes a named month only.
  month: 'date' | 'none' | 'quartz';
  // What closes the side after its month and year.
  tail: string;
  text: string;
}

/** What a side needs to know of the month it stands in. */
export interface MonthFacts {
  months: Chosen;
  // Whether exactly one month is named.
  single: boolean;
  style: PortugueseStyle;
  // Whether no month is named, though some may be excepted.
  unnamed: boolean;
}

const bare: Side =
  {excepted: [], leads: false, month: 'none', tail: '', text: ''};

const eachMonth = `${words.ofEach} ${units.month.one}`;

// How many days each month has; February counts 29.
const monthLengths = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const longestMonth = 31;

// A list no longer than this is said in place of a cadence of days.
const longestList = 7;

// Weekday pieces are said only for more days than this.
const mostDaysListed = 4;

// A day that can be a month's last, from which the nearest weekday might
// be looked for in the next month.
const firstClosingDay = 28;

// The week as Portuguese lists it starts on Monday, with Sunday last.
function weekIndex(weekday: number): number {
  return (weekday + 6) % 7;
}

function cronWeekday(index: number): number {
  return (index + 1) % 7;
}

// Weekdays have no cadence. The whole week with a hole in it is the only
// exception, and one side of a day of the month and a weekday together
// never takes one, where it would be taken for the whole pair.
function weekRules(paired: boolean): Rules {
  return {
    cadence: () => 0,
    domain: {cyclic: true, max: 6, min: 0},
    excepts: (base) => base.kind === 'all' && !paired,
    piecesOver: mostDaysListed,
    wrap: true
  };
}

type WeekSayer = (said: never, style: PortugueseStyle) => string;

// Recurring weekdays, each group led by the «todas as» or «todos os»
// that agrees with it.
function everyOne(said: {values: number[]}, style: PortugueseStyle): string {
  return led(said.values.map(cronWeekday).map((weekday) => ({
    lead: words.every[weekdays[weekday].gender],
    text: weekdayName(weekday, 'many', style)
  })));
}

function weekdayRun(said: RangeDescription, style: PortugueseStyle): string {
  return `${words.from} ${weekdayName(cronWeekday(said.from), 'one', style)} ` +
    `${words.to} ${weekdayName(cronWeekday(said.to), 'one', style)}`;
}

// Weekdays have no cadence, so no way of saying one.
type WeekKind = Exclude<Plain['kind'], 'cadence'>;

const weekSayers: {[Kind in WeekKind]: WeekSayer} = {
  all: () => words.everyDay,
  pieces: (said: Extract<Plain, {kind: 'pieces'}>, style) => list(
    said.parts.map((part) => weekSayers[part.kind](part as never, style))),
  range: weekdayRun,
  values: everyOne
};

// The nth or the last such weekday of the month. The ordinal agrees with
// the weekday, which keeps «-feira» after it: the bare names are ordinals
// themselves.
function nthWeekday(form: QuartzWeekday, style: PortugueseStyle): string {
  const {gender} = weekdays[form.weekday];
  const ordinal = form.kind === 'nth' ?
    nthWords[form.nth - 1][gender] :
    words.lastOne[gender];

  return `${contractions.em.singular[gender]} ${ordinal} ` +
    weekdayName(form.weekday, 'one', {...style, feira: true});
}

/** The weekday side of the calendar part. */
function weekdaySide(analyses: Analyses, facts: MonthFacts): Side {
  const {union} = analyses.day;
  const weekday = analyses.day.weekday as WeekdayArm;
  const {style} = facts;

  if (weekday.kind === 'quartz') {
    return {...bare, month: 'quartz', text: nthWeekday(weekday.form, style)};
  }

  const days = firesOn(analyses.candidates.weekday, domainOf('weekday'))
    .map(weekIndex).sort((a, b) => a - b);
  const {removed, said} = choose(days, weekRules(union));

  return {
    ...bare,
    excepted: ifAny(removed.map(cronWeekday), (holes) => led(holes.map(
      (day) => ({
        lead: contractions.a.plural[weekdays[day].gender],
        text: weekdayName(day, 'many', style)
      })))),
    leads: ['pieces', 'range'].includes(said.kind),
    text: weekSayers[said.kind as WeekKind](said as never, style)
  };
}

// The first day of a month takes the ordinal mark where the style has it.
function dayNumber(day: number, style: PortugueseStyle): string {
  return day === 1 && style.firstOrdinal ?
    `${day}${words.firstMark}` :
    String(day);
}

function onDays(said: {values: number[]}, style: PortugueseStyle): string {
  return numbered(
    said.values.map((day) => dayNumber(day, style)), units.day);
}

function dayRun(said: {from: number; to: number}, style: PortugueseStyle):
  string {
  const {a, de} = contractions;

  return `${de.singular.masculine} ${units.day.one} ` +
    `${dayNumber(said.from, style)} ${a.singular.masculine} ` +
    `${units.day.one} ${dayNumber(said.to, style)}`;
}

// Whether a cadence of days is every second day of a month of this
// length, from its 1st or its 2nd to its end.
function alternate(cadence: Cadence, length: number): boolean {
  return cadence.interval === 2 && cadence.start <= 2 &&
    cadence.last + 2 > length;
}

type DateSayer = (said: never, style: PortugueseStyle, length: number) =>
  string;

// Every second day by its number being odd or even; any other cadence
// by its interval and both its ends.
function everyFewDays(said: Cadence, style: PortugueseStyle, length: number):
  string {
  return alternate(said, length) ?
    `${contractions.em.plural.masculine} ${units.day.many} ` +
      (said.start === 1 ? words.theOdd : words.theEven) :
    `${words.from} ${said.interval} ${words.in} ` +
      `${counted(said.interval, units.day)} ` +
      dayRun({from: said.start, to: said.last}, style);
}

const dateSayers: {[Kind in Plain['kind']]: DateSayer} = {
  all: () => words.everyDay,
  cadence: everyFewDays,
  pieces: (said: Extract<Plain, {kind: 'pieces'}>, style, length) => list(
    said.parts.map(
      (part) => dateSayers[part.kind](part as never, style, length))),
  range: dayRun,
  values: onDays
};

// Every second day from the 1st or the 2nd is one thing; any other
// cadence names both its ends, and is listed while it is short. Beside
// weekdays the days take no exception, where it would be taken for the
// whole pair.
function dateRules(length: number, paired: boolean): Rules {
  return {
    cadence: (cadence) => Number(alternate(cadence, length)) ||
      withEnds(longestList)(cadence),
    domain: {cyclic: false, max: length, min: 1},
    excepts: () => !paired,
    piecesOver: 0,
    wrap: false
  };
}

type QuartzSayer = (form: never, style: PortugueseStyle) => Partial<Side>;

// The last or the first day from Monday to Friday, with the gloss that
// says which days those are.
function weekdayOfMonth(which: string, style: PortugueseStyle): Partial<Side> {
  const gloss = `${weekdayName(1, 'one', style)} ${words.to} ` +
    weekdayName(5, 'one', style);

  return {
    text: `${contractions.em.singular.masculine} ${which} ` +
      `${words.weekdayDay} (${gloss})`
  };
}

// So many days before the last day of the month, as one day.
function beforeLast(form: {days: number}): Partial<Side> {
  const {de, em} = contractions;
  const day = `${em.singular.masculine} ${units.day.one}`;
  const lastDay = `${words.lastOne.masculine} ${units.day.one}`;

  return {
    text: form.days === 1 ?
      `${em.singular.masculine} ${words.penultimate} ${units.day.one}` :
      `${day} ${words.thatFalls} ${counted(form.days, units.day)} ` +
        `${words.before} ${de.singular.masculine} ${lastDay}`
  };
}

// The day itself, as a plain date, and then what happens if it is a
// Saturday or a Sunday.
function nearestWeekday(form: {day: number}, style: PortugueseStyle):
  Partial<Side> {
  return {
    month: 'date',
    tail: ` ${words.or}, ` + spaced([
      words.ifItFallsOn,
      weekdayName(6, 'one', style),
      words.or,
      `${weekdayName(0, 'one', style)},`,
      contractions.em.singular.masculine,
      words.weekdayDay,
      words.closest,
      form.day >= firstClosingDay && words.ofTheSameMonth
    ]),
    text: onDays({values: [form.day]}, style)
  };
}

const quartzSayers: {[Kind in QuartzDate['kind']]: QuartzSayer} = {
  beforeLast,
  firstWeekday: (form, style) =>
    weekdayOfMonth(nthWords[0].masculine, style),
  last: () => ({
    text: `${contractions.em.singular.masculine} ` +
      `${words.lastOne.masculine} ${units.day.one}`
  }),
  lastWeekday: (form, style) =>
    weekdayOfMonth(words.lastOne.masculine, style),
  nearestWeekday
};

/**
 * The day-of-month side of the calendar part. Under one named month the
 * days are those the month has, described afresh.
 */
function dateSide(analyses: Analyses, facts: MonthFacts): Side {
  const date = analyses.day.date as DateArm;
  const {months, single, style, unnamed} = facts;

  if (date.kind === 'quartz') {
    return {
      ...bare,
      month: 'quartz',
      ...quartzSayers[date.form.kind](date.form as never, style)
    };
  }

  const days = firesOn(analyses.candidates.date, domainOf('date'));
  const length = single ? monthLengths[months.values[0]] : longestMonth;
  const inMonth = days.filter((day) => day <= length);
  const [kept, size] = inMonth.length > 0 ?
    [inMonth, length] :
    [days, longestMonth];
  const {removed, said} =
    choose(kept, dateRules(size, analyses.day.union));
  const whole = said.kind === 'all';

  return {
    ...bare,
    excepted: ifAny(removed, (values) => spaced(
      [onDays({values}, style), whole && unnamed && eachMonth])),
    month: whole ? 'none' : 'date',
    text: dateSayers[said.kind](said as never, style, size)
  };
}

export {dateSide, eachMonth, weekdaySide};
