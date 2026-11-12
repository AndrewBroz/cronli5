// English, built from the answers in ./answers.md: the core's facts
// about a schedule, said as a description.

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {EnglishOptions, EnglishStyle} from './options.js';
import type {Parts} from './frame.js';
import {arrange} from './frame.js';
import {partsOf} from './fusions.js';
import lexicon from './lexicon.js';
import {normalize} from './options.js';

const {words} = lexicon;

/** The four parts of a description, before they are joined into one frame. */
export function describeParts(schedule: ScheduleFacts, opts: EnglishOptions):
  Parts {
  return partsOf(schedule, opts);
}

const english: Language<EnglishStyle> = {
  describe(schedule, opts) {
    return arrange(describeParts(schedule, opts));
  },
  fallback() {
    return words.unrecognizable;
  },
  options: normalize,
  reboot() {
    return words.startup;
  },
  // One full stop, whether or not the description already ends in one.
  sentence(description) {
    const stop = description.endsWith('.') ? '' : '.';

    return `${words.runs} ${description}${stop}`;
  }
};

export default english;
