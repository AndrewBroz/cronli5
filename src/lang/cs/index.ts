// Czech. One frame, from the large to the small: years, months, days,
// time. The rule book is ./answers.md; every word is in ./lexicon.ts.

import type {
  Language, NormalizedOptions, Schedule, SetDescription
} from '../../core/schedule.js';
import {denote, domainOf} from '../../core/index.js';
import type {CzechStyle} from './options.js';
import {regions, style, styles} from './options.js';
import {monthsSaid, yearsOf} from './calendar.js';
import type {Close, DayPart} from './days.js';
import {armsOf, dayPart} from './days.js';
import type {Opening} from './clock.js';
import {timePart} from './seconds.js';
import type {Described} from './sets.js';
import {spaced} from './sets.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** The options a Czech description is rendered under. */
export type CzechOptions = NormalizedOptions<CzechStyle>;

/** A description as its three parts, each with what joins it to the next. */
export interface Parts {
  day: string;
  frame: string;
  time: string;
}

// What the leading years and months are worked out from.
interface Lead {
  // Whether the day part is a date that stands alone.
  alone: boolean;
  // The single year written beside a single month.
  beside: string;
  months: number[];
  years: ReturnType<typeof yearsOf>;
}

// The day parts «vždy» closes before the time, by what opens the time: a
// union always, and a range or an exception before a list of clock
// times. The places of the minutes open with their own «vždy», which is
// not said after «denně» or after the one that closes a union.
const alwaysCloses: Record<Opening, Close[]> = {
  '': ['always'],
  always: ['always'],
  times: ['always', 'span']
};

// The months that are named: none when every month is reached, and not
// those in which a date that stands alone can never fire.
function monthsNamed(schedule: Schedule, alone: boolean): number[] {
  const reach = schedule.analyses.dateReach;
  const set = schedule.analyses.candidates.month as SetDescription[];
  const skipped = alone && reach?.fires ? reach.never : [];

  return denote(set[set.length - 1], domainOf('month')).filter(
    function named(month) {
      return set[0].kind !== 'all' && !skipped.includes(month);
    }
  );
}

// The year a single month or a date of it carries, when the pattern has
// exactly one year and one month.
function yearBeside(years: Described, months: number[]): string {
  return years.kind === 'values' && months.length === 1 &&
    years.values.length === 1 ?
    String(years.values[0]) :
    '';
}

// Whether a date that stands alone fires in leap years only.
function leapOnly(schedule: Schedule): boolean {
  const reach = schedule.analyses.dateReach;

  return Boolean(reach?.fires && reach.leapYears.length) &&
    !reach?.everyYear.length;
}

// The years and months that lead: a single year beside a single month
// is written after it, months taken into the day part are not said, and
// a date that fires in leap years only says so where no year is named.
function frameOf(schedule: Schedule, day: DayPart, lead: Lead): string {
  const {alone, beside, months, years} = lead;
  const everyYear = years.form.kind === 'all';
  const leap = alone && everyYear && leapOnly(schedule) ?
    words.inLeapYears :
    '';
  const month = day.consumed || !months.length ?
    '' :
    spaced(monthsSaid(months, everyYear), beside);

  return spaced(beside ? '' : years.text || leap, month);
}

/** The parts of a description: the years and months, the day, the time. */
function describeParts(schedule: Schedule, opts: CzechOptions): Parts {
  const {style: table} = opts;
  const arms = armsOf(schedule);
  const alone = arms.date && !arms.weekday;
  const years = yearsOf(schedule);
  const months = monthsNamed(schedule, alone);
  const beside = yearBeside(years.form, months);
  const free = [years.form.kind !== 'all', months.length, arms.date,
    arms.weekday].every(function unrestricted(restricted) {
    return !restricted;
  });
  const time = timePart(schedule, free, table);
  const [hours] = schedule.analyses.candidates.hour as SetDescription[];
  const restricted = time.night ? words.everyNight : words.daily;
  const day = dayPart(schedule, {
    idle: hours.kind === 'all' ? '' : restricted,
    months,
    style: table,
    year: beside
  });
  // The places of the minutes keep their own «vždy» unless the day part
  // has just said one: after «denně», after a union, or after a day part
  // that itself opens with «vždy».
  const own = time.opening === 'always' &&
    !['always', 'daily'].includes(day.close) &&
    !day.text.startsWith(`${words.always} `);
  const closed = !day.never && alwaysCloses[time.opening].includes(day.close);

  return {
    day: spaced(day.text, closed ? words.always : ''),
    frame: frameOf(schedule, day, {alone, beside, months, years}),
    time: day.never ? '' : spaced(own ? words.always : '', time.text)
  };
}

function describe(schedule: Schedule, opts: CzechOptions): string {
  const parts = describeParts(schedule, opts);

  return spaced(parts.frame, parts.day, parts.time);
}

const czech: Language<CzechStyle> = {
  code: 'cs',
  defaultStyle: 'cs',
  describe,
  fallback: () => words.unrecognizable,
  label: (description) =>
    description.charAt(0).toUpperCase() + description.slice(1),
  reboot: () => words.startup,
  regions,
  sentence: (description) =>
    `${words.runs} ${description}.`,
  style,
  styles
};

export type {CzechStyle};
export {describeParts, styles};
export default czech;
