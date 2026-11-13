// Day-field classification: the DOM-or-DOW union and each arm's semantic
// kind, computed once for every language. Language-independent; renderers
// own the words and frames (docs/i18n-design.md §2.2).

import type {
  DateArm, DayFacts, Pattern, QuartzDate, QuartzWeekday, SetDescription,
  Shape, WeekdayArm
} from './schedule.js';
import {fieldSpecs} from './specs.js';
import {toFieldNumber} from './util.js';

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

// The day facts for a pattern: each arm, and whether both narrow the days
// (cron then fires when either matches).
function dayFacts(
  pattern: Pattern,
  shapes: Record<'date' | 'weekday', Shape>,
  candidates: Record<'date' | 'weekday', SetDescription[] | null>
): DayFacts {
  return {
    date: dateArm(pattern.date, shapes.date),
    union: restricts(candidates.date) && restricts(candidates.weekday),
    weekday: weekdayArm(pattern.weekday, shapes.weekday)
  };
}

export {dayFacts};
