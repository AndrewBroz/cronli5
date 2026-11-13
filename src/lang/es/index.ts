// The Spanish renderer. A description is four parts in one order, from
// the calendar to the clock (answers 2.1): the leading frame, the day,
// the time, and the days of the month a union adds after the time.

import type {Language, Schedule, SetDescription} from '../../core/schedule.js';
import type {SpanishOptions, SpanishStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {calendarOf} from './calendar.js';
import {clockOf, pick} from './wording.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import {timePart} from './time.js';

const {words} = lexicon;

/** The parts of a description, each with the comma that follows it. */
export interface Parts {
  frame: string;
  day: string;
  time: string;
  also: string;
}

// Whether a field takes every value. A Quartz form does not.
function open(candidates: SetDescription[] | null): boolean {
  return candidates !== null && candidates[0].kind === 'all';
}

function timeValues(schedule: Schedule, field: 'hour' | 'minute' | 'second'):
  number[] {
  const candidates = schedule.analyses.candidates[field] as SetDescription[];

  return denote(candidates[0], domainOf(field));
}

// A part with a comma after it, when it is there and the join asks for
// one.
function closed(part: string, comma: boolean): string {
  return part !== '' && comma ? `${part},` : part;
}

/**
 * The four parts of a description. Their non-empty members, joined by
 * spaces, are the description.
 */
function describeParts(schedule: Schedule, opts: SpanishOptions): Parts {
  const {candidates} = schedule.analyses;
  const time = timePart({
    hour: timeValues(schedule, 'hour'),
    // Hours run past midnight as one run only when nothing coarser is
    // restricted (answers 3.5).
    hoursWrap: open(candidates.date) && open(candidates.weekday) &&
      open(candidates.month) && open(candidates.year),
    minute: timeValues(schedule, 'minute'),
    second: timeValues(schedule, 'second')
  }, clockOf(opts.style));
  const calendar = calendarOf(schedule, time.everyHour, opts.style);

  // A clock time follows the day with a space; anything else, and
  // anything after an inserted phrase, follows a comma. «A la» is also
  // how «a las» begins.
  const clockTime = time.text.startsWith(words.atOne);

  // A schedule that never fires says so in place of the day, and has no
  // time to say (answers 4.4).
  return pick([
    [{also: '', day: calendar.day, frame: '', time: ''},
      calendar.never],
    [{
      also: calendar.also,
      day: closed(calendar.day, calendar.dayClosed || !clockTime),
      frame: calendar.frame.map(function leading(phrase) {
        return `${phrase},`;
      }).join(' '),
      time: closed(time.text, calendar.also !== '')
    }, true]
  ]);
}

function describe(schedule: Schedule, opts: SpanishOptions): string {
  const parts = describeParts(schedule, opts);

  return [parts.frame, parts.day, parts.time, parts.also]
    .filter(Boolean).join(' ');
}

const spanish: Language<SpanishStyle> = {
  code: 'es',
  defaultStyle: 'es',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions,
  // A description that already ends in a full stop, as «p. m.» does,
  // takes no second one. A schedule that never fires takes the negative
  // before the verb: «No se ejecuta nunca, porque …».
  sentence(description) {
    const stop = description.endsWith('.') ? '' : '.';
    const verb = description.startsWith(words.never) ?
      words.neverRuns :
      words.runs;

    return `${verb} ${description}${stop}`;
  },
  style,
  styles
};

export type {SpanishOptions, SpanishStyle};
export {describeParts, styles};
export default spanish;
