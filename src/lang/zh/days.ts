// The year, month and day parts of a Chinese description, coarsest first,
// and what the day part asks to stand between it and a clock time.

import type {
  Domain, QuartzDate, QuartzWeekday, Schedule, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {Cadence, Exception} from './sets.js';
import {
  LISTED, RANGE, cadenceOf, chosen, everyOther, first, lastOf, linearRuns,
  listed, never, runsOf, series, when
} from './sets.js';

const {marks, units, words} = lexicon;

// What a year part is, which decides what joins it to a month.
type YearKind = 'none' | 'single' | 'range' | 'several' | 'cycle';

// What stands before the days: no month, one month, a list of months, or
// months with a range or an exception among them; or, for a date and a
// weekday together under a month, the 每逢 that leads both.
type Context = 'none' | 'one' | 'list' | 'ranged' | 'both';

// One side of the day part: dates or weekdays.
interface Side {
  kind: 'plain' | 'parity' | 'except' | 'week' | 'free';
  text: string;
  // What this side asks for before a clock time.
  tie: string;
}

/** A year or month part. */
export interface Part<Kind> {
  kind: Kind;
  text: string;
}

// What joins a year part to a month. With no year, a month reads as a
// single occasion unless 每年 says it recurs.
const beforeMonth: Record<YearKind, string> = {
  cycle: '',
  none: words.eachYear,
  range: words.eachYear,
  several: words.of,
  single: ''
};

// What joins the months, or 每逢, to each kind of day phrase.
const beforeDays: Record<Side['kind'], Record<Context, string>> = {
  except: {
    both: '',
    list: words.eachOfTheMonths,
    none: words.everyMonth,
    one: '',
    ranged: words.everyMonth
  },
  free: {both: '', list: '', none: '', one: '', ranged: ''},
  parity: {
    both: '',
    list: words.of,
    none: words.everyMonth,
    one: words.of,
    ranged: words.everyMonth
  },
  plain: {
    both: '',
    list: words.of,
    none: words.everyMonth,
    one: '',
    ranged: words.everyMonth
  },
  week: {
    both: '',
    list: words.every,
    none: words.every,
    one: words.every,
    ranged: words.every
  }
};

// The even and the odd days: 逢 marks them after 每月, and gives way after
// a named month or 每逢.
const everyOtherDay: Record<Context, string[]> = {
  both: [words.evenDaysOfMonth, words.oddDaysOfMonth],
  list: [words.evenDaysOfMonth, words.oddDaysOfMonth],
  none: [words.evenDays, words.oddDays],
  one: [words.evenDaysOfMonth, words.oddDaysOfMonth],
  ranged: [words.evenDays, words.oddDays]
};

// The last date of the months that have fewer than 31, February at its
// longest.
const shorterMonths: {[month: number]: number} =
  {2: 29, 4: 30, 6: 30, 9: 30, 11: 30};

const weekdayGloss = marks.open + words.mondayToFriday + marks.close;

function yearName(year: number): string {
  return String(year) + units.year;
}

function monthName(month: number): string {
  return String(month) + units.month;
}

function dateName(date: number): string {
  return String(date) + units.date;
}

// A weekday by cron's number or, for Sunday at the end of the week, 7.
function weekdayName(weekday: number): string {
  return words.week + lexicon.weekdays[weekday % 7];
}

function isAll(found: SetDescription[] | null): boolean {
  return found !== null && found[0].kind === 'all';
}

// The first three values, ……, and where the cadence has an end, the last.
function abbreviated(values: string[], last: string): string {
  return series(values.slice(0, 3)) + marks.ellipsis + last;
}

// A cadence of years too long to list: its start (and its end, if it has
// one), its step, the years it begins with, and 当年 to carry on from.
function yearCycle(cadence: Cadence, values: number[], open: boolean): string {
  const head = open ?
    words.fromYear + yearName(cadence.start) + words.onwards :
    yearName(cadence.start) + words.to + yearName(cadence.last);

  return head + words.every + String(cadence.interval) + units.year +
    words.oneYearIn + marks.open + abbreviated(values.map(yearName),
    when(!open, yearName(cadence.last))) + marks.close + marks.comma +
    words.thatYear;
}

/** The year part: nothing when every year fires. */
function yearOf(found: SetDescription[]): Part<YearKind> {
  const domain = domainOf('year');

  if (isAll(found)) {
    return {kind: 'none', text: ''};
  }

  const values = denote(found[0], domain);
  const cadence = cadenceOf(values, domain);
  const runs = linearRuns(values);

  if (everyOther(values, domain)) {
    return {
      kind: 'several',
      text: [words.evenYears, words.oddYears][values[0] % 2]
    };
  }

  if (values.length <= LISTED || typeof cadence === 'undefined') {
    return {
      kind: first<YearKind>([
        [values.length === 1, 'single'],
        [runs.length === 1 && values.length >= RANGE, 'range'],
        [true, 'several']
      ]),
      text: series(listed(runs, RANGE, yearName))
    };
  }

  return {
    kind: 'cycle',
    text: yearCycle(cadence, values,
      cadence.last + cadence.interval > domain.max)
  };
}

/**
 * The month part: nothing when every month fires. A run of months may
 * cross the new year only when `wraps` allows.
 */
function monthOf(found: SetDescription[], wraps: boolean): Part<Context> {
  const domain = domainOf('month');

  if (isAll(found)) {
    return {kind: 'none', text: ''};
  }

  const values = denote(found[0], domain);
  const picked = chosen(values, domain, function mostMonths(exception, kept) {
    return kept.length > LISTED && exception.base.kind === 'all';
  });
  const runs = runsOf(values, domain, wraps);
  const excepted = picked.removed.length > 0;

  return {
    kind: first<Context>([
      [excepted || runs.some((run) => run.length >= RANGE), 'ranged'],
      [values.length === 1, 'one'],
      [true, 'list']
    ]),
    text: excepted ?
      words.except + series(picked.removed.map(monthName)) +
        words.exceptedEnd :
      series(listed(runs, RANGE, monthName, words.nextYear))
  };
}

// A Quartz day-of-month form, as it follows 每月 or a month.
function quartzDate(form: QuartzDate): string {
  const numbers = form as {day?: number; days?: number};
  const forms: Record<QuartzDate['kind'], string> = {
    beforeLast: words.nthFromLast + String((numbers.days ?? 0) + 1) +
      units.day,
    firstWeekday: words.nth + '1' + words.nthOne + words.workingDay +
      weekdayGloss,
    last: words.lastDay,
    lastWeekday: words.lastOne + words.workingDay + weekdayGloss,
    nearestWeekday: dateName(numbers.day ?? 0) + marks.open +
      words.nearestFridayOrMonday + marks.close
  };

  return forms[form.kind];
}

// A Quartz day-of-week form, as it follows 每月 or a month.
function quartzWeekday(form: QuartzWeekday): string {
  const numbers = form as {nth?: number};
  const forms: Record<QuartzWeekday['kind'], string> = {
    last: words.lastOne,
    nth: words.nth + String(numbers.nth) + words.nthOne
  };

  return forms[form.kind] + weekdayName(form.weekday);
}

// An exception among dates: one or two missing from every day, or from
// the odd or the even days, of more than eight.
function dateException(domain: Domain) {
  return function fewMissing(exception: Exception, kept: number[]): boolean {
    return kept.length > LISTED && exception.removed.length <= 2 &&
      (exception.base.kind === 'all' ||
        everyOther(denote(exception.base, domain), domain));
  };
}

// Dates as a list in which a run of three is a range. One range alone is
// followed by 每天 before a time, and pieces with a range by 的.
function dateList(days: number[]): Side {
  const runs = linearRuns(days);

  return {
    kind: 'plain',
    text: series(listed(runs, RANGE, dateName)),
    tie: first([
      [runs.length === 1 && days.length >= RANGE, words.everyDay],
      [runs.some((run) => run.length >= RANGE), words.of],
      [true, '']
    ])
  };
}

// The dates. Under one named month a date the month never has is left
// out, and the month's own length bounds what is every day, or every
// second day, of it. `together` is a date beside a weekday, where no
// exception is said.
function dateSide(schedule: Schedule, context: Context, together: boolean):
  Side {
  const {candidates, day} = schedule.analyses;

  if (candidates.date === null) {
    return {
      kind: 'plain',
      text: quartzDate((day.date as {form: QuartzDate}).form),
      tie: ''
    };
  }

  const months = denote((candidates.month as SetDescription[])[0],
    domainOf('month'));
  const max = months.length === 1 && shorterMonths[months[0]] || 31;
  const domain = {cyclic: false, max, min: 1};
  const every = denote(candidates.date[0], domainOf('date'));
  const fitting = every.filter((date) => date <= max);
  const days = fitting.length > 0 ? fitting : every;
  const picked = chosen(days, domain,
    together ? never : dateException(domain));
  const removed = series(picked.removed.map(dateName));

  return first<Side>([
    [everyOther(picked.values, domain), {
      kind: 'parity',
      text: everyOtherDay[context][picked.values[0] % 2] + when(
        removed !== '', marks.open + removed + words.excepted + marks.close),
      tie: ''
    }],
    [removed !== '', {
      kind: 'except',
      text: words.except + removed + words.exceptedEnd + words.everyDay,
      tie: ''
    }],
    [days.length > LISTED && typeof cadenceOf(days, domain) !== 'undefined', {
      kind: 'plain',
      text: abbreviated(days.map(dateName), dateName(lastOf(days))),
      tie: ''
    }],
    [true, dateList(days)]
  ]);
}

// The weekdays, in the week that runs from Monday to Sunday. Exactly six
// days that are not one run are every day but one, except beside a date.
function weekSide(schedule: Schedule, together: boolean): Side {
  const {candidates, day} = schedule.analyses;

  if (candidates.weekday === null) {
    return {
      kind: 'plain',
      text: quartzWeekday((day.weekday as {form: QuartzWeekday}).form),
      tie: ''
    };
  }

  const domain = {cyclic: false, max: 7, min: 1};
  const days = denote(candidates.weekday[0], domainOf('weekday'))
    .map((weekday) => weekday || 7).sort();
  const picked = chosen(days, domain, function allButOne(exception) {
    return !together && exception.base.kind === 'all' &&
      exception.removed.length === 1;
  });

  return picked.removed.length > 0 ?
    {
      kind: 'free',
      text: words.except + series(picked.removed.map(weekdayName)) +
        words.exceptedEnd + words.everyDay,
      tie: ''
    } :
    {
      kind: 'week',
      text: series(listed(linearRuns(days), RANGE, weekdayName)),
      tie: ''
    };
}

/**
 * The day part after a month part, and its tie: what it asks to stand
 * before a clock time. With no day the tie is 每天, which fills the level
 * a time of day would otherwise skip. A date and a weekday together are
 * joined by 和 and tied to the time by 的; under a month, 每逢 leads both
 * after a comma.
 */
function dayOf(schedule: Schedule, month: Part<Context>):
  {text: string; tie: string} {
  const {candidates, day} = schedule.analyses;
  const context = day.union && month.kind !== 'none' ? 'both' : month.kind;
  const sides = [
    ...[candidates.date].filter((found) => !isAll(found)).map(
      () => dateSide(schedule, context, day.union)),
    ...[candidates.weekday].filter((found) => !isAll(found)).map(
      () => weekSide(schedule, day.union))
  ];

  return {
    text: when(context === 'both', marks.comma + words.eachOfDays) +
      sides.map((side) => beforeDays[side.kind][context] + side.text)
        .join(words.andDays),
    tie: [
      words.everyDay,
      sides.map((side) => side.tie).join(''),
      words.of
    ][sides.length]
  };
}

export {beforeMonth, dayOf, monthOf, yearOf};
