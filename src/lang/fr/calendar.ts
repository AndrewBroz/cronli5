// The calendar part and the year part: the days, the way a month joins
// them, and the years. A day phrase says how it takes a month (after a
// number, after a noun, after a recurring day); the month says what shape
// it has; a table joins the two.

import type {
  QuartzDate, QuartzWeekday, RangeDescription
} from '../../core/schedule.js';
import {daysReached} from '../../core/set-views.js';
import type {Context} from './context.js';
import {weekdayView} from './context.js';
import lexicon from './lexicon.js';
import {conjoin, every, given, led, phrase, series} from './say.js';
import type {
  Cadence, Counts, Described, Excepted, Sayers, Stretch, View
} from './sets.js';
import {
  around, choose, countOf, described, interior, isRun, lengthOf,
  members,
  partsCount, say, singles, spoken, stretchesOf, viewOf, when
} from './sets.js';

const {countWords, dayNumber, nthWords, units, words: w} = lexicon;

/** How a day phrase takes a month. */
type Link =
  'dated' | 'ended' | 'idiom' | 'noun' | 'number' | 'plain' | 'recurring';

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
  // Whether it ends in a clause that a comma closes.
  closes: boolean;
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
  closes: boolean;
  head: string;
  setOff: string[];
  // Whether the phrase, as said, names several days.
  several: boolean;
  tail: string;
}

interface Attached {
  head?: string;
  inline: string;
  setOff: string[];
  // Whether the months make the phrase name a day in each.
  several?: boolean;
}

type Attach = (months: Months, day: DayPhrase) => Attached;

// The days each month has, February counted with its leap day. The core
// says which months a day can fire in, and not which day a count from
// the end of a month lands on: that alone is worked out from these.
const monthDays = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const numbered: DayPhrase = {
  after: '',
  closes: false,
  head: '',
  link: 'number',
  setOff: [],
  single: false
};

const afterNoun: DayPhrase = {...numbered, link: 'noun'};

const plainDays: DayPhrase = {...numbered, link: 'plain'};

/** How each kind of part is said when a set is said in pieces. */
interface PieceSayers {
  cadence?: (cadence: Cadence) => string;
  range: (run: RangeDescription) => string;
  value: (member: number) => string;
}

// Runs, cadences and single values in a row, each part whole and with
// its own lead.
function inPieces(parts: Stretch[], sayers: PieceSayers): string {
  const {cadence} = sayers;

  return conjoin(parts.flatMap((part) => say(part, {
    cadence: cadence && ((spaced) => [cadence(spaced)]),
    range: (run) => [sayers.range(run)],
    values: (listed) => listed.values.map((member) => sayers.value(member))
  }, [])));
}

// The years. Every second year is said by parity, with its start or both
// ends when it does not begin with the calendar; any other cadence too
// long to list is one year in so many, counted from its start. A cadence
// with no end names its start alone.
function yearCadence(cadence: Cadence, view: View): string {
  const everyOther = cadence.interval === 2;
  const lead = everyOther ?
    [w.evenYears, w.oddYears][cadence.start % 2] :
    phrase(w.oneYearIn,
      countWords[cadence.interval] ?? String(cadence.interval));
  const open = cadence.open === true;
  const whole = open && everyOther && cadence.start - view.domain.min < 2;

  return phrase(lead,
    given(open && !whole, phrase(w.since, String(cadence.start))),
    given(!open, phrase(w.from, String(cadence.start), w.to,
      String(cadence.last))));
}

// A run of years: from its first to its last, or from its first on when
// it has no end.
function yearSpan(run: RangeDescription): string {
  return run.open ?
    phrase(w.since, String(run.from)) :
    phrase(w.from, String(run.from), w.to, String(run.to));
}

function inYears(years: number[]): string {
  return series(years.map(String), led(w.in));
}

/**
 * The year part, or nothing when every year fires. Years with a few
 * missing take an exception, which is the last thing in the sentence;
 * runs and cadences together are joined as pieces are.
 */
function yearPart(c: Context): string {
  const counts: Counts = {
    all: () => 0,
    cadence: (cadence) => when(members(cadence) > 4, 3),
    cadencePieces: partsCount,
    except: (excepted) => when(
      c.years.values.length > 4 && interior(excepted),
      countOf(excepted.base, counts) + excepted.removed.length),
    pieces: partsCount,
    range: (run) => when(run.to - run.from > 1, 2 - Number(run.open === true)),
    values: (listed) => listed.values.length
  };

  function pieced(pieces: {parts: Stretch[]}): string {
    return inPieces(pieces.parts, {
      cadence: (cadence) => yearCadence(cadence, c.years),
      range: yearSpan,
      value: (year) => phrase(w.in, String(year))
    });
  }

  const sayers: Sayers<string> = {
    cadence: (cadence) => yearCadence(cadence, c.years),
    cadencePieces: pieced,
    except: (excepted) => [
      say(excepted.base, sayers, ''),
      phrase(w.except, inYears(excepted.removed))
    ].filter(Boolean).join(', '),
    pieces: pieced,
    range: yearSpan,
    values: (listed) => inYears(listed.values)
  };

  return say(choose(c.years, counts), sayers, '');
}

/**
 * The months of a view. Months with some missing are «sauf» those only
 * where a day part stands to be excepted from. One year after one
 * month's name is written into the name, unless the months are `apart`
 * from the sentence's own.
 */
function monthsOf(
  c: Context,
  view: View,
  how: {apart?: boolean; excepting: boolean}
): Months {
  const description = choose(view, {
    except: (excepted) => when(
      how.excepting && excepted.base.kind === 'all',
      excepted.removed.length),
    pieces: partsCount,
    range: (run) => when(lengthOf(run, view.domain) > 2, 2),
    values: (listed) => listed.values.length
  });
  const values = spoken(description, view.domain);
  const named: Shape = values.length > 1 ? 'list' : 'one';
  const fused = values.length === 1 && c.years.values.length === 1 &&
    how.apart !== true;
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
      pieces: (pieces) => inPieces(pieces.parts,
        {range: span, value: (month) => phrase(w.in, name(month))}),
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
  return {
    ...inline(series(months.names, lexicon.of)),
    several: months.names.length > 1
  };
}

// One day with a few months is every date in full; any other phrase that
// ends in a number is said «du mois», and the months follow, set off.
function several(months: Months, day: DayPhrase): Attached {
  const dates = months.names.map((name) => phrase(day.head, name));

  return day.single && dates.length <= 6 ?
    {head: conjoin(dates), inline: '', setOff: [], several: true} :
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
  // Every date in full, each with its month.
  dated: {
    all: unsaid, except: unsaid, led: unsaid, list: unsaid, one: unsaid,
    span: unsaid
  },
  // To the end of the month: the months follow, set off.
  ended: {
    all: () => inline(w.ofEachMonth),
    except: (months) => aside('', months),
    led: unsaid,
    list: (months) => aside('', months),
    one: (months) => aside('', months),
    span: (months) => aside('', months)
  },
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
    closes: day.closes,
    head: made.head ?? day.head,
    setOff: [...made.setOff, ...day.setOff],
    several: Boolean(made.several),
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

/** The days of the month as a schedule fires on them. */
interface Dates {
  // The last day each month the days fire in has, in some year.
  lengths: Map<number, number>;
  // Whether months are named: an exception from every day then never
  // names the month's last day.
  named: boolean;
  // The last day every month the days fire in has, in some year: a day
  // after it is one some of the months lack.
  shared: number;
  // The days, described over those of the longest month they fire in.
  view: View;
}

// Every second day that runs the length of the month: to a day whose next
// is past the last day of the longest month the days fire in. The days
// reached decide, not how the field was written: `1-29/2` and `*/2` in
// June are the same days.
function wholeParity(cadence: Cadence, dates: Dates): boolean {
  return cadence.interval === 2 && cadence.start <= 2 &&
    cadence.last + 2 > dates.view.domain.max;
}

// Whether a run that steps by `step` and stops at `last` goes on to the
// end of every month while naming a day some of the months lack: it is
// then said to the end of the month, which each month has.
function toMonthEnd(last: number, step: number, dates: Dates): boolean {
  return last > dates.shared && last + step > dates.view.domain.max;
}

// A run of days by its ends, or to the end of the month.
function daySpan(run: RangeDescription, step: number, dates: Dates): string {
  return toMonthEnd(run.to, step, dates) ?
    phrase(w.fromThe, dayNumber(run.from), w.toMonthEnd) :
    fromTo(run);
}

// A cadence of days with both its ends: every second day by parity.
function boundedDays(cadence: Cadence, dates: Dates): string {
  const lead = cadence.interval === 2 ?
    [w.evenDays, w.oddDays][cadence.start % 2] :
    every(cadence.interval, units.day);

  return phrase(lead, daySpan(
    {from: cadence.start, kind: 'range', to: cadence.last},
    cadence.interval, dates));
}

// Days on a cadence: every second day by parity, the whole month's as the
// idiom alone, and anything else with both ends.
function cadenceDays(cadence: Cadence, dates: Dates): DayPhrase {
  return wholeParity(cadence, dates) ?
    {
      ...numbered,
      head: [w.evenDays, w.oddDays][cadence.start % 2],
      link: 'idiom'
    } :
    {...numbered, head: boundedDays(cadence, dates)};
}

// The days of the month the months they fire in have, as the core states
// them: described over the days of the longest such month, so that what
// is every day, a run or a list is judged against the months themselves.
// With every month the longest has a 31st, and «de chaque mois» is read
// as skipping the days a month lacks.
function datesOf(c: Context): Dates {
  const round = c.months.all && c.years.all;
  const own = viewOf(c.schedule, 'date', {round});
  const groups = c.schedule.analyses.monthLengths;
  const domain = daysReached(c.schedule)?.domain ?? own.domain;
  const days = own.values.filter((day) => day <= domain.max);
  const lengths = new Map<number, number>();

  groups.forEach((group) => group.months.forEach((month) => lengths.set(
    month, Math.max(group.length, lengths.get(month) ?? 0))));

  return {
    lengths,
    named: !c.months.all,
    shared: c.months.all ? domain.max : Math.min(...lengths.values()),
    view: domain.max === own.domain.max && days.length === own.values.length ?
      own :
      described(days, domain, {round})
  };
}

// The things each description of the days names. A cadence with both
// ends, and an exception, must replace more than seven days. Beside
// named months an exception from every day never names the last day of
// the month: a set without it is the run to its own last day. Where no
// exception may be said, a cadence with a hole is the stretches each
// side of it, each said whole.
function dateCounts(dates: Dates, excepting: boolean): Counts {
  const {view} = dates;
  const long = view.values.length > 7;

  // Three things for each stretch of the cadence, one for a stray day.
  function split(excepted: Excepted): number {
    const left = around(excepted, view.domain);

    return left.length + 2 * left.filter(isRun).length;
  }

  function sayable(excepted: Excepted): boolean {
    const known = !dates.named || excepted.base.kind !== 'all' ||
      !excepted.removed.includes(view.domain.max);

    return excepting && long && interior(excepted) && known;
  }

  const counts: Counts = {
    all: () => 0,
    cadence: (cadence) => Math.min(
      when(wholeParity(cadence, dates), 1),
      when(members(cadence) > 7, 3)),
    cadencePieces: partsCount,
    except: (excepted) => Math.min(
      when(sayable(excepted),
        countOf(excepted.base, counts) + excepted.removed.length),
      when(!excepting && long && excepted.base.kind === 'cadence' &&
        interior(excepted), split(excepted))),
    pieces: partsCount,
    range: (run) => when(lengthOf(run, view.domain) > 2, 2),
    values: (listed) => listed.values.length
  };

  return counts;
}

// The days a description names that some of the months lack, other than
// a run said to the end of the month.
function lacking(description: Described, dates: Dates): boolean {
  function past(day: number): boolean {
    return day > dates.shared;
  }

  function stretch(run: RangeDescription, step: number): boolean {
    return past(run.to) && !toMonthEnd(run.to, step, dates);
  }

  function cadence(spaced: Cadence): boolean {
    return !wholeParity(spaced, dates) && stretch(
      {from: spaced.start, kind: 'range', to: spaced.last}, spaced.interval);
  }

  function parts(pieces: {parts: Stretch[]}): boolean {
    return pieces.parts.some((part) => lacking(part, dates));
  }

  // A cadence with a hole, said as the stretches each side of it.
  function holed(excepted: Excepted): boolean {
    const step = (excepted.base as Cadence).interval;

    return excepted.base.kind === 'cadence' &&
      around(excepted, dates.view.domain).some(function names(run) {
        return isRun(run) ? stretch(run, step) : past(run.from);
      });
  }

  return say(description, {
    cadence,
    cadencePieces: parts,
    except: holed,
    pieces: parts,
    range: (run) => stretch(run, 1),
    values: (listed) => listed.values.some(past)
  }, false);
}

// The days as one description chooses them.
function chosenDays(dates: Dates, excepting: boolean): DayPhrase {
  const {view} = dates;
  const ended = view.values.some((day) => day > dates.shared);

  // A cadence with a hole, each stretch said whole and no word shared.
  function stretches(excepted: Excepted): string {
    const base = excepted.base as Cadence;

    return conjoin(around(excepted, view.domain).map(function whole(run) {
      return isRun(run) ?
        boundedDays({...base, last: run.to, start: run.from}, dates) :
        theDay(run.from);
    }));
  }

  // Said to the end of the month, the months follow set off.
  function closing(said: DayPhrase): DayPhrase {
    return ended && said.link === 'number' ? {...said, link: 'ended'} : said;
  }

  function except(excepted: Excepted): DayPhrase {
    return excepting ?
      {
        ...say(excepted.base, sayers),
        setOff: [phrase(w.except, theDays(excepted.removed))]
      } :
      closing({...numbered, head: stretches(excepted)});
  }

  function pieced(pieces: {parts: Stretch[]}): DayPhrase {
    return closing({
      ...numbered,
      head: inPieces(pieces.parts, {
        cadence: (cadence) => boundedDays(cadence, dates),
        range: (run) => daySpan(run, 1, dates),
        value: theDay
      })
    });
  }

  const sayers: Sayers<DayPhrase> = {
    all: () => ({...afterNoun, head: w.everyDay}),
    cadence: (cadence) => closing(cadenceDays(cadence, dates)),
    cadencePieces: pieced,
    except,
    pieces: pieced,
    range: (run) => closing({...numbered, head: daySpan(run, 1, dates)}),
    values: (listed) => ({
      ...numbered,
      head: theDays(listed.values),
      single: listed.values.length === 1
    })
  };

  return say(choose(view, dateCounts(dates, excepting)), sayers);
}

// Each date in full, in the order the months are said, each month with
// the days it has, from those after `after`.
function datesInFull(dates: Dates, months: Months, after: number): string[] {
  return months.values.flatMap((month, at) => dates.view.values
    .filter((day) => day > after &&
      day <= (dates.lengths.get(month) ?? 0))
    .map((day) => phrase(theDay(day), months.names[at])));
}

/**
 * The days of the month. Where the description chosen would name a day
 * some of the named months lack, the dates are each said in full while
 * there are six or fewer; past that, the days every month has are said
 * of all the months, and the others follow in full, each with its month.
 */
function plainDate(c: Context, months: Months, excepting: boolean):
  DayPhrase {
  const dates = datesOf(c);
  const {view} = dates;

  if (!lacking(choose(view, dateCounts(dates, excepting)), dates)) {
    return chosenDays(dates, excepting);
  }

  const each = datesInFull(dates, months, 0);

  if (each.length <= 6) {
    return {...numbered, head: conjoin(each), link: 'dated'};
  }

  const shared = view.values.filter((day) => day <= dates.shared);
  const base = chosenDays({...dates, view: described(shared, view.domain,
    {round: false})}, excepting);

  return {
    ...base,
    setOff: [...base.setOff,
      phrase(w.and, conjoin(datesInFull(dates, months, dates.shared)))]
  };
}

// The lengths one month can have: February's depend on the years named.
function lengthsOf(month: number, years: View): number[] {
  return month === 2 ?
    [28, 29].filter((length) => years.values.some(
      (year) => Number(year % 4 === 0) === length - 28)) :
    [monthDays[month]];
}

// The day an `L-n` form lands on. With one named month it is that
// month's own day, or two days for February across leap years and
// others. With any other months it is the day of a month of 31 days,
// and the months too short are said to be skipped: with every month from
// 28 days up, and with named months only when February among them
// reaches the day in leap years alone (a month that never does is not
// named).
function landing(c: Context, days: number, months: Months):
  Partial<DayPhrase> {
  const leaping = c.schedule.analyses.dateReach?.leapYears.length;
  const skips = days > 27 && (c.months.all || Boolean(leaping));
  const [day, leapDay] = lengthsOf(months.values[0], c.years)
    .map((length) => length - days)
    .filter((landed) => landed > 0).map(theDay);
  const both = given(Boolean(leapDay),
    `, ${w.or} ${leapDay} ${w.leapYears}`);

  return months.shape === 'one' ?
    {after: `(${day}${both})`} :
    {
      after: `(${phrase(theDay(31 - days), w.ofMonthOf31Days)})`,
      setOff: [
        phrase(w.whenMonthHasMoreThan, String(days), units.day.many)
      ].filter(() => skips)
    };
}

// So many days before the last: the day before it has its own word.
function beforeLast(c: Context, days: number, months: Months): DayPhrase {
  return days === 1 ?
    {...afterNoun, head: w.penultimateDay} :
    {
      ...afterNoun,
      head: phrase(countWords[days], units.day.many, w.beforeLastDay),
      ...landing(c, days, months)
    };
}

// A date moved off a weekend: the date itself or, when it falls on a
// Saturday or a Sunday, the day it moves to.
function offWeekend(c: Context, moved: string): Partial<DayPhrase> {
  const [sunday, , , , , , saturday] =
    lexicon.weekdays.map((name) => name[c.names]);

  return {
    after: phrase(w.falls, w.a, saturday, w.or, w.a, `${sunday},`, moved),
    closes: true
  };
}

function quartzDate(c: Context, form: QuartzDate, months: Months):
  DayPhrase {
  const monday = lexicon.weekdays[1][c.names];
  const friday = lexicon.weekdays[5][c.names];
  const forms: {[kind: string]: (said: never) => DayPhrase} = {
    beforeLast: (said: {days: number}) => beforeLast(c, said.days, months),
    firstWeekday: () => ({
      ...numbered,
      head: theDay(1),
      ...offWeekend(c, phrase(w.the, monday, w.follows))
    }),
    last: () => ({...afterNoun, head: w.lastDay}),
    lastWeekday: () => ({
      ...afterNoun,
      head: w.lastDay,
      ...offWeekend(c, phrase(w.the, friday, w.precedes))
    }),
    nearestWeekday: (said: {day: number}) => ({
      ...numbered,
      head: theDay(said.day),
      ...offWeekend(c,
        phrase(w.the, friday, w.or, w.the, monday, w.nearest)),
      setOff: [w.sameMonth].filter(() => said.day > 27)
    })
  };

  return forms[form.kind](form as never);
}

/** The days of the month, plain or a Quartz form. */
function datePhrase(c: Context, months: Months, excepting: boolean): DayPhrase {
  const arm = c.day.date as {form: QuartzDate; kind: string};

  return arm.kind === 'quartz' ?
    quartzDate(c, arm.form, months) :
    plainDate(c, months, excepting);
}

// How a set of weekdays is said, counted from Monday. A run of two is
// listed in the order of the run; pieces are said only of more than four
// days; and six days that wrap the week are every day but the seventh,
// where an exception may be said.
function weekdaysChosen(view: View, excepting: boolean): Described {
  return choose(view, {
    except: (excepted) => when(excepting && excepted.removed.length === 1 &&
      excepted.base.kind === 'all' && excepted.removed[0] % 7 > 1, 1),
    pieces: (pieces) => when(view.values.length > 4, partsCount(pieces)),
    range: () => 2,
    values: (listed) => listed.values.length
  });
}

function weekdayNamed(c: Context, day: number): string {
  return lexicon.weekdays[day % 7][c.names];
}

function weekdayRun(c: Context, days: RangeDescription): string {
  return phrase(w.fromThe, weekdayNamed(c, days.from), w.toThe,
    weekdayNamed(c, days.to));
}

// Plain weekdays: one recurring is «tous les lundis», several are each
// said with their article, and a run of more than two is said by its ends.
function plainWeekdays(c: Context, excepting: boolean): DayPhrase {
  const view = weekdayView(c);
  const plural = ({full: 'plural', short: 'short'} as const)[c.names];

  function the(day: number): string {
    return phrase(w.the, weekdayNamed(c, day));
  }

  const description = weekdaysChosen(view, excepting);

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
      {...plainDays, head: weekdayRun(c, days)} :
      named([days.from, days.to]);
  }

  return say<DayPhrase>(description, {
    except: (excepted) => ({
      ...plainDays,
      head: w.everyDay,
      setOff: [phrase(w.except, the(excepted.removed[0]))]
    }),
    pieces: (pieces) => ({
      ...plainDays,
      head: inPieces(pieces.parts, {
        range: (run) => weekdayRun(c, run),
        value: the
      })
    }),
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

// The weekdays a date must fall on, each with its article: «un lundi, un
// mercredi ou un vendredi». A run of more than two is said by its ends,
// and a Quartz weekday as it stands.
function fallsOn(c: Context): string {
  const arm = c.day.weekday as {kind: string};

  function items(stretch: RangeDescription): string[] {
    return lengthOf(stretch, weekdayView(c).domain) > 2 ?
      [phrase(w.a, units.day.one, weekdayRun(c, stretch))] :
      [...new Set([stretch.from, stretch.to])].map(
        (day) => phrase(w.a, weekdayNamed(c, day)));
  }

  return arm.kind === 'quartz' ?
    phrase(weekdayPhrase(c, false).head, w.daysOfMonth) :
    conjoin(stretchesOf(weekdaysChosen(weekdayView(c), false), singles)
      .flatMap(items), w.or);
}

/**
 * The days of a schedule whose two day fields must both match: the days
 * of the month as they are said alone, and when they fall on the
 * weekdays. The condition ends the phrase: after the months where those
 * are set off from it, and set off itself after a clause that ends in a
 * comma. No exception is said among the days or the months,
 * for it would read as taking days from the weekdays.
 */
function datesOnWeekdays(c: Context, months: Months): Joined {
  const dates = datePhrase(c, months, false);
  const joined = join(dates, months, months.shape);
  const quartz = (c.day.date as {kind: string}).kind === 'quartz';
  const many = !quartz && !dates.single || joined.several;
  const condition = phrase(w.when, many ? w.theyFall : w.itFalls,
    fallsOn(c));
  const apart = joined.setOff.length > 0 || joined.closes;

  return {
    ...joined,
    closes: true,
    setOff: apart ? [...joined.setOff, condition] : joined.setOff,
    tail: apart ? joined.tail : phrase(joined.tail, condition)
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
export {
  datePhrase, datesOnWeekdays, dayPhrase, join, monthsOf, weekdayPhrase,
  yearPart
};
