// The year, month and day parts of the sentence. They join as a Chinese
// date does, coarsest first, so what leads a date depends on how the
// month before it was said.

import type {QuartzDate, ScheduleFacts} from '../../core/schedule.js';
import {
  type Shape, choose, excepted, listed, parity, ranges, scales,
  setsOf, unrestricted, weekSets
} from './shape.js';
import lexicon from './lexicon.js';

const {marks, units, weekdays, words} = lexicon;

/** The three parts that say which days. */
export interface DaysSaid {
  day: string;
  month: string;
  year: string;
}

// How one field's values are named, and the words around them.
interface Naming {
  // What leads a plain list or run.
  each: string;
  even: string;
  name: (value: number) => string;
  // What marks the end of a run that wraps round.
  next: string;
  odd: string;
  // What follows "all but these".
  rest: string;
  // What a cadence counts in.
  unit: string;
}

const dates: Naming = {
  each: '',
  even: words.evenDays,
  name(value) {
    return value + units.date;
  },
  next: words.nextMonth,
  odd: words.oddDays,
  rest: words.everyDay,
  unit: units.day
};

const months: Naming = {
  each: '',
  even: words.evenMonths,
  name(value) {
    return value + units.month;
  },
  next: words.nextYear,
  odd: words.oddMonths,
  rest: '',
  unit: units.month
};

const days: Naming = {
  each: words.every,
  even: '',
  name(value) {
    return words.week + weekdays[value % weekdays.length];
  },
  next: '',
  odd: '',
  rest: words.everyDay,
  unit: units.day
};

const years: Naming = {
  each: '',
  even: words.evenYears,
  name(value) {
    return value + units.year;
  },
  next: '',
  odd: words.oddYears,
  rest: '',
  unit: units.year
};

// How the month was said, which decides what joins it to a date: nothing
// said, one month, several listed, or a stretch of them.
type Link = 'listed' | 'none' | 'single' | 'spanning';

// What leads a date standing alone after the month, and what leads it
// when a weekday is said beside it. A Quartz form has its own lead.
const dateLead: Record<Link, string> = {
  listed: words.of,
  none: words.everyMonth,
  single: '',
  spanning: words.everyMonth
};

const pairedDateLead: Record<Link, string> = {
  ...dateLead,
  listed: words.everyMonth
};

// All but a few days follows its months directly.
const exceptedDateLead: Record<Link, string> = {...dateLead, listed: ''};

const quartzLead: Record<Link, string> = {
  listed: '',
  none: words.everyMonth,
  single: '',
  spanning: ''
};

function anyShape(): boolean {
  return true;
}

function unbroken(shape: Shape): boolean {
  return shape.removed.length === 0;
}

// Months have no cadence but the odd and the even ones.
function monthSayable(shape: Shape): boolean {
  return shape.interval === 1 || shape.alternate;
}

// Weekdays that are not one run are listed up to this many.
const listedWeekdays = 4;

// Weekdays have no cadence; only six days are said as all but one; and
// pieces are said only of more than four days.
function weekdaySayable(shape: Shape, count: number): boolean {
  return shape.interval === 1 && shape.removed.length <= 1 &&
    (shape.parts.length === 1 || count > listedWeekdays);
}

function setWords(shape: Shape, naming: Naming): string {
  const [run] = ranges(shape);

  if (shape.interval === 1) {
    return listed(shape.parts, naming.name, naming.next);
  }

  if (shape.alternate) {
    return parity(shape, naming.even, naming.odd);
  }

  return naming.name(run.from) +
    (shape.open ? words.fromOn : words.to + naming.name(run.to)) +
    words.every + shape.interval + naming.unit;
}

// A restricted field in words: all but a few, or the set itself with
// anything taken out of it in brackets.
function fieldWords(shape: Shape, naming: Naming): string {
  const removed = shape.removed.map(naming.name).join(marks.list);

  if (shape.round && removed) {
    return words.except + removed + words.exceptedEnd + naming.rest;
  }

  return naming.each + setWords(shape, naming) + excepted([removed]);
}

function linkOf(month: Shape): Link {
  if (month.length === 0) {
    return 'none';
  }

  if (month.removed.length > 0 ||
      month.interval === 1 && ranges(month).length > 0) {
    return 'spanning';
  }

  return month.length === 1 && month.interval === 1 ? 'single' : 'listed';
}

function quartzDateWords(form: QuartzDate): string {
  const working = words.workingDay + marks.open + words.mondayToFriday +
    marks.close;

  switch (form.kind) {
    case 'last':
      return words.lastDay;
    case 'lastWeekday':
      return words.lastOne + working;
    case 'beforeLast':
      return words.nthFromLast + (form.days + 1) + units.day;
    default:
      return words.nearest + dates.name(form.day) + words.of + working;
  }
}

// The date, with what leads it, and whether a comma must close it: a
// range or a cadence of dates would otherwise run into the time.
function dateWords(
  facts: ScheduleFacts,
  link: Link
): {open: boolean; text: string} {
  const {date, union} = facts.analyses.day;

  if (date?.kind === 'quartz') {
    return {open: false, text: quartzLead[link] + quartzDateWords(date.form)};
  }

  const mayWrap = unrestricted(facts, ['month', 'year']);
  const shape = choose(setsOf(facts, 'date', mayWrap), scales.date, anyShape);
  const alone = shape.round ? exceptedDateLead : dateLead;
  const lead = (union ? pairedDateLead : alone)[link];

  return {
    open: ranges(shape).length > 0 && !shape.round && !shape.alternate,
    text: shape.length === 0 ? '' : lead + fieldWords(shape, dates)
  };
}

function weekdayWords(facts: ScheduleFacts, link: Link): string {
  const {weekday} = facts.analyses.day;

  if (weekday?.kind === 'quartz') {
    const {form} = weekday;
    const which = form.kind === 'nth' ?
      words.nth + form.nth + words.nthOne :
      words.lastOne;

    return quartzLead[link] + which + days.name(form.weekday);
  }

  const shape = choose(weekSets(facts), scales.weekday, weekdaySayable);

  return shape.length === 0 ? '' : fieldWords(shape, days);
}

// A single year leads as in a date; any other year phrase is closed by a
// comma. With a month and no year, the year part says every year.
function yearWords(year: Shape, monthSaid: boolean): string {
  if (year.length === 0) {
    return monthSaid ? words.eachYear : '';
  }

  const single = year.length === 1 && year.interval === 1;

  return fieldWords(year, years) + (single ? '' : marks.comma);
}

/**
 * The year, month and day parts. `allDay` is whether the time part already
 * says the schedule runs round the clock: otherwise, with no day named,
 * the day part says every day.
 */
function describeDays(facts: ScheduleFacts, allDay: boolean): DaysSaid {
  const {union} = facts.analyses.day;
  const year = choose(setsOf(facts, 'year', false), scales.year, unbroken);
  const month = choose(
    setsOf(facts, 'month', unrestricted(facts, ['year'])), scales.month,
    monthSayable);
  const link = linkOf(month);
  const date = dateWords(facts, link);
  const named = [date.text, weekdayWords(facts, link)].filter(Boolean);
  const everyDay = allDay ? '' : words.everyDay;
  const apart = union ? words.during + marks.comma : '';

  return {
    day: named.length === 0 ?
      everyDay :
      named.join(words.also) + (union || date.open ? marks.comma : ''),
    month: link === 'none' ? '' : fieldWords(month, months) + apart,
    year: yearWords(year, link !== 'none')
  };
}

export {describeDays};
