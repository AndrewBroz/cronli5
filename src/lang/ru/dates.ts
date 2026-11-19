// Days of the month (answers 3.6, 3.7, 4.4): ordinals with «числа» and
// the months as their scope, or bare cardinals before a month's name;
// every second date by parity; an exception from every day.

import type {ScheduleFacts} from '../../core/schedule.js';
import {
  daysByMonths, daysReached, describeCadencePieces
} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {MonthSet, MonthsSaid} from './months.js';
import {monthScope} from './months.js';
import type {Piece} from './names.js';
import {
  amount, fromWord, joined, list, monthName, ordinal, spaced, when
} from './names.js';
import type {RussianStyle} from './options.js';
import type {Described, Exception, Part, Rule} from './sets.js';
import {
  choose, choosingOf, firstRule, isAlternate, valuesOf
} from './sets.js';

const {units, words} = lexicon;

/** What the days of a pattern are said among. */
export interface Calendar extends MonthSet {
  // Whether the month field is unrestricted.
  everyMonth: boolean;
  facts: ScheduleFacts;
  // Whether some month the pattern reaches lacks the date.
  lacking: boolean;
  // The months the date arm fires in.
  months: number[];
  style: RussianStyle;
}

/** A date phrase, and how the rest of the sentence stands to it. */
export interface DaySaid {
  // Whether the phrase ends in a clause that a comma closes.
  comma: boolean;
  // Whether the dates are every day less one or two.
  everyDay: boolean;
  // «Кроме 15-го числа», said after the phrase, or after a condition.
  exception: string;
  // Whether the one year was said after the one month's name.
  fused: boolean;
  // The dates an exception leaves out: «15-го и 16-го числа».
  left: string;
  // Whether the months are said before the day and not inside the phrase.
  monthsLead: boolean;
  // Whether months are named inside the phrase.
  named: boolean;
  // Whether the phrase says what it counts within: «каждого месяца».
  scoped: boolean;
  text: string;
}

// How a day and its noun are written: «1-го числа», or «1 июня».
interface Notation {
  accusative(day: number): string;
  genitive(day: number): string;
  nounAccusative: string;
  nounGenitive: string;
}

// A part of a phrase in several parts: its rate word, the rest, and
// whether it takes the noun.
interface DatePart {
  lead: string;
  list: boolean;
  noun: string;
  run: boolean;
  tail: string;
}

const ordinals: Notation = {
  accusative(day) {
    return ordinal(day, 'dateAccusative');
  },
  genitive(day) {
    return ordinal(day, 'dateGenitive');
  },
  nounAccusative: words.dateThrough,
  nounGenitive: words.dateOf
};

function beforeMonth(month: number, style: RussianStyle): Notation {
  const name = monthName(month, 'genitive', style);

  return {
    accusative: String,
    genitive: String,
    nounAccusative: name,
    nounGenitive: name
  };
}

const unsaid: MonthsSaid = {comma: false, fused: false, named: false, text: ''};

/** A date phrase with nothing said around it, to build others from. */
function daySaid(text: string): DaySaid {
  return {
    comma: false,
    everyDay: false,
    exception: '',
    fused: false,
    left: '',
    monthsLead: false,
    named: false,
    scoped: false,
    text
  };
}

// «С 1-го по 7-е», «со 2 по 6».
function runOf(ends: {from: number; to: number}, notation: Notation): string {
  return spaced(fromWord(ends.from === 2), notation.genitive(ends.from),
    words.through, notation.accusative(ends.to));
}

function parityWord(start: number): string {
  return start % 2 ? words.oddDates : words.evenDates;
}

const parts: {
  [kind: string]: (description: never, notation: Notation) => DatePart;
} = {
  cadence(description: Extract<Described, {kind: 'cadence'}>,
    notation: Notation) {
    const alternate = isAlternate(description);
    const ends = {from: description.start, to: description.last};

    return {
      lead: alternate ?
        parityWord(description.start) :
        spaced(words.every, amount(description.interval, units.day)),
      list: false,
      noun: when(!alternate, notation.nounAccusative),
      run: !alternate,
      tail: runOf(ends, alternate ? ordinals : notation)
    };
  },
  range(description: Extract<Described, {kind: 'range'}>,
    notation: Notation) {
    return {
      lead: '',
      list: false,
      noun: notation.nounAccusative,
      run: true,
      tail: runOf(description, notation)
    };
  },
  values(description: Extract<Described, {kind: 'values'}>,
    notation: Notation) {
    return {
      lead: '',
      list: description.values.length > 1,
      noun: notation.nounGenitive,
      run: false,
      tail: list(description.values.map(notation.genitive))
    };
  }
};

function partOf(description: Described, notation: Notation): DatePart {
  return parts[description.kind](description as never, notation);
}

// Parts in order. A run takes its rate word beside a step («ежедневно с
// 12-го по 14-е число»), and a rate word shared with the part before is
// said once. A part takes its noun at the end of the phrase and where a
// run stands before a single date.
function inParts(description: Described, notation: Notation): string {
  const stepped = description.kind === 'cadencePieces';
  const said = ((description as {parts: Part[]}).parts || [description])
    .map(function say(part): DatePart {
      const found = partOf(part, notation);

      return {
        ...found,
        lead: when(stepped && part.kind === 'range', words.everyDay) ||
          found.lead
      };
    });

  return joined(said.map(function closed(part, at): Piece {
    const next = said[at + 1];
    const again = at > 0 && said[at - 1].lead === part.lead;
    const closes = !next || stepped || part.run && !next.run;

    return {
      list: part.list,
      text: spaced(when(!again, part.lead), part.tail,
        when(closes, part.noun))
    };
  }));
}

// Whether every part of a description is said by parity, which takes no
// noun and no months.
function byParity(description: Described): boolean {
  return ((description as {parts: Part[]}).parts || [description])
    .every(isAlternate);
}

// Every calendar date, in calendar order: «30 апреля, 30 мая и 31 мая».
function eachDate(days: number[], given: Calendar): string {
  const groups = daysByMonths(given.facts) ?? [];
  const pairs = groups.length > 1 ?
    groups.flatMap(function each(group) {
      const held = [...new Set(group.months.flatMap(function monthsOf(length) {
        return length.months;
      }))];

      return held.flatMap(function inMonth(month) {
        return group.days.map(function onDay(day) {
          return [month, day];
        });
      });
    }) :
    given.months.flatMap(function inMonth(month) {
      return days.map(function onDay(day) {
        return [month, day];
      });
    });

  return list(pairs.sort(function calendarOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }).map(function name([month, day]) {
    return spaced(String(day), monthName(month, 'genitive', given.style));
  }));
}

// Dates and the months they are said with.
interface Dated {
  days: number[];
  description: Described;
  given: Calendar;
  months: MonthsSaid;
  // Whether the months are named beside the dates.
  named: boolean;
}

// The ways dates take their months, in the order they are tried.
const withMonths: Array<Rule<Dated, DaySaid>> = [
  [function fewOrUneven({days, given, named}) {
    const uneven = (daysByMonths(given.facts) ?? []).length > 1;
    const few = days.length > 0 && days.length * given.months.length <= 3;

    return named && given.months.length > 1 && (uneven || few);
  }, function eachCalendarDate({days, given}) {
    return {...daySaid(eachDate(days, given)), named: true, scoped: true};
  }],
  [function oneMonth({description, given, named}) {
    // Parts said by parity keep their ordinals, and so do the parts
    // beside them.
    return named && given.months.length === 1 &&
      description.kind !== 'cadencePieces';
  }, function beforeItsName({description, given}) {
    return {
      ...daySaid(spaced(
        inParts(description, beforeMonth(given.months[0], given.style)),
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
 * when there are three or fewer, or when the days differ by month; bare
 * cardinals before one month's name; otherwise ordinals with «числа» and
 * the months after them. With no scope given, the months lead and the
 * dates are ordinals alone.
 */
function datesWithMonths(description: Described, given: Calendar,
  scope: MonthsSaid | null): DaySaid {
  return firstRule(withMonths, {
    days: (description as {values?: number[]}).values ?? [],
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

  return given.everyMonth && given.lacking ? unsaid : monthScope(given);
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

// Odd or even dates with a hole, where no exception may be said: each
// stretch of every second date, and a date that stands alone.
function stretchesOf(days: number[]): Described {
  const stretches: number[][] = [];

  days.forEach(function place(day) {
    const current = stretches[stretches.length - 1];

    if (current && day === current[current.length - 1] + 2) {
      current.push(day);
    }
    else {
      stretches.push([day]);
    }
  });

  return {
    kind: 'cadencePieces',
    parts: stretches.map(function part(stretch): Part {
      return stretch.length > 1 ?
        {
          interval: 2,
          kind: 'cadence',
          last: stretch[stretch.length - 1],
          start: stretch[0]
        } :
        {kind: 'values', values: stretch};
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
    stepNamed: 7
  });
  const order = ['all', 'few', ...excepting ? ['exception'] : [], 'run',
    'cadence', 'pieces', 'values'];
  const lacking = choose(['all', 'few', 'exception'], choosing) as
    Exception | null;
  const holed = !excepting && lacking?.kind === 'except' &&
    isAlternate(lacking.base);

  return formOf(holed ? stretchesOf(days) : choose(order, choosing), given,
    scoped);
}

export {datesSaid, datesWithMonths, daySaid, ordinals};
