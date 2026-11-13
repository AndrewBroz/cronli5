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
}

// The months of a schedule.
interface Months {
  every: boolean;
  // The days of the longest of them.
  length: number;
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

// What a date says of its month where every month is meant, and where no
// month is said with it.
const everyMonthTail: MonthTail =
  {noun: words.ofEachMonth, ord: words.ofEachMonth};
const noTail: MonthTail = {noun: '', ord: ''};

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

// Years in step are said as even or odd years or as a series, and a short
// series that stops is its list. No exception is said of years.
const yearCounting: Counting = {
  cadence(cadence, count) {
    return cadence.interval === 2 || runsOn(cadence) || count > heldYears ?
      boundedCadence :
      Infinity;
  },
  listed: 0,
  removable: 0
};

// Whether a cadence of years has no end to name.
function runsOn(cadence: Described<'cadence'>): boolean {
  return cadence.last + cadence.interval > lastYear;
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
  // the month, and one that some months lack says which months have it.
  nearestWeekday(form, tail, voice) {
    const {day} = form;
    const lacking = day > inEveryMonth && tail === everyMonthTail;

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

const yearForms: {[kind: string]: (
  description: never, naming: Naming) => string} = {
  cadence(cadence: Described<'cadence'>) {
    const open = runsOn(cadence);
    const first = domainOf('year').min + 1;
    const series = denote(cadence, domainOf('year'))
      .slice(0, boundedCadence).join(', ');

    return cadence.interval === 2 ?
      join([[words.inEvenYears, words.inOddYears][cadence.start % 2],
        open && cadence.start > first && `${words.since} ${cadence.start}`,
        !open && `${words.from} ${cadence.start} ${words.to} ` +
          `${cadence.last}`]) :
      join([`${words.inYears} ${series} ${words.andSoOn}`,
        !open && `${words.to} ${cadence.last}`]);
  },
  plain(description, naming) {
    return `${words.inYears} ${names(description, naming)}`;
  }
};

// The years of a schedule that names more than every year, where no
// month's name carries the one year.
function yearPart(Y: number[], naming: Naming): string {
  const said = settle(Y, domainOf('year'), yearCounting);

  return Y.length === 1 ?
    `${words.inYear} ${Y[0]}` :
    (yearForms[said.kind] || yearForms.plain)(said as never, naming);
}

// The months, and how long the longest of them is.
function monthsOf(schedule: Schedule, everyYear: boolean): Months {
  const values = denote(
    (schedule.analyses.candidates.month as SetDescription[])[0],
    domainOf('month'));

  return {
    every: values.length === monthLengths.length - 1,
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
function datesOf(schedule: Schedule, length: number): Dates {
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
    dateCounting);
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
  const dates = datesOf(schedule, months.length);
  const weekdays = weekdaysOf(schedule, dates);
  const union = dates.there && weekdays.there;
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
  const own = {noun: `${words.in} ${name}`, ord: name};
  const these = {noun: words.ofTheseMonths, ord: words.ofTheseMonths};

  return months.every && everyMonthTail ||
    (again || fused) && months.one && own ||
    again && these ||
    noTail;
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
    yearPart(years, {...naming, from: '', name: String, one: ''});
  const shared = union || due.pieces ||
    time.offset && year + month + day !== '';

  return {day, lead: shared ? `${words.eachTime} ` : '', month, year};
}

export {calendar};
