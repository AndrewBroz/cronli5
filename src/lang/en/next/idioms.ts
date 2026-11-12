// Idioms: the fixed phrasings English has for particular sets and
// moments. Each row states what it applies to as a condition on the
// values, and what is said. An idiom names one thing however many values
// it stands for.

import type {
  Field, QuartzDate, QuartzWeekday, SetDescription
} from '../../../core/schedule.js';
import type {Spoken} from '../../../core/select.js';
import type {EnglishOptions} from './options.js';
import lexicon from './lexicon.js';

/** A fixed phrasing and the condition under which it is said. */
export interface Idiom<Subject> {
  name: string;
  applies(subject: Subject): boolean;
  say(subject: Subject, opts: EnglishOptions): Spoken;
}

/** An idiom for a set of one field's values. */
export interface SetIdiom extends Idiom<SetDescription> {
  field: Field;
}

/**
 * A time of day. The second is absent unless it is to be shown; `exact`
 * marks a time written to the minute even on the hour ("9:00").
 */
export interface Moment {
  exact?: boolean;
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
    return moment.hour === hour && moment.minute === 0 && !moment.second;
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
// "half past midnight". A moment written to the second is still the word
// when it falls exactly there.
const momentIdioms: Array<Idiom<Moment>> = [
  {
    applies: onTheHour(0),
    name: 'midnight',
    say(moment, opts) {
      return {length: 1, text: opts.style.midnight};
    }
  },
  {
    applies: onTheHour(12),
    name: 'noon',
    say(moment, opts) {
      return {length: 1, text: opts.style.midday};
    }
  }
];

// A row for one Quartz day form: it applies to that form whatever its
// numbers, and its words are built from them.
function quartzForm<Form extends {kind: string}, Kind extends Form['kind']>(
  kind: Kind,
  name: string,
  wording: (form: Extract<Form, {kind: Kind}>, opts: EnglishOptions) => string
): Idiom<Form> {
  return {
    applies(form) {
      return form.kind === kind;
    },
    name,
    say(form, opts) {
      return {
        length: 1,
        text: wording(form as Extract<Form, {kind: Kind}>, opts)
      };
    }
  };
}

function weekdayOf(day: number, opts: EnglishOptions): string {
  return lexicon.weekdays[day][opts.short ? 'short' : 'full'].text;
}

const lastDay = `${words.the.text} ${words.last.text} ` +
  lexicon.units.day.one.text;

// Each is followed by "of the month" or "of" and the months, except the
// nearest weekday, which is followed by the day it is nearest to.
const quartzDateIdioms: Array<Idiom<QuartzDate>> = [
  quartzForm('last', 'last day of the month', function say() {
    return `${words.on.text} ${lastDay}`;
  }),
  quartzForm('lastWeekday', 'last weekday of the month', function say() {
    return `${words.on.text} ${words.the.text} ${words.last.text} ` +
      words.weekday.text;
  }),
  quartzForm('beforeLast', 'days before the last', function say(form) {
    const days = lexicon.units.day[form.days === 1 ? 'one' : 'many'].text;

    return `${form.days} ${days} ${words.before.text} ${lastDay}`;
  }),
  quartzForm('nearestWeekday', 'weekday nearest a day', function say() {
    return `${words.on.text} ${words.the.text} ${words.weekday.text} ` +
      words.nearest.text;
  })
];

const quartzWeekdayIdioms: Array<Idiom<QuartzWeekday>> = [
  quartzForm('last', 'last such weekday', function say(form, opts) {
    return `${words.on.text} ${words.the.text} ${words.last.text} ` +
      weekdayOf(form.weekday, opts);
  }),
  quartzForm('nth', 'nth such weekday', function say(form, opts) {
    return `${words.on.text} ${words.the.text} ` +
      `${lexicon.nthWords[form.nth].text} ${weekdayOf(form.weekday, opts)}`;
  })
];

export {idioms, momentIdioms, quartzDateIdioms, quartzWeekdayIdioms};
