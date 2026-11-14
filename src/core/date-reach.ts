// When the day-of-month arm can fire. Months differ in length and
// February differs by year, so a day, or a Quartz form counted from a day,
// does not exist in every month a pattern reaches. That is calendar
// arithmetic, the same for every language.

import type {
  DateArm, DateReach, DayFacts, MonthLengths, QuartzDate, SetDescription
} from './schedule.js';
import {denote, describeSet} from './describe-set.js';
import {domainOf} from './specs.js';

const february = 2;
const longestMonth = 31;
const shortMonths = [4, 6, 9, 11];
const anyYear = {common: true, leap: true};

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
    days: null,
    everyYear: [],
    fires: true,
    firesInOtherYears: false,
    leapYears: [],
    never: []
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
  reach.firesInOtherYears = !reach.fires &&
    months.some(function inAnyYear(month) {
      return shortest <= lengthsOf(month, anyYear).slice(-1)[0];
    });
  reach.days = dates && reachedDays(dates, longest);

  const asWritten = !dates || !reach.days!.everyDay &&
    dates[dates.length - 1] <= longest;

  return reach.everyYear.length === months.length && asWritten ?
    null :
    reach;
}

// The shortest month the date arm fires in: a Quartz form's, a plain
// set's lowest day, and one day when the field is unrestricted.
function shortestFor(arm: DateArm | null, dates: SetDescription[] | null):
  number {
  if (arm?.kind === 'quartz') {
    return shortestForForm(arm.form);
  }

  return arm ?
    denote((dates as SetDescription[])[0], domainOf('date'))[0] :
    1;
}

/**
 * The months the date arm fires in, grouped by how many days they have, in
 * ascending order of length. February is in a group of its own for each
 * length it has in the years reached. Every reached month is here when the
 * day-of-month is unrestricted.
 */
function monthLengths(
  arm: DateArm | null,
  candidates: Record<'date' | 'month' | 'year', SetDescription[] | null>
): MonthLengths[] {
  const shortest = shortestFor(arm, candidates.date);
  const years = yearsReached(candidates.year as SetDescription[]);
  const groups = new Map<number, MonthLengths>();

  denote((candidates.month as SetDescription[])[0], domainOf('month'))
    .forEach(function place(month) {
      const lengths = lengthsOf(month, years);

      lengths.forEach(function group(length) {
        const sort = length === lengths[0] ? 'common' : 'leap';
        const found = groups.get(length) || {
          length, months: [], years: lengths.length > 1 ? sort : 'every'
        };

        if (shortest <= length) {
          found.months.push(month);
          groups.set(length, found);
        }
      });
    });

  return [...groups.values()].sort(function byLength(a, b) {
    return a.length - b.length;
  });
}

/**
 * For the weekday nearest a day: whether that day is the last day of the
 * months the form fires in, over the years the pattern reaches. Null for
 * any other date arm.
 */
function nearestDayIsLast(arm: DateArm | null, fired: MonthLengths[]):
  DayFacts['nearestDayIsLast'] {
  if (arm?.kind !== 'quartz' || arm.form.kind !== 'nearestWeekday') {
    return null;
  }

  const {day} = arm.form;
  const ending = fired.filter(function ends(group) {
    return group.length === day;
  });

  if (!ending.length) {
    return 'never';
  }

  return ending.length === fired.length ? 'always' : 'sometimes';
}

export {dateReach, monthLengths, nearestDayIsLast};
