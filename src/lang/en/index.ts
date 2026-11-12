// English, built from the answers in ./answers.md: the core's facts
// about a schedule, said as a description.

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {EnglishOptions, EnglishStyle} from './options.js';
import type {Parts} from './frame.js';
import {arrange} from './frame.js';
import {partsOf} from './fusions.js';
import {normalize} from './options.js';

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
    return 'an unrecognizable cron pattern';
  },
  options: normalize,
  reboot() {
    return 'at system startup';
  },
  // One full stop, whether or not the description already ends in one.
  sentence(description) {
    return `Runs ${description}${description.endsWith('.') ? '' : '.'}`;
  }
};

export default english;
