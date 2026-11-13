// Idioms: the fixed phrasings English has for particular sets and
// moments. Each row states what it applies to as a condition on the
// values, and what is said. An idiom names one thing however many values
// it stands for.

import type {
  CadencePieces, Field, QuartzDate, QuartzWeekday, SetDescription
} from '../../core/schedule.js';
import type {EnglishOptions} from './options.js';
import {domainOf} from '../../core/specs.js';
import {named, unit} from './forms.js';
import lexicon from './lexicon.js';

/** A fixed phrasing and the condition under which it is said. */
export interface Idiom<Subject> {
  applies(subject: Subject): boolean;
  say(subject: Subject, opts: EnglishOptions): string;
}

/** An idiom for a set of one field's values. */
export interface SetIdiom extends Idiom<SetDescription | CadencePieces> {
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

const {units, words} = lexicon;

// A set is the same set however it was written, and the core describes
// each set one way, so matching the description is matching the values.
// Every second value of a field, from its first value or the one after,
// to the end of the field.
function alternate(field: Field, offset: number, phrase: string): SetIdiom {
  const {max, min} = domainOf(field);
  const start = min + offset;
  const last = max - (max - start) % 2;

  return {
    applies(set) {
      return set.kind === 'cadence' && set.interval === 2 &&
        set.start === start && set.last === last;
    },
    field,
    say() {
      return phrase;
    }
  };
}

function running(from: number, to: number, phrase: string): SetIdiom {
  return {
    applies(set) {
      return set.kind === 'range' && set.from === from && set.to === to;
    },
    field: 'weekday',
    say() {
      return phrase;
    }
  };
}

const idioms: SetIdiom[] = [
  alternate('date', 0, `${words.on} ${words.oddDays}`),
  alternate('date', 1, `${words.on} ${words.evenDays}`),
  running(1, 5, `${words.on} ${words.weekdays}`),
  running(6, 0, `${words.on} ${words.weekends}`),
  alternate('year', 0, `${words.in} ${words.evenYears}`),
  alternate('year', 1, `${words.in} ${words.oddYears}`)
];

// The moment an hour starts, said as a word. Said only of the moment
// itself, in 12-hour time: 12:30 a.m. is not "half past midnight". A
// moment written to the second is still the word when it falls exactly
// there.
function onTheHour(hour: number, word: 'midday' | 'midnight'): Idiom<Moment> {
  return {
    applies(moment) {
      return moment.hour === hour && moment.minute === 0 && !moment.second;
    },
    say(moment, opts) {
      return opts.style[word];
    }
  };
}

const momentIdioms = [onTheHour(0, 'midnight'), onTheHour(12, 'midday')];

// A row for one Quartz day form: it applies to that form whatever its
// numbers, and its words are built from them.
function quartzForm<Form extends {kind: string}, Kind extends Form['kind']>(
  kind: Kind,
  say: (form: Extract<Form, {kind: Kind}>, opts: EnglishOptions) => string
): Idiom<Form> {
  return {
    applies(form) {
      return form.kind === kind;
    },
    say: say as Idiom<Form>['say']
  };
}

function weekdayOf(day: number, opts: EnglishOptions): string {
  return named(lexicon.weekdays[day], 'full', opts);
}

// The earliest day that can be a month's last. The weekday nearest a day
// never leaves the month, and from here on a reader could look for it in
// the next one.
const earliestLastDay = 28;

const onTheLast = `${words.on} ${words.the} ${words.last}`;
const lastDay = `${words.the} ${words.last} ${units.day.one}`;

// Each is followed by "of the month" or "of" and the months, except the
// nearest weekday, which is followed by the day it is nearest to. The
// first row that applies is said.
const quartzDateIdioms: Array<Idiom<QuartzDate>> = [
  quartzForm('last', function lastDayOfMonth() {
    return `${words.on} ${lastDay}`;
  }),
  quartzForm('lastWeekday', function lastWeekdayOfMonth() {
    return `${onTheLast} ${words.weekday}`;
  }),
  quartzForm('firstWeekday', function firstWeekdayOfMonth() {
    return `${words.on} ${words.the} ${lexicon.nthWords[0]} ${words.weekday}`;
  }),
  quartzForm('beforeLast', function daysBeforeLast(form) {
    return `${form.days} ${unit('day', form.days)} ${words.before} ${lastDay}`;
  }),
  {
    applies(form) {
      return form.kind === 'nearestWeekday' && form.day >= earliestLastDay;
    },
    say() {
      return `${words.on} ${words.the} ${words.weekday} ${words.sameMonth} ` +
        words.nearest;
    }
  },
  quartzForm('nearestWeekday', function weekdayNearest() {
    return `${words.on} ${words.the} ${words.weekday} ${words.nearest}`;
  })
];

const quartzWeekdayIdioms: Array<Idiom<QuartzWeekday>> = [
  quartzForm('last', function lastSuchWeekday(form, opts) {
    return `${onTheLast} ${weekdayOf(form.weekday, opts)}`;
  }),
  quartzForm('nth', function nthSuchWeekday(form, opts) {
    return `${words.on} ${words.the} ${lexicon.nthWords[form.nth - 1]} ` +
      weekdayOf(form.weekday, opts);
  })
];

export {idioms, momentIdioms, quartzDateIdioms, quartzWeekdayIdioms};
