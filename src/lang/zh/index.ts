// Chinese (Simplified). A description is five pieces in one order, written
// one after another with no space: the year, the month, the day, the join,
// and the time. Each piece is built from the core's facts about its own
// fields; only the join looks at two of them, and it is one of four fixed
// things. The rules are in ./answers.md.

import type {
  Field, Language, Schedule, SetDescription
} from '../../core/schedule.js';
import {denote} from '../../core/describe-set.js';
import {domainOf} from '../../core/specs.js';
import {beforeMonth, dayOf, monthOf, yearOf} from './days.js';
import lexicon from './lexicon.js';
import type {ChineseOptions, ChineseStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {when} from './sets.js';
import {timeOf} from './time.js';

const {marks, words} = lexicon;

/** The pieces of a description, which joined in this order are it. */
export interface ChineseParts {
  year: string;
  month: string;
  day: string;
  join: string;
  time: string;
}

function valuesOf(schedule: Schedule, field: Field): number[] {
  const found = schedule.analyses.candidates[field] as SetDescription[];

  return denote(found[0], domainOf(field));
}

/**
 * The pieces of a description. The join stands between the day and the
 * time. Before a time that runs round the clock it is a comma, unless
 * nothing stands before it or only a cadence of years that ends in 当年.
 * Before a clock time it is whatever the day part asks for.
 */
function describeParts(schedule: Schedule, opts: ChineseOptions):
  ChineseParts {
  const {candidates} = schedule.analyses;
  const years = yearOf(candidates.year as SetDescription[]);
  const months = monthOf(candidates.month as SetDescription[],
    years.kind === 'none');
  const days = dayOf(schedule, months);
  const year = years.text +
    when(months.kind !== 'none', beforeMonth[years.kind]);
  const month = months.text;
  const time = timeOf({
    hour: valuesOf(schedule, 'hour'),
    minute: valuesOf(schedule, 'minute'),
    second: valuesOf(schedule, 'second')
  }, year + month + days.text === '', opts.style);
  const paused = year + month + days.text !== '' &&
    !(years.kind === 'cycle' && month + days.text === '');

  return {
    day: days.text,
    join: time.allDay ? when(paused, marks.comma) : days.tie,
    month,
    time: time.text,
    year
  };
}

function describe(schedule: Schedule, opts: ChineseOptions): string {
  const parts = describeParts(schedule, opts);

  return parts.year + parts.month + parts.day + parts.join + parts.time;
}

// Chinese has no capitals: a label is the description as it stands.
function label(description: string): string {
  return description;
}

function sentence(description: string): string {
  return words.runsAt + marks.lead + description + marks.stop;
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
  regions,
  sentence,
  style,
  styles
};

export type {ChineseStyle};
export {describeParts, styles};
export default chinese;
