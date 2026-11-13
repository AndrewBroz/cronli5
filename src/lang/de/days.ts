// The parts before the time: the year, the month and the day, coarsest
// first, with the fusions a German date makes and the joins between them.

import {denote} from '../../core/describe-set.js';
import type {
  QuartzDate, QuartzWeekday, Schedule, SetDescription
} from '../../core/schedule.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {Counting, Described, Piece} from './sets.js';
import {
  boundedCadence, join, list, longerThan, settle, settleUnwrapped, unsayable
} from './sets.js';
import type {TimeSaid} from './time.js';
import type {Voice} from './voice.js';

const {fromLastWords, nthWords, units, words} = lexicon;

/** The parts before the time, and what opens the time after them. */
export interface CalendarSaid {
  day: string;
  // «jeweils », where the time is shared out over what stands before it.
  lead: string;
  month: string;
  year: string;
}

// The words one field names its values with.
interface Naming {
  except: string;
  // What opens a run: «von», «vom».
  from: string;
  name(value: number): string;
  // What opens single values: «im», «am».
  one: string;
  size: number;
  // Every value of the field, as the base of an exception.
  whole: string;
}

// What follows a date to say its month: after an ordinal number («am 1.
// Juni») and after a noun («am letzten Tag im Juni»).
interface MonthTail {
  noun: string;
  ord: string;
  // The days of the shortest month it stands for, where the months are
  // not said with the date itself.
  shortest: number;
}

// The months of a schedule.
interface Months {
  every: boolean;
  // The days of the longest of them.
  length: number;
  // The days the shortest of them has in every year.
  least: number;
  one: boolean;
  said: SetDescription;
  values: number[];
}

// The days of the month a schedule names: a Quartz form or a set.
interface Dates {
  form?: QuartzDate;
  said: SetDescription;
  there: boolean;
  // The last date the named months have.
  top: number;
  // Whether the dates named are every day the named months have.
  whole: boolean;
}

interface Weekdays {
  form?: QuartzWeekday;
  said: SetDescription;
  there: boolean;
}

// The fields before the time, and how their parts stand to one another.
interface Frame {
  dates: Dates;
  // Whether a date phrase carries its one month.
  fused: boolean;
  monthLeads: boolean;
  // Whether the month part ends in a month's name, which a year follows.
  monthNamed: boolean;
  months: Months;
  // Whether the day part is a date phrase on its own.
  phrase: boolean;
  // Whether a date and a weekday are said together.
  union: boolean;
  weekdays: Weekdays;
  years: number[];
}

const everyValue: SetDescription = {kind: 'all'};

// The days of the longest month, and of each month, February with 29.
const longest = 31;
const monthLengths = [0, longest, 29, longest, 30, longest, 30, longest,
  longest, 30, longest, 30, longest];

// The last date that every month of every year has.
const inEveryMonth = 28;

// The month that has its last day only in some years.
const february = 2;

// What a date says of its month where every month is meant, and where no
// month is said with it.
const everyMonthTail: MonthTail =
  {noun: words.ofEachMonth, ord: words.ofEachMonth, shortest: inEveryMonth};

// The most dates a list holds.
const heldDates = 7;

// The most years of a cadence that stops which are still listed.
const heldYears = 4;

const lastYear = domainOf('year').max;

// Monday and Friday, as cron numbers them.
const workWeek = [1, 5];

// A week from Monday (1) to Sunday (7), as German lists its days.
const week = {cyclic: true, max: 7, min: 1};

const monthCounting: Counting =
  {cadence: unsayable, listed: 0, removable: Infinity};

// An exception names the one day of the week that is missing.
const weekCounting: Counting = {...monthCounting, removable: 1};

const dateCounting: Counting = {
  cadence: longerThan(heldDates),
  listed: heldDates,
  removable: Infinity
};

// Years said together: a year on its own (a step of 0), a run (a step of
// 1), or a series in step.
interface YearTerm {
  count: number;
  first: number;
  last: number;
  step: number;
}

function ordinal(day: number): string {
  return `${day}.`;
}

function ascending(a: number, b: number): number {
  return a - b;
}

// A set in pieces as its single items: each run, and each value on its
// own.
function itemsOf(pieces: Described<'pieces'>): Piece[] {
  return pieces.parts.flatMap(function split(part) {
    const {values = []} = part as Partial<Described<'values'>>;

    return [
      ...[part].filter(function isRun() {
        return part.kind === 'range';
      }),
      ...values.map(function single(value): Piece {
        return {kind: 'values', values: [value]};
      })
    ];
  });
}

// Where an item stands among the others: in ascending order of its first
// value, a run that wraps round the cycle before the rest.
function standing(item: Piece): number {
  const {values = []} = item as Partial<Described<'values'>>;
  const {from = values[0], to = from} = item as Partial<Described<'range'>>;

  return from - lastYear * Number(from > to);
}

const itemNames = {
  range(run: Described<'range'>, naming: Naming): string {
    return named.range(run as never, naming);
  },
  // Single values after one another share what opens them.
  values(
    value: Described<'values'>,
    naming: Naming,
    before?: Piece
  ): string {
    return (before?.kind === 'values' ? '' : naming.one) +
      naming.name(value.values[0]);
  }
};

const named: {[kind: string]: (
  description: never, naming: Naming) => string} = {
  all(): string {
    return '';
  },
  except(exception: Described<'except'>, naming: Naming): string {
    return `${naming.whole}, ${naming.except} ${naming.one}` +
      `${list(exception.removed.map(naming.name))}`;
  },
  pieces(pieces: Described<'pieces'>, naming: Naming): string {
    const items = itemsOf(pieces).sort(function byStanding(a, b) {
      return standing(a) - standing(b);
    });

    return list(items.map(function nameOf(item, at) {
      return itemNames[item.kind](item as never, naming, items[at - 1]);
    }));
  },
  // A run of two values is the two values, in the order of the run.
  range(run: Described<'range'>, naming: Naming): string {
    const ends = [run.from, run.to].map(naming.name);

    return (run.to - run.from + naming.size) % naming.size > 1 ?
      `${naming.from}${ends[0]} ${words.to} ${ends[1]}` :
      naming.one + list(ends);
  },
  values(values: Described<'values'>, naming: Naming): string {
    return naming.one + list(values.values.map(naming.name));
  }
};

// A set of named values: a list, a run, pieces, or all but a few.
function names(description: SetDescription, naming: Naming): string {
  return named[description.kind](description as never, naming);
}

// The first three values of a series and its last.
function shown(cadence: SetDescription, top: number): string[] {
  const days = denote(cadence, {cyclic: false, max: top, min: 1});

  return [...days.slice(0, boundedCadence), ...days.slice(-1)].map(ordinal);
}

const dated: {[kind: string]: (
  description: never, tail: MonthTail, naming: Naming) => string} = {
  all() {
    return '';
  },
  // Every second day of the whole month has a name, and its gloss; any
  // other cadence is a series.
  cadence(cadence: Described<'cadence'>, tail, naming) {
    const [first, second, third, last] = shown(cadence, naming.size);
    const run = `${first}, ${second}, ${third} ${words.ellipsis}`;

    return cadence.interval === 2 && cadence.start <= 2 &&
      cadence.last + 2 > naming.size ?
      join([[words.onOddDays, words.onEvenDays][cadence.start - 1],
        tail.noun, `(${run} ${last})`]) :
      join([`${naming.one}${run} ${words.and} ${last}`, tail.ord]);
  },
  // Every day but a few names the month with the days taken away; a
  // cadence names it itself.
  except(exception: Described<'except'>, tail, naming) {
    const {base, removed} = exception;

    return base.kind === 'all' ?
      plainDates(exception as never, tail, naming) :
      `${dateText(base, tail, naming)}, ${naming.except} ${naming.one}` +
        `${list(removed.map(naming.name))}`;
  }
};

function plainDates(
  description: never,
  tail: MonthTail,
  naming: Naming
): string {
  return join([names(description, naming), tail.ord]);
}

// The days of the month a set of dates names, with their month.
function dateText(
  description: SetDescription,
  tail: MonthTail,
  naming: Naming
): string {
  return (dated[description.kind] || plainDates)(
    description as never, tail, naming);
}

// «Werktag (Montag bis Freitag)»: the brackets say that Saturday is not
// meant.
function workday(voice: Voice): string {
  const [monday, friday] = workWeek.map(voice.weekdayNoun);

  return `${words.workday} (${monday} ${words.to} ${friday})`;
}

const quartzDates: {
  [Kind in QuartzDate['kind']]: (
    form: Extract<QuartzDate, {kind: Kind}>,
    tail: MonthTail,
    voice: Voice
  ) => string
} = {
  // The day counted from the end has a word up to the tenth-last, and
  // the count of days stands in a gloss; beyond that only the count.
  beforeLast(form, tail) {
    const word = fromLastWords[form.days - 2];
    const count = `${form.days} ${units.day.many}`;

    if (form.days === 1) {
      return join([words.penultimateDay, tail.noun]);
    }

    return word ?
      join([`${words.on} ${word} ${words.day}`, tail.noun,
        `(${count} ${words.beforeLast})`]) :
      join([`${count} ${words.beforeLastDay}`, tail.noun]);
  },
  firstWeekday(_form, tail, voice) {
    return join([`${words.onTheFirst} ${workday(voice)}`, tail.noun]);
  },
  last(_form, tail) {
    return join([words.lastDay, tail.noun]);
  },
  lastWeekday(_form, tail, voice) {
    return join([`${words.onTheLast} ${workday(voice)}`, tail.noun]);
  },
  // A date that can be the last of its month keeps the weekday inside
  // the month, and one that some of the months lack says which months
  // have it.
  nearestWeekday(form, tail, voice) {
    const {day} = form;
    const lacking = day > tail.shortest;

    return join([
      lacking && words.inMonthsWith,
      lacking && day < longest && words.atLeast,
      lacking && `${day} ${words.withDays}`,
      `${words.on} ${workday(voice)},`,
      `${words.whichThe} ${ordinal(day)}`,
      !lacking && tail.ord,
      day >= inEveryMonth && words.inSameMonth,
      words.nearest
    ]);
  }
};

function quartzWeekday(
  form: QuartzWeekday,
  tail: MonthTail,
  voice: Voice
): string {
  const {nth = 0} = form as {nth?: number};
  const which = [words.onTheLast, ...nthWords.map(function dative(word) {
    return `${words.on} ${word}`;
  })][nth];

  return join([`${which} ${voice.weekdayNoun(form.weekday)}`, tail.noun]);
}

// The years that follow a year at one spacing, as far as none is missing.
function reach(first: number, step: number, left: Set<number>): YearTerm {
  let last = first;

  while (left.has(last + step)) {
    last += step;
  }

  return {count: (last - first) / step + 1, first, last, step};
}

// Whether years in step are said as a series: more of them not yet said
// than a list holds, or as many where they never stop.
function inSeries(term: YearTerm, left: Set<number>): boolean {
  let unsaid = 0;

  for (let year = term.first; year <= term.last; year += term.step) {
    unsaid += Number(left.has(year));
  }

  return unsaid > heldYears - Number(term.last + term.step > lastYear);
}

// The stretches of three or more years in a row among the years not yet
// said, each handed to `take`.
function runsAmong(
  years: number[],
  left: Set<number>,
  take: (term: YearTerm) => void
): void {
  years.filter(function unsaid(first) {
    return left.has(first) && left.has(first + 2);
  }).forEach(function open(first) {
    const run = reach(first, 1, left);

    if (left.has(first) && run.count > 2) {
      take(run);
    }
  });
}

// The series among the years: each year not yet said opens one at the
// closest spacing at which the years in step from it make a series. A
// year already said may be a step on the way.
function seriesAmong(
  years: number[],
  left: Set<number>,
  take: (term: YearTerm) => void
): void {
  const all = new Set(years);

  years.forEach(function open(first, at) {
    const next = left.has(first) && years.slice(at + 1).find(
      function opens(year) {
        return year > first + 1 &&
          inSeries(reach(first, year - first, all), left);
      });

    if (next) {
      take(reach(first, next - first, all));
    }
  });
}

// Years taken apart into runs, series and the years left alone, in the
// order of their first years. The runs are found first, or the series.
function yearTerms(years: number[], runsFirst: boolean): YearTerm[] {
  const left = new Set(years);
  const terms: YearTerm[] = [];
  const passes = [runsAmong, seriesAmong];

  function take(term: YearTerm): void {
    terms.push(term);

    for (let year = term.first; year <= term.last; year += term.step || 1) {
      left.delete(year);
    }
  }

  passes[Number(!runsFirst)](years, left, take);
  passes[Number(runsFirst)](years, left, take);
  years.forEach(function alone(first) {
    if (left.has(first)) {
      take({count: 1, first, last: first, step: 0});
    }
  });

  return terms.sort(function byFirst(a, b) {
    return a.first - b.first;
  });
}

// A series of years: three of them and «usw.», and its end if it has one.
function yearSeries(term: YearTerm): string {
  const opening = [0, 1, 2].map(function at(place) {
    return term.first + place * term.step;
  }).join(', ');

  return join([opening, words.andSoOn, term.last + term.step <= lastYear &&
    `${words.to} ${term.last}`]);
}

// A year on its own, and a run by its ends; a run that reaches the last
// year a pattern can name has only a start.
function yearNamed(term: YearTerm): string {
  const run = term.last < lastYear ?
    `${term.first} ${words.to} ${term.last}` :
    `${words.since} ${term.first}`;

  return [String(term.first), run][term.step];
}

// Every second year, when the years are nothing else: even or odd years,
// from their start unless that is the first such year, to their end if
// they have one.
function alternateYears(term: YearTerm): string {
  const open = term.last + 2 > lastYear;
  const first = domainOf('year').min + 1;

  return join([[words.inEvenYears, words.inOddYears][term.first % 2],
    open && term.first > first && `${words.since} ${term.first}`,
    !open && `${words.from} ${term.first} ${words.to} ${term.last}`]);
}

// The years of a schedule that names more than every year, where no
// month's name carries the one year.
function yearPart(years: number[]): string {
  const [whole] = [reach(years[0], 2, new Set(years))].filter(
    function isAll(term) {
      return term.count === years.length && term.count >= heldYears;
    });
  const said: string[][] = [[]];

  if (years.length === 1) {
    return `${words.inYear} ${years[0]}`;
  }

  if (whole) {
    return alternateYears(whole);
  }

  // Runs first, unless finding the series first leaves fewer parts.
  const [byRuns, bySeries] = [true, false].map(function apart(runsFirst) {
    return yearTerms(years, runsFirst);
  });
  const terms = bySeries.length < byRuns.length ? bySeries : byRuns;

  // Years and runs side by side are one list; a series stands apart.
  terms.forEach(function place(term) {
    if (term.step > 1) {
      said.push([yearSeries(term)], []);
    }
    else {
      said[said.length - 1].push(yearNamed(term));
    }
  });

  return `${words.inYears} ${said.map(list).filter(Boolean)
    .join(` ${words.also} `)}`;
}

// The months, and how long the longest of them is.
function monthsOf(schedule: Schedule, everyYear: boolean): Months {
  const values = denote(
    (schedule.analyses.candidates.month as SetDescription[])[0],
    domainOf('month'));

  return {
    every: values.length === monthLengths.length - 1,
    least: Math.min(...values.map(function leastOf(month) {
      return monthLengths[month] - Number(month === february);
    })),
    length: Math.max(...values.map(function lengthOf(month) {
      return monthLengths[month];
    })),
    one: values.length === 1,
    // They wrap round the end of the year only where no year is named.
    said: settle(values, {cyclic: everyYear, max: 12, min: 1},
      monthCounting),
    values
  };
}

// The dates the named months have, described afresh. Dates that cover
// the whole of those months leave the weekdays nothing to add.
function datesOf(
  schedule: Schedule,
  length: number,
  counting: Counting
): Dates {
  const {candidates, day} = schedule.analyses;
  const {form} = {...day.date} as {form?: QuartzDate};
  const [written] = candidates.date || [everyValue];
  const values = denote(written, domainOf('date'));
  const fitting = values.filter(function fits(date) {
    return date <= length;
  });
  const [held, top] = fitting.length > 0 ?
    [fitting, length] :
    [values, longest];
  const said = settleUnwrapped(held, {cyclic: false, max: top, min: 1},
    counting);
  const there = Boolean(form) || said.kind !== 'all';

  return {form, said, there, top, whole: !there && written.kind !== 'all'};
}

// The weekdays, counted from Monday.
function weekdaysOf(schedule: Schedule, dates: Dates): Weekdays {
  const {candidates, day} = schedule.analyses;
  const {form} = {...day.weekday} as {form?: QuartzWeekday};
  const [written] = candidates.weekday || [everyValue];
  const values = denote(written, domainOf('weekday'))
    .map(function fromMonday(weekday) {
      return (weekday + week.max - 1) % week.max + 1;
    }).sort(ascending);
  const said = settle(values, week, weekCounting);

  return {
    form,
    said,
    there: !dates.whole && (Boolean(form) || said.kind !== 'all')
  };
}

// Whether dates are every day but a few.
function dailyBut(dates: SetDescription): boolean {
  return dates.kind === 'except' && dates.base.kind === 'all';
}

// What is said of the days, and what fuses: a date phrase with its one
// month, and one year with a month's name.
function frameOf(schedule: Schedule): Frame {
  const [written] = schedule.analyses.candidates.year as SetDescription[];
  const years = [written].filter(function narrowed(description) {
    return description.kind !== 'all';
  }).flatMap(function valuesOf(description) {
    return denote(description, domainOf('year'));
  });
  const months = monthsOf(schedule, years.length === 0);
  const alone = datesOf(schedule, months.length, dateCounting);
  const weekdays = weekdaysOf(schedule, alone);
  const union = alone.there && weekdays.there;
  // Beside weekdays, every day but a few is said as its stretches: after
  // «und zusätzlich täglich» an exception would reach the weekdays too.
  const dates = union ?
    datesOf(schedule, months.length, {...dateCounting, removable: 0}) :
    alone;
  // Every day but a few is no date phrase: «täglich, außer am 15.».
  const phrase = !union && (dates.there && !dailyBut(dates.said) ||
    Boolean(weekdays.form));
  const fused = phrase && months.one;
  const monthLeads = !months.every && !fused;

  return {
    dates,
    fused,
    monthLeads,
    monthNamed: monthLeads && months.said.kind !== 'except',
    months,
    phrase,
    union,
    weekdays,
    years
  };
}

// The one year, where a month's name carries it.
function yearAfter(frame: Frame, carried: boolean): string {
  return frame.years.slice(0, Number(frame.years.length === 1 && carried))
    .map(function say(year) {
      return ` ${year}`;
    }).join('');
}

// What a date says of its month. Every month is «jedes Monats». One
// month is named after a date that is fused with it, and after the date
// beside a weekday, where several months are «dieser Monate». A month
// that leads is not said again.
function tailOf(frame: Frame, again: boolean, voice: Voice): MonthTail {
  const {fused, months} = frame;
  const name = voice.month(months.values[0]) + yearAfter(frame, fused);
  const own = {noun: `${words.in} ${name}`, ord: name, shortest: longest};
  const these =
    {noun: words.ofTheseMonths, ord: words.ofTheseMonths, shortest: longest};

  return months.every && everyMonthTail ||
    (again || fused) && months.one && own ||
    again && these ||
    {noun: '', ord: '', shortest: months.least};
}

// The day part without its joins: the dates, the weekdays, or the
// weekdays and in addition the dates.
function daysSaid(frame: Frame, naming: Naming, voice: Voice): string {
  const {dates, union, weekdays} = frame;
  const dateTail = tailOf(frame, union, voice);
  const dateSide = dates.form ?
    quartzDates[dates.form.kind](dates.form as never, dateTail, voice) :
    dateText(dates.said, dateTail, {...naming, size: dates.top});
  const weekNames = weekdays.form ?
    quartzWeekday(weekdays.form, tailOf(frame, false, voice), voice) :
    names(weekdays.said, {...naming, from: '', name(weekday) {
      return voice.weekday(weekday % week.max);
    }, one: '', size: week.max});

  return join([
    weekdays.there && weekNames +
      (union && weekdays.said.kind === 'except' ? ',' : ''),
    union && words.additionally,
    dateSide
  ]);
}

// Where «jeweils» is due: before a month part or a date fused with its
// month after several years, and before a date phrase after several
// months; once, at the first place. Pieces of dates that hold a run take
// it before a clock time instead.
function sharing(frame: Frame, time: TimeSaid) {
  const {dates, fused, monthLeads, months, phrase, union, years} = frame;
  const several = years.length > 1;
  const month = several && monthLeads && !union;

  return {
    day: phrase && !month &&
      (several && fused || !months.every && !months.one),
    month,
    pieces: !union && dates.said.kind === 'pieces' && time.clock
  };
}

// Whether a comma closes the day part: after a date and a weekday
// together, an exception, a relative clause, and pieces of dates whose
// «jeweils» has moved to the time.
function closes(frame: Frame, moved: boolean): boolean {
  const {dates, union, weekdays} = frame;

  return union || moved || dates.said.kind === 'except' ||
    weekdays.there && weekdays.said.kind === 'except' ||
    dates.form?.kind === 'nearestWeekday';
}

function monthPart(frame: Frame, naming: Naming, voice: Voice): string {
  const {monthLeads, monthNamed, months} = frame;

  return join([monthLeads && names(months.said, {...naming,
    from: `${words.from} `, name: voice.month, one: `${words.in} `,
    size: 12, whole: words.inAllMonths}) + yearAfter(frame, monthNamed)]) +
    (monthLeads && months.said.kind === 'except' ? ',' : '');
}

// The day part with its joins. «Täglich» fills the level a restricted
// hour would skip, and follows a single run of dates, which a bare time
// would seem to end.
function dayPart(frame: Frame, time: TimeSaid, naming: Naming, voice: Voice) {
  const {dates, union} = frame;
  const due = sharing(frame, time);
  const said = daysSaid(frame, naming, voice);
  const filler = time.daily &&
    (said === '' || !union && dates.said.kind === 'range') && words.daily;

  return join([due.day && !due.pieces && words.eachTime, said, filler]) +
    (closes(frame, due.pieces && (due.month || due.day)) ? ',' : '');
}

/** The year, the month and the day of a schedule, as it will be said. */
function calendar(
  schedule: Schedule,
  time: TimeSaid,
  voice: Voice
): CalendarSaid {
  const frame = frameOf(schedule);
  const {fused, monthNamed, union, years} = frame;
  const naming: Naming = {
    except: voice.except,
    from: `${words.fromDate} `,
    name: ordinal,
    one: `${words.on} `,
    size: longest,
    whole: words.daily
  };
  const due = sharing(frame, time);
  const day = dayPart(frame, time, naming, voice);
  const month = join([due.month && !due.pieces && words.eachTime,
    monthPart(frame, naming, voice)]);
  const year = years.length === 0 || yearAfter(frame, fused || monthNamed) ?
    '' :
    yearPart(years);
  const shared = union || due.pieces ||
    time.offset && year + month + day !== '';

  return {day, lead: shared ? `${words.eachTime} ` : '', month, year};
}

export {calendar};
