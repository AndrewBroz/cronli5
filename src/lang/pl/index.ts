// The Polish renderer: a description is a frame of years and months, a
// day part, a time and, for one family, a closing clause, in that order
// (src/lang/pl/answers.md).

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import {calendar} from './calendar.js';
import type {Parts} from './calendar.js';
import {fieldForm} from './forms.js';
import lexicon from './lexicon.js';
import {never, neverFires} from './never.js';
import type {PolishOptions, PolishStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {timeOf} from './seconds.js';
import {clockFor} from './text.js';

const {words} = lexicon;

// Hours that run past midnight stay one run only when nothing coarser is
// restricted: under a named day the run would promise the next day's
// early hours.
function hoursMayWrap(facts: ScheduleFacts): boolean {
  const {candidates} = facts.analyses;

  return [candidates.date, candidates.month, candidates.weekday,
    candidates.year].every(function unrestricted(field) {
    return field !== null && field[0].kind === 'all';
  });
}

/**
 * The parts of a description, each with the comma or colon that follows
 * it; the non-empty ones, joined by spaces, are the description.
 */
function describeParts(facts: ScheduleFacts, opts: PolishOptions): Parts {
  const {short} = opts.style;
  const time = timeOf({
    clock: clockFor(opts.style),
    hour: fieldForm(facts, 'hour', hoursMayWrap(facts)),
    minute: fieldForm(facts, 'minute', false),
    second: fieldForm(facts, 'second', false),
    short
  });

  return neverFires(facts) ?
    {closing: '', day: never(facts), frame: '', time: ''} :
    calendar(facts, time, short);
}

function describe(facts: ScheduleFacts, opts: PolishOptions): string {
  const parts = describeParts(facts, opts);

  return [parts.frame, parts.day, parts.time, parts.closing]
    .filter(Boolean).join(' ');
}

const polish: Language<PolishStyle, 'pl'> = {
  code: 'pl',
  defaultStyle: 'pl',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  // A label starts with a capital letter, if it starts with a letter.
  label(description) {
    return `${description.charAt(0).toUpperCase()}${description.slice(1)}`;
  },
  reboot() {
    return words.startup;
  },
  regions,
  // «Uruchamia się …», closed by a full stop unless an abbreviation has
  // already closed it. The schedule that never fires does not follow the
  // verb.
  sentence(description) {
    const verb = [words.runs, words.neverRuns][
      Number(description.startsWith(words.never))];
    const stop = '.'.repeat(Number(!description.endsWith('.')));

    return `${verb} ${description}${stop}`;
  },
  style,
  styles
};

export type {PolishStyle};
export {describeParts, styles};
export default polish;
