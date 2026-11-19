// Days of the month (answers 3.6, 3.7, 4.4): the months as their scope;
// each calendar date where there are few; every second date by parity;
// an exception from every day.

import {
  daysByMonths, daysReached, describeCadencePieces
} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {Calendar, DaySaid} from './date-parts.js';
import {
  beforeMonth, byParity, daySaid, inLeapYearsOnly, inParts, ordinals,
  parityWord
} from './date-parts.js';
import type {MonthsSaid} from './months.js';
import {monthScope} from './months.js';
import {list, monthName, spaced, when} from './names.js';
import type {Described, Exception, Part, Rule} from './sets.js';
import {
  choose, choosingOf, firstRule, isAlternate, valuesOf
} from './sets.js';

const {words} = lexicon;
const fewDates = 3;
const scatteredDates = 7;

const unsaid: MonthsSaid = {comma: false, fused: false, named: false, text: ''};


// plain set of dates, the days given in every month it fires in.
function calendarDates(days: number[], given: Calendar): number[][] {
  const groups = daysByMonths(given.facts) ??
    [{days, months: [{months: given.months}]}];

  return groups.flatMap(function each(group) {
    const held = [...new Set(group.months.flatMap(function monthsOf(length) {
      return length.months;
    }))];

    return held.flatMap(function inMonth(month) {
      return group.days.map(function onDay(day) {
        return [month, day];
      });
    });
  }).sort(function calendarOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  });
}

// «30 апреля, 30 мая и 31 мая»; «29 января и 29 февраля (в високосные
// годы)».
function eachDate(dates: number[][], given: Calendar): string {
  return list(dates.map(function name([month, day]) {
    return spaced(String(day), monthName(month, 'genitive', given.style),
      inLeapYearsOnly(month, day, given));
  }));
}

// Dates and the months they are said with.
interface Dated {
  // The calendar dates the dates come to.
  dates: number[][];
  description: Described;
  given: Calendar;
  months: MonthsSaid;
  // Whether the months are named beside the dates.
  named: boolean;
}

// The ways dates take their months, in the order they are tried.
const withMonths: Array<Rule<Dated, DaySaid>> = [
  [function few({dates, given, named}) {
    return named && given.months.length > 1 && dates.length > 0 &&
      dates.length <= fewDates;
  }, function eachCalendarDate({dates, given}) {
    return {...daySaid(eachDate(dates, given)), named: true, scoped: true};
  }],
  [function oneMonth({description, given, named}) {
    // Parts said by parity keep their ordinals, and so do the parts
    // beside them.
    return named && given.months.length === 1 &&
      description.kind !== 'cadencePieces';
  }, function beforeItsName({description, given}) {
    return {
      ...daySaid(spaced(
        inParts(description, beforeMonth(given.months[0], given)),
        given.yearSuffix)),
      fused: Boolean(given.yearSuffix),
      named: true,
      scoped: true
    };
  }],
  [Boolean, function ordinalsAndScope({description, months}) {
    return {
      ...daySaid(spaced(inParts(description, ordinals), months.text)),
      comma: months.comma,
      fused: months.fused,
      named: months.named,
      scoped: Boolean(months.text)
    };
  }]
];

/**
 * Dates that take their months (answers 4.4): each calendar date named
 * when there are three or fewer; bare cardinals before one month's name;
 * otherwise ordinals with «числа» and the months after them. With no
 * scope given, the months lead and the dates are ordinals alone.
 */
function datesWithMonths(description: Described, given: Calendar,
  scope: MonthsSaid | null): DaySaid {
  return firstRule(withMonths, {
    dates: calendarDates(
      (description as {values?: number[]}).values ?? [], given),
    description,
    given,
    months: scope ?? unsaid,
    named: scope !== null && !given.everyMonth
  });
}

// The scope of plain dates: the months, or nothing where the months lead
// or a date some months lack is said bare.
function scopeOf(given: Calendar, scoped: boolean): MonthsSaid | null {
  if (!scoped) {
    return null;
  }

  return given.everyMonth && given.lacking ?
    unsaid :
    monthScope(given, given.leapMonths);
}

const forms: {
  [kind: string]: (description: never, given: Calendar, scoped: boolean) =>
  DaySaid;
} = {
  all() {
    return {...daySaid(words.everyDay), everyDay: true, monthsLead: true};
  },
  cadence(description: Extract<Described, {kind: 'cadence'}>, given: Calendar,
    scoped: boolean) {
    const {max} = daysReached(given.facts)?.domain ?? {max: 0};
    const whole = description.start <= 2 && description.last + 2 > max;

    return isAlternate(description) ?
      {
        ...daySaid(whole ?
          parityWord(description.start) :
          inParts(description, ordinals)),
        monthsLead: true
      } :
      datesWithMonths(description, given, scopeOf(given, scoped));
  },
  cadencePieces(description: Described, given: Calendar, scoped: boolean) {
    return byParity(description) ?
      {...daySaid(inParts(description, ordinals)), monthsLead: true} :
      datesWithMonths(description, given, scopeOf(given, scoped));
  },
  except(description: Exception, given: Calendar, scoped: boolean) {
    const base = formOf(description.base, given, scoped);
    const left = list(description.removed.map(ordinals.genitive));
    const noun = when(!byParity(description.base), words.dateOf);

    return {
      ...base,
      exception: spaced(words.except, left, noun),
      left: spaced(left, noun)
    };
  },
  pieces(description: Described, given: Calendar, scoped: boolean) {
    return datesWithMonths(description, given, scopeOf(given, scoped));
  },
  range(description: Described, given: Calendar, scoped: boolean) {
    return datesWithMonths(description, given, scopeOf(given, scoped));
  },
  values(description: Described, given: Calendar, scoped: boolean) {
    return datesWithMonths(description, given, scopeOf(given, scoped));
  }
};

function formOf(description: Described, given: Calendar, scoped: boolean):
  DaySaid {
  return forms[description.kind](description as never, given, scoped);
}

// A step less a date or two, where no exception may be said: the step
// cut at each date left out, as the stretches between them, and a date
// that stands alone. (The core's runs and cadences split such a set
// another way; this cut is read off the exception itself.)
function stretchesOf(lacking: Exception): Described {
  const {interval, last, start} = lacking.base as
    Extract<Described, {kind: 'cadence'}>;
  const cuts = [start - interval, ...lacking.removed, last + interval];

  return {
    kind: 'cadencePieces',
    parts: cuts.slice(1).map(function between(cut, at): number[] {
      return [cuts[at] + interval, cut - interval];
    }).filter(function holds([from, to]) {
      return from <= to;
    }).map(function part([from, to]): Part {
      return from < to ?
        {interval, kind: 'cadence', last: to, start: from} :
        {kind: 'values', values: [from]};
    })
  };
}

/**
 * A plain set of dates, as the days the months have. `scoped` is whether
 * the dates take their months; `excepting` whether a set may be said as a
 * simpler one less a date or two.
 */
function datesSaid(given: Calendar, scoped: boolean, excepting: boolean):
  DaySaid {
  const reached = daysReached(given.facts, {linear: true}) as
    NonNullable<ReturnType<typeof daysReached>>;
  const days = valuesOf(reached.candidates, reached.domain);
  const choosing = choosingOf({linear: reached.candidates}, reached.domain, {
    pieces: describeCadencePieces(days, reached.domain),
    runsFirst: true,
    scattered: scatteredDates
  });
  const order = ['all', 'few', ...excepting ? ['exception'] : [], 'run',
    'cadence', 'pieces', 'values'];
  const lacking = choose(['all', 'few', 'exception'], choosing) as
    Exception | null;
  const holed = !excepting && lacking?.kind === 'except' &&
    isAlternate(lacking.base);

  return formOf(holed ? stretchesOf(lacking) : choose(order, choosing),
    given, scoped);
}

export type {Calendar, DaySaid};
export {datesSaid, datesWithMonths, daySaid, ordinals};
