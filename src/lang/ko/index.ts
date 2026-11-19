// Korean: a description is the calendar, a fill word and the time, large
// to small, built from the core's facts and this language's lexicon. The
// choices and their reasons are in answers.md.

import type {Language, Schedule} from '../../core/schedule.js';
import type {Reach} from './calendar.js';
import {calendarOf} from './calendar.js';
import {join, noted} from './clock.js';
import lexicon from './lexicon.js';
import type {KoreanOptions, KoreanStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {timeOf} from './seconds.js';

const {words} = lexicon;

/** A description as its parts, in the order they are said. */
interface Parts {
  calendar: string;
  fill: string;
  note: string;
  time: string;
}

// The word between the calendar and the time says what the level between
// them does: by whether the time part names a clock time, and by what
// the calendar names.
const fills: {[names: string]: Record<Reach, string>} = {
  false: {
    daily: '',
    day: words.allDay,
    never: '',
    none: '',
    note: words.everyDay,
    span: words.throughout
  },
  true: {
    daily: '',
    day: '',
    never: '',
    none: words.everyDay,
    note: words.everyDay,
    span: words.everyDay
  }
};

// A closing bracket, which a sentence writes after its verb. It may hold
// one bracket of its own.
const closingBracket = /^(.*?)(\((?:[^()]|\([^()]*\))*\))?$/su;

/**
 * The parts of a description: the calendar, the fill, the time, and the
 * note that closes a sentence whose days carry a condition, without its
 * bracket. The non-empty ones of the first three joined with spaces, and
 * then the note in a bracket, are the description.
 */
function describeParts(schedule: Schedule, opts: KoreanOptions): Parts {
  const time = timeOf(schedule, opts.style);
  const calendar = calendarOf(schedule, opts.style);

  return {
    calendar: calendar.text,
    fill: fills[String(time.names)][calendar.reach],
    note: calendar.note,
    time: [time.text, ''][Number(calendar.reach === 'never')]
  };
}

// The note that closes a sentence is a bracket. After a time part that
// ends in a bracket of its own it joins that bracket, after a full stop.
function describe(schedule: Schedule, opts: KoreanOptions): string {
  const parts = describeParts(schedule, opts);
  const body = join(parts.calendar, parts.fill, parts.time);

  return parts.note && noted(body, parts.note, '. ') || body;
}

// A sentence ends in «실행됩니다», after «에» unless the last word is a
// rhythm or already carries «에도». A bracket that ends the description
// is written after the verb.
function sentence(description: string): string {
  const [, body, bracket = ''] =
    closingBracket.exec(description) as RegExpExecArray;
  const flowing = [words.every, words.alsoAt].some(function ends(word) {
    return body.endsWith(word);
  });
  const verb = [`${words.at} ${words.runs}`, ` ${words.runs}`][
    Number(flowing)];

  return description === words.neverRuns ?
    `${words.neverRunsSentence}.` :
    `${body}${verb}${bracket}.`;
}

const korean: Language<KoreanStyle, 'ko'> = {
  code: 'ko',
  defaultStyle: 'ko',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  // Hangul has no capitals: a label is the description unchanged.
  label(description) {
    return description;
  },
  reboot() {
    return words.startup;
  },
  regions,
  sentence,
  style,
  styles
};

export type {KoreanStyle};
export {styles};

/** The parts of a description, for the tests. @internal */
export {describeParts};
export default korean;
