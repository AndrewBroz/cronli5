// The parts before the time: the year, the month and the day, coarsest
// first, with the fusions a German date makes and the joins between them.

import {
  denote, describeCadencePieces, describeSet
} from '../../core/describe-set.js';
import type {
  CadencePieces, DateReach, QuartzDate, QuartzWeekday, Schedule,
  SetDescription
} from '../../core/schedule.js';
import {candidatesAs} from '../../core/set-views.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {Counting, Described, Piece, Sayable} from './sets.js';
import {
  boundedCadence, join, list, longerThan, restOf, settle, settleUnwrapped,
  sizeOf, unsayable
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
  // Whether the schedule never runs, and so has no time to say.
  never: boolean;
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
  // Where a value stands in the cycle as its readers walk it.
  place(value: number): number;
  size: number;
  // Every value of the field, as the base of an exception.
  whole: string;
}

// The words of the fields that are named.
interface Namings {
  date: Naming;
  month: Naming;
}

// What a date phrase says besides its days: its month, after an ordinal
// number («am 1. Juni») and after a noun («am letzten Tag im Juni»).
interface DateTail {
  // Whether the days are every second day of the whole month.
  alternate: boolean;
  // Whether the phrase stands beside weekdays, as their addition.
  beside: boolean;
  // The dates taken away inside a gloss, where there are any.
  less: string;
  noun: string;
  ord: string;
}

// The months of a schedule.
interface Months {
  every: boolean;
  // The months the date arm fires in, and how they are said.
  firing: number[];
  firingSaid: Sayable;
  said: Sayable;
  // The months the month part names.
  values: number[];
}

// The days of the month a schedule names: a Quartz form or a set.
interface Dates {
  alternate: boolean;
  form?: QuartzDate;
  said: Sayable;
  there: boolean;
}

interface Weekdays {
  form?: QuartzWeekday;
  said: Sayable;
  there: boolean;
}

interface Years {
  // The one year, where the schedule names just one.
  one: number[];
  said: Sayable;
  several: boolean;
}

// Which of the two day fields have something to say.
interface DayArms {
  dated: boolean;
  // Whether no day the schedule names exists.
  never: boolean;
  // Whether a date and a weekday are said together.
  union: boolean;
  weekly: boolean;
}

// The fields before the time, and how their parts stand to one another.
interface Frame extends DayArms {
  dates: Dates;
  // Whether a date phrase carries its one month.
  fused: boolean;
  monthLeads: boolean;
  // Whether the month part ends in a month's name, which a year follows.
  monthNamed: boolean;
  months: Months;
  // Whether the day part is a date phrase on its own.
  phrase: boolean;
  reach: DateReach | null;
  weekdays: Weekdays;
  years: Years;
}

const everyValue: SetDescription = {kind: 'all'};

const dateDomain = domainOf('date');
const monthDomain = domainOf('month');
const yearDomain = domainOf('year');

// The last date at which the nearest weekday could lie in the next month,
// if the form did not keep it in its own.
const inEveryMonth = 28;

// The most dates a list holds.
const heldDates = 7;

// The most years of a cadence that stops which are still listed.
const heldYears = 4;

// Monday and Friday, as cron numbers them.
const workWeek = [1, 5];

function asItIs(value: number): number {
  return value;
}

const monthCounting: Counting =
  {cadence: unsayable, listed: 0, removable: Infinity};

// An exception names the one day of the week that is missing, and the
// week is walked from Monday.
const weekCounting: Counting = {
  ...monthCounting,
  place(weekday) {
    return (weekday + 6) % 7;
  },
  removable: 1
};

const dateCounting: Counting = {
  cadence: longerThan(heldDates),
  listed: heldDates,
  removable: Infinity
};

// Years in step are a word or a series where they never stop or are too
// many to list; every second year has a word, which replaces one year
// fewer than a series does.
const yearCounting: Counting = {
  cadence(cadence, count) {
    return cadence.open ||
      count > heldYears - Number(cadence.interval === 2) ?
      boundedCadence :
      Infinity;
  },
  listed: 0,
  removable: Infinity
};

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
function standing(item: Piece, place: Naming['place']): number {
  const {values = []} = item as Partial<Described<'values'>>;
  const {from = values[0], to = from} = item as Partial<Described<'range'>>;

  return place(from) - yearDomain.max * Number(place(from) > place(to));
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
      return standing(a, naming.place) - standing(b, naming.place);
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
function names(description: Sayable, naming: Naming): string {
  return named[description.kind](description as never, naming);
}

// A series of dates: the first three and the last, or all of a few.
function series(cadence: Described<'cadence'>, naming: Naming): string {
  const days = denote(cadence, dateDomain).map(ordinal);

  return days.length > boundedCadence + 1 ?
    `${naming.one}${days.slice(0, boundedCadence).join(', ')} ` +
      `${words.ellipsis} ${words.and} ${days[days.length - 1]}` :
    naming.one + list(days);
}

const datesSaid: {[kind: string]: (
  description: never, tail: DateTail, naming: Naming) => string} = {
  all() {
    return '';
  },
  // Every second day of the whole month has a name, and its gloss; any
  // other cadence is a series.
  cadence(cadence: Described<'cadence'>, tail, naming) {
    const days = denote(cadence, dateDomain).map(ordinal);
    const gloss = `(${days.slice(0, boundedCadence).join(', ')} ` +
      `${words.ellipsis} ${days[days.length - 1]}${tail.less})`;

    return tail.alternate ?
      join([[words.onOddDays, words.onEvenDays][cadence.start - 1],
        tail.noun, gloss]) :
      join([series(cadence, naming), tail.ord]);
  },
  // Runs and series side by side, each with what opens it.
  cadencePieces(pieces: CadencePieces, tail, naming) {
    return join([pieces.parts.map(function say(part) {
      return part.kind === 'cadence' ?
        series(part, naming) :
        names(part, naming);
    }).join(` ${words.also} `), tail.ord]);
  },
  // Every day but a few names the month with the days taken away; a
  // cadence names it itself. Beside weekdays the days taken away stand
  // inside the gloss, where they cannot reach the weekdays.
  except(exception: Described<'except'>, tail, naming) {
    const {base, removed} = exception;
    const gone = list(removed.map(naming.name));

    if (base.kind === 'all') {
      return plainDates(exception as never, tail, naming);
    }

    return tail.beside ?
      dateText(base, {...tail, less: `, ${words.without} ${gone}`}, naming) :
      `${dateText(base, tail, naming)}, ${naming.except} ${naming.one}${gone}`;
  }
};

function plainDates(
  description: never,
  tail: DateTail,
  naming: Naming
): string {
  return join([names(description, naming), tail.ord]);
}

// The days of the month a set of dates names, with their month.
function dateText(
  description: Sayable,
  tail: DateTail,
  naming: Naming
): string {
  return (datesSaid[description.kind] || plainDates)(
    description as never, tail, naming);
}

// «Wochentag (Montag bis Freitag)»: the brackets say which days are
// meant, and the word says nothing of public holidays.
function workday(voice: Voice): string {
  const [monday, friday] = workWeek.map(voice.weekdayNoun);

  return `${words.workday} (${monday} ${words.to} ${friday})`;
}

const quartzDates: {
  [Kind in QuartzDate['kind']]: (
    form: Extract<QuartzDate, {kind: Kind}>,
    tail: DateTail,
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
  // the month.
  nearestWeekday(form, tail, voice) {
    return join([
      `${words.on} ${workday(voice)},`,
      `${words.whichThe} ${ordinal(form.day)}`,
      tail.ord,
      form.day >= inEveryMonth && words.inSameMonth,
      words.nearest
    ]);
  }
};

function quartzWeekday(
  form: QuartzWeekday,
  tail: DateTail,
  voice: Voice
): string {
  const {nth = 0} = form as {nth?: number};
  const which = [words.onTheLast, ...nthWords.map(function dative(word) {
    return `${words.on} ${word}`;
  })][nth];

  return join([`${which} ${voice.weekdayNoun(form.weekday)}`, tail.noun]);
}

// Whether years in step are said as a series: they never stop, or are
// more than a list holds.
function inSeries(cadence: Described<'cadence'>): boolean {
  return cadence.open === true ||
    (cadence.last - cadence.start) / cadence.interval >= heldYears;
}

// A series of years: three of them and «usw.», and its end if it has one.
function yearSeries(cadence: Described<'cadence'>): string {
  const opening = [0, 1, 2].map(function at(place) {
    return cadence.start + place * cadence.interval;
  }).join(', ');

  return join([opening, words.andSoOn,
    !cadence.open && `${words.to} ${cadence.last}`]);
}

// A run of years by its ends; one that has no end, by its start.
function yearRun(run: Described<'range'>): string {
  return run.open ?
    `${words.since} ${run.from}` :
    `${run.from} ${words.to} ${run.to}`;
}

// Years in step: every second year has a word, said from its start
// unless that is the first such year, to its end if it has one; any
// other step is a series.
function yearsInStep(cadence: Described<'cadence'>): string {
  const late = cadence.start - yearDomain.min >= cadence.interval;

  return cadence.interval === 2 ?
    join([[words.inEvenYears, words.inOddYears][cadence.start % 2],
      cadence.open === true && late && `${words.since} ${cadence.start}`,
      !cadence.open &&
        `${words.from} ${cadence.start} ${words.to} ${cadence.last}`]) :
    `${words.inYears} ${yearSeries(cadence)}`;
}

const yearSaid: {[kind: string]: (
  description: never, except: string) => string} = {
  cadence: yearsInStep,
  // Years and runs side by side are one list; a series stands apart.
  cadencePieces(pieces: CadencePieces) {
    const said: string[][] = [[]];

    pieces.parts.forEach(function place(part) {
      if (part.kind === 'cadence' && inSeries(part)) {
        said.push([yearSeries(part)], []);
      }
      else {
        said[said.length - 1].push(...part.kind === 'range' ?
          [yearRun(part)] :
          denote(part, yearDomain).map(String));
      }
    });

    return `${words.inYears} ${said.map(list).filter(Boolean)
      .join(` ${words.also} `)}`;
  },
  except(exception: Described<'except'>, except) {
    const {base, removed} = exception;

    return `${base.kind === 'all' ?
      words.inAllYears :
      yearsInStep(base as never)}, ${except} ${list(removed.map(String))},`;
  },
  pieces(pieces: Described<'pieces'>) {
    const items = itemsOf(pieces).sort(function byFirst(a, b) {
      return standing(a, asItIs) - standing(b, asItIs);
    });

    return `${words.inYears} ${list(items.map(function say(item) {
      return item.kind === 'range' ? yearRun(item) : String(item.values[0]);
    }))}`;
  },
  range(run: Described<'range'>) {
    return join([!run.open && words.inYears, yearRun(run)]);
  },
  values(years: Described<'values'>) {
    return [words.inYear, words.inYears][Number(years.values.length > 1)] +
      ` ${list(years.values.map(String))}`;
  }
};

// The years, as the core's candidates and its runs and cadences together
// offer them.
function yearsOf(schedule: Schedule): Years {
  const {cadencePieces, candidates} = schedule.analyses;
  const offered = candidates.year as SetDescription[];
  const said = settle(offered, yearCounting,
    [cadencePieces.year].filter(Boolean) as Sayable[]);
  const one = [offered[offered.length - 1]].flatMap(function lone(last) {
    return sizeOf(offered) === 1 ? (last as Described<'values'>).values : [];
  });

  return {one, said, several: said.kind !== 'all' && one.length === 0};
}

// The months as a list, a run, pieces or all but a few. They wrap round
// the end of the year only where no year is named.
function monthsSaid(values: number[], linear: boolean): Sayable {
  return settle(describeSet(values, monthDomain, {linear}), monthCounting);
}

// The months: those the pattern reaches, and of them those the date arm
// fires in. Beside weekdays the month part names every month reached;
// otherwise only those in which the schedule runs.
function monthsOf(schedule: Schedule, linear: boolean, union: boolean): Months {
  const {candidates, dateReach: reach} = schedule.analyses;
  const offered = candidates.month as SetDescription[];
  const reached = denote(offered[offered.length - 1], monthDomain);
  const firing = reach?.fires ?
    [...reach.everyYear, ...reach.leapYears].sort(ascending) :
    reached;
  const values = union ? reached : firing;

  return {
    every: offered[0].kind === 'all',
    firing,
    firingSaid: monthsSaid(firing, linear),
    said: monthsSaid(values, linear),
    values
  };
}

// Whether a set is every second day of the whole month.
function isAlternate(description: Sayable): boolean {
  const {interval, last = 0, start = 0} =
    description as Partial<Described<'cadence'>>;

  return interval === 2 && start <= 2 && last + 2 > dateDomain.max;
}

// The dates the reached months have. Beside weekdays an exception is said
// only inside the gloss of every second day; and every day but a few is
// said only of every month, since the core does not say which of the days
// taken away the named months have.
function datesOf(schedule: Schedule, there: boolean, frame: {
  everyMonth: boolean;
  union: boolean;
}): Dates {
  const {candidates, dateReach: reach, day} = schedule.analyses;
  const {form} = {...day.date} as {form?: QuartzDate};
  const written = candidates.date || [everyValue];
  const clipped = reach?.days?.candidates || [];
  const round = clipped.length > 0 ? clipped : written;
  const values = denote(round[round.length - 1], dateDomain);
  // Every second day of the whole month is what the pattern writes; the
  // months may have cut its last days off.
  const cut = clipped.length > 0 && isAlternate(restOf(written[0]).base);

  function alternate(description: Sayable): boolean {
    return isAlternate(description) || cut && description.kind === 'cadence';
  }

  const linear = describeSet(values, dateDomain, {linear: true}).filter(
    function sayable(description) {
      const {base = everyValue} = description as Partial<Described<'except'>>;

      return description.kind !== 'except' ||
        (frame.union ? alternate(base) :
          base.kind !== 'all' || frame.everyMonth);
    });
  const others = [describeCadencePieces(values, dateDomain)]
    .filter(Boolean) as Sayable[];
  const said = there && !form ?
    settleUnwrapped(round, linear, dateCounting, others) :
    everyValue;

  return {alternate: alternate(restOf(said).base), form, said, there};
}

// The weekdays, in a week that starts on Monday.
function weekdaysOf(schedule: Schedule, there: boolean): Weekdays {
  const {form} = {...schedule.analyses.day.weekday} as
    {form?: QuartzWeekday};
  const offered = candidatesAs(schedule, 'weekday', {first: 1});

  return {
    form,
    said: there && offered ? settle(offered, weekCounting) : everyValue,
    there
  };
}

// Whether dates are every day but a few.
function dailyBut(dates: Sayable): boolean {
  return dates.kind === 'except' && dates.base.kind === 'all';
}

// What is said of the days, and what fuses: a date phrase with its one
// month, and one year with a month's name.
// Which day fields speak. Dates that are every day the reached months
// have restrict nothing, and a date no reached month has leaves the
// weekdays, or nothing.
function armsOf(schedule: Schedule): DayArms {
  const {dateReach: reach, day} = schedule.analyses;
  const whole = reach?.days?.everyDay === true;
  const fires = reach?.fires !== false;
  const dated = day.date !== null && fires && !whole;
  const weekly = day.weekday !== null && !whole;

  return {
    dated,
    never: day.date !== null && !fires && !weekly,
    union: dated && weekly,
    weekly
  };
}

function frameOf(schedule: Schedule): Frame {
  const arms = armsOf(schedule);
  const {dated, union, weekly} = arms;
  const years = yearsOf(schedule);
  const months = monthsOf(schedule, years.said.kind !== 'all', union);
  const dates = datesOf(schedule, dated, {everyMonth: months.every, union});
  const weekdays = weekdaysOf(schedule, weekly);
  // Every day but a few is no date phrase: «täglich, außer am 15.».
  const phrase = !union && (dated && !dailyBut(dates.said) ||
    Boolean(weekdays.form));
  const fused = phrase && !months.every && months.values.length === 1;
  const monthLeads = !months.every && !fused;

  return {
    ...arms,
    dates,
    fused,
    monthLeads,
    // A year follows one name, a list or a run of months; pieces and an
    // exception would take it for their last item alone.
    monthNamed: monthLeads && ['range', 'values'].includes(months.said.kind),
    months,
    phrase,
    reach: schedule.analyses.dateReach,
    weekdays,
    years
  };
}

// The one year, where a month's name carries it.
function yearAfter(frame: Frame, carried: boolean): string {
  return frame.years.one.filter(function due() {
    return carried;
  }).map(function say(year) {
    return ` ${year}`;
  }).join('');
}

// What a date says of its month. Every month is «jedes Monats». One
// month is named after a date that is fused with it, and after the date
// beside a weekday, where several months are «dieser Monate». A month
// that leads is not said again.
function tailOf(frame: Frame, again: boolean, voice: Voice): DateTail {
  const {dates, fused, months} = frame;
  const mine = again ? months.firing : months.values;
  const name = voice.month(mine[0]) + yearAfter(frame, fused);
  const bare = {alternate: dates.alternate, beside: again, less: '',
    noun: '', ord: ''};

  return months.every &&
      {...bare, noun: words.ofEachMonth, ord: words.ofEachMonth} ||
    (again || fused) && mine.length === 1 &&
      {...bare, noun: `${words.in} ${name}`, ord: name} ||
    again && mine.length === months.values.length &&
      {...bare, noun: words.ofTheseMonths, ord: words.ofTheseMonths} ||
    bare;
}

// What a date phrase says of leap years, where February has the day
// only in them.
function leapGloss(frame: Frame, voice: Voice): string {
  const {months, reach} = frame;
  const leap = months.every ? [] : [...reach?.leapYears || []];

  return leap.map(function say(month) {
    return `(${join([months.firing.length > 1 &&
      `${words.in} ${voice.month(month)}`, words.onlyLeapYears])})`;
  }).join('');
}

// Which months have a Quartz form that some months lack, where every
// month is meant: those with the day the form needs.
function monthsWith(frame: Frame): string {
  const {dates, months, reach} = frame;
  const {days = 0, day = days + 1} =
    {...dates.form} as {day?: number; days?: number};
  const lacking = Boolean(dates.form) && months.every && reach !== null;

  return join([
    lacking && words.inMonthsWith,
    lacking && day < dateDomain.max && words.atLeast,
    lacking && `${day} ${words.withDays}`
  ]);
}

// The date phrase: the days, with the months they fire in where those
// are fewer than the months said before, and what is true of leap years.
function dateSide(frame: Frame, namings: Namings, voice: Voice): string {
  const {dates, months, union} = frame;
  const tail = tailOf(frame, union, voice);
  const having = monthsWith(frame);
  const fewer = union && !months.every && months.firing.length > 1 &&
    months.firing.length < months.values.length;

  return join([
    fewer && names(months.firingSaid, namings.month),
    having,
    dates.form ?
      quartzDates[dates.form.kind](dates.form as never,
        having ? {...tail, noun: '', ord: ''} : tail, voice) :
      dateText(dates.said, tail, namings.date),
    leapGloss(frame, voice)
  ]);
}

// The day part without its joins: the dates, the weekdays, or the
// weekdays and in addition the dates.
function daysSaid(frame: Frame, namings: Namings, voice: Voice): string {
  const {dates, union, weekdays} = frame;
  const weekNames = weekdays.form ?
    quartzWeekday(weekdays.form, tailOf(frame, false, voice), voice) :
    names(weekdays.said, {...namings.date, from: '', name: voice.weekday,
      one: '', place: weekCounting.place as Naming['place'], size: 7});

  return join([
    weekdays.there && weekNames +
      (union && weekdays.said.kind === 'except' ? ',' : ''),
    union && words.additionally,
    dates.there && dateSide(frame, namings, voice)
  ]);
}

// Whether dates are said in parts of which one is a run.
function holdsRun(dates: Sayable): boolean {
  const {parts = []} = dates as Partial<CadencePieces>;

  return parts.some(function isRun(part) {
    return part.kind === 'range';
  });
}

// Where «jeweils» is due: before a month part or a date fused with its
// month after several years, and before a date phrase after several
// months; once, at the first place. Parts of dates that hold a run take
// it before a clock time instead.
function sharing(frame: Frame, time: TimeSaid) {
  const {dates, fused, monthLeads, months, phrase, union, years} = frame;
  const month = years.several && monthLeads && !union;

  return {
    day: phrase && !month &&
      (years.several && fused || !months.every && months.values.length > 1),
    month,
    pieces: !union && holdsRun(dates.said) && time.clock
  };
}

// Whether a comma closes the day part: after a date and a weekday
// together, an exception, a relative clause, and parts of dates whose
// «jeweils» has moved to the time.
function closes(frame: Frame, moved: boolean): boolean {
  const {dates, union, weekdays} = frame;

  return union || moved || dates.said.kind === 'except' ||
    weekdays.said.kind === 'except' ||
    dates.there && dates.form?.kind === 'nearestWeekday';
}

function monthPart(frame: Frame, namings: Namings): string {
  const {monthLeads, monthNamed, months} = frame;

  return join([monthLeads && names(months.said, namings.month) +
    yearAfter(frame, monthNamed)]) +
    (monthLeads && months.said.kind === 'except' ? ',' : '');
}

// The day part with its joins. «Täglich» fills the level a restricted
// hour would skip, and follows a single run of dates, which a bare time
// would seem to end.
function dayPart(
  frame: Frame,
  time: TimeSaid,
  namings: Namings,
  voice: Voice
): string {
  const {dates, union} = frame;
  const due = sharing(frame, time);
  const said = daysSaid(frame, namings, voice);
  const filler = time.daily &&
    (said === '' || !union && dates.said.kind === 'range') && words.daily;

  return join([due.day && !due.pieces && words.eachTime, said, filler]) +
    (closes(frame, due.pieces && (due.month || due.day)) ? ',' : '');
}

// The year part. One year that a month's name carries is not said here.
// Every year is silent, but for a date fused with its month, which has
// no other mark that it comes round again: «jährlich am 1. Juni». Where
// the date comes only in leap years the gloss says so instead.
function yearPart(frame: Frame, voice: Voice): string {
  const {fused, monthNamed, years} = frame;
  const yearly = fused && leapGloss(frame, voice) === '' && words.yearly;

  if (yearAfter(frame, fused || monthNamed)) {
    return '';
  }

  return years.said.kind === 'all' ?
    yearly || '' :
    yearSaid[years.said.kind](years.said as never, voice.except);
}

/** The year, the month and the day of a schedule, as it will be said. */
function calendar(
  schedule: Schedule,
  time: TimeSaid,
  voice: Voice
): CalendarSaid {
  const frame = frameOf(schedule);
  const base = {except: voice.except, place: asItIs};
  const namings: Namings = {
    date: {...base, from: `${words.fromDate} `, name: ordinal,
      one: `${words.on} `, size: dateDomain.max, whole: words.daily},
    month: {...base, from: `${words.from} `, name: voice.month,
      one: `${words.in} `, size: monthDomain.max, whole: words.inAllMonths}
  };
  const due = sharing(frame, time);
  const day = dayPart(frame, time, namings, voice);
  const month = join([due.month && !due.pieces && words.eachTime,
    monthPart(frame, namings)]);
  const year = yearPart(frame, voice);
  const shared = frame.union || due.pieces ||
    time.offset && year + month + day !== '';

  return frame.never ?
    {day: words.never, lead: '', month: '', never: true, year: ''} :
    {day, lead: shared ? `${words.eachTime} ` : '', month, never: false,
      year};
}

export {calendar};
