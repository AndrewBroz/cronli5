// English, built from the answers in ./answers.md: the core's facts
// about a schedule, said as a description.

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {EnglishOptions, EnglishStyle} from './options.js';
import type {Parts} from './frame.js';
import {arrange} from './frame.js';
import {partsOf} from './fusions.js';
import lexicon from './lexicon.js';
import {regions, style, styles} from './options.js';

const {words} = lexicon;

/** The four parts of a description, before they are joined into one frame. */
export function describeParts(schedule: ScheduleFacts, opts: EnglishOptions):
  Parts {
  return partsOf(schedule, opts);
}

const english: Language<EnglishStyle> = {
  code: 'en',
  defaultStyle: 'us',
  describe(schedule, opts) {
    return arrange(describeParts(schedule, opts));
  },
  fallback() {
    return words.unrecognizable;
  },
  // A description standing alone as a label starts with a capital.
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions,
  // One full stop, whether or not the description already ends in one.
  sentence(description) {
    const stop = description.endsWith('.') ? '' : '.';

    return `${words.runs} ${description}${stop}`;
  },
  style,
  styles
};

export type {EnglishStyle};
export {styles};
export default english;
