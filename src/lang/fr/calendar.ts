// The calendar part and the year part: the days, the way a month joins
// them, and the years. A day phrase says how it takes a month (after a
// number, after a noun, after a recurring day); the month says what shape
// it has; a table joins the two.

import type {
  QuartzDate, QuartzWeekday, RangeDescription
} from '../../core/schedule.js';
import type {Context} from './context.js';
import {weekdayView} from './context.js';
import lexicon from './lexicon.js';
import {conjoin, every, given, led, phrase, series} from './say.js';
import type {
  Cadence, Counts, Excepted, Part, Sayers, View
} from './sets.js';
import {
  around, choose, countOf, described, interior, isRun, lengthOf,
  members,
  partsCount, say, spoken, viewOf, when
} from './sets.js';

const {countWords, dayNumber, nthWords, units, words: w} = lexicon;

/** How a day phrase takes a month. */
type Link = 'idiom' | 'noun' | 'number' | 'plain' | 'recurring';

/**
 * What the months are to a day phrase: every month, one, a list, a range
 * or pieces, every month but some, or months already said at the head of
 * the sentence.
 */
type Shape = 'all' | 'except' | 'led' | 'list' | 'one' | 'span';

/** The days of a schedule, before a month joins them. */
interface DayPhrase {
  // What follows the month inside the phrase.
  after: string;
  head: string;
  link: Link;
  // Phrases set off between commas at the end of the part.
  setOff: string[];
  // Whether it is one day of the month.
  single: boolean;
}

/** The months of a schedule. */
interface Months {
  // The phrase as it stands alone: «en juin», «de juin à août».
  alone: string;
  // Whether a single year is written after the one month's name.
  fused: boolean;
  names: string[];
  shape: Shape;
  values: number[];
}

/** A day phrase with its month. */
interface Joined {
  head: string;
  setOff: string[];
  tail: string;
}

interface Attached {
  head?: string;
  inline: string;
  setOff: string[];
}

type Attach = (months: Months, day: DayPhrase) => Attached;

// The days each month has, February counted with its leap day: a day set
// is clipped to these when one month is named.
const monthDays = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const numbered: DayPhrase =
  {after: '', head: '', link: 'number', setOff: [], single: false};

const afterNoun: DayPhrase = {...numbered, link: 'noun'};

const plainDays: DayPhrase = {...numbered, link: 'plain'};

// A range and a list of parts, each part with its own lead.
function inPieces(
  parts: Part[],
  range: (run: RangeDescription) => string,
  value: (member: number) => string
): string {
  return conjoin(parts.flatMap((part) => say(part, {
    range: (run) => [range(run)],
    values: (listed) => listed.values.map((member) => value(member))
  }, [])));
}

// The years. Every second year is said by parity, with its start or both
// ends when it does not begin with the calendar; any other cadence too
// long to list is one year in so many, counted from its start.
function yearCadence(cadence: Cadence, view: View): string {
  const everyOther = cadence.interval === 2;
  const lead = everyOther ?
    [w.evenYears, w.oddYears][cadence.start % 2] :
    phrase(w.oneYearIn,
      countWords[cadence.interval] ?? String(cadence.interval));
  const open = cadence.last + cadence.interval > view.domain.max;
  const whole = open && everyOther && cadence.start - view.domain.min < 2;

  return phrase(lead,
    given(open && !whole, phrase(w.since, String(cadence.start))),
    given(!open, phrase(w.from, String(cadence.start), w.to,
      String(cadence.last))));
}

function yearSpan(run: RangeDescription): string {
  return phrase(w.from, String(run.from), w.to, String(run.to));
}

/** The year part, or nothing when every year fires. */
function yearPart(c: Context): string {
  const description = choose(c.years, {
    cadence: (cadence) => when(members(cadence) > 4, 3),
    pieces: partsCount,
    range: (run) => when(run.to - run.from > 1, 2),
    values: (listed) => listed.values.length
  });

  return say(description, {
    cadence: (cadence) => yearCadence(cadence, c.years),
    pieces: (pieces) => inPieces(pieces.parts, yearSpan,
      (year) => phrase(w.in, String(year))),
    range: yearSpan,
    values: (listed) => series(listed.values.map(String), led(w.in))
  }, '');
}

/**
 * The months. Months with some missing are «sauf» those only where a day
 * part stands to be excepted from. One year after one month's name is
 * written into the name.
 */
function monthsOf(c: Context, excepting: boolean): Months {
  const description = choose(c.months, {
    except: (excepted) => when(excepting && excepted.base.kind === 'all',
      excepted.removed.length),
    pieces: partsCount,
    range: (run) => when(lengthOf(run, c.months.domain) > 2, 2),
    values: (listed) => listed.values.length
  });
  const values = spoken(description, c.months.domain);
  const named: Shape = values.length > 1 ? 'list' : 'one';
  const fused = values.length === 1 && c.years.values.length === 1;
  const year = given(fused, String(c.years.values[0]));

  function name(month: number): string {
    return phrase(lexicon.months[month][c.names], year);
  }

  function span(run: RangeDescription): string {
    return phrase(lexicon.of(name(run.from)), w.to, name(run.to));
  }

  return {
    alone: say(description, {
      except: (excepted) => phrase(w.except,
        series(excepted.removed.map(name), led(w.in))),
      pieces: (pieces) => inPieces(pieces.parts, span,
        (month) => phrase(w.in, name(month))),
      range: span,
      values: (listed) => series(listed.values.map(name), led(w.in))
    }, ''),
    fused,
    names: values.map(name),
    shape: say<Shape>(description, {
      all: () => 'all',
      except: () => 'except',
      pieces: () => 'span',
      range: () => 'span',
      values: () => named
    }),
    values
  };
}

function inline(text: string): Attached {
  return {inline: text, setOff: []};
}

function aside(text: string, months: Months): Attached {
  return {inline: text, setOff: [months.alone]};
}

function unsaid(): Attached {
  return inline('');
}

function standing(months: Months): Attached {
  return inline(months.alone);
}

function ofMonths(months: Months): Attached {
  return inline(series(months.names, lexicon.of));
}

// One day with a few months is every date in full; any other phrase that
// ends in a number is said «du mois», and the months follow, set off.
function several(months: Months, day: DayPhrase): Attached {
  const dates = months.names.map((name) => phrase(day.head, name));

  return day.single && dates.length <= 6 ?
    {head: conjoin(dates), inline: '', setOff: []} :
    aside(w.daysOfMonth, months);
}

const plain: Record<Shape, Attach> = {
  all: unsaid,
  except: (months) => aside('', months),
  led: unsaid,
  list: standing,
  one: standing,
  span: standing
};

const noun: Record<Shape, Attach> = {
  all: () => inline(w.daysOfMonth),
  except: (months) => aside(w.daysOfMonth, months),
  led: () => inline(w.daysOfMonth),
  list: ofMonths,
  one: ofMonths,
  span: (months) => aside(w.daysOfMonth, months)
};

// How each kind of day phrase takes each shape of months.
const attachments: Record<Link, Record<Shape, Attach>> = {
  idiom: {
    ...noun,
    all: () => inline(w.ofEachMonth),
    except: (months) => aside(w.ofEachMonth, months),
    led: unsaid
  },
  noun,
  number: {
    all: () => inline(w.ofEachMonth),
    except: (months) => aside(w.ofEachMonth, months),
    led: unsaid,
    list: several,
    one: (months) => inline(months.names[0]),
    span: several
  },
  plain,
  recurring: {...plain, one: ofMonths}
};

/** Join a day phrase and the months, as months of the given shape. */
function join(day: DayPhrase, months: Months, shape: Shape): Joined {
  const made = attachments[day.link][shape](months, day);

  return {
    head: made.head ?? day.head,
    setOff: [...made.setOff, ...day.setOff],
    tail: phrase(made.inline, day.after)
  };
}

function theDay(day: number): string {
  return phrase(w.the, dayNumber(day));
}

function fromTo(run: RangeDescription): string {
  return phrase(w.fromThe, dayNumber(run.from), w.toThe, dayNumber(run.to));
}

function theDays(days: number[]): string {
  return series(days.map(dayNumber), led(w.the), led(w.thePlural));
}

// Every second day that runs the length of the month.
function wholeParity(cadence: Cadence, view: View): boolean {
  return cadence.interval === 2 && cadence.start <= 2 &&
    cadence.last + 2 > view.domain.max;
}

// Days on a cadence: every second day by parity, the whole month's as the
// idiom alone, and anything else with both ends.
function cadenceDays(cadence: Cadence, view: View): DayPhrase {
  const lead = cadence.interval === 2 ?
    [w.evenDays, w.oddDays][cadence.start % 2] :
    every(cadence.interval, units.day);
  const bounded = phrase(lead, fromTo(
    {from: cadence.start, kind: 'range', to: cadence.last}));

  return wholeParity(cadence, view) ?
    {...numbered, head: lead, link: 'idiom'} :
    {...numbered, head: bounded};
}

// The days of the month, as the days one named month has when there is
// one, and described afresh.
function dateView(c: Context, months: Months): View {
  const whole =
    viewOf(c.schedule, 'date', {round: c.months.all && c.years.all});
  const length = months.shape === 'one' && monthDays[months.values[0]] || 31;
  const kept = whole.values.filter(function inMonth(day) {
    return day <= length || whole.values[0] > length;
  });

  return described(kept,
    {cyclic: whole.domain.cyclic, max: length, min: 1});
}

// The things each description of the days names. A cadence with both
// ends, and an exception, must replace more than seven days. Where no
// exception may be said, a cadence with a hole is the stretches each side
// of it, each said whole.
function dateCounts(view: View, excepting: boolean): Counts {
  const long = view.values.length > 7;

  // Three things for each stretch of the cadence, one for a stray day.
  function split(excepted: Excepted): number {
    const left = around(excepted, view.domain);

    return left.length + 2 * left.filter(isRun).length;
  }

  const counts: Counts = {
    all: () => 0,
    cadence: (cadence) => Math.min(
      when(wholeParity(cadence, view), 1),
      when(members(cadence) > 7, 3)),
    except: (excepted) => Math.min(
      when(excepting && long && interior(excepted),
        countOf(excepted.base, counts) + excepted.removed.length),
      when(!excepting && long && excepted.base.kind === 'cadence' &&
        interior(excepted), split(excepted))),
    pieces: partsCount,
    range: (run) => when(lengthOf(run, view.domain) > 2, 2),
    values: (listed) => listed.values.length
  };

  return counts;
}

function plainDate(c: Context, months: Months, excepting: boolean): DayPhrase {
  const view = dateView(c, months);

  // A cadence with a hole, each stretch said whole and no word shared.
  function stretches(excepted: Excepted): string {
    return conjoin(around(excepted, view.domain).map(function whole(run) {
      return isRun(run) ?
        cadenceDays({...excepted.base as Cadence, last: run.to,
          start: run.from}, view).head :
        theDay(run.from);
    }));
  }

  function except(excepted: Excepted): DayPhrase {
    return excepting ?
      {
        ...say(excepted.base, sayers),
        setOff: [phrase(w.except, theDays(excepted.removed))]
      } :
      {...numbered, head: stretches(excepted)};
  }

  const sayers: Sayers<DayPhrase> = {
    all: () => ({...afterNoun, head: w.everyDay}),
    cadence: (cadence) => cadenceDays(cadence, view),
    except,
    pieces: (pieces) =>
      ({...numbered, head: inPieces(pieces.parts, fromTo, theDay)}),
    range: (run) => ({...numbered, head: fromTo(run)}),
    values: (listed) => ({
      ...numbered,
      head: theDays(listed.values),
      single: listed.values.length === 1
    })
  };

  return say(choose(view, dateCounts(view, excepting)), sayers);
}

// The lengths one month can have: February's depend on the years named.
function lengthsOf(month: number, years: View): number[] {
  return month === 2 ?
    [28, 29].filter((length) => years.values.some(
      (year) => Number(year % 4 === 0) === length - 28)) :
    [monthDays[month]];
}

// The day an `L-n` form lands on. With one named month it is that
// month's own day: two days for February across leap years and others,
// one of them where only a leap year is long enough, and none where the
// month never is, which is then said as the condition it fails. With
// any other months it is the day of a month of 31 days, and from 28 up
// the months too short are said to be skipped.
function landing(days: number, months: Months, years: View):
  Partial<DayPhrase> {
  const lengths = lengthsOf(months.values[0], years);
  const [day, leapDay] = lengths.map((length) => length - days)
    .filter((landed) => landed > 0).map(theDay);
  const skipped =
    [phrase(w.whenMonthHasMoreThan, String(days), units.day.many)];

  if (months.shape !== 'one') {
    return {
      after: `(${phrase(theDay(31 - days), w.ofMonthOf31Days)})`,
      setOff: skipped.filter(() => days > 27)
    };
  }

  if (!day) {
    return {setOff: skipped};
  }

  // One day in every year named; or two, the later in leap years; or one
  // that only a leap year reaches.
  const both = given(Boolean(leapDay),
    `, ${w.or} ${leapDay} ${w.leapYears}`);
  const leapOnly = given(lengths.length > 1 && !leapDay,
    `, ${w.leapYears} ${w.only}`);

  return {after: `(${day}${both}${leapOnly})`};
}

// So many days before the last: the day before it has its own word.
function beforeLast(days: number, months: Months, years: View): DayPhrase {
  return days === 1 ?
    {...afterNoun, head: w.penultimateDay} :
    {
      ...afterNoun,
      head: phrase(countWords[days], units.day.many, w.beforeLastDay),
      ...landing(days, months, years)
    };
}

function quartzDate(form: QuartzDate, months: Months, years: View):
  DayPhrase {
  const forms: {[kind: string]: (said: never) => DayPhrase} = {
    beforeLast: (said: {days: number}) =>
      beforeLast(said.days, months, years),
    firstWeekday: () =>
      ({...afterNoun, head: phrase(w.the, nthWords[0], w.workingDay)}),
    last: () => ({...afterNoun, head: w.lastDay}),
    lastWeekday: () =>
      ({...afterNoun, head: phrase(w.the, w.lastOne, w.workingDay)}),
    nearestWeekday: (said: {day: number}) => ({
      ...numbered,
      head: phrase(w.the, w.workingDay, w.closest, String(said.day)),
      setOff: [w.sameMonth].filter(() => said.day > 27)
    })
  };

  return forms[form.kind](form as never);
}

/** The days of the month, plain or a Quartz form. */
function datePhrase(c: Context, months: Months, excepting: boolean): DayPhrase {
  const arm = c.day.date as {form: QuartzDate; kind: string};

  return arm.kind === 'quartz' ?
    quartzDate(arm.form, months, c.years) :
    plainDate(c, months, excepting);
}

// Plain weekdays, counted from Monday. A run of two is listed in the
// order of the run; pieces are said only of more than four days; and six
// days that wrap the week are every day but the seventh, where an
// exception may be said.
function plainWeekdays(c: Context, excepting: boolean): DayPhrase {
  const view = weekdayView(c);
  const plural = ({full: 'plural', short: 'short'} as const)[c.names];

  function the(day: number): string {
    return phrase(w.the, lexicon.weekdays[day % 7][c.names]);
  }

  function run(days: RangeDescription): string {
    return phrase(w.fromThe, lexicon.weekdays[days.from % 7][c.names],
      w.toThe, lexicon.weekdays[days.to % 7][c.names]);
  }

  const description = choose(view, {
    except: (excepted) => when(excepting && excepted.removed.length === 1 &&
      excepted.base.kind === 'all' && excepted.removed[0] % 7 > 1, 1),
    pieces: (pieces) => when(view.values.length > 4, partsCount(pieces)),
    range: () => 2,
    values: (listed) => listed.values.length
  });

  // One day recurs: «tous les lundis». Several each take their article.
  function named(days: number[]): DayPhrase {
    return days.length > 1 ?
      {...plainDays, head: conjoin(days.map(the))} :
      {
        ...plainDays,
        head: phrase(units.day.every, lexicon.weekdays[days[0] % 7][plural]),
        link: 'recurring'
      };
  }

  function ranged(days: RangeDescription): DayPhrase {
    return lengthOf(days, view.domain) > 2 ?
      {...plainDays, head: run(days)} :
      named([days.from, days.to]);
  }

  return say<DayPhrase>(description, {
    except: (excepted) => ({
      ...plainDays,
      head: w.everyDay,
      setOff: [phrase(w.except, the(excepted.removed[0]))]
    }),
    pieces: (pieces) =>
      ({...plainDays, head: inPieces(pieces.parts, run, the)}),
    range: ranged,
    values: (listed) => named(listed.values)
  });
}

/** The weekdays, plain or a Quartz form. */
function weekdayPhrase(c: Context, excepting: boolean): DayPhrase {
  const arm = c.day.weekday as {form: QuartzWeekday; kind: string};

  if (arm.kind !== 'quartz') {
    return plainWeekdays(c, excepting);
  }

  const form = arm.form as
    {kind: 'last' | 'nth'; nth?: number; weekday: number};
  const which = {last: w.lastOne, nth: nthWords[(form.nth ?? 1) - 1]};

  return {
    ...afterNoun,
    head: phrase(w.the, which[form.kind],
      lexicon.weekdays[form.weekday][c.names])
  };
}

/**
 * The days of a schedule that is not a union. An exception among the
 * days is the last thing in the calendar part, so it is said only where
 * no month phrase would follow it. With no day named, a restricted hour
 * is given «tous les jours», so that a time is never without its days.
 */
function dayPhrase(c: Context, months: Months): DayPhrase {
  if (c.dated) {
    return datePhrase(c, months, ['all', 'one'].includes(months.shape));
  }

  if (c.weekdayed) {
    return weekdayPhrase(c, months.shape === 'all');
  }

  return c.daily ?
    {...plainDays, head: w.everyDay, link: 'recurring'} :
    plainDays;
}

export type {DayPhrase, Joined, Months};
export {datePhrase, dayPhrase, join, monthsOf, weekdayPhrase, yearPart};
