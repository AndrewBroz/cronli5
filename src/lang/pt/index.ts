// The Portuguese renderer: the calendar part, then the time part, in one
// frame. Every word comes from the lexicon; every rule from the answers
// to the language questionnaire beside this file.

import type {Field, Language, Schedule} from '../../core/schedule.js';
import type {PortugueseOptions, PortugueseStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {calendarPart} from './calendar.js';
import lexicon from './lexicon.js';
import {restricts} from './sets.js';
import {timePart} from './time.js';

const {words} = lexicon;

/** The parts of a description, which join in this order with spaces. */
export interface Parts {
  day: string;
  month: string;
  time: string;
  year: string;
}

const calendarFields: Field[] = ['date', 'weekday', 'month', 'year'];

/**
 * A description as its parts. The days carry their month and year the way
 * a date does, so the whole calendar is held in the day part, with the
 * mark that joins it to the time: a comma, nothing, or «, sempre» after a
 * day of the month and a weekday together.
 */
function describeParts(schedule: Schedule, opts: PortugueseOptions): Parts {
  const {analyses} = schedule;
  const {candidates} = analyses;
  const open = calendarFields.every((field) => !restricts(candidates[field]));
  const time = timePart(analyses, open, opts.style);
  const calendar =
    calendarPart(analyses, restricts(candidates.hour), opts.style);
  const marks = {
    comma: ',',
    never: '',
    open: time.clock ? '' : ',',
    pair: `, ${words.always}`
  };

  // A schedule that never fires has no time to say.
  return {
    day: calendar.text === '' ? '' : calendar.text + marks[calendar.join],
    month: '',
    time: calendar.join === 'never' ? '' : time.text,
    year: ''
  };
}

function describe(schedule: Schedule, opts: PortugueseOptions): string {
  const parts = describeParts(schedule, opts);

  return [parts.day, parts.time].filter(Boolean).join(' ');
}

const portuguese: Language<PortugueseStyle> = {
  code: 'pt',
  defaultStyle: 'br',
  describe,
  fallback: () => words.unrecognizable,
  label: (description) =>
    description.charAt(0).toLocaleUpperCase('pt') + description.slice(1),
  reboot: () => words.startup,
  regions,
  // «Nunca» goes before the verb: «Nunca ocorre (…).»
  sentence: (description) => (description.startsWith(`${words.never} `) ?
    words.neverRuns + description.slice(words.never.length) :
    `${words.runs} ${description}`) +
    (description.endsWith('.') ? '' : '.'),
  style,
  styles
};

export type {PortugueseStyle};
export {describeParts, styles};
export default portuguese;
