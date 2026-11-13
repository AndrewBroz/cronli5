// The calendar parts of the sentence: the leading frame (years and
// months that stand apart), the day, and the days of the month a union
// adds after the time (answers 2.1, 4.3 to 4.5, 5.7, 5.8).

import type {Policy, Said} from './sets.js';
import type {
  Analyses, QuartzDate, QuartzWeekday, Schedule, SetDescription
} from '../../core/schedule.js';
import {byCount, list, pick, spaced} from './wording.js';
import {isRange, isValues, mapParts, say} from './sets.js';
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
}

// A phrase for the day of the month or the weekday. `suffix` is how it
// is tied to the months («de cada mes», «de junio»); `inserted` are the
// phrases set off by commas after it; `closed` asks for a comma after it
// in any case; `lead` names the months that fire, where a month in reach
// may lack the day, and `bare` is the suffix that goes with it.
interface DayPhrase {
  main: string;
  suffix: string;
  inserted: string[];
  closed: boolean;
  lead: string;
  bare: string;
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
  // Whether a month in reach may lack the day a Quartz form names.
  scarce: boolean;
  style: SpanishStyle;
}

// The days in the longest year's months; there is no month 0.
const MONTH_LENGTHS = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// The fewest days each month can have.
const SHORTEST_LENGTHS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// A cadence of this many values or more names both its ends.
const LONG_CADENCE = 8;

// From this day of the month on, the day can be a month's last.
const SHORTEST_MONTH = 28;

const WEEK = 7;

const LONGEST_MONTH = 31;

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

// The years (answers 5.8): every second year is «pares» or «impares»,
// with its start or both ends when it does not run from the first year
// to the last; a longer cadence shows its first three years.
const yearPhrasers = {
  all(said: Said): string {
    return pick([
      ['', said.removed.length === 0],
      [words.everyYear, true]
    ]);
  },
  cadence(said: Said): string {
    const {max, min} = domainOf('year');
    const {interval, last, start} = said;
    const open = last + interval > max;
    const second = interval === 2;
    const parity = spaced([
      words.in, words.theYears, [words.theEven, words.theOdd][start % 2]
    ]);
    const shown = `${words.in} ` +
      [start, start + interval, start + 2 * interval].join(', ') +
      ` ${words.andSoOn}`;

    return pick([
      [parity, second && open && start - interval < min],
      [`${parity} ${words.since} ${start}`, second && open],
      [`${parity} ${fromTo(start, last)}`, second],
      [shown, open],
      [`${shown} ${words.until} ${last}`, true]
    ]);
  },
  parts(said: Said): string {
    return list(mapParts(said.parts, fromTo, function named(values) {
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

const yearPolicy: Policy = {
  cadence(cadence, count) {
    return cadence.interval === 2 || count >= LONG_CADENCE;
  },
  domain: domainOf('year'),
  holeCost: 1,
  minRun: 3,
  pairWraps: false,
  wraps: false
};

// Months have no cadence and take no exception; they wrap only when the
// year is every year.
function monthPolicy(wraps: boolean): Policy {
  return {
    cadence: never,
    domain: domainOf('month'),
    holeCost: 0,
    minRun: 3,
    pairWraps: false,
    wraps
  };
}

// Weekdays are counted from Monday; they may always wrap, and two days
// across the end of the week keep that order: «los domingos y lunes».
const weekdayPolicy: Policy = {
  cadence: never,
  domain: {cyclic: true, max: WEEK - 1, min: 0},
  holeCost: 0,
  minRun: 3,
  pairWraps: true,
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
// an idiom; any other cadence is one from eight days.
function datePolicy(length: number, wraps: boolean): Policy {
  return {
    cadence(cadence, count) {
      return cadence.interval === 2 && fullMonth(cadence, length) ||
        count >= LONG_CADENCE;
    },
    domain: {cyclic: true, max: length, min: 1},
    holeCost: 1,
    minRun: 3,
    pairWraps: false,
    wraps
  };
}

function phrase(main: string, more: Partial<DayPhrase>): DayPhrase {
  return {
    bare: '',
    closed: false,
    inserted: [],
    lead: '',
    main,
    suffix: '',
    ...more
  };
}

function workdayOf(style: SpanishStyle): string {
  return {
    hábil: words.workdayBusiness,
    laborable: words.workdayWorking
  }[style.workday];
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
        {
          bare: words.ofMonth,
          closed: true,
          lead: pick([
            [`${words.inMonthsLongerThan} ${days} ${units.day.many}`,
              facts.scarce],
            ['', true]
          ]),
          suffix: facts.suffix
        }), true]
    ]);
  },
  // «los días impares», «los días pares del 8 al 30», «cada 3 días del 1
  // al 31».
  cadence(facts: DayFacts): DayPhrase {
    const {interval, last, start} = facts.said;
    const second = interval === 2;
    const parity = spaced([
      words.thePlural, units.day.many, [words.theEven, words.theOdd][start % 2]
    ]);
    const ends = fromThe(start, last);

    return phrase(pick([
      [parity, second && fullMonth(facts.said, facts.length)],
      [`${parity} ${ends}`, second],
      [`${words.each} ${interval} ${units.day.many} ${ends}`, true]
    ]), {inserted: exceptDays(facts.said.removed), suffix: facts.suffix});
  },
  firstWeekday(facts: DayFacts): DayPhrase {
    return phrase(
      `${words.the} ${words.firstOne} ${workdayOf(facts.style)}`,
      {suffix: facts.suffix});
  },
  last(facts: DayFacts): DayPhrase {
    return phrase(`${words.the} ${words.lastDay}`, {suffix: facts.suffix});
  },
  lastWeekday(facts: DayFacts): DayPhrase {
    return phrase(
      `${words.the} ${words.lastOne} ${workdayOf(facts.style)}`,
      {suffix: facts.suffix});
  },
  // «el día laborable más cercano al 15»; from day 28 the search is said
  // to stay inside the month, and a month without the day does not fire.
  nearestWeekday(facts: DayFacts): DayPhrase {
    const {day} = facts.form;

    return phrase(
      `${words.the} ${workdayOf(facts.style)} ${words.closest} ${day}`,
      {
        inserted: [words.withinMonth].filter(function atAnEdge() {
          return day >= SHORTEST_MONTH;
        }),
        lead: pick([
          [`${words.inMonthsWithDay} ${day}`, facts.scarce],
          ['', true]
        ]),
        suffix: facts.suffix
      });
  },
  // «del 1 al 7 y el día 15»; a run that crosses into the next month
  // says so, and is not tied to the months again.
  parts(facts: DayFacts): DayPhrase {
    const {parts} = facts.said;
    const crosses = parts.some(function backwards(part) {
      return isRange(part) && part.from > part.to;
    });

    return phrase(list(mapParts(parts, function run(from, to) {
      return pick([
        [`${words.fromThe} ${from} ${words.ofEachMonth} ${words.toThe} ` +
          `${to} ${words.ofTheNext}`, from > to],
        [fromThe(from, to), true]
      ]);
    }, function named(days) {
      return pick([
        [`${words.the} ${days[0]}`, facts.dated],
        [numbered(days), true]
      ]);
    })), {suffix: pick([['', crosses], [facts.suffix, true]])});
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
    const missing = parts.flatMap(function after(part) {
      return isRange(part) ? [(part.to + 1) % WEEK] : [];
    });

    function plural(day: number): string {
      return weekdayName(day, 'plural', style);
    }

    return pick([
      [phrase(words.everyDay, {inserted: [
        `${words.except} ${words.thePlural} ${missing.map(plural).join()}`
      ]}), facts.alone && days[0] === WEEK - 1 && parts[0].kind === 'range' &&
        parts[0].from > parts[0].to],
      [phrase(list(mapParts(parts, function run(from, to) {
        return fromTo(weekdayName(from, 'name', style),
          weekdayName(to, 'name', style));
      }, function named(values) {
        // Saturday and Sunday on their own are the weekend.
        return pick([
          [words.weekends, values.join() === `${WEEK - 2},${WEEK - 1}`],
          [`${words.thePlural} ${list(values.map(plural))}`, true]
        ]);
      })), {suffix: facts.suffix}), true]
    ]);
  }
};

// A day phrase as text, tied to the months as given unless the months
// that fire are said before it.
function textOf(said: DayPhrase, leads: boolean): string {
  const suffix = pick([[said.bare, leads], [said.suffix, true]]);

  return [spaced([said.main, suffix]), ...said.inserted].join(', ');
}

// The years and months, and how the year meets the months.
interface Leading {
  years: Said;
  // Whether the years are every year, with none excepted.
  everyYear: boolean;
  months: Said;
  monthValues: number[];
  monthNamed: boolean;
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
  // The length of the longest month named.
  length: number;
  // Whether one day of the month is left to say.
  oneDate: boolean;
  // Whether a month in reach may lack the day a Quartz form names.
  scarce: boolean;
}

function leadingOf(candidates: Analyses['candidates']): Leading {
  const yearValues = valuesOf(candidates.year, 'year');
  const years = say(yearValues, yearPolicy);
  const everyYear = years.kind === 'all' && years.removed.length === 0;
  const monthValues = valuesOf(candidates.month, 'month');
  const months = say(monthValues, monthPolicy(everyYear));
  const monthNamed = months.kind !== 'all';
  const yearJoins = yearValues.length === 1 && monthNamed;

  return {
    everyYear,
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

// Whether a month whose shortest length is given may lack the day a
// Quartz form names: the day the nearest weekday is sought for, or the
// day so many days before the last.
function lacksDay(form: QuartzDate | null, shortest: number): boolean {
  const reach = {day: 0, days: 0, ...form};

  return reach.day > shortest || reach.days >= shortest;
}

function daysOf(analyses: Analyses, leading: Leading): Days {
  const {candidates} = analyses;
  const {quartzDate, quartzDay} = quartzForms(analyses.day);

  // Days of the month, cut to the length of the longest named month and
  // described afresh (answers 4.4). They wrap into the next month only
  // when no month or year is named.
  const length = Math.max(...leading.monthValues.map(function days(month) {
    return MONTH_LENGTHS[month];
  }));
  const written = valuesOf(candidates.date, 'date');
  const kept = written.filter(function exists(date) {
    return date <= length;
  });
  const dates = say(
    [kept, written].find(function some(values) {
      return values.length > 0;
    }) as number[],
    datePolicy(length, leading.everyYear && !leading.monthNamed));
  const everyDate = quartzDate === null && dates.kind === 'all' &&
    dates.removed.length === 0;

  // Weekdays, counted from Monday.
  const weekdays = say(
    valuesOf(candidates.weekday, 'weekday').map(function fromMonday(value) {
      return (value + WEEK - 1) % WEEK;
    }).sort(function ascending(a, b) {
      return a - b;
    }),
    weekdayPolicy);

  // Days of the month that cover every day of the named months leave
  // nothing for the weekdays to add.
  const covered = everyDate && written.length < LONGEST_MONTH;

  return {
    dates,
    everyDate,
    everyWeekday: quartzDay === null && weekdays.kind === 'all' || covered,
    length,
    oneDate: kept.length === 1,
    quartzDate,
    scarce: lacksDay(quartzDate, Math.min(
      ...leading.monthValues.map(function fewest(month) {
        return SHORTEST_LENGTHS[month];
      }))),
    quartzDay,
    weekdays
  };
}

// The months join a date phrase, or a weekday phrase with no run in it,
// when they have no run themselves, there is no union, and every one of
// them has the day a Quartz form names; otherwise they lead.
function monthsJoin(leading: Leading, days: Days): boolean {
  const listed = days.quartzDay !== null ||
    days.weekdays.parts.every(isValues);

  return leading.monthNamed && leading.months.parts.every(isValues) &&
    days.everyDate !== days.everyWeekday && !days.scarce &&
    (!days.everyDate || listed);
}

// The months as a leading phrase: «en enero y julio», «de junio a agosto
// y en diciembre».
function monthLead(leading: Leading, style: SpanishStyle): string {
  function name(month: number): string {
    return monthName(month, style);
  }

  return list(mapParts(leading.months.parts, function run(from, to) {
    return fromTo(name(from), name(to));
  }, function named(values) {
    return `${words.in} ${list(values.map(name))}`;
  })) + leading.yearTail;
}

// The two day phrases, each tied to the months as its place asks.
function dayPhrases(leading: Leading, days: Days, style: SpanishStyle):
  {date: DayPhrase; weekday: DayPhrase} {
  const {monthValues} = leading;
  const union = !days.everyDate && !days.everyWeekday;
  const joins = monthsJoin(leading, days);
  const tied = union && leading.monthNamed;
  const quartzDay = days.quartzDay !== null;
  const joined = `${words.of} ` + list(monthValues.map(function name(month) {
    return monthName(month, style);
  })) + leading.yearTail;
  const those = `${words.of} ` +
    byCount([words.thatMonth, words.thoseMonths], monthValues.length);
  const shared = {length: days.length, scarce: days.scarce, style};

  // Weekdays have no cadence, so a plain set is every day or parts.
  const weekdayKind = (days.quartzDay ?? days.weekdays).kind as
    keyof typeof weekdayPhrasers;

  return {
    date: datePhrasers[(days.quartzDate ?? days.dates).kind]({
      ...shared,
      alone: false,
      dated: joins && monthValues.length === 1 && days.oneDate,
      form: {...NO_FORM, ...days.quartzDate},
      said: days.dates,
      suffix: pick([
        [those, tied],
        [joined, joins],
        [words.ofEachMonth, true]
      ])
    }),
    weekday: weekdayPhrasers[weekdayKind]({
      ...shared,
      alone: !union,
      dated: false,
      form: {...NO_FORM, ...days.quartzDay},
      said: days.weekdays,
      suffix: pick([
        [joined, joins],
        [words.ofMonth, tied && quartzDay],
        [words.ofEachMonth, quartzDay],
        ['', true]
      ])
    })
  };
}

/** The leading frame, the day, and what a union adds after the time. */
function calendarOf(
  schedule: Schedule,
  everyHour: boolean,
  style: SpanishStyle
): Calendar {
  const leading = leadingOf(schedule.analyses.candidates);
  const days = daysOf(schedule.analyses, leading);
  const phrases = dayPhrases(leading, days, style);
  const union = !days.everyDate && !days.everyWeekday;

  // The months that fire are said before the date they limit: in the
  // leading frame, or inside the addition of a union.
  const {lead} = phrases.date;
  const leads = lead !== '' && !union;
  const said = pick([
    [phrases.weekday, !days.everyWeekday],
    [phrases.date, !days.everyDate],
    [phrase(pick([['', everyHour], [words.everyDay, true]]), {}), true]
  ]);

  return {
    also: pick([
      [`${words.also}, ${lead}, ${textOf(phrases.date, true)}`,
        union && lead !== ''],
      [`${words.also} ${textOf(phrases.date, false)}`, union],
      ['', true]
    ]),
    day: textOf(said, leads),
    dayClosed: said.closed || said.inserted.length > 0,
    frame: [
      pick([
        ['', leading.yearJoins],
        [yearPhrase(leading.years), true]
      ]),
      pick([
        [monthLead(leading, style), leading.monthNamed &&
          !monthsJoin(leading, days)],
        ['', true]
      ]),
      pick([[lead, leads], ['', true]])
    ].filter(Boolean)
  };
}

export {calendarOf};
