// The Russian renderer: a description is the years, the months that lead,
// the day and the time, in that order, joined by one space (answers, "The
// sentence in one page"). The Russian is Russian as it is written in
// Ukraine.

import type {Language, Schedule} from '../../core/schedule.js';
import {calendarParts} from './day.js';
import lexicon from './lexicon.js';
import type {RussianOptions, RussianStyle} from './options.js';
import {style, styles} from './options.js';
import {timePart} from './seconds.js';

const {words} = lexicon;

/** The four parts of a description, each with the mark that closes it. */
export interface Parts {
  day: string;
  months: string;
  time: string;
  years: string;
}

// Hours past midnight are one run only when every day fires: no date,
// weekday, month or year is restricted.
function everyDayFires(schedule: Schedule): boolean {
  const {candidates} = schedule.analyses;
  const fields = ['date', 'month', 'weekday', 'year'] as const;

  return fields.every(function free(field) {
    return candidates[field]?.[0].kind === 'all';
  });
}

/** A description as its four parts. */
function describeParts(schedule: Schedule, opts: RussianOptions): Parts {
  const time = timePart(schedule, everyDayFires(schedule), opts.style);
  const calendar = calendarParts(schedule, opts.style, time.clockStart);

  return {
    day: calendar.day,
    months: calendar.months,
    time: calendar.never ? '' : time.text,
    years: calendar.years
  };
}

function describe(schedule: Schedule, opts: RussianOptions): string {
  const parts = describeParts(schedule, opts);

  return [parts.years, parts.months, parts.day, parts.time]
    .filter(Boolean).join(' ');
}

const russian: Language<RussianStyle, 'ru'> = {
  code: 'ru',
  defaultStyle: 'ru',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  // A label capitalises its first letter, when it is a letter.
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions: {},
  // A schedule that never fires is «Не выполняется никогда: …».
  sentence(description) {
    const lead = description.startsWith(words.never) ?
      words.neverRuns :
      words.runs;

    return `${lead} ${description}.`;
  },
  style,
  styles
};

export type {RussianStyle};
export {styles};

/** The parts of a description, for the tests. @internal */
export {describeParts};
export default russian;
