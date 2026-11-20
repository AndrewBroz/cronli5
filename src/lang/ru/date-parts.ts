// How dates are written (answers 3.6, 4.4): ordinals with «числа», or
// bare cardinals before a month's name; runs, steps and lists as the
// parts of one phrase; the mark on a date that comes in leap years only.

import type {ScheduleFacts} from '../../core/schedule.js';
import lexicon from './lexicon.js';
import type {MonthSet} from './months.js';
import type {Piece} from './names.js';
import {
  amount, fromWord, joined, list, monthName, ordinal, spaced, when
} from './names.js';
import type {RussianStyle} from './options.js';
import type {Described, Part} from './sets.js';
import {isAlternate} from './sets.js';

const {units, words} = lexicon;

/** What the days of a pattern are said among. */
export interface Calendar extends MonthSet {
  // Whether the month field is unrestricted.
  everyMonth: boolean;
  facts: ScheduleFacts;
  // Whether some month the pattern reaches lacks the date.
  lacking: boolean;
  // The date that comes in leap years only (29 February), when the
  // pattern reaches leap and common years and other dates come every
  // year; null otherwise.
  leapDate: {day: number; month: number} | null;
  // The months the dates reach in leap years only, beside such dates.
  leapMonths: number[];
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
  // «(в високосные годы)» after a date that comes in leap years only.
  only(day: number): string;
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
  nounGenitive: words.dateOf,
  only() {
    return '';
  }
};

// «(в високосные годы)» after a calendar date that comes in leap years
// only, beside dates that come every year.
function inLeapYearsOnly(month: number, day: number, given: Calendar): string {
  const {leapDate} = given;

  return when(leapDate?.month === month && leapDate.day === day,
    words.inLeapYearsOnly);
}

function beforeMonth(month: number, given: Calendar): Notation {
  const name = monthName(month, 'genitive', given.style);

  return {
    accusative: String,
    genitive: String,
    nounAccusative: name,
    nounGenitive: name,
    only(day) {
      return inLeapYearsOnly(month, day, given);
    }
  };
}

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
  // A date that comes in leap years only is said after the others, on
  // its own: «1, 10 и 20 февраля, а также 29 февраля (в високосные годы)».
  values(description: Extract<Described, {kind: 'values'}>,
    notation: Notation) {
    const [yearly, leap] = [false, true].map(function sort(marked) {
      return description.values.filter(function fits(day) {
        return Boolean(notation.only(day)) === marked;
      });
    });
    const named = list(yearly.map(notation.genitive));
    const alone = leap.map(function own(day): Piece {
      return {
        list: false,
        text: spaced(notation.genitive(day), notation.nounGenitive,
          notation.only(day))
      };
    });

    return {
      lead: '',
      list: description.values.length > 1,
      noun: when(!alone.length, notation.nounGenitive),
      run: false,
      tail: alone.length ?
        joined([
          ...yearly.length ?
            [{
              list: yearly.length > 1,
              text: spaced(named, notation.nounGenitive)
            }] :
            [],
          ...alone
        ]) :
        named
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

// Every calendar date the dates come to, as month and day in calendar
// order: each day in the months that have it. For a form that is no

export {
  beforeMonth, byParity, daySaid, inLeapYearsOnly, inParts, ordinals,
  parityWord
};
