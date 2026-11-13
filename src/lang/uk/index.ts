// The Ukrainian renderer. One frame: time, then day, then month, then
// year, joined by single spaces. The time part is built in ./time.ts, the
// calendar parts in ./calendar.ts, and every word is in ./lexicon.ts. The
// rules are the answers in ./answers.md.

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {UkrainianOptions, UkrainianStyle} from './options.js';
import {calendarParts, isAll, unwrapped} from './calendar.js';
import {style, styles} from './options.js';
import type {Part} from './calendar.js';
import lexicon from './lexicon.js';
import {timePart} from './time.js';

const {words} = lexicon;

/** The four parts of a description, each empty when it is silent. */
export interface Parts {
  time: string;
  day: string;
  month: string;
  year: string;
}

/**
 * The parts of the sentence in spoken order. A part that ends in an
 * exception, or that is followed by a part set off from it, is closed by
 * a comma when another part follows.
 */
function describeParts(
  schedule: ScheduleFacts,
  opts: UkrainianOptions
): Parts {
  const {candidates} = schedule.analyses;
  const calendarOpen = ['date', 'weekday', 'month', 'year'].every(
    function open(field) {
      return isAll(candidates[field as 'date']);
    }
  );
  const spoken = timePart(
    schedule, unwrapped(schedule, 'hour', calendarOpen), opts.style);
  const time: Part = {...spoken, named: false, setOff: false};
  const calendar = calendarParts(schedule, time,
    !isAll(candidates.hour) && !spoken.round, opts.style);
  const parts = [time, calendar.day, calendar.month, calendar.year];
  const [timeText, day, month, year] = parts.map(
    function close(part, index) {
      const next = parts.slice(index + 1).find(function said(later) {
        return later.text !== '';
      });

      return part.text && next && (part.exception || next.setOff) ?
        `${part.text},` :
        part.text;
    }
  );

  return {day, month, time: timeText, year};
}

function describe(schedule: ScheduleFacts, opts: UkrainianOptions): string {
  const parts = describeParts(schedule, opts);

  return [parts.time, parts.day, parts.month, parts.year]
    .filter(Boolean)
    .join(' ');
}

function label(description: string): string {
  return description.charAt(0).toUpperCase() + description.slice(1);
}

function sentence(description: string): string {
  const stop = description.endsWith('.') ? '' : '.';

  return `${words.runs} ${description}${stop}`;
}

function reboot(): string {
  return words.startup;
}

function fallback(): string {
  return words.unrecognizable;
}

const ukrainian: Language<UkrainianStyle> = {
  code: 'uk',
  defaultStyle: 'standard',
  describe,
  fallback,
  label,
  reboot,
  regions: {},
  sentence,
  style,
  styles
};

export type {UkrainianStyle};
export {describeParts, styles};
export default ukrainian;
