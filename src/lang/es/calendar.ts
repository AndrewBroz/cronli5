// The calendar parts of the sentence: the leading frame (years and
// months that stand apart), the day, and the days of the month a union
// adds after the time (answers 2.1, 4.3 to 4.5, 5.7, 5.8).

import type {Part, Policy, Run, Said} from './sets.js';
import type {
  Analyses, QuartzDate, QuartzWeekday, Schedule, SetDescription
} from '../../core/schedule.js';
import type {Piece} from './wording.js';
import {
  byCount, led, list, norList, phrases, pick, spaced
} from './wording.js';
import {isValues, mapParts, say} from './sets.js';
import type {SpanishStyle} from './options.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';

const {units, words} = lexicon;

/** The calendar parts, before the joins of 2.1 are made. */
export interface Calendar {
  // The leading phrases, each of which a comma follows.
  frame: string[];
  day: string;
  // Whether a comma follows the day whatever the time begins with.
  dayClosed: boolean;
  // The days of the month a union adds after the time, or nothing.
  also: string;
  // Whether the schedule never fires: the day says so, and no time is
  // said.
  never: boolean;
}

// A phrase for the day of the month or the weekday. `suffix` is how it
// is tied to the months («de cada mes», «de junio»); `after` follows the
// months with no comma («o, si cae en sábado o domingo, …»); `inserted`
// are the phrases set off by commas after it; `closed` asks for a comma
// after it in any case.
interface DayPhrase {
  main: string;
  suffix: string;
  after: string;
  inserted: string[];
  closed: boolean;
}

// What a day phrase is built from.
interface DayFacts {
  said: Said;
  // A Quartz form's numbers: the days before the last, the day whose
  // nearest weekday is meant, the weekday and which one of the month.
  form: {days: number; day: number; nth: number; weekday: number};
  // How the phrase is tied to the months, for a phrase of numbered days
  // or weekdays and for one that names a single day of the month.
  suffix: string;
  // The length of the longest month the days are said of.
  length: number;
  // Whether a single day is written as a date: «el 1 de junio».
  dated: boolean;
  // Whether a set of weekdays may be said as an exception.
  alone: boolean;
  style: SpanishStyle;
}

// The most days each month can have; there is no month 0. The core says
// which days and months fire (`dateReach`), but not how long the months
// in reach are, and «todos los días de junio, excepto el día 15» and
// «los días impares de junio» are only true of a month of that length.
const MONTH_LENGTHS = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// A cadence of this many values or more names both its ends.
const LONG_CADENCE = 8;

// From this day of the month on, the day can be a month's last.
const SHORTEST_MONTH = 28;

const WEEK = 7;

// The weekdays a Quartz form moves between, counted from Monday.
const MONDAY = 0;
const FRIDAY = 4;
const SATURDAY = 5;
const SUNDAY = 6;

const NO_FORM = {day: 0, days: 0, nth: 0, weekday: 0};

// Which form of a name each style says.
const NAME_FORMS = {
  false: {name: 'full', plural: 'plural'},
  true: {name: 'short', plural: 'short'}
} as const;

function never(): boolean {
  return false;
}

// A field's values; every value of the field for a Quartz form, which is
// not a plain set.
function valuesOf(
  candidates: SetDescription[] | null,
  field: 'date' | 'month' | 'weekday' | 'year'
): number[] {
  return denote((candidates ?? [{kind: 'all'}])[0], domainOf(field));
}

function monthName(month: number, style: SpanishStyle): string {
  return lexicon.months[month][NAME_FORMS[`${style.short}`].name];
}

// A weekday counted from Monday, as the week is said (answers 3.3).
function weekdayName(
  day: number,
  form: 'name' | 'plural',
  style: SpanishStyle
): string {
  return lexicon.weekdays[(day + 1) % WEEK][NAME_FORMS[`${style.short}`][form]];
}

// «de junio a agosto», «de 2030 a 2035».
function fromTo(from: number | string, to: number | string): string {
  return `${words.from} ${from} ${words.to} ${to}`;
}

// «del 1 al 7».
function fromThe(from: number, to: number): string {
  return `${words.fromThe} ${from} ${words.toThe} ${to}`;
}

// «el día 15», «los días 1 y 15».
function numbered(days: number[]): string {
  return spaced([
    byCount([words.the, words.thePlural], days.length),
    byCount([units.day.one, units.day.many], days.length),
    list(days)
  ]);
}

// A cadence of years (answers 5.8): every second year is «pares» or
// «impares», with its start, or both ends when it stops; a longer cadence
// shows its first three years.
function yearCadence(
  cadence: {interval: number; start: number; last: number; endless: boolean}
): string {
  const {endless, interval, last, start} = cadence;
  const second = interval === 2;
  const parity = spaced([
    words.in, words.theYears, [words.theEven, words.theOdd][start % 2]
  ]);
  const shown = `${words.in} ` +
    [start, start + interval, start + 2 * interval].join(', ') +
    ` ${words.andSoOn}`;

  const unbegun = start - interval < domainOf('year').min;

  return pick([
    [parity, second && endless && unbegun],
    [`${parity} ${words.since} ${start}`, second && endless],
    [`${parity} ${words.until} ${last}`, second && unbegun],
    [`${parity} ${fromTo(start, last)}`, second],
    [shown, endless],
    [`${shown} ${words.until} ${last}`, true]
  ]);
}

// A run of years: «de 2030 a 2035»; one with no end, «desde 2030»; one
// from the first year there is, «hasta 2030».
function yearRun(run: Run): string {
  return pick([
    [yearCadence({...run, last: run.to, start: run.from}), run.interval > 1],
    [`${words.since} ${run.from}`, run.endless],
    [`${words.until} ${run.to}`, run.unbegun],
    [fromTo(run.from, run.to), true]
  ]);
}

const yearPhrasers = {
  all(said: Said): string {
    return pick([
      ['', said.removed.length === 0],
      [words.everyYear, true]
    ]);
  },
  cadence: yearCadence,
  parts(said: Said): string {
    return phrases(mapParts(said.parts, function run(from, to, part) {
      return yearRun(part);
    }, function named(values) {
      return `${words.in} ${list(values)}`;
    }));
  }
};

// The years with the years excepted from them: «en los años pares de
// 2000 a 2098, excepto en 2030».
function yearPhrase(years: Said): string {
  const excepted = years.removed.length > 0 ?
    `, ${words.except} ${words.in} ${list(years.removed)}` :
    '';

  return yearPhrasers[years.kind](years) + excepted;
}

// A series of years shows its first three, and none of them is excepted.
const yearPolicy: Policy = {
  cadence(cadence, count) {
    return cadence.interval === 2 || count >= LONG_CADENCE;
  },
  domain: domainOf('year'),
  edgeHoles: true,
  holeCost: 1,
  minRun: 3,
  mixes: true,
  pairWraps: false,
  shown: 3,
  wraps: false
};

// Months have no cadence and take no exception; they wrap only when the
// year is every year.
function monthPolicy(wraps: boolean): Policy {
  return {
    cadence: never,
    domain: domainOf('month'),
    edgeHoles: true,
    holeCost: 0,
    minRun: 3,
    mixes: false,
    pairWraps: false,
    shown: 1,
    wraps
  };
}

// Weekdays are counted from Monday; they may always wrap, and two days
// across the end of the week keep that order: «los domingos y lunes».
const weekdayPolicy: Policy = {
  cadence: never,
  domain: {cyclic: true, max: WEEK - 1, min: 0},
  edgeHoles: true,
  holeCost: 0,
  minRun: 3,
  mixes: false,
  pairWraps: true,
  shown: 1,
  wraps: true
};

// Whether every second day runs from the start of the month to its end.
function fullMonth(
  cadence: {interval: number; start: number; last: number},
  length: number
): boolean {
  return cadence.start - cadence.interval < 1 &&
    cadence.last + cadence.interval > length;
}

// Days of the month, in a month of the length given. Every second day is
// an idiom; any other cadence is one from eight days. They never wrap
// into the next month, and in a union they take no exception.
function datePolicy(length: number, excepts: boolean): Policy {
  return {
    cadence(cadence, count) {
      return cadence.interval === 2 && fullMonth(cadence, length) ||
        count >= LONG_CADENCE;
    },
    domain: {cyclic: true, max: length, min: 1},
    edgeHoles: true,
    holeCost: Number(excepts),
    minRun: 3,
    mixes: true,
    pairWraps: false,
    shown: 1,
    wraps: false
  };
}

function phrase(main: string, more: Partial<DayPhrase>): DayPhrase {
  return {
    after: '',
    closed: false,
    inserted: [],
    main,
    suffix: '',
    ...more
  };
}

// «o, si cae en sábado o domingo, » and the day the schedule moves to.
function orOffTheWeekend(landing: string, style: SpanishStyle): string {
  return `${words.orIfItFallsOn} ${weekdayName(SATURDAY, 'name', style)} ` +
    `${words.or} ${weekdayName(SUNDAY, 'name', style)}, ${landing}`;
}

// «el viernes», «el lunes».
function theDay(day: number, style: SpanishStyle): string {
  return `${words.the} ${weekdayName(day, 'name', style)}`;
}

// «el día 15»; written as a date, «el 15».
function theDate(day: number, dated: boolean): string {
  return pick([[`${words.the} ${day}`, dated], [numbered([day]), true]]);
}

// A cadence of days as what leads it and its two ends: «los días
// impares» and «del 1 al 15», «cada 3 días» and «del 1 al 31». Every
// second day of the whole month is «los días impares» alone.
function steppedDays(
  cadence: {interval: number; start: number; last: number},
  length: number
): Piece {
  const {interval, last, start} = cadence;
  const second = interval === 2;
  const parity = spaced([
    words.thePlural, units.day.many, [words.theEven, words.theOdd][start % 2]
  ]);
  const ends = fromThe(start, last);

  return pick([
    [{body: '', lead: parity}, second && fullMonth(cadence, length)],
    [{body: ends, lead: parity}, second],
    [{body: ends, lead: `${words.each} ${interval} ${units.day.many}`}, true]
  ]);
}

// The excepted days of the month, as an inserted phrase.
function exceptDays(removed: number[]): string[] {
  return removed.length > 0 ?
    [`${words.except} ${numbered(removed)}`] :
    [];
}

// The day-of-month phrase for each Quartz form (answers 5.7) and for each
// way a plain set of days is said.
const datePhrasers = {
  // «todos los días de cada mes, excepto el día 15».
  all(facts: DayFacts): DayPhrase {
    return phrase(words.everyDay, {
      inserted: exceptDays(facts.said.removed),
      suffix: facts.suffix
    });
  },
  // «3 días antes del último día de cada mes», closed by a comma; one
  // and two days before have names of their own.
  beforeLast(facts: DayFacts): DayPhrase {
    const {days} = facts.form;
    const names = ['', words.penultimateDay, words.antepenultimateDay];

    return pick([
      [phrase(`${words.the} ${names[days]}`, {suffix: facts.suffix}),
        days < names.length],
      [phrase(
        `${days} ${units.day.many} ${words.before} ${words.lastDay}`,
        {closed: true, suffix: facts.suffix}), true]
    ]);
  },
  // «los días impares», «los días pares del 8 al 30», «cada 3 días del 1
  // al 31».
  cadence(facts: DayFacts): DayPhrase {
    const said = steppedDays(facts.said, facts.length);

    return phrase(spaced([said.lead, said.body]), {
      inserted: exceptDays(facts.said.removed),
      suffix: facts.suffix
    });
  },
  // The first day from Monday to Friday: the 1st, or the Monday after a
  // 1st that falls on the weekend.
  firstWeekday(facts: DayFacts): DayPhrase {
    const {style} = facts;

    return phrase(theDate(1, facts.dated), {
      after: orOffTheWeekend(
        `${theDay(MONDAY, style)} ${words.following}`, style),
      closed: true,
      suffix: facts.suffix
    });
  },
  last(facts: DayFacts): DayPhrase {
    return phrase(`${words.the} ${words.lastDay}`, {suffix: facts.suffix});
  },
  // The last day from Monday to Friday: the last day, or the Friday
  // before one that falls on the weekend.
  lastWeekday(facts: DayFacts): DayPhrase {
    const {style} = facts;

    return phrase(`${words.the} ${words.lastDay}`, {
      after: orOffTheWeekend(
        `${theDay(FRIDAY, style)} ${words.previous}`, style),
      closed: true,
      suffix: facts.suffix
    });
  },
  // The day from Monday to Friday nearest a date: the date, or the Friday
  // or Monday nearest one that falls on the weekend. From day 28 the date
  // can be a month's last, and the search is said to stay in the month.
  nearestWeekday(facts: DayFacts): DayPhrase {
    const {style} = facts;
    const {day} = facts.form;
    const landing = spaced([
      theDay(FRIDAY, style), words.or, theDay(MONDAY, style), words.nearest,
      pick([[words.ofSameMonth, day >= SHORTEST_MONTH], ['', true]])
    ]);

    return phrase(theDate(day, facts.dated), {
      after: orOffTheWeekend(landing, style),
      closed: true,
      suffix: facts.suffix
    });
  },
  // «del 1 al 7 y el día 15»; with a cadence among them, «los días
  // impares del 1 al 15 y los días 16, 19, 22, 25, 28 y 31».
  parts(facts: DayFacts): DayPhrase {
    return phrase(phrases(led(mapParts(facts.said.parts,
      function run(from, to, part): Piece {
        return pick([
          [steppedDays({...part, last: to, start: from}, facts.length),
            part.interval > 1],
          [{body: fromThe(from, to), lead: ''}, true]
        ]);
      },
      function named(days) {
        return {
          body: pick([
            [`${words.the} ${days[0]}`, facts.dated],
            [numbered(days), true]
          ]),
          lead: ''
        };
      }))), {suffix: facts.suffix});
  }
};

// «el segundo lunes», «el último viernes».
function quartzWeekday(facts: DayFacts, which: string): DayPhrase {
  // The Quartz form counts from Sunday; the names are asked for from
  // Monday.
  const day = (facts.form.weekday + WEEK - 1) % WEEK;

  return phrase(
    `${words.the} ${which} ${weekdayName(day, 'name', facts.style)}`,
    {suffix: facts.suffix});
}

// The weekday phrase for each Quartz form and for a plain set of days.
const weekdayPhrasers = {
  all(): DayPhrase {
    return phrase('', {});
  },
  last(facts: DayFacts): DayPhrase {
    return quartzWeekday(facts, words.lastOne);
  },
  nth(facts: DayFacts): DayPhrase {
    return quartzWeekday(facts, lexicon.nthWords[facts.form.nth - 1]);
  },
  // «los lunes, miércoles y viernes»; «de martes a jueves y los
  // domingos»; six days that wrap the week are every day but one.
  parts(facts: DayFacts): DayPhrase {
    const {style} = facts;
    const {parts} = facts.said;
    const days = mapParts(parts, function run(from, to) {
      return (to - from + WEEK) % WEEK + 1;
    }, function named(values) {
      return values.length;
    });
    const missing = mapParts(parts, function after(from, to) {
      return [(to + 1) % WEEK];
    }, function none(): number[] {
      return [];
    }).flat();
    const wrapped = mapParts(parts, function backwards(from, to) {
      return from > to;
    }, never)[0];

    function plural(day: number): string {
      return weekdayName(day, 'plural', style);
    }

    return pick([
      [phrase(words.everyDay, {inserted: [
        `${words.except} ${words.thePlural} ${missing.map(plural).join()}`
      ]}), facts.alone && days[0] === WEEK - 1 && wrapped],
      [phrase(phrases(mapParts(parts, function run(from, to) {
        return fromTo(weekdayName(from, 'name', style),
          weekdayName(to, 'name', style));
      }, function named(values) {
        // Saturday and Sunday on their own are the weekend.
        return pick([
          [words.weekends, values.join() === `${SATURDAY},${SUNDAY}`],
          [`${words.thePlural} ${list(values.map(plural))}`, true]
        ]);
      })), {suffix: facts.suffix}), true]
    ]);
  }
};

// A day phrase as text.
function textOf(said: DayPhrase): string {
  return [spaced([said.main, said.suffix, said.after]), ...said.inserted]
    .join(', ');
}

// The years and months, and how the year meets the months.
interface Leading {
  years: Said;
  // Whether the years are every year, with none excepted.
  everyYear: boolean;
  months: Said;
  monthValues: number[];
  monthNamed: boolean;
  // The months the day of the month fires in, where they are named.
  firing: number[];
  // A single year follows a month's name; any other year phrase leads.
  yearJoins: boolean;
  yearTail: string;
}

// The two day fields, as they are said under the months named.
interface Days {
  dates: Said;
  weekdays: Said;
  quartzDate: QuartzDate | null;
  quartzDay: QuartzWeekday | null;
  everyDate: boolean;
  everyWeekday: boolean;
  // Whether both day fields narrow the days and a day must match both, or
  // match either one (a union).
  both: boolean;
  union: boolean;
  // The length of the longest month named.
  length: number;
  // Whether one day of the month is left to say.
  oneDate: boolean;
  // What limits the date beyond the months named: the leap years, or the
  // months long enough for a day counted from the last.
  lead: string;
  // Whether that lead is the months, so that the date says «del mes».
  scarce: boolean;
}

function sorted(values: number[]): number[] {
  return values.slice().sort(function ascending(a, b) {
    return a - b;
  });
}

// The years and the months. Where the day of the month cannot fire in
// every month named, the months it does fire in are the months said
// (answers 4.4); in a union the weekdays keep the months as written.
function leadingOf(analyses: Analyses): Leading {
  const {candidates, dateReach} = analyses;
  const yearValues = valuesOf(candidates.year, 'year');
  const years = say(yearValues, yearPolicy);
  const everyYear = years.kind === 'all' && years.removed.length === 0;
  const written = valuesOf(candidates.month, 'month');
  const monthNamed = written.length < domainOf('month').max;
  const reach = {everyYear: written, fires: false, leapYears: [], ...dateReach};
  const firing = pick([
    [sorted([...reach.everyYear, ...reach.leapYears]),
      monthNamed && reach.fires],
    [written, true]
  ]);
  const monthValues = pick([[written, analyses.day.union], [firing, true]]);
  const months = say(monthValues, monthPolicy(everyYear));

  // A year after months in several pieces would be heard with the last
  // piece only, so there it leads.
  const yearJoins = yearValues.length === 1 && monthNamed &&
    months.parts.length === 1;

  return {
    everyYear,
    firing,
    monthNamed,
    monthValues,
    months,
    yearJoins,
    yearTail: pick([
      [` ${words.of} ${yearValues[0]}`, yearJoins],
      ['', true]
    ]),
    years
  };
}

function quartzForms(day: Analyses['day']):
  Pick<Days, 'quartzDate' | 'quartzDay'> {
  return {
    quartzDate: day.date && day.date.kind === 'quartz' ?
      day.date.form :
      null,
    quartzDay: day.weekday && day.weekday.kind === 'quartz' ?
      day.weekday.form :
      null
  };
}

// The days of the month that exist in a month in reach, as the core
// states them; the field's own days where every one of them does.
function reachedDates(analyses: Analyses): number[] {
  const reached = analyses.dateReach && analyses.dateReach.days;
  const offered = reached ? reached.candidates : analyses.candidates.date;

  return valuesOf(pick([[null, offered !== null && offered.length === 0],
    [offered, true]]), 'date');
}

// How two day fields that still narrow the days combine: both must match,
// or either will do. Where either is silent there is nothing to combine.
function restriction(day: Analyses['day'], silent: boolean):
  {both: boolean; union: boolean} {
  return {both: day.both && !silent, union: day.union && !silent};
}

function daysOf(analyses: Analyses, leading: Leading): Days {
  const {candidates, day, dateReach} = analyses;
  const {quartzDate, quartzDay} = quartzForms(day);
  const form = {days: 0, kind: '', ...quartzDate};
  const reach = {
    days: null, everyYear: [0], fires: true, leapYears: [], never: [],
    ...dateReach
  };

  // The date arm is silent when the field is every day, when its days
  // are every day the months in reach have, and when it never fires
  // beside weekdays that do.
  const everyDay = reach.days !== null && reach.days.everyDay;
  const everyDate = day.date === null || everyDay || !reach.fires;
  const everyWeekday = day.weekday === null || everyDay;
  const length = Math.max(...leading.monthValues.map(function days(month) {
    return MONTH_LENGTHS[month];
  }));
  const values = reachedDates(analyses);

  // In a union the days take no exception: it would be heard as an
  // exception to the weekdays too (answers 4.3).
  const dates = say(values, datePolicy(length, everyWeekday));

  // Weekdays, counted from Monday.
  const weekdays = say(
    sorted(valuesOf(candidates.weekday, 'weekday').map(
      function fromMonday(value) {
        return (value + WEEK - 1) % WEEK;
      })),
    weekdayPolicy);

  // A day counted from the last needs a month long enough. Where the
  // months said do not settle that (every month, or a February beside
  // others), the months that fire are said; a February alone fires in
  // leap years.
  const leapOnly = reach.everyYear.length === 0 && reach.fires;
  const unsettled = reach.leapYears.length +
    Number(!leading.monthNamed) * reach.never.length > 0;
  const scarce = form.kind === 'beforeLast' && unsettled && !leapOnly;

  return {
    ...restriction(day, everyDate || everyWeekday),
    dates,
    everyDate,
    everyWeekday,
    lead: pick([
      [words.inLeapYears, leapOnly],
      [`${words.inMonthsLongerThan} ${form.days} ${units.day.many}`, scarce],
      ['', true]
    ]),
    length,
    oneDate: values.length === 1 || form.kind === 'nearestWeekday' ||
      form.kind === 'firstWeekday',
    quartzDate,
    quartzDay,
    scarce,
    weekdays
  };
}

// The months join a date phrase, or a weekday phrase with no run in it,
// when they have no run themselves, there is no union, and they settle
// which months fire; otherwise they lead.
function monthsJoin(leading: Leading, days: Days): boolean {
  const listed = days.quartzDay !== null ||
    days.weekdays.parts.every(isValues);

  return leading.monthNamed && leading.months.parts.every(isValues) &&
    (days.everyDate !== days.everyWeekday || days.both) && !days.scarce &&
    (!days.everyDate || listed);
}

// Months as a leading phrase: «en enero y julio», «de junio a agosto y
// en diciembre».
function monthsLeading(months: Said, style: SpanishStyle): string {
  function name(month: number): string {
    return monthName(month, style);
  }

  return phrases(mapParts(months.parts, function run(from, to) {
    return fromTo(name(from), name(to));
  }, function named(values) {
    return `${words.in} ${list(values.map(name))}`;
  }));
}

// Months as they join a date: «de enero y julio».
function monthsJoined(months: number[], style: SpanishStyle): string {
  return `${words.of} ` + list(months.map(function name(month) {
    return monthName(month, style);
  }));
}

// How the date a union adds is tied to its months. Where it fires in
// every month named it points back at them, «de ese mes»; where it does
// not, it names its own, joined to it («el 31 de mayo») or, with a run
// among them, leading it.
function addedMonths(leading: Leading, days: Days, style: SpanishStyle):
  {suffix: string; lead: string; own: boolean} {
  const {firing, monthValues} = leading;
  const own = firing.length < monthValues.length;
  const months = say(firing, monthPolicy(false));
  const joins = months.parts.every(isValues);
  const those = `${words.of} ` +
    byCount([words.thatMonth, words.thoseMonths], monthValues.length);

  return pick([
    [{lead: '', own, suffix: those}, !own],
    [{lead: '', own, suffix: monthsJoined(firing, style)}, joins],
    [{lead: monthsLeading(months, style), own, suffix: words.ofEachMonth},
      true]
  ]);
}

// The two day phrases, each tied to the months as its place asks.
function dayPhrases(leading: Leading, days: Days, style: SpanishStyle):
  {date: DayPhrase; weekday: DayPhrase; addedLead: string} {
  const {monthValues} = leading;
  const {both, union} = days;
  const joins = monthsJoin(leading, days);
  const tied = union && leading.monthNamed;
  const quartzDay = days.quartzDay !== null;
  const joined = monthsJoined(monthValues, style) + leading.yearTail;
  const added = addedMonths(leading, days, style);
  const shared = {length: days.length, style};

  // Weekdays have no cadence, so a plain set is every day or parts.
  const weekdayKind = (days.quartzDay ?? days.weekdays).kind as
    keyof typeof weekdayPhrasers;

  return {
    addedLead: added.lead,
    date: datePhrasers[(days.quartzDate ?? days.dates).kind]({
      ...shared,
      alone: false,
      dated: days.oneDate && pick([
        [leading.firing.length === 1, tied && added.own],
        [joins && monthValues.length === 1, true]
      ]),
      form: {...NO_FORM, ...days.quartzDate},
      said: days.dates,
      suffix: pick([
        [words.ofMonth, days.scarce],
        [added.suffix, tied],
        [joined, joins],
        [words.ofEachMonth, true]
      ])
    }),
    weekday: weekdayPhrasers[weekdayKind]({
      ...shared,
      alone: !union && !both,
      dated: false,
      form: {...NO_FORM, ...days.quartzDay},
      said: days.weekdays,
      suffix: pick([
        [words.ofMonth, both && quartzDay],
        ['', both],
        [joined, joins],
        [words.ofMonth, tied && quartzDay],
        [words.ofEachMonth, quartzDay],
        ['', true]
      ])
    })
  };
}

// A schedule whose day of the month no month in reach has: «nunca,
// porque junio no tiene día 31». The years are said with the months, as
// the reason holds of them.
function neverText(analyses: Analyses, leading: Leading, style: SpanishStyle):
  string {
  const form = {day: 0, days: 0, kind: '', ...quartzForms(analyses.day)
    .quartzDate};
  const months = leading.monthValues;
  const lacking = pick([
    [`${words.moreThan} ${form.days} ${units.day.many}`,
      form.kind === 'beforeLast'],
    [`${units.day.one} ${form.day}`, form.kind === 'nearestWeekday'],
    [`${units.day.one} ` +
      norList(valuesOf(analyses.candidates.date, 'date')), true]
  ]);

  return `${words.never}, ${words.because} ` + spaced([
    pick([['', leading.yearJoins], [yearPhrase(leading.years), true]]),
    list(months.map(function name(month) {
      return monthName(month, style);
    })) + leading.yearTail,
    byCount([words.hasNo, words.haveNo], months.length),
    lacking
  ]);
}

// What a date must fall on when both day fields must match: «cuando cae
// en lunes o jueves», «cuando caen de lunes a viernes», «cuando cae en
// fin de semana»; «cuando coinciden con el último viernes del mes» for a
// weekday of the month. A run needs no «en»; the rest of the days follow
// it in the same list.
function condition(days: Days, weekday: DayPhrase, style: SpanishStyle):
  string {
  const plural = days.quartzDate === null && !days.oneDate;
  const {parts} = days.weekdays;
  const [first = {kind: 'values', values: []} as Part] = parts;
  const weekend = parts.length === 1 && isValues(first) &&
    first.values.join() === `${SATURDAY},${SUNDAY}`;
  const items = mapParts(parts, function run(from, to) {
    return [fromTo(weekdayName(from, 'name', style),
      weekdayName(to, 'name', style))];
  }, function named(values) {
    return values.map(function name(value) {
      return weekdayName(value, 'name', style);
    });
  }).flat();

  return spaced([
    words.when,
    pick([
      [byCount([words.coincides, words.coincide], Number(plural) + 1) + ' ' +
        textOf(weekday), days.quartzDay !== null],
      [spaced([
        byCount([words.falls, words.fall], Number(plural) + 1),
        pick([['', !isValues(first)], [words.in, true]]),
        list(pick([[[words.weekend], weekend], [items, true]]), words.or)
      ]), true]
    ])
  ]);
}

/** The leading frame, the day, and what a union adds after the time. */
function calendarOf(
  schedule: Schedule,
  everyHour: boolean,
  style: SpanishStyle
): Calendar {
  const {analyses} = schedule;
  const leading = leadingOf(analyses);
  const days = daysOf(analyses, leading);
  const spoken = dayPhrases(leading, days, style);
  const {union} = days;
  const neverFires = analyses.dateReach !== null &&
    !analyses.dateReach.fires && !analyses.day.union;

  // What limits the date beyond the months is said before it: in the
  // leading frame, or inside the addition of a union.
  const said = pick([
    [phrase(`${textOf(spoken.date)}, ${condition(days, spoken.weekday, style)}`,
      {closed: true}), days.both],
    [spoken.weekday, !days.everyWeekday],
    [spoken.date, !days.everyDate],
    [phrase(pick([['', everyHour], [words.everyDay, true]]), {}), true]
  ]);
  const addedLead = days.lead || spoken.addedLead;

  return pick([
    [{
      also: '',
      day: neverText(analyses, leading, style),
      dayClosed: false,
      frame: [],
      never: true
    }, neverFires],
    [{
      also: pick([
        [`${words.also}, ${addedLead}, ${textOf(spoken.date)}`,
          union && addedLead !== ''],
        [`${words.also} ${textOf(spoken.date)}`, union],
        ['', true]
      ]),
      day: textOf(said),
      dayClosed: said.closed || said.inserted.length > 0,
      frame: [
        pick([
          ['', leading.yearJoins],
          [yearPhrase(leading.years), true]
        ]),
        pick([[days.lead, days.lead === words.inLeapYears && !union],
          ['', true]]),
        pick([
          [monthsLeading(leading.months, style) + leading.yearTail,
            leading.monthNamed && !monthsJoin(leading, days)],
          ['', true]
        ]),
        pick([[days.lead, days.scarce && !union], ['', true]])
      ].filter(Boolean),
      never: false
    }, true]
  ]);
}

export {calendarOf};
