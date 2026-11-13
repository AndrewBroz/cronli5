// Italian. A description is four parts in one order, from the calendar to
// the clock: the years and months that lead, the days, the time, and the
// months or years left out, which close. The rules are in answers.md.

import type {Language, ScheduleFacts} from '../../core/schedule.js';
import type {ItalianOptions, ItalianStyle} from './options.js';
import {regions, style, styles} from './options.js';
import type {DaySaid, MonthPlace} from './days.js';
import {sayDay} from './days.js';
import {chooseMonths, sayMonths, sayYears} from './calendar.js';
import {firstOf} from './sets.js';
import {phrase, speechOf} from './words.js';
import {sayTime} from './time.js';
import lexicon from './lexicon.js';

const {words} = lexicon;

/** The parts of a description, each with the comma that follows it. */
interface Parts {
  closing: string;
  day: string;
  frame: string;
  time: string;
}

// The longest month, which the months of 31 days are named after.
const LONGEST_MONTH = 31;

type SetField = 'date' | 'hour' | 'month' | 'weekday' | 'year';

// Whether a field narrows what fires: a Quartz form does, and a plain set
// does unless it is every value.
function restricted(facts: ScheduleFacts, field: SetField): boolean {
  const [first] = facts.analyses.candidates[field] || [];

  return first?.kind !== 'all';
}

// The day arms that are said: neither when the dates are every day the
// months have, and no date when it adds nothing to the weekdays.
function armsOf(facts: ScheduleFacts) {
  const {dateReach, day} = facts.analyses;
  const said = !dateReach?.days?.everyDay;
  const dated = said && !day.dateAddsNothing && restricted(facts, 'date');

  return {
    date: dated && day.date || null,
    weekday: said && restricted(facts, 'weekday') && day.weekday || null
  };
}

type Arms = ReturnType<typeof armsOf>;

// The months a date arm alone is said with: the ones it can fire in, when
// the calendar keeps it out of some.
function monthsReached(facts: ScheduleFacts, alone: boolean): number[] | null {
  const {dateReach} = facts.analyses;

  return alone && dateReach &&
    [...dateReach.everyYear, ...dateReach.leapYears].sort(
      function ascending(a, b) {
        return a - b;
      }
    ) || null;
}

// Whether a date arm alone fires in the months of 31 days out of every
// month, which have a name.
function inLongMonths(facts: ScheduleFacts, alone: boolean): boolean {
  const {monthLengths} = facts.analyses;

  return alone && !restricted(facts, 'month') &&
    monthLengths.length === 1 && monthLengths[0].length === LONGEST_MONTH;
}

// Where the months stand for the day part, and the form they are said in.
function monthsFor(facts: ScheduleFacts, arms: Arms) {
  const union = Boolean(arms.date && arms.weekday);
  const alone = Boolean(arms.date) && !union;
  const long = inLongMonths(facts, alone);
  const chosen = chooseMonths(facts, {
    linear: restricted(facts, 'year'),
    plain: union,
    reached: monthsReached(facts, alone)
  });
  const form = long ? {kind: 'all' as const} : chosen;
  const values = (form as {values?: number[]}).values || [];
  const closes = (form as {base?: {kind: string}}).base?.kind === 'all';
  const kinds: Array<MonthPlace['kind'] | false> = [
    long && 'long',
    (form.kind === 'all' || closes) && 'every',
    !union && values.length === 1 && 'one',
    'several'
  ];

  return {form, place: {kind: firstOf(kinds), month: values[0] || 0}};
}

// The day and the time are joined by a space when the time begins with a
// clock time and by a comma otherwise, and by a comma in any case after
// an exception or a gloss. A union ends with its own word and a space.
function dayJoin(days: DaySaid, time: string, arms: Arms): string {
  const atClock = time.startsWith(`${words.toHours} `) ||
    time.startsWith(words.toElided);
  const union = Boolean(arms.date && arms.weekday) &&
    days.text.endsWith(words.always);

  return phrase(days.text !== '' && !union && (days.glossed || !atClock) &&
    ',');
}

/** The parts of a description, which joined by spaces are the whole. */
function describeParts(facts: ScheduleFacts, opts: ItalianOptions): Parts {
  const {dateReach, day} = facts.analyses;

  if (dateReach?.fires === false && !day.union) {
    return {closing: '', day: words.never, frame: '', time: ''};
  }

  const speech = speechOf(opts.style);
  const arms = armsOf(facts);
  const months = monthsFor(facts, arms);
  const days = sayDay({
    ...arms,
    hoursNamed: restricted(facts, 'hour'),
    place: months.place,
    speech
  }, facts);
  const years = sayYears(facts);
  const monthsSaid = sayMonths(months.form, speech);
  const fixed = [arms.date, arms.weekday, restricted(facts, 'month'),
    restricted(facts, 'year')].some(Boolean);
  const time = sayTime(facts, speech, !fixed);
  const closing = [monthsSaid.closing, years.closing].filter(Boolean)
    .join(` ${words.andExcept} `);

  // After an exception of the time, what closes is one more exception.
  return {
    closing: phrase(closing &&
      `${time.excepted && words.andExcept || words.except} ${closing}`),
    day: days.text + dayJoin(days, time.text, arms),
    frame: [years.lead, !days.fused && monthsSaid.lead].filter(Boolean)
      .map(function led(lead) {
        return `${lead},`;
      }).join(' '),
    time: time.text + phrase(closing && !time.excepted && ',')
  };
}

function describe(facts: ScheduleFacts, opts: ItalianOptions): string {
  const parts = describeParts(facts, opts);

  return phrase(parts.frame, parts.day, parts.time, parts.closing);
}

const italian: Language<ItalianStyle> = {
  code: 'it',
  defaultStyle: 'it',
  describe,
  fallback() {
    return words.unrecognizable;
  },
  label(description) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  },
  reboot() {
    return words.startup;
  },
  regions,
  // The one description that is not wrapped is the one that says the
  // schedule never runs, which has a sentence of its own.
  sentence(description) {
    return description === words.never ?
      words.neverSentence :
      `${words.runs} ${description}.`;
  },
  style,
  styles
};

export type {ItalianStyle};
export {describeParts, styles};
export default italian;
