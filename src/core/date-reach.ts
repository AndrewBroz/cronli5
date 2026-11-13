// When the day-of-month arm can fire. Months differ in length and
// February differs by year, so a day, or a Quartz form counted from a day,
// does not exist in every month a pattern reaches. That is calendar
// arithmetic, the same for every language.

import type {
  DateArm, DateReach, QuartzDate, SetDescription
} from './schedule.js';
import {denote, describeSet} from './describe-set.js';
import {domainOf} from './specs.js';

const february = 2;
const longestMonth = 31;
const shortMonths = [4, 6, 9, 11];

function isLeap(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

// The lengths a month can have in the years reached: one, or two for
// February when both leap and common years are reached. Ascending.
function lengthsOf(month: number, years: {leap: boolean; common: boolean}):
  number[] {
  if (month !== february) {
    return [shortMonths.includes(month) ? 30 : longestMonth];
  }

  return [...years.common ? [28] : [], ...years.leap ? [29] : []];
}

// The shortest month a Quartz form fires in. The last day, the last
// weekday and the first weekday exist in every month; the weekday nearest
// a day needs that day; so many days before the last needs a longer month
// than that.
function shortestForForm(form: QuartzDate): number {
  if (form.kind === 'nearestWeekday') {
    return form.day;
  }

  return form.kind === 'beforeLast' ? form.days + 1 : 1;
}

// Which sorts of year a year field reaches. The whole field is not
// enumerated: it holds both.
function yearsReached(candidates: SetDescription[]):
  {leap: boolean; common: boolean} {
  const [first] = candidates;

  if (first.kind === 'all') {
    return {common: true, leap: true};
  }

  const years = denote(candidates[candidates.length - 1], domainOf('year'));

  return {
    common: !years.every(isLeap),
    leap: years.some(isLeap)
  };
}

// The days of a plain set that some reached month has, and whether they
// are all the days of the longest one (and so of every one).
function reachedDays(days: number[], longest: number): DateReach['days'] {
  const reached = days.filter(function exists(day) {
    return day <= longest;
  });

  return {
    candidates: reached.length ? describeSet(reached, domainOf('date')) : [],
    everyDay: reached.length === longest
  };
}

/**
 * When the date arm can fire in the months and years the pattern reaches,
 * or null when it fires in every one of them as written: the common case.
 */
function dateReach(
  arm: DateArm | null,
  candidates: Record<'date' | 'month' | 'year', SetDescription[] | null>
): DateReach | null {
  if (!arm) {
    return null;
  }

  const dates = candidates.date &&
    denote(candidates.date[candidates.date.length - 1], domainOf('date'));
  const months = denote((candidates.month as SetDescription[])[0],
    domainOf('month'));
  const years = yearsReached(candidates.year as SetDescription[]);
  const shortest = arm.kind === 'quartz' ? shortestForForm(arm.form) :
    (dates as number[])[0];
  const reach: DateReach = {
    days: null, everyYear: [], fires: true, leapYears: [], never: []
  };
  let longest = 0;

  months.forEach(function place(month) {
    const lengths = lengthsOf(month, years);
    const fitting = lengths.filter(function fits(length) {
      return shortest <= length;
    });

    longest = Math.max(longest, lengths[lengths.length - 1]);

    if (fitting.length === lengths.length) {
      reach.everyYear.push(month);
    }
    else if (fitting.length) {
      reach.leapYears.push(month);
    }
    else {
      reach.never.push(month);
    }
  });

  reach.fires = reach.never.length < months.length;
  reach.days = dates && reachedDays(dates, longest);

  const asWritten = !dates || !reach.days!.everyDay &&
    dates[dates.length - 1] <= longest;

  return reach.everyYear.length === months.length && asWritten ?
    null :
    reach;
}

export {dateReach};
