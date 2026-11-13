// The two sides of the calendar part that name days: the weekdays and the
// days of the month, each as a set of values or as a Quartz form.

import type {
  Analyses, DateArm, QuartzDate, QuartzWeekday, RangeDescription, WeekdayArm
} from '../../core/schedule.js';
import type {Cadence, Chosen, Part, Pieces, Plain, Rules} from './sets.js';
import type {Led} from './phrases.js';
import type {PortugueseStyle} from './options.js';
import {choose, firesOn, partsOf, withEnds} from './sets.js';
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

// A list no longer than this is said in place of a cadence of days.
const longestList = 7;

// Weekday pieces are said only for more days than this.
const mostDaysListed = 4;

// A day that can be a month's last, from which the nearest Friday or
// Monday might be looked for in the next month.
const firstClosingDay = 28;

// The days every month has.
const shortestMonth = 28;

// The week Portuguese lists starts on Monday, with Sunday last.
const monday = 1;

// Weekdays have no cadence. The whole week with a hole in it is the only
// exception, and one side of a day of the month and a weekday together
// never takes one, where it would be taken for the whole pair.
function weekRules(paired: boolean): Rules {
  return {
    cadence: () => 0,
    domain: domainOf('weekday'),
    excepts: (base) => base.kind === 'all' && !paired,
    first: monday,
    longestWrap: Infinity,
    piecesOver: mostDaysListed,
    steps: false,
    wrap: true
  };
}

type WeekSayer = (said: never, style: PortugueseStyle) => string;

// Several weekdays under one lead, which agrees with the first of them.
function weekdayList(
  days: number[],
  leads: {feminine: string; masculine: string},
  style: PortugueseStyle
): string {
  return `${leads[weekdays[days[0]].gender]} ` +
    list(days.map((day) => weekdayName(day, 'many', style)));
}

function weekdayRun(said: RangeDescription, style: PortugueseStyle): string {
  return `${words.from} ${weekdayName(said.from, 'one', style)} ` +
    `${words.to} ${weekdayName(said.to, 'one', style)}`;
}

// Weekdays have no cadence, so no way of saying one.
type WeekKind = Exclude<Plain['kind'], 'cadence'>;

const weekSayers: {[Kind in WeekKind]: WeekSayer} = {
  all: () => words.everyDay,
  pieces: (said: Pieces, style) => list(
    said.parts.map((part) => weekSayers[part.kind as WeekKind](
      part as never, style))),
  range: weekdayRun,
  values: (said: {values: number[]}, style) =>
    weekdayList(said.values, words.every, style)
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

  const days = firesOn(analyses.candidates.weekday, domainOf('weekday'));
  const {removed, said} = choose(days, weekRules(union));

  return {
    ...bare,
    excepted: ifAny(removed,
      (holes) => weekdayList(holes, contractions.a.plural, style)),
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

// Whether every second day runs the length of the month, from its 1st or
// its 2nd to the last odd or even day there can be.
function spansMonth(cadence: Cadence): boolean {
  return cadence.interval === 2 && cadence.start <= 2 &&
    cadence.last + 2 > domainOf('date').max;
}

// Every second day by its number being odd or even, with both its ends
// where it does not run the length of the month; any other cadence by its
// interval and both its ends.
function everyFewDays(said: Cadence, style: PortugueseStyle): Led {
  const ends = dayRun({from: said.start, to: said.last}, style);

  if (said.interval === 2) {
    return {
      lead: `${contractions.em.plural.masculine} ${units.day.many} ` +
        (said.start % 2 === 1 ? words.theOdd : words.theEven),
      text: spansMonth(said) ? '' : ends
    };
  }

  return {
    lead: `${words.from} ${said.interval} ${words.in} ` +
      counted(said.interval, units.day),
    text: ends
  };
}

// A piece of the days, with what leads it kept apart so that neighbours
// which share a lead say it once.
const datePieces: {[Kind in Part['kind']]:
  (part: never, style: PortugueseStyle) => Led} = {
  cadence: everyFewDays,
  range: (part: RangeDescription, style) =>
    ({lead: '', text: dayRun(part, style)}),
  values: (part: {values: number[]}, style) =>
    ({lead: '', text: onDays(part, style)})
};

function dateParts(parts: Part[], style: PortugueseStyle): string {
  return led(parts.map((part) => datePieces[part.kind](part as never, style)));
}

// Every second day that runs the length of the month is one thing; any
// other cadence names both its ends, and is listed while it is short.
// Beside weekdays the days take no exception, where it would be taken for
// the whole pair.
function dateRules(paired: boolean, anyLength: boolean): Rules {
  return {
    cadence: (cadence) => Number(spansMonth(cadence)) ||
      withEnds(longestList)(cadence),
    domain: domainOf('date'),
    excepts: (base) => !paired && (anyLength || base.kind !== 'all'),
    longestWrap: 0,
    piecesOver: 0,
    steps: true,
    wrap: false
  };
}

type QuartzSayer = (form: never, style: PortugueseStyle) => Partial<Side>;

// The last or the first day that is neither a Saturday nor a Sunday: the
// days are named, so that no word for a working day is needed.
function notWeekend(which: string, style: PortugueseStyle): Partial<Side> {
  return {
    tail: ` ${words.thatIsNot} ${weekdayName(6, 'one', style)} ` +
      `${words.nor} ${weekdayName(0, 'one', style)}`,
    text: `${contractions.em.singular.masculine} ${which} ${units.day.one}`
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
      contractions.em.singular.feminine,
      weekdayName(5, 'one', style),
      words.or,
      weekdayName(1, 'one', style),
      words.closest,
      form.day >= firstClosingDay && words.ofTheSameMonth
    ]),
    text: onDays({values: [form.day]}, style)
  };
}

const quartzSayers: {[Kind in QuartzDate['kind']]: QuartzSayer} = {
  beforeLast,
  firstWeekday: (form, style) => notWeekend(nthWords[0].masculine, style),
  last: () => ({
    text: `${contractions.em.singular.masculine} ` +
      `${words.lastOne.masculine} ${units.day.one}`
  }),
  lastWeekday: (form, style) => notWeekend(words.lastOne.masculine, style),
  nearestWeekday
};

// Whether what is said of the days as written holds in a month of any
// length: every second day the length of the month, and every day but
// some that every month has.
function holdsAnywhere(written: Chosen): boolean {
  const {removed, said} = written;

  return said.kind === 'cadence' && spansMonth(said) ||
    said.kind === 'all' && removed.every((day) => day <= shortestMonth);
}

// The days of a plain set as they are said. With every month, or where
// it holds in a month of any length, that is the set as written. Under
// named months it is otherwise the days those months have, and never
// «todos os dias, exceto», which counts to the 31st.
function daysSaid(analyses: Analyses, unnamed: boolean): Chosen {
  const reach = analyses.dateReach;
  const domain = domainOf('date');
  const {union} = analyses.day;
  const days = firesOn(analyses.candidates.date, domain);
  const written = choose(days, dateRules(union, true));

  if (reach && reach.days && reach.days.everyDay) {
    return {...written, removed: [], said: {kind: 'all'}};
  }

  return unnamed || holdsAnywhere(written) ?
    written :
    choose(reach && reach.days ?
      firesOn(reach.days.candidates, domain) :
      days, dateRules(union, false));
}

/** The day-of-month side of the calendar part. */
function dateSide(analyses: Analyses, facts: MonthFacts): Side {
  const date = analyses.day.date as DateArm;
  const {style, unnamed} = facts;

  if (date.kind === 'quartz') {
    return {
      ...bare,
      month: 'quartz',
      ...quartzSayers[date.form.kind](date.form as never, style)
    };
  }

  const {removed, said} = daysSaid(analyses, unnamed);
  const whole = said.kind === 'all';

  return {
    ...bare,
    excepted: ifAny(removed, (values) => spaced(
      [onDays({values}, style), whole && unnamed && eachMonth])),
    month: whole ? 'none' : 'date',
    text: whole ?
      words.everyDay :
      dateParts(partsOf(said), style)
  };
}

// What the reached months would need for the day of the month to come:
// the day or days themselves, or enough days for a count from the last.
const missed: {[Kind in 'beforeLast' | 'nearestWeekday' | 'values']:
  (analyses: Analyses, form: never) => string} = {
  beforeLast: (analyses, form: {days: number}) =>
    counted(form.days + 1, units.day),
  nearestWeekday: (analyses, form: {day: number}) =>
    `${units.day.one} ${form.day}`,
  values(analyses) {
    const days = firesOn(analyses.candidates.date, domainOf('date'));

    return `${days.length === 1 ? units.day.one : units.day.many} ` +
      list(days.map(String));
  }
};

/** What no reached month has, where the day of the month never comes. */
function missing(analyses: Analyses): string {
  const date = analyses.day.date as DateArm;
  const form = date.kind === 'quartz' ? date.form : date;

  return missed[form.kind as 'values'](analyses, form as never);
}

export {dateSide, eachMonth, missing, weekdaySide};
