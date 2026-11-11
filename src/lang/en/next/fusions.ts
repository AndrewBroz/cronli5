// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week or with its month.

import type {
  ScheduleFacts, SetDescription
} from '../../../core/schedule.js';
import type {Spoken} from '../../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice} from './devices.js';
import type {Parts} from './frame.js';
import {clockTimes} from '../../../core/fusions.js';
import {shortestSpoken} from '../../../core/select.js';
import {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, monthsOfTheYear, say, withinTheHour, yearsByNumber
} from './devices.js';
import lexicon from './lexicon.js';
import {extraWords, join, list, timeNames, unit} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// How the seconds or the minutes of a time are said.
interface Tick {
  // A cadence with no gaps to name: every value, or "every 15 minutes".
  continuous: boolean;
  // Every value of the field.
  every: boolean;
  length: number;
  // The value, when there is just one.
  only: number | null;
  text: string;
}

// What the seconds contribute to the time: the words that take the place
// of "every minute", and the words that go before anything else.
interface SecondsLead {
  before: string;
  everyMinute: string;
}

// The candidates of a field that is a plain set of values. A Quartz day
// form is not one, and the core states no fact that says which form it is.
function plainSet(candidates: SetDescription[] | null): SetDescription[] {
  if (!candidates) {
    throw new TypeError(
      'English cannot yet describe a Quartz day form: the schedule facts ' +
      'do not say which form it is.');
  }

  return candidates;
}

function onlyValue(description: SetDescription): number | null {
  return description.kind === 'values' && description.values.length === 1 ?
    description.values[0] :
    null;
}

// A field that takes every value has nothing to say.
function unlessEvery(choice: Choice): string {
  return choice.description.kind === 'all' ? '' : choice.text;
}

function tick(
  candidates: SetDescription[] | null,
  field: 'minute' | 'second',
  opts: EnglishOptions
): Tick {
  const chosen = choose(plainSet(candidates), withinTheHour(field, opts),
    opts);
  const {description} = chosen;
  const only = onlyValue(description);
  const every = description.kind === 'all';
  const continuous = every ||
    description.kind === 'cadence' && chosen.length === 1;

  return {
    continuous,
    every,
    length: chosen.length,
    only,
    text: continuous ?
      chosen.text :
      join(chosen.text, unit(field, only ?? 0), words.past.text)
  };
}

// Second 0 is silent. A continuous cadence of seconds replaces "every
// minute", or else runs "for one minute" at each time. Any other seconds
// are counted past the minute.
function secondsLead(second: Tick): SecondsLead {
  const everyMinute = `${words.every.text} ${unit('minute', 1)}`;

  if (second.only === 0) {
    return {before: '', everyMinute};
  }

  if (second.continuous) {
    return {
      before: `${second.text} ${words.forOneMinute.text}`,
      everyMinute: second.text
    };
  }

  return {
    before: `${second.text} ${words.the.text} ${unit('minute', 1)},`,
    everyMinute: `${second.text} ${everyMinute}`
  };
}

// The time said with one description of the hours. A single minute rides
// on each hour as a moment. Continuous minutes lead and the hours confine
// them. Any other minutes are counted past the hours.
function timeWith(
  hours: SetDescription,
  minute: Tick,
  lead: SecondsLead,
  opts: EnglishOptions
): Spoken[] {
  const moments = minute.only === null ?
    null :
    say(hours, hoursAsMoments(minute.only, opts), opts);

  if (moments) {
    return [{...moments, text: join(lead.before, moments.text)}];
  }

  const rest = say(hours,
    minute.continuous ? hoursAsStretches(opts) : hoursAsNouns(opts), opts);

  if (!rest) {
    return [];
  }

  return [{
    length: minute.length + rest.length,
    text: minute.every ?
      join(lead.everyMinute, rest.text) :
      join(lead.before, minute.text, rest.text)
  }];
}

/**
 * The time of day. Each description of the hours is said with the
 * minutes, and competes with the plain list of clock times, which wins a
 * tie. A single second other than zero joins each clock time of the list.
 */
function timeOfDay(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {candidates} = facts.analyses;
  const second = tick(candidates.second, 'second', opts);
  const times = clockTimes(facts, mostClockTimes);
  const listed = times ?
    `${words.at.text} ${list(timeNames(times, opts), opts)}` :
    '';

  if (listed && second.only) {
    return listed;
  }

  const lead = secondsLead(second);
  const minute = tick(candidates.minute, 'minute', opts);
  const others = plainSet(candidates.hour).flatMap(function sayWith(hours) {
    return timeWith(hours, minute, lead, opts);
  });
  const list24 = times ?
    [{length: times.length, text: join(lead.before, listed)}] :
    [];

  return shortestSpoken([...list24, ...others]).text;
}

/**
 * The time, the days, the month and the year, each as it is said. A day
 * of the month and a day of the week are joined by "as well as", with any
 * month after a comma. Without a day of the week, numbered days take
 * their month with them: one month as a date ("on June 1"), several after
 * "of" ("on the 1st of every third month").
 */
function partsOf(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const {candidates} = facts.analyses;
  const months = plainSet(candidates.month);
  const weekday = choose(plainSet(candidates.weekday), daysOfTheWeek(opts),
    opts);
  const alone = choose(months, monthsOfTheYear('in', opts), opts);
  const union = facts.analyses.day.union;
  const date = choose(plainSet(candidates.date),
    daysOfTheMonth(union ? null : onlyValue(alone.description), opts), opts);
  const fused = date.named && !union;
  const belonging = onlyValue(alone.description) === null ?
    unlessEvery(choose(months, monthsOfTheYear('of', opts), opts)) :
    '';
  const year = choose(plainSet(candidates.year), yearsByNumber(opts), opts);

  return {
    date: {before: ' ', text: unlessEvery(date)},
    month: {
      before: union ? ', ' : ' ',
      text: fused ? belonging : unlessEvery(alone)
    },
    time: timeOfDay(facts, opts),
    weekday: {
      before: union ? ` ${extraWords.asWellAs} ` : ' ',
      text: unlessEvery(weekday)
    },
    year: {before: ' ', text: unlessEvery(year)}
  };
}

export {partsOf};
