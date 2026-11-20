// The two sides of the calendar part that name days: the weekdays and the
// days of the month, each as a set of values or as a Quartz form.

import type {
  Analyses, DateArm, Domain, QuartzDate, QuartzWeekday, RangeDescription,
  WeekdayArm
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
  // The weekdays as what a day of the month falls on, where both day
  // fields must match.
  condition: string;
  // What follows «exceto» for the days this side leaves out.
  excepted: string[];
  // Whether a month or a year has no noun here to attach to with «de»,
  // and so leads the sentence.
  leads: boolean;
  // Whether the side names more than one day of the month.
  several: boolean;
  // How the side stands to its month. A date says «de cada mês» when no
  // month is named and nothing under a leading month; a Quartz form
  // cannot stand without its month; days that name their own months (a
  // day only the longer of the months have, said with them) take none;
  // anything else takes a named month only.
  month: 'date' | 'none' | 'own' | 'quartz';
  // What closes the side after its month and year.
  tail: string;
  text: string;
}

/** What a side needs to know of the month it stands in. */
export interface MonthFacts {
  // The named months the day of the month fires in, grouped by their last
  // day (February's is the 29th), in the order of their first month; none
  // where no month is named.
  lengths: Array<{last: number; months: number[]}>;
  // Whether a month is named, beside weekdays, that has none of the days.
  lacking: boolean;
  // The days the months the day of the month fires in have: 1 to the last
  // day of the longest of them.
  monthDays: Domain;
  months: Chosen;
  // Named months as they follow a day phrase: after a date (`dated`) or
  // after «todos os dias».
  monthsAfter(months: number[], dated: boolean): string;
  // Whether exactly one month is named.
  single: boolean;
  style: PortugueseStyle;
  // Whether no month is named, though some may be excepted.
  unnamed: boolean;
}

const bare: Side = {
  condition: '',
  excepted: [],
  leads: false,
  month: 'none',
  several: false,
  tail: '',
  text: ''
};

const eachMonth = `${words.ofEach} ${units.month.one}`;

// A list no longer than this is said in place of a cadence of days.
const longestList = 7;

// Weekday pieces are said only for more days than this.
const mostDaysListed = 4;

// A day that can be a month's last, from which the nearest Friday or
// Monday might be looked for in the next month.
const firstClosingDay = 28;

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

// How the weekdays are said: as the days a schedule fires on, or, with
// `on`, as what a day of the month falls on.
type WeekSayer = (said: never, style: PortugueseStyle, on: boolean) => string;

// Several weekdays under one lead, which agrees with the first of them.
function weekdayList(
  days: number[],
  leads: {feminine: string; masculine: string},
  style: PortugueseStyle
): string {
  return `${leads[weekdays[days[0]].gender]} ` +
    list(days.map((day) => weekdayName(day, 'many', style)));
}

// Several weekdays as what a day falls on: one lead, which agrees with
// the first of them, and «ou» before the last.
function fallsOn(days: number[], style: PortugueseStyle): string {
  return `${words.inA[weekdays[days[0]].gender]} ` +
    list(days.map((day) => weekdayName(day, 'one', style)), words.or);
}

function weekdayRun(said: RangeDescription, style: PortugueseStyle): string {
  return `${words.from} ${weekdayName(said.from, 'one', style)} ` +
    `${words.to} ${weekdayName(said.to, 'one', style)}`;
}

// Weekdays have no cadence, so no way of saying one.
type WeekKind = Exclude<Plain['kind'], 'cadence'>;

const weekSayers: {[Kind in WeekKind]: WeekSayer} = {
  all: () => words.everyDay,
  pieces: (said: Pieces, style, on) => list(
    said.parts.map((part) => weekSayers[part.kind as WeekKind](
      part as never, style, on))),
  range: weekdayRun,
  values: (said: {values: number[]}, style, on) => {
    if (on) {
      return fallsOn(said.values, style);
    }

    return weekdayList(said.values, words.every, style);
  }
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

// Whether a day of the month and a weekday are said as a pair, neither
// taking an exception: a union, or two fields that both must match.
function pairedDays(analyses: Analyses): boolean {
  return analyses.day.union || analyses.day.both;
}

/** The weekday side of the calendar part. */
function weekdaySide(analyses: Analyses, facts: MonthFacts): Side {
  const weekday = analyses.day.weekday as WeekdayArm;
  const {style} = facts;

  if (weekday.kind === 'quartz') {
    const text = nthWeekday(weekday.form, style);

    return {...bare, condition: text, month: 'quartz', text};
  }

  const days = firesOn(analyses.candidates.weekday, domainOf('weekday'));
  const {removed, said} = choose(days, weekRules(pairedDays(analyses)));
  const say = weekSayers[said.kind as WeekKind] as WeekSayer;

  return {
    ...bare,
    condition: say(said as never, style, true),
    excepted: ifAny(removed,
      (holes) => weekdayList(holes, contractions.a.plural, style)),
    leads: ['pieces', 'range'].includes(said.kind),
    text: say(said as never, style, false)
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

// How the days are said: in what style, and against what months: the
// days the longest has, and the last day of the shortest.
interface DayContext {
  month: Domain;
  shortest: number;
  style: PortugueseStyle;
}

// Whether a run or a step goes on to the end of every month and ends on a
// day only the longer months have: it then runs to «o último dia».
function toLastDay(end: number, interval: number, context: DayContext):
  boolean {
  return end + interval > context.month.max && end > context.shortest;
}

// A run or a step from one day to another, or to the last day of each
// month.
function dayRun(from: number, to: number, interval: number,
  context: DayContext): string {
  const {a, de} = contractions;
  const end = toLastDay(to, interval, context) ?
    `${words.lastOne.masculine} ${units.day.one}` :
    `${units.day.one} ${dayNumber(to, context.style)}`;

  return `${de.singular.masculine} ${units.day.one} ` +
    `${dayNumber(from, context.style)} ${a.singular.masculine} ${end}`;
}

// Whether every second day runs the length of the month, from its 1st or
// its 2nd to the last odd or even day the month has. The month is the
// longest the days fire in, so that a step spelled to stop there and one
// spelled to run on fire on the same days and are said alike.
function spansMonth(cadence: Cadence, month: Domain): boolean {
  return cadence.interval === 2 && cadence.start - month.min < 2 &&
    cadence.last + 2 > month.max;
}

// Every second day by its number being odd or even, with both its ends
// where it does not run the length of the month; any other cadence by its
// interval and both its ends.
function everyFewDays(said: Cadence, context: DayContext): Led {
  const ends = dayRun(said.start, said.last, said.interval, context);

  if (said.interval === 2) {
    return {
      lead: `${contractions.em.plural.masculine} ${units.day.many} ` +
        (said.start % 2 === 1 ? words.theOdd : words.theEven),
      text: spansMonth(said, context.month) ? '' : ends
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
  (part: never, context: DayContext) => Led} = {
  cadence: everyFewDays,
  range: (part: RangeDescription, context) =>
    ({lead: '', text: dayRun(part.from, part.to, 1, context)}),
  values: (part: {values: number[]}, {style}) =>
    ({lead: '', text: onDays(part, style)})
};

function dateParts(parts: Part[], context: DayContext): string {
  return led(parts.map((part) =>
    datePieces[part.kind](part as never, context)));
}

// Every second day that runs the length of the month is one thing; any
// other cadence names both its ends, and is listed while it is short.
// Beside weekdays the days take no exception, where it would be taken for
// the whole pair. The days are those of the months they fire in. Under
// named months every day but some never leaves out the last day the
// months have: a run that stops before it is said as a run.
function dateRules(paired: boolean, unnamed: boolean, month: Domain):
  Rules {
  return {
    cadence: (cadence) => Number(spansMonth(cadence, month)) ||
      withEnds(longestList)(cadence),
    domain: month,
    excepts: (base, removed) => !paired && (unnamed ||
      base.kind !== 'all' || removed.every((day) => day < month.max)),
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

// The days a part names as days that occur: a list's values and the ends
// of a run or a step, but no end said as «o último dia» and none of every
// second day that runs the length of the month.
const namedBy: {[Kind in Part['kind']]:
  (part: never, context: DayContext) => number[]} = {
  cadence: (part: Cadence, context) => [part.start, part.last].filter(
    (day, index) => !spansMonth(part, context.month) &&
      (index === 0 || !toLastDay(day, part.interval, context))),
  range: (part: RangeDescription, context) => [part.from, part.to].filter(
    (day, index) => index === 0 || !toLastDay(day, 1, context)),
  values: (part: {values: number[]}) => part.values
};

// Whether the days as said name one that some of the months lack.
function namesMissingDay(said: Plain, context: DayContext): boolean {
  return said.kind !== 'all' && partsOf(said).some((part) =>
    namedBy[part.kind](part as never, context)
      .some((day) => day > context.shortest));
}

// The days the months fire on, said against the days those months have,
// never against 31: every day, every day but a few, every second day and
// a run to the end are judged there, so that the same days are said alike
// however they are spelled.
function daysSaid(days: number[], rules: Rules): Chosen {
  return choose(days.filter((day) => day <= rules.domain.max), rules);
}

// The text of the days as said.
function dateText(chosen: Chosen, context: DayContext): string {
  return chosen.said.kind === 'all' ?
    words.everyDay :
    dateParts(partsOf(chosen.said), context);
}

// Months of different lengths, where the days name one the shorter lack:
// the days every month has, said of all of them, and then the days only
// the longer have, each with the months that have them.
function byDays(days: number[], facts: MonthFacts): string {
  const {lengths, monthDays: month, style} = facts;
  const context = {month, shortest: Infinity, style};
  const lasts = [0, ...lengths.map(({last}) => last).sort((a, b) => a - b)];

  return list(lasts.slice(1).map(function part(last, index) {
    const had = days.filter((day) => day > lasts[index] && day <= last);
    const months = lengths.filter((group) => group.last >= last)
      .flatMap((group) => group.months).sort((a, b) => a - b);

    return had.length === 0 ?
      '' :
      `${dateText(daysSaid(had, dateRules(true, false, month)), context)} ` +
        facts.monthsAfter(months, true);
  }).filter(Boolean));
}

/** The day-of-month side of the calendar part. */
function dateSide(analyses: Analyses, facts: MonthFacts): Side {
  const date = analyses.day.date as DateArm;
  const {monthDays: month, style, unnamed} = facts;

  if (date.kind === 'quartz') {
    return {
      ...bare,
      month: 'quartz',
      ...quartzSayers[date.form.kind](date.form as never, style)
    };
  }

  const days = firesOn(analyses.candidates.date, domainOf('date'));
  const context = {
    month,
    shortest: Math.min(...facts.lengths.map(({last}) => last)),
    style
  };
  const chosen =
    daysSaid(days, dateRules(pairedDays(analyses), unnamed, month));
  const whole = chosen.said.kind === 'all';
  const apart = facts.lacking || namesMissingDay(chosen.said, context);

  return {
    ...bare,
    excepted: ifAny(apart ? [] : chosen.removed, (values) => spaced(
      [onDays({values}, style), whole && unnamed && eachMonth])),
    month: apart && 'own' || (whole ? 'none' : 'date'),
    several: days.length > 1,
    text: apart ? byDays(days, facts) : dateText(chosen, context)
  };
}

/**
 * Two day fields that must both match: the days of the month as they are
 * said alone, and then the weekdays they fall on, as a condition on one
 * day or on several. The weekdays are not said as days of their own.
 */
function fallingOn(date: Side, weekday: Side): Side {
  return {
    ...date,
    tail: `${date.tail}${date.several ?
      ` ${words.thatFall}` :
      `, ${words.ifItFalls}`} ${weekday.condition}`
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

export {dateSide, eachMonth, fallingOn, missing, weekdaySide};
