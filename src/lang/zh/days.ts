// The year, month and day parts of a Chinese description, coarsest first,
// and what the day part asks to stand between it and a clock time.

import type {
  Domain, QuartzDate, QuartzWeekday, RangeDescription,
  Schedule, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {denote, describeSet} from '../../core/describe-set.js';
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

type YearRange = RangeDescription;
type YearValues = ValuesDescription;

// One stretch of years: what it asks for before a month, and whether it
// has no end.
interface YearTerm {
  // Whether it is every year but a few, said as 除…外.
  excepted?: boolean;
  kind: YearKind;
  open: boolean;
  text: string;
}

// One side of the day part: dates or weekdays.
interface Side {
  // The weekdays one by one, where they can be said after 或.
  items?: string[];
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

/** A year part, and whether it is every year but a few. */
export interface YearPart extends Part<YearKind> {
  excepted: boolean;
}

/** A month part, and what joins the year part to it. */
export interface MonthPart extends Part<Context> {
  // Whether the months are said as all but a few.
  excepted: boolean;
  lead: string;
}

// What joins a year part to a month. With no year, a month reads as a
// single occasion unless 每年 says it recurs. 的 gives way before months
// excepted, which begin with 除.
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
    both: words.eachOfDays,
    list: words.eachOfTheMonths,
    none: words.everyMonth,
    one: '',
    ranged: words.everyMonth
  },
  free: {both: words.eachOfDays, list: '', none: '', one: '', ranged: ''},
  parity: {
    both: words.eachOfDays,
    list: words.of,
    none: words.everyMonth,
    one: words.of,
    ranged: words.everyMonth
  },
  plain: {
    both: words.eachOfDays,
    list: words.of,
    none: words.everyMonth,
    one: '',
    ranged: words.everyMonth
  },
  week: {
    both: words.eachOfDays,
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

// What closes a phrase in brackets, or nothing.
function bracketed(notes: string[]): string {
  const said = notes.filter(Boolean).join(marks.comma);

  return when(said !== '', marks.open + said + marks.close);
}

// The first three values, ……, and where the cadence has an end, the last.
function abbreviated(values: string[], last: string): string {
  return series(values.slice(0, 3)) + marks.ellipsis + last;
}

// Years named one by one, a run of three as a range.
function yearsListed(values: number[]): string {
  return series(listed(linearRuns(values), RANGE, yearName));
}

// Years excepted, as they close a bracket.
function yearsExcepted(removed: number[]): string {
  return when(removed.length > 0, yearsListed(removed) + words.excepted);
}

// Whether a cadence is all the even or all the odd years there are.
function isEveryOtherYear(cadence: Cadence): boolean {
  return cadence.interval === 2 && cadence.open === true &&
    cadence.start <= domainOf('year').min + 1;
}

// A cadence of years. All the even or odd years have their word, and up
// to eight that end are listed. Any other is said with its rule: its
// start, and its end if it has one, its step, and the years it begins
// with, after which 当年 carries on.
function yearCadence(cadence: Cadence, removed: number[]): YearTerm {
  const open = cadence.open === true;
  const count = (cadence.last - cadence.start) / cadence.interval + 1;
  const shown = [0, 1, 2].map(
    (nth) => yearName(cadence.start + nth * cadence.interval));
  const head = open ?
    words.fromYear + yearName(cadence.start) + words.onwards :
    yearName(cadence.start) + words.to + yearName(cadence.last);

  return first<() => YearTerm>([
    [isEveryOtherYear(cadence), () => ({
      kind: 'several',
      open: false,
      text: [words.evenYears, words.oddYears][cadence.start % 2] +
        bracketed([yearsExcepted(removed)])
    })],
    [!open && count <= LISTED, () => ({
      kind: 'several',
      open: false,
      text: yearsListed(denote(cadence, domainOf('year')))
    })],
    [true, () => ({
      kind: 'cycle',
      open,
      text: head + words.every + String(cadence.interval) + units.year +
        words.oneYearIn + bracketed([
        abbreviated(shown, when(!open, yearName(cadence.last))),
        yearsExcepted(removed)
      ])
    })]
  ])();
}

// A run of years: one with no end is said from its first year on.
function yearRun(range: YearRange, removed: number[]): YearTerm {
  const open = range.open === true;

  return {
    kind: 'range',
    open,
    text: (open ?
      words.fromYear + yearName(range.from) + words.onwards :
      yearName(range.from) + words.to + yearName(range.to)) +
      bracketed([yearsExcepted(removed)])
  };
}

// Years named one by one.
function yearValues(values: number[]): YearTerm {
  return {
    kind: first<YearKind>([
      [values.length === 1, 'single'],
      [linearRuns(values).length === 1 && values.length >= RANGE, 'range'],
      [true, 'several']
    ]),
    open: false,
    text: yearsListed(values)
  };
}

// One stretch of years, with any years excepted from it. Every year but
// one or two is 除…外.
function yearTerm(part: SetDescription, removed: number[] = []): YearTerm {
  const terms: {[kind: string]: () => YearTerm} = {
    all: () => ({
      excepted: true,
      kind: 'range',
      open: false,
      text: words.except + yearsListed(removed) + words.exceptedEnd
    }),
    cadence: () => yearCadence(part as Cadence, removed),
    range: () => yearRun(part as YearRange, removed),
    values: () => yearValues((part as YearValues).values)
  };

  return terms[part.kind]();
}

// Stretches of years together, as a list. Where any is a run with no end
// or a cadence said with its rule, the last is joined by 以及, and such a
// cadence ends the whole in 当年.
function yearsTogether(terms: YearTerm[]): YearPart {
  const ruled = terms.some((term) => term.kind === 'cycle');
  const open = terms.some((term) => term.open);

  return {
    excepted: terms[0].excepted === true,
    kind: first<YearKind>([
      [ruled, 'cycle'],
      [terms.length === 1, terms[0].kind],
      [open, 'range'],
      [true, 'several']
    ]),
    text: series(terms.slice(0, -1).map((term) => term.text)) +
      when(terms.length > 1,
        ruled || open ? words.alsoPoints : marks.list) +
      lastOf(terms).text + when(ruled, marks.comma + words.thatYear)
  };
}

// A few lone years and then one run or cadence, where the years are
// that: the fewest lone years that leave one. Nothing where they are not.
function leadingYears(values: number[]): YearTerm[] {
  const domain = domainOf('year');
  const splits = [...Array(LISTED).keys()].map((at) => at + 1).map(
    (lone) => ({
      lone: values.slice(0, lone),
      rest: describeSet(values.slice(lone), domain)[0]
    }));
  const found = splits.filter(
    (split) => ['range', 'cadence'].includes(split.rest.kind));

  return found.slice(0, 1).flatMap(
    (split) => [yearValues(split.lone), yearTerm(split.rest)]);
}

// More than eight years that are no single run or cadence: one or two
// missing from one, else up to eight runs and lone years, else a few lone
// years before one run or cadence, else runs and cadences together as
// the core gives them, else the list.
function manyYears(schedule: Schedule): YearTerm[] {
  const found = schedule.analyses.candidates.year as SetDescription[];
  const together = schedule.analyses.cadencePieces.year?.parts ?? [];
  const [shortest] = found;
  const all = lastOf(found) as YearValues;
  const excepted = found.find(function fewMissing(candidate) {
    return candidate.kind === 'except' && candidate.removed.length <= 2 &&
      ['all', 'range', 'cadence'].includes(candidate.base.kind);
  }) as Exception | undefined;
  const parts = shortest.kind === 'pieces' ? shortest.parts : [];
  const items = parts.reduce((total, part) => total +
    (part.kind === 'range' ? 1 : part.values.length), 0);

  return first<() => YearTerm[]>([
    [typeof excepted !== 'undefined', () => [yearTerm(
      (excepted as Exception).base, (excepted as Exception).removed)]],
    [items > 0 && items <= LISTED,
      () => parts.map((part) => yearTerm(part))],
    [true, () => [
      leadingYears(all.values),
      together.map((part) => yearTerm(part)),
      [yearValues(all.values)]
    ].filter((terms) => terms.length > 0)[0]]
  ])();
}

/**
 * The year part: nothing when every year fires. Up to eight years are
 * listed; a single run or cadence is said as one; anything else is
 * several stretches.
 */
function yearOf(schedule: Schedule): YearPart {
  const found = schedule.analyses.candidates.year as SetDescription[];
  const [shortest] = found;
  const all = lastOf(found) as YearValues;

  return first<() => YearPart>([
    [shortest.kind === 'all',
      () => ({excepted: false, kind: 'none', text: ''})],
    [all.values?.length <= LISTED && !(shortest as YearRange).open,
      () => yearsTogether([yearValues(all.values)])],
    [shortest.kind === 'range' || shortest.kind === 'cadence',
      () => yearsTogether([yearTerm(shortest)])],
    [true, () => yearsTogether(manyYears(schedule))]
  ])();
}

/**
 * The months the description names: none when every month fires, and
 * otherwise those in which the schedule can fire. A month that never has
 * the date is left out, except beside a weekday, which fires there, and
 * where no month has it, which is said another way.
 */
function monthsOf(schedule: Schedule): number[] {
  const {candidates, dateReach, day} = schedule.analyses;
  const named = isAll(candidates.month) ?
    [] :
    denote((candidates.month as SetDescription[])[0], domainOf('month'));
  const skipped = dateReach?.fires === true && !day.union ?
    dateReach.never :
    [];

  return named.filter((month) => !skipped.includes(month));
}

/**
 * The month part, and what joins the given year part to it:
 * nothing when no month is named. A run of months may cross the new year
 * only when every year fires. After years that are all but a few, no
 * exception is said of the months.
 */
function monthOf(values: number[], years: YearPart): MonthPart {
  const domain = domainOf('month');
  const year = years.kind;
  const plain = years.excepted;
  const wraps = year === 'none';

  if (values.length === 0) {
    return {excepted: false, kind: 'none', lead: '', text: ''};
  }

  const picked = chosen(values, domain, function mostMonths(exception, kept) {
    return !plain && kept.length > LISTED && exception.base.kind === 'all';
  });
  const runs = runsOf(values, domain, wraps, RANGE);
  const excepted = picked.removed.length > 0;

  return {
    excepted,
    kind: first<Context>([
      [excepted || runs.some((run) => run.length >= RANGE), 'ranged'],
      [values.length === 1, 'one'],
      [true, 'list']
    ]),
    lead: when(!(excepted && year === 'several'), beforeMonth[year]),
    text: excepted ?
      words.except + series(picked.removed.map(monthName)) +
        words.exceptedEnd :
      series(listed(runs, RANGE, monthName, words.nextYear))
  };
}

// A Quartz day-of-month form as it is named, before any bracket.
function quartzHead(form: QuartzDate): string {
  const numbers = form as {day?: number; days?: number};
  const heads: Record<QuartzDate['kind'], string> = {
    beforeLast: words.nthFromLast + String((numbers.days ?? 0) + 1) +
      units.day,
    firstWeekday: dateName(1),
    last: words.lastDay,
    lastWeekday: words.lastDay,
    nearestWeekday: dateName(numbers.day ?? 0)
  };

  return heads[form.kind];
}

// A Quartz day-of-month form, as it follows 每月 or a month: the date,
// and in a bracket what the calendar says of it and which way it moves
// off a Saturday or Sunday.
function quartzDate(form: QuartzDate, note: string): string {
  const moves: Record<QuartzDate['kind'], string> = {
    beforeLast: '',
    firstWeekday: words.movedOnToMonday,
    last: '',
    lastWeekday: words.movedBackToFriday,
    nearestWeekday: words.nearestFridayOrMonday
  };

  return quartzHead(form) + bracketed([note, moves[form.kind]]);
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

// The dates of the month as one unbroken line: no run of them wraps.
function dateDomain(): Domain {
  return {...domainOf('date'), cyclic: false};
}

// An exception among dates: one or two missing from every day, or from
// the odd or the even days, of more than eight.
function dateException(exception: Exception, kept: number[]): boolean {
  const domain = dateDomain();

  return kept.length > LISTED && exception.removed.length <= 2 &&
    (exception.base.kind === 'all' ||
      everyOther(denote(exception.base, domain), domain));
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

// What the calendar says of the date where the months cannot say it:
// that February fires in leap years only, or, where no month can be
// left out, that a month without the date is skipped.
function calendarNote(schedule: Schedule): string {
  const {candidates, dateReach, day} = schedule.analyses;
  const reach = dateReach ?? {everyYear: [], leapYears: [], never: []};
  const narrowed = !isAll(candidates.month) && !day.union;
  const skips = reach.never.length + reach.leapYears.length > 0;

  return narrowed ?
    when(reach.everyYear.length > 0,
      reach.leapYears.map(monthName).join('')) +
      when(reach.leapYears.length > 0, words.leapYearsOnly) :
    when(skips, words.skippedWhereMissing);
}

// The dates. They are those the months named have, as the core gives
// them. The device is chosen from the dates as written, so that the odd
// days of a short month are still the odd days; a date is excepted only
// where it surely exists, which under a named month is before the last
// date that fires. `plain` is where no exception is said.
function dateSide(schedule: Schedule, context: Context, plain: boolean):
  Side {
  const {candidates, dateReach, day} = schedule.analyses;
  const note = bracketed([calendarNote(schedule)]);

  if (candidates.date === null) {
    return {
      kind: 'plain',
      text: quartzDate((day.date as {form: QuartzDate}).form,
        calendarNote(schedule)),
      tie: ''
    };
  }

  const domain = dateDomain();
  const written = denote(candidates.date[0], domain);
  const days = dateReach?.days ?
    denote(dateReach.days.candidates[0], domain) :
    written;
  const picked = chosen(written, domain, plain ? never : dateException);
  const sure = picked.removed.every(
    (date) => context === 'none' || date < lastOf(days));
  const removed = series(picked.removed.filter(() => sure).map(dateName));
  const side = first<() => Side>([
    [sure && everyOther(picked.values, domain), () => ({
      kind: 'parity',
      text: everyOtherDay[context][picked.values[0] % 2] +
        bracketed([when(removed !== '', removed + words.excepted)]),
      tie: ''
    })],
    [removed !== '', () => ({
      kind: 'except',
      text: words.except + removed + words.exceptedEnd + words.everyDay,
      tie: ''
    })],
    [days.length > LISTED && typeof cadenceOf(days, domain) !== 'undefined',
      () => ({
        kind: 'plain',
        text: abbreviated(days.map(dateName), dateName(lastOf(days))),
        tie: ''
      })],
    [true, () => dateList(days)]
  ])();

  return {...side, text: side.text + note};
}

// The weekdays, in the week that runs from Monday to Sunday. Exactly six
// days that are not one run are every day but one, except where no
// exception is said.
function weekSide(schedule: Schedule, plain: boolean): Side {
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
    return !plain && exception.base.kind === 'all' &&
      exception.removed.length === 1;
  });

  const items = listed(linearRuns(days), RANGE, weekdayName);

  return picked.removed.length > 0 ?
    {
      kind: 'free',
      text: words.except + series(picked.removed.map(weekdayName)) +
        words.exceptedEnd + words.everyDay,
      tie: ''
    } :
    {
      items,
      kind: 'week',
      text: series(items),
      tie: ''
    };
}

// Dates and weekdays that must both match: the dates, then that they fall
// on the weekdays. 每逢 leads the dates, 为 and 时 close the condition,
// and the last weekday follows 或.
function meeting(dates: Side, weekdays: Side): string {
  const items = weekdays.items ?? [weekdays.text];

  return words.eachOfDays + dates.text + words.being +
    series(items.slice(0, -1)) + when(items.length > 1, words.or) +
    lastOf(items) + words.whenItIs;
}

// What stands before the days: a date and a weekday together under a
// month, or that must both match, are led by 每逢.
function dayContext(month: MonthPart, together: boolean, meet: boolean):
  Context {
  return first<Context>([
    [together && (month.kind !== 'none' || meet), 'both'],
    [true, month.kind]
  ]);
}

// The sides of the day part, each marked for itself and joined by 以及,
// or, where both must match, said as a condition.
function sidesText(sides: Side[], context: Context, meet: boolean): string {
  return meet ?
    meeting(sides[0], sides[1]) :
    sides.map((side) => beforeDays[side.kind][context] + side.text)
      .join(words.andDays);
}

/**
 * The day part after a month part, and its tie: what it asks to stand
 * before a clock time. With no day the tie is 每天, which fills the level
 * a time of day would otherwise skip. A date and a weekday together are
 * each marked for itself, joined by 以及, and tied to the time by ，均在,
 * which says the time of both (where both must match, by 的);
 * under a month, 每逢 leads each after a comma. Where both must match,
 * the dates are said, then that they fall on the weekdays. Dates that are
 * every day the months have are not said, nor the weekday beside them; a
 * date no month has leaves the weekday alone.
 */
function dayOf(schedule: Schedule, month: MonthPart):
  {text: string; tie: string} {
  const {candidates, dateReach, day} = schedule.analyses;
  const everyDay = dateReach?.days?.everyDay === true;
  const dated = !isAll(candidates.date) && !everyDay &&
    dateReach?.fires !== false;
  const weekly = !isAll(candidates.weekday) && !everyDay;
  const together = dated && weekly;
  const meet = together && day.both;
  const context = dayContext(month, together, meet);
  const plain = together || month.excepted;
  const sides = [
    ...[dated].filter(Boolean).map(
      () => dateSide(schedule, context, plain)),
    ...[weekly].filter(Boolean).map(() => weekSide(schedule, plain))
  ];
  const lead = when(together && month.kind !== 'none', marks.comma);

  return {
    text: lead + sidesText(sides, context, meet),
    tie: [
      words.everyDay,
      sides.map((side) => side.tie).join(''),
      [marks.comma + words.bothAt, words.of][Number(meet)]
    ][sides.length]
  };
}

/**
 * Why a schedule never fires: the months named, in the years named, have
 * none of the dates.
 */
function neverOf(schedule: Schedule, months: string): string {
  const {candidates, day} = schedule.analyses;
  const dates = candidates.date === null ?
    quartzHead((day.date as {form: QuartzDate}).form) :
    series(listed(linearRuns(denote(candidates.date[0], dateDomain())),
      RANGE, dateName));

  return words.neverRuns + bracketed([months + words.hasNo + dates]);
}

export {dayOf, monthOf, monthsOf, neverOf, yearOf};
