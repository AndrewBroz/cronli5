// Day-field classification: the DOM-or-DOW union and each arm's semantic
// kind, computed once for every language. Language-independent; renderers
// own the words and frames (docs/i18n-design.md §2.2).

import type {
  DateArm, DateReach, DayFacts, MonthLengths, Pattern, QuartzDate,
  QuartzWeekday, SetDescription, Shape, WeekdayArm
} from './schedule.js';
import {domainOf, fieldSpecs} from './specs.js';
import {denote} from './describe-set.js';
import {nearestDayIsLast} from './date-reach.js';
import {toFieldNumber} from './util.js';

type DayArms = Pick<DayFacts, 'date' | 'union' | 'weekday'>;

// Classify the date arm; null for a wildcard.
function dateArm(field: string, shape: Shape): DateArm | null {
  if (shape === 'wildcard') {
    return null;
  }

  return shape === 'quartz' ?
    {form: quartzDate(field), kind: 'quartz'} :
    {kind: 'values'};
}

// Which Quartz day-of-month form a validated field is, with its number.
function quartzDate(field: string): QuartzDate {
  if (field === 'L') {
    return {kind: 'last'};
  }

  if (field === 'LW' || field === 'WL') {
    return {kind: 'lastWeekday'};
  }

  const digits = +field.replace(/\D/gu, '');

  if (!field.startsWith('L-') && digits === 1) {
    return {kind: 'firstWeekday'};
  }

  return field.startsWith('L-') ?
    {days: digits, kind: 'beforeLast'} :
    {day: digits, kind: 'nearestWeekday'};
}

// Which Quartz day-of-week form a validated field is. The weekday may be
// written as a name or as 7 for Sunday; it is given as cron's number.
function quartzWeekday(field: string): QuartzWeekday {
  const spec = fieldSpecs.weekday;
  const [stem, nth] = field.replace(/L$/u, '').split('#');
  const number = toFieldNumber(stem, spec.numbers);
  const weekday = number > (spec.top as number) ? spec.min : number;

  return nth ?
    {kind: 'nth', nth: +nth, weekday} :
    {kind: 'last', weekday};
}

// Classify the weekday arm; null for a wildcard.
function weekdayArm(field: string, shape: Shape): WeekdayArm | null {
  if (shape === 'wildcard') {
    return null;
  }

  return shape === 'quartz' ?
    {form: quartzWeekday(field), kind: 'quartz'} :
    {kind: 'values'};
}

// Whether a day field narrows the days at all: a Quartz form does, and a
// plain set does unless it covers every value, however that was written.
function restricts(candidates: SetDescription[] | null): boolean {
  return candidates === null || candidates[0].kind !== 'all';
}

// The day fields as written: each arm, and whether both narrow the days
// (cron then fires when either matches).
function dayArms(
  pattern: Pattern,
  shapes: Record<'date' | 'weekday', Shape>,
  candidates: Record<'date' | 'weekday', SetDescription[] | null>
): DayArms {
  return {
    date: dateArm(pattern.date, shapes.date),
    union: restricts(candidates.date) && restricts(candidates.weekday),
    weekday: weekdayArm(pattern.weekday, shapes.weekday)
  };
}

const mondayToFriday = [1, 2, 3, 4, 5];
const mondayToFridayForms = ['firstWeekday', 'lastWeekday', 'nearestWeekday'];

// Whether a date arm can only land on Monday to Friday: the Quartz forms
// that pick a weekday. A plain date, the last day and so many days before
// it land on every day of the week over the years.
function landsMondayToFriday(arm: DateArm | null): boolean {
  return arm?.kind === 'quartz' &&
    mondayToFridayForms.includes(arm.form.kind);
}

// Whether a weekday arm is a plain set holding all of Monday to Friday.
function holdsMondayToFriday(candidates: SetDescription[] | null): boolean {
  if (!candidates) {
    return false;
  }

  const days = denote(candidates[candidates.length - 1],
    domainOf('weekday'));

  return mondayToFriday.every(function held(weekday) {
    return days.includes(weekday);
  });
}

// Whether the date arm of a union fires on no day the weekday arm does
// not: it never fires at all, or it only lands on Monday to Friday and
// the weekday arm has all five.
function dateAddsNothing(
  arms: DayArms,
  reach: DateReach | null,
  weekdays: SetDescription[] | null
): boolean {
  if (!arms.union) {
    return false;
  }

  return reach?.fires === false ||
    landsMondayToFriday(arms.date) && holdsMondayToFriday(weekdays);
}

// The day facts for a pattern: the arms as written, and what the calendar
// makes of the date arm in the months and years the pattern reaches.
function dayFacts(
  arms: DayArms,
  calendar: {reach: DateReach | null; fired: MonthLengths[]},
  weekdays: SetDescription[] | null
): DayFacts {
  return {
    ...arms,
    dateAddsNothing: dateAddsNothing(arms, calendar.reach, weekdays),
    nearestDayIsLast: nearestDayIsLast(arms.date, calendar.fired)
  };
}

export {dayArms, dayFacts};
