// Day-field classification: the DOM-or-DOW union and each arm's semantic
// kind, computed once for every language. Language-independent; renderers
// own the words and frames (docs/i18n-design.md §2.2).

import {isOpenStep} from './shapes.js';
import type {
  DateArm, DayFacts, Pattern, QuartzDate, QuartzWeekday, Shape, WeekdayArm
} from './schedule.js';
import {fieldSpecs} from './specs.js';
import {toFieldNumber} from './util.js';

// The parity of an interval-2 open step covering a whole odd/even set:
// `*/2` and `1/2` are the odd values, `2/2` the even; any other start is a
// partial set with no parity reading.
function stepParity(start: string): 'odd' | 'even' | null {
  if (start === '*' || start === '1') {
    return 'odd';
  }

  return start === '2' ? 'even' : null;
}

// Classify the date arm; null for a wildcard. A bounded step (`5-20/3`) is
// a windowed set, not an open cadence, so it reads as segments.
function dateArm(field: string, shape: Shape): DateArm | null {
  if (shape === 'wildcard') {
    return null;
  }

  if (shape === 'quartz') {
    return {form: quartzDate(field), kind: 'quartz'};
  }

  if (isOpenStep(field)) {
    const [start, interval] = field.split('/');

    return {
      interval: +interval,
      kind: 'cadenceStep',
      parity: +interval === 2 ? stepParity(start) : null,
      start: start === '*' ? 1 : +start
    };
  }

  return {kind: 'segments'};
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
    {kind: 'segments'};
}

// The day facts for a pattern: the union flag plus each arm.
function dayFacts(pattern: Pattern,
  shapes: Record<'date' | 'weekday', Shape>): DayFacts {
  return {
    date: dateArm(pattern.date, shapes.date),
    union: pattern.date !== '*' && pattern.weekday !== '*',
    weekday: weekdayArm(pattern.weekday, shapes.weekday)
  };
}

export {dayFacts};
