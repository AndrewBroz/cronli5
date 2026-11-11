// English, built from the answers in ../answers.md: the core's facts
// about a schedule, said as a description.

import type {Language} from '../../../core/schedule.js';
import type {EnglishStyle} from './options.js';
import {arrange} from './frame.js';
import {partsOf} from './fusions.js';
import {normalize} from './options.js';

const english: Language<EnglishStyle> = {
  describe(schedule, opts) {
    return arrange(partsOf(schedule, opts));
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
