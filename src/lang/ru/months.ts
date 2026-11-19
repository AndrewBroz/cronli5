// Months (answers 3.9, 4.4): always names, in calendar order. They lead
// the sentence («в июне», «с июня по август», «во все месяцы, кроме
// июня,») or follow a date as its scope («каждого месяца», «января и
// июля»).

import type {SetDescription} from '../../core/schedule.js';
import {describeSet, domainOf} from '../../core/index.js';
import lexicon from './lexicon.js';
import type {MonthCase, Piece} from './names.js';
import {clausal, joined, list, monthName, spaced, when} from './names.js';
import type {RussianStyle} from './options.js';
import type {Described, Part} from './sets.js';
import {choose, choosingOf} from './sets.js';

const {words} = lexicon;

/** Months as they lead a sentence or follow a date. */
export interface MonthsSaid {
  // Whether the phrase ends in a clause that a comma closes.
  comma: boolean;
  // Whether the one year was said after the one month's name.
  fused: boolean;
  // Whether months are named, and not «каждого месяца».
  named: boolean;
  text: string;
}

/** A set of months, the style its names are said in, and the one year. */
export interface MonthSet {
  months: number[];
  style: RussianStyle;
  // Whether a run of months may pass the year's end.
  wraps: boolean;
  // «2030 года», when one year is named and may follow one month's name.
  yearSuffix: string;
}

const domain = domainOf('month');
const manyMonths = 5;

function described(given: MonthSet): Described {
  const linear = describeSet(given.months, domain, {linear: true});
  const own: SetDescription[] = describeSet(given.months, domain);

  return choose(['all', 'run', 'exception', 'wrapped', 'pieces', 'values'],
    choosingOf({linear, own}, domain,
      {cadenceBase: false, wraps: given.wraps}));
}

function namesOf(months: number[], form: MonthCase, style: RussianStyle):
  string {
  return list(months.map(function name(month) {
    return monthName(month, form, style);
  }));
}

// «С июня по август».
function runOf(run: {from: number; to: number}, style: RussianStyle): string {
  return spaced(words.from, monthName(run.from, 'genitive', style),
    words.through, monthName(run.to, 'accusative', style));
}

// The one year after the one month's name, when there is one of each.
function yearAfter(given: MonthSet): string {
  return when(given.months.length === 1, given.yearSuffix);
}

const leading: {
  [kind: string]: (description: never, given: MonthSet) => Piece;
} = {
  all() {
    return {list: false, text: ''};
  },
  except(description: Extract<Described, {kind: 'except'}>, given: MonthSet) {
    return {
      list: false,
      text: clausal(words.inAllMonths, spaced(words.except,
        namesOf(description.removed, 'genitive', given.style)))
    };
  },
  pieces(description: Extract<Described, {kind: 'pieces'}>, given: MonthSet) {
    return {
      list: true,
      text: joined((description.parts as Part[]).map(function say(part) {
        return leading[part.kind](part as never, given);
      }))
    };
  },
  range(description: Extract<Described, {kind: 'range'}>, given: MonthSet) {
    return {list: false, text: runOf(description, given.style)};
  },
  values(description: Extract<Described, {kind: 'values'}>, given: MonthSet) {
    return {
      list: description.values.length > 1,
      text: spaced(words.in,
        namesOf(description.values, 'prepositional', given.style),
        yearAfter(given))
    };
  }
};

/** The months before the day: «в июне», «с июня по август». */
function leadingMonths(given: MonthSet): MonthsSaid {
  const found = described(given);

  return {
    comma: found.kind === 'except',
    fused: Boolean(yearAfter(given)),
    named: false,
    text: leading[found.kind](found as never, given).text
  };
}

// «Каждого месяца» with what narrows it, for the sets of months that
// are not said by their names: every month, five or more in one run, and
// all but one or two.
const eachMonth: {
  [kind: string]: (description: never, given: MonthSet) => string;
} = {
  all() {
    return words.ofEachMonth;
  },
  except(description: Extract<Described, {kind: 'except'}>, given: MonthSet) {
    return clausal(words.ofEachMonth, spaced(words.except,
      namesOf(description.removed, 'genitive', given.style)));
  },
  range(description: Extract<Described, {kind: 'range'}>, given: MonthSet) {
    return when(given.months.length >= manyMonths,
      spaced(words.ofEachMonth, runOf(description, given.style)));
  }
};

function nothing(): string {
  return '';
}

/** The months after a date: «каждого месяца», «января и июля». */
function monthScope(given: MonthSet): MonthsSaid {
  const found = described(given);
  const each = (eachMonth[found.kind] || nothing)(found as never, given);

  return {
    comma: found.kind === 'except',
    fused: !each && Boolean(yearAfter(given)),
    named: !each,
    text: each || spaced(namesOf(given.months, 'genitive', given.style),
      yearAfter(given))
  };
}

/** «В июне», «в апреле и июне»: months that lack a date. */
function monthsLacking(months: number[], style: RussianStyle): string {
  return spaced(words.in, namesOf(months, 'prepositional', style));
}

export {leadingMonths, monthName, monthScope, monthsLacking};
