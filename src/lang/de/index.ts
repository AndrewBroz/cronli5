// German. A description runs coarsest first: the year, the month, the
// day, then the time, in which the stretch of the day stands before what
// happens in it. The rules are in answers.md and the words in lexicon.ts.

import type {Language, Schedule} from '../../core/schedule.js';
import {calendar} from './days.js';
import lexicon from './lexicon.js';
import type {GermanOptions, GermanStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {join} from './sets.js';
import {timePart} from './time.js';
import {voiceOf} from './voice.js';

const {words} = lexicon;

/** The four parts of a description, each empty where it has nothing. */
export interface GermanParts {
  day: string;
  month: string;
  time: string;
  year: string;
}

/**
 * A description as its parts, in the order they are said. Joined by
 * single spaces they are the description. A closing comma and an opening
 * «jeweils» belong to the join between two parts.
 */
function describeParts(schedule: Schedule, opts: GermanOptions): GermanParts {
  const voice = voiceOf(opts.style);
  const time = timePart(schedule, voice);
  const {day, lead, month, year} = calendar(schedule, time, voice);

  return {day, month, time: lead + time.text, year};
}

function describe(schedule: Schedule, opts: GermanOptions): string {
  const {day, month, time, year} = describeParts(schedule, opts);

  return join([year, month, day, time]);
}

const german: Language<GermanStyle> = {
  code: 'de',
  defaultStyle: 'de',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  // A label starts with a capital letter; a digit stays as it is.
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions,
  sentence(description) {
    return `${words.runs} ${description}.`;
  },
  style,
  styles
};

export type {GermanStyle};
export {describeParts, styles};
export default german;
