// The years and the months: the parts that lead the sentence, and the
// ways a month is named beside the days of the month.

import type {
  CadenceDescription, CadencePieces, Domain, RangeDescription,
  ScheduleFacts, SetDescription, ValuesDescription
} from '../../core/schedule.js';
import {describeSet, domainOf} from '../../core/index.js';
import type {CzechStyle} from './options.js';
import type {Described} from './sets.js';
import {
  cadenceCount, chosen, enoughForARun, fewestNamed, listed,
  longestListedCadence, ofKind, spaced
} from './sets.js';
import lexicon from './lexicon.js';

const {months: monthNames, units, words} = lexicon;

type Except = Extract<SetDescription, {kind: 'except'}>;
type Pieces = Extract<SetDescription, {kind: 'pieces'}>;

/** How the month is named beside a day of the month. */
export interface MonthRef {
  // After days in the genitive: «1. dne v měsíci», «1. června».
  date(days: string): string;
  // After days in the accusative: «15. den v měsíci», «15. června».
  day(days: string): string;
  // Where the days lie: «v měsíci», «v červnu», «těchto měsíců».
  within: string;
}

const monthsInAYear = 12;
const parityStep = 2;

/** The step of «každý … den / rok»: a word up to the tenth, then digits. */
function stepWord(step: number): string {
  return lexicon.stepWords[step - parityStep] || `${step}.`;
}

/** The first three members of a cadence, as the reader counts them. */
function sample(cadence: CadenceDescription, mark = ''): string {
  const shown = [0, 1, 2].map(function member(index) {
    return `${cadence.start + index * cadence.interval}${mark}`;
  });

  return `(${shown.join(', ')} ${words.andSoOn})`;
}

// The removed years after a base.
function exceptYears(removed: number[]): string {
  return removed.length > 1 ?
    spaced(words.exceptYears, listed(removed.map(String))) :
    spaced(words.except, words.yearGenitive, String(removed[0]));
}

// A cadence of years: listed when it ends and is short, by parity when
// its step is two, and otherwise from its first year with its first
// three members shown.
function cadenceOfYears(form: CadenceDescription, domain: Domain): string {
  const parity = form.start % parityStep ? words.oddYears : words.evenYears;
  const rhythm = spaced(words.everyNth, stepWord(form.interval), words.year,
    sample(form));
  const ends = spaced(String(form.start), words.upTo, String(form.last));
  const fromFirst = form.start - domain.min < parityStep;
  const open = form.interval === parityStep ?
    spaced(fromFirst ? '' : spaced(words.fromYear, String(form.start)),
      parity) :
    spaced(words.fromYear, String(form.start), rhythm);
  const closed = form.interval === parityStep ?
    spaced(parity, ends) :
    spaced(words.inYears, ends, rhythm);
  const short = spaced(words.inYears, listed(
    Array.from({length: Math.min(cadenceCount(form),
      longestListedCadence)}, function member(_, index) {
      return String(form.start + index * form.interval);
    })
  ));

  return form.open && open ||
    cadenceCount(form) > longestListedCadence && closed || short;
}

// The years, by the kind of set.
const yearKinds: {[kind: string]: (form: never, domain: Domain) => string} = {
  cadence: cadenceOfYears,
  cadencePieces(form: CadencePieces, domain: Domain) {
    const single = form.parts.filter(function isList(part) {
      return part.kind === 'values';
    });
    const others = form.parts.filter(function isRun(part) {
      return part.kind !== 'values';
    });
    const said = listed(others.map(function each(part) {
      return yearsSaid(part, domain);
    }));

    return `${listed([said, ...single.map(function each(part) {
      return yearsSaid(part, domain);
    })], words.andBesides)}, ${words.namely}`;
  },
  except(form: Except, domain: Domain) {
    return spaced(
      form.base.kind === 'all' ?
        words.everyYear :
        yearsSaid(form.base, domain),
      exceptYears(form.removed));
  },
  pieces(form: Pieces) {
    return spaced(words.inYears, listed(form.parts.flatMap(
      function items(part) {
        const run = part as RangeDescription;
        const open = [spaced(words.fromYear, String(run.from))];
        const closed = [spaced(String(run.from), words.upTo, String(run.to))];

        return part.kind === 'values' ?
          part.values.map(String) :
          run.open && open || closed;
      }
    )));
  },
  range(form: RangeDescription) {
    return form.open ?
      spaced(words.fromYear, String(form.from)) :
      spaced(words.inYears, String(form.from), words.upTo, String(form.to));
  },
  values(form: ValuesDescription) {
    return form.values.length > 1 ?
      spaced(words.inYears, listed(form.values.map(String))) :
      spaced(words.inYear, String(form.values[0]));
  }
};

function yearsSaid(form: Described, domain: Domain): string {
  return yearKinds[form.kind](form as never, domain);
}

/** The years of a pattern: the form chosen for them, and how it is said. */
function yearsOf(facts: ScheduleFacts): {form: Described; text: string} {
  const domain = domainOf('year');
  const form = chosen(facts.analyses.candidates.year as SetDescription[], {
    domain,
    exceptions: false,
    rounds: false,
    together: facts.analyses.cadencePieces.year
  });

  return {
    form,
    text: form.kind === 'all' ? '' : yearsSaid(form, domain)
  };
}

function genitive(month: number): string {
  return monthNames[month].genitive;
}

function runOfMonths(run: RangeDescription): string {
  return spaced(words.from, genitive(run.from), words.to, genitive(run.to));
}

// The months, by the kind of set.
const monthKinds: {[kind: string]: (form: never) => string} = {
  except(form: Except) {
    return spaced(
      form.base.kind === 'range' ? runOfMonths(form.base) : words.everyMonth,
      words.except, listed(form.removed.map(genitive)));
  },
  pieces(form: Pieces) {
    return `${listed(form.parts.flatMap(function items(part) {
      return part.kind === 'range' ?
        [runOfMonths(part)] :
        part.values.map(function single(month) {
          return spaced(words.at, monthNames[month].locative);
        });
    }))}, ${words.namely}`;
  },
  range: runOfMonths,
  values(form: ValuesDescription) {
    return spaced(words.at, listed(form.values.map(function name(month) {
      return monthNames[month].locative;
    })));
  }
};

// A run of months that passes the new year: an exception when it leaves
// out a month or two, and otherwise one stretch, as a winter.
function aroundTheYear(months: number[], linear: SetDescription[]):
  {missing: Described[]; winter: Described[]} {
  const around = ofKind(describeSet(months, domainOf('month')), 'range');
  const wraps = months.length >= enoughForARun && around &&
    around.from > around.to ?
    [around] :
    [];
  const few = monthsInAYear - months.length <= parityStep;

  return {
    missing: wraps.flatMap(function excepted() {
      return linear.filter(function isException(candidate) {
        return few && candidate.kind === 'except' &&
          candidate.base.kind === 'all';
      });
    }),
    winter: wraps
  };
}

/**
 * The months that lead a sentence. A run that passes the new year stays
 * one stretch only as a winter, where no year is restricted; one that
 * leaves out a month or two is an exception; months never say a cadence.
 */
function monthsSaid(months: number[], winter: boolean): string {
  const linear = describeSet(months, domainOf('month'), {linear: true});
  const wrapped = aroundTheYear(months, linear);
  const one = months.length === 1 && linear[linear.length - 1];
  const run = months.length >= enoughForARun && ofKind(linear, 'range');
  const form = one || run || wrapped.missing[0] ||
    winter && wrapped.winter[0] ||
    fewestNamed(linear.filter(function sayable(candidate) {
      return candidate.kind !== 'except' || candidate.base.kind !== 'cadence';
    }));

  return monthKinds[form.kind](form as never);
}

/** The month as every month: «dne v měsíci». */
const anyMonth: MonthRef = {
  date: (days) => spaced(days, words.dayGenitive, words.inTheMonth),
  day: (days) => spaced(days, units.day.one, words.inTheMonth),
  within: words.inTheMonth
};

/** The months named before, in a union: «dne těchto měsíců». */
const theseMonths: MonthRef = {
  date: (days) => spaced(days, words.dayGenitive, words.ofTheseMonths),
  day: (days) => spaced(days, units.day.one, words.ofTheseMonths),
  within: words.ofTheseMonths
};

/**
 * One month taken into the days' own phrase, with the single year after
 * it when there is one: «1. června 2030», «v červnu 2030». Under the
 * short style a date writes the month as its number.
 */
function oneMonth(month: number, year: string, style: CzechStyle): MonthRef {
  const name = style.short ? `${month}.` : genitive(month);

  return {
    date: (days) => spaced(days, name, year),
    day: (days) => spaced(days, name, year),
    within: spaced(words.at, monthNames[month].locative, year)
  };
}

export {
  anyMonth, monthsSaid, oneMonth, parityStep, sample, stepWord, theseMonths,
  yearsOf
};
