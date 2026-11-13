// Japanese: the description of a schedule, coarsest part first and written
// without spaces. The calendar says the year, the month and the day, the
// clock says the time, and what joins the two depends on both.

import type {Language, Schedule, SetDescription}
  from '../../core/schedule.js';
import type {Calendar, Lead} from './calendar.js';
import {calendarPart} from './calendar.js';
import type {TimeKind} from './clock.js';
import {timePart} from './clock.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import lexicon from './lexicon.js';
import type {JapaneseOptions, JapaneseStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {when} from './phrases.js';

const {marks, words} = lexicon;

/** The four parts of a description, each ending in what joins it on. */
export interface Parts {
  day: string;
  month: string;
  time: string;
  year: string;
}

const shared = marks.comma + words.inEach;
const allDay = marks.comma + words.allDay;

// What stands between the day part and the time: by what the day part
// ends in, then by how the time begins. Several days that share a time
// close with いずれも; 毎日 runs straight into a clock time; the even or
// odd hours follow a comma; and a cadence through every hour takes 終日.
const joins: Record<Lead, Record<TimeKind, string>> = {
  everyDay: {allDay, clock: '', hourly: words.of, rule: marks.comma},
  none: {allDay: '', clock: '', hourly: '', rule: ''},
  other: {
    allDay, clock: words.of, hourly: words.of, rule: marks.comma
  },
  shared: {
    allDay: shared + words.allDay, clock: shared, hourly: shared,
    rule: shared
  }
};

// A field's values, when it does not take every one of them.
function restricted(candidates: SetDescription[] | null): boolean {
  return candidates === null || candidates[0].kind !== 'all';
}

function valuesOf(schedule: Schedule, field: 'hour' | 'minute' | 'second'):
  number[] {
  const candidates = schedule.analyses.candidates[field] as SetDescription[];

  return denote(candidates[0], domainOf(field));
}

/**
 * The parts of a description: joined in the order year, month, day, time,
 * with nothing between, they are the description.
 */
function describeParts(schedule: Schedule, opts: JapaneseOptions): Parts {
  const {candidates} = schedule.analyses;
  // A stretch of hours past midnight is only true when every day fires.
  const wrap = !restricted(candidates.date) &&
    !restricted(candidates.weekday) && !restricted(candidates.month) &&
    !restricted(candidates.year);
  const time = timePart({
    hours: valuesOf(schedule, 'hour'),
    minutes: valuesOf(schedule, 'minute'),
    seconds: valuesOf(schedule, 'second'),
    wrap
  }, opts.style);
  const calendar: Calendar = calendarPart(schedule, {
    allDay: time.kind === 'allDay',
    restricted: !time.everyHour
  }, opts.style);

  // A schedule that never runs says only that.
  return {
    day: calendar.day + when(calendar.runs, joins[calendar.lead][time.kind]),
    month: calendar.month,
    time: when(calendar.runs, time.text),
    year: calendar.year
  };
}

function describe(schedule: Schedule, opts: JapaneseOptions): string {
  const parts = describeParts(schedule, opts);

  return parts.year + parts.month + parts.day + parts.time;
}

const japanese: Language<JapaneseStyle> = {
  code: 'ja',
  defaultStyle: 'standard',
  describe,
  fallback: () => words.unrecognizable,
  // Japanese has no capitals: a label is the description as it stands.
  label: (description) => description,
  reboot: () => words.startup,
  regions,
  // A description is closed with に実行します。; one that says the schedule
  // never runs is itself the statement, and says it as a sentence does.
  sentence: (description) => (description.startsWith(words.never) ?
    words.neverRuns + description.slice(words.never.length) :
    description + words.runsAt + words.runs) + marks.stop,
  style,
  styles
};

export type {JapaneseStyle};
export {describeParts, styles};
export default japanese;
