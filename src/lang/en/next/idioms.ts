// Idioms: the fixed phrasings English has for particular sets and
// moments. Each row states what it applies to as a condition on the
// values, and what is said. An idiom names one thing however many values
// it stands for.

import type {Field, SetDescription} from '../../../core/schedule.js';
import type {Spoken} from '../../../core/select.js';
import type {EnglishOptions} from './options.js';
import lexicon from './lexicon.js';

/** A fixed phrasing and the condition under which it is said. */
export interface Idiom<Subject> {
  name: string;
  applies(subject: Subject): boolean;
  say(opts: EnglishOptions): Spoken;
}

/** An idiom for a set of one field's values. */
export interface SetIdiom extends Idiom<SetDescription> {
  field: Field;
}

/** A time of day; the second is absent when it is zero or not single. */
export interface Moment {
  hour: number;
  minute: number;
  second?: number;
}

const {words} = lexicon;

// A set is the same set however it was written, and the core describes
// each set one way, so matching the description is matching the values.
function everyNth(interval: number, start: number, last: number) {
  return function isThatCadence(set: SetDescription): boolean {
    return set.kind === 'cadence' && set.interval === interval &&
      set.start === start && set.last === last;
  };
}

function running(from: number, to: number) {
  return function isThatRange(set: SetDescription): boolean {
    return set.kind === 'range' && set.from === from && set.to === to;
  };
}

function onTheHour(hour: number) {
  return function isThatMoment(moment: Moment): boolean {
    return moment.hour === hour && moment.minute === 0 &&
      typeof moment.second !== 'number';
  };
}

function saying(...parts: Spoken[]) {
  return function say(): Spoken {
    return {
      length: 1,
      text: parts.map(function textOf(part) {
        return part.text;
      }).join(' ')
    };
  };
}

const idioms: SetIdiom[] = [
  {
    applies: everyNth(2, 1, 31),
    field: 'date',
    name: 'odd-numbered days',
    say: saying(words.on, words.oddDays)
  },
  {
    applies: everyNth(2, 2, 30),
    field: 'date',
    name: 'even-numbered days',
    say: saying(words.on, words.evenDays)
  },
  {
    applies: running(1, 5),
    field: 'weekday',
    name: 'weekdays',
    say: saying(words.on, words.weekdays)
  },
  {
    applies: running(6, 0),
    field: 'weekday',
    name: 'weekends',
    say: saying(words.on, words.weekends)
  },
  {
    applies: everyNth(2, 1970, 9998),
    field: 'year',
    name: 'even-numbered years',
    say: saying(words.in, words.evenYears)
  },
  {
    applies: everyNth(2, 1971, 9999),
    field: 'year',
    name: 'odd-numbered years',
    say: saying(words.in, words.oddYears)
  }
];

// Said only of the moment itself, in 12-hour time: 12:30 a.m. is not
// "half past midnight".
const momentIdioms: Array<Idiom<Moment>> = [
  {
    applies: onTheHour(0),
    name: 'midnight',
    say: saying(words.midnight)
  },
  {
    applies: onTheHour(12),
    name: 'noon',
    say(opts) {
      return {length: 1, text: opts.style.midday};
    }
  }
];

export {idioms, momentIdioms};
