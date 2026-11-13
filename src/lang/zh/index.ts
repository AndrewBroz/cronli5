// Chinese (Simplified). One frame, coarsest part first, as a Chinese date
// and time is written: year, month, day, time, with nothing between them.
// Built from the answers to the language questionnaire (./answers.md).

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {ChineseOptions, ChineseStyle} from './options.js';
import {style, styles} from './options.js';
import {describeDays} from './days.js';
import {describeTime} from './time.js';
import lexicon from './lexicon.js';

const {marks, words} = lexicon;

/** The four parts of a description, each empty when it is silent. */
export interface Parts {
  day: string;
  month: string;
  time: string;
  year: string;
}

/**
 * The parts of a description. A comma that parts two of them belongs to
 * the end of the earlier one.
 */
function describeParts(schedule: ScheduleFacts, opts: ChineseOptions): Parts {
  const time = describeTime(schedule, opts);

  return {...describeDays(schedule, time.allDay), time: time.text};
}

function describe(schedule: ScheduleFacts, opts: ChineseOptions): string {
  const parts = describeParts(schedule, opts);

  return parts.year + parts.month + parts.day + parts.time;
}

// Chinese has no capitals: a label is the description as it stands.
function label(description: string): string {
  return description;
}

function sentence(description: string): string {
  return description + words.runs + marks.stop;
}

function reboot(): string {
  return words.startup;
}

function fallback(): string {
  return words.unrecognizable;
}

const chinese: Language<ChineseStyle> = {
  code: 'zh',
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

export type {ChineseStyle};
export {describeParts, styles};
export default chinese;
