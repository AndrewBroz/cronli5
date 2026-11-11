// The places where neighbouring fields are said together: seconds,
// minutes and hours as one time of day, and the day of the month with a
// day of the week, with its month, and with its year.

import type {
  ScheduleFacts, SetDescription
} from '../../../core/schedule.js';
import type {Spoken} from '../../../core/select.js';
import type {EnglishOptions} from './options.js';
import type {Choice, Phrase} from './devices.js';
import type {Idiom} from './idioms.js';
import type {Parts, Slot} from './frame.js';
import {clockTimes} from '../../../core/fusions.js';
import {shortestSpoken} from '../../../core/select.js';
import {
  choose, daysOfTheMonth, daysOfTheWeek, hoursAsMoments, hoursAsNouns,
  hoursAsStretches, minutesOfOneHour, monthsAlone, monthsOfDays, say,
  secondsOfOneMinute, withinTheHour, yearsByNumber
} from './devices.js';
import {quartzDateIdioms, quartzWeekdayIdioms} from './idioms.js';
import lexicon from './lexicon.js';
import {extraWords, join, list, timeNames, unit} from './words.js';

// The most clock times a list of them may hold.
const mostClockTimes = 24;

const {words} = lexicon;

// How the seconds or the minutes of a time are said.
interface Tick {
  // A cadence with no gaps to name: every value, or "every 15 minutes".
  continuous: boolean;
  description: SetDescription;
  // Every value of the field.
  every: boolean;
  length: number;
  // The value, when there is just one.
  only: number | null;
  text: string;
}

// What the seconds contribute to the rest of the time: the words that
// take the place of "every minute", and the words that go before anything
// else.
interface SecondsLead {
  before: string;
  every: string;
}

// What a description of the hours is said with.
interface TimeContext {
  // The single second that every clock time carries, if there is one.
  carried?: number;
  lead: SecondsLead;
  minute: Tick;
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

// Minutes or seconds that are not continuous, up to the word that ties
// them to what follows. A run from the start is "for the first N minutes
// of", a run to the end "for the last N minutes of", and anything else is
// counted "minutes past".
function anchored(chosen: Choice, field: 'minute' | 'second'): string {
  const {description} = chosen;
  const everyOne = `${words.every.text} ${unit(field, 1)}`;
  const many = unit(field, 0);
  const forThe = `${extraWords.for} ${words.the.text}`;
  const of = words.of.text;

  if (description.kind === 'range' && description.from === 0) {
    const first = lexicon.nthWords[1].text;

    return `${everyOne} ${forThe} ${first} ${description.to + 1} ${many} ${of}`;
  }

  if (description.kind === 'range' && description.to === 59) {
    const count = 60 - description.from;

    return `${everyOne} ${forThe} ${words.last.text} ${count} ${many} ${of}`;
  }

  return join(chosen.text, unit(field, onlyValue(description) ?? 0),
    words.past.text);
}

function tick(
  candidates: SetDescription[],
  field: 'minute' | 'second',
  opts: EnglishOptions
): Tick {
  const chosen = choose(candidates, withinTheHour(field, opts), opts);
  const {description} = chosen;
  const every = description.kind === 'all';
  const continuous = every ||
    description.kind === 'cadence' && chosen.length === 1;

  return {
    continuous,
    description,
    every,
    length: chosen.length,
    only: onlyValue(description),
    text: continuous ? chosen.text : anchored(chosen, field)
  };
}

// A single second is silent here: zero says nothing, and any other rides
// on the clock times. A continuous cadence of seconds replaces "every
// minute", or else runs "for one minute" at each time. Any other seconds
// are counted past the minute.
function secondsLead(second: Tick, rides: boolean): SecondsLead {
  const everyMinute = `${words.every.text} ${unit('minute', 1)}`;

  if (rides || second.only === 0) {
    return {before: '', every: everyMinute};
  }

  if (second.continuous) {
    return {
      before: `${second.text} ${words.forOneMinute.text}`,
      every: second.text
    };
  }

  return {
    before: `${second.text} ${words.the.text} ${unit('minute', 1)},`,
    every: `${second.text} ${everyMinute}`
  };
}

// A run of minutes inside one named hour is a window of clock times.
function minuteWindow(
  hours: SetDescription,
  context: TimeContext,
  opts: EnglishOptions
): Phrase | null {
  const hour = onlyValue(hours);
  const {description} = context.minute;

  return hour === null || description.kind === 'values' ?
    null :
    say(description, minutesOfOneHour(hour, context.lead, opts), opts);
}

// The time said with one description of the hours, by the first of these
// that applies. A single minute rides on each hour as a moment, with any
// carried second. Continuous minutes lead and the hours confine them. A
// run of minutes in one hour is a window. Any other minutes are counted
// past the hours.
function timeWith(
  hours: SetDescription,
  context: TimeContext,
  opts: EnglishOptions
): Spoken[] {
  const {carried, lead, minute} = context;
  const moments = minute.only === null ?
    null :
    say(hours, hoursAsMoments({minute: minute.only, second: carried}, opts),
      opts);

  if (moments || typeof carried === 'number') {
    return moments ? [{...moments, text: join(lead.before, moments.text)}] : [];
  }

  const window = minute.continuous ? null : minuteWindow(hours, context, opts);
  const rest = say(hours,
    minute.continuous ? hoursAsStretches(opts) : hoursAsNouns(opts), opts);

  if (window || !rest) {
    return window ? [window] : [];
  }

  return [{
    length: minute.length + rest.length,
    text: minute.every ?
      join(lead.every, rest.text) :
      join(lead.before, minute.text, rest.text)
  }];
}

/**
 * The time of day. Within a single clock time, seconds that are not a
 * plain list are a window of it. Otherwise each description of the hours
 * is said with the minutes, and competes with the plain list of clock
 * times, which wins a tie; a single second rides on every clock time.
 */
function timeOfDay(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {candidates} = facts.analyses;
  const second = tick(candidates.second!, 'second', opts);
  const times = clockTimes(facts, mostClockTimes);

  if (times?.length === 1 && second.description.kind !== 'values') {
    return (say(second.description, secondsOfOneMinute(times[0], opts),
      opts) as Phrase).text;
  }

  const context = {
    carried: times?.[0].second,
    lead: secondsLead(second, times !== null && second.only !== null),
    minute: tick(candidates.minute!, 'minute', opts)
  };
  const listed = times ?
    [{
      length: times.length,
      text: join(context.lead.before, words.at.text,
        list(timeNames(times, opts), opts))
    }] :
    [];
  const others = candidates.hour!.flatMap(function sayWith(hours) {
    return timeWith(hours, context, opts);
  });

  return shortestSpoken([...listed, ...others]).text;
}

function sayForm<Form>(rows: Array<Idiom<Form>>, form: Form,
  opts: EnglishOptions): string {
  return (rows.find(function fits(row) {
    return row.applies(form);
  }) as Idiom<Form>).say(form, opts).text;
}

// A phrase that picks a day out of the month ("on the last Friday") and
// the months it applies to: "of the month", or "of" and the months.
function ofTheMonth(
  phrase: string,
  months: SetDescription[],
  opts: EnglishOptions
): string {
  const theMonth = `${words.of.text} ${words.the.text} ${unit('month', 1)}`;

  return months[0].kind === 'all' ?
    `${phrase} ${theMonth}` :
    choose(months, monthsOfDays({day: null, lead: '', phrase}, opts), opts)
      .text;
}

// The kinds of description that name days of the month outright, and so
// can be followed by "of" and several months. An exception or a cadence
// before "of" would be misheard ("except the 15th of March").
const namesDays = ['pieces', 'range', 'values'];

// Days of the month with the months they fall in. One month makes dates
// of numbered days ("on June 1 and 15"); several months follow them after
// "of" ("on the 1st and 15th of January and July"). Any other phrase for
// the days takes the months after "in".
function daysWithMonths(
  days: SetDescription[],
  months: SetDescription[],
  lead: string,
  opts: EnglishOptions
): string {
  if (days[0].kind === 'all') {
    return '';
  }

  const alone = choose(months, monthsAlone(opts), opts);
  const month = onlyValue(alone.description);
  const date = choose(days, daysOfTheMonth(month, lead, opts), opts);

  if (alone.description.kind === 'all' || date.named && month !== null) {
    return date.text;
  }

  if (!namesDays.includes(date.description.kind)) {
    return `${date.text} ${alone.text}`;
  }

  return choose(months, monthsOfDays(
    {day: onlyValue(date.description), lead, phrase: date.text}, opts), opts)
    .text;
}

// The day-of-month part with its months. A Quartz form is an idiom
// followed by its months, except the weekday nearest a day, which is
// followed by that day said as any day of the month is.
function dateWithMonths(facts: ScheduleFacts, opts: EnglishOptions): string {
  const {candidates, day} = facts.analyses;
  const months = candidates.month!;

  if (day.date?.kind !== 'quartz') {
    return daysWithMonths(candidates.date!, months, words.on.text, opts);
  }

  const {form} = day.date;
  const phrase = sayForm(quartzDateIdioms, form, opts);

  return form.kind === 'nearestWeekday' ?
    daysWithMonths([{kind: 'values', values: [form.day]}], months, phrase,
      opts) :
    ofTheMonth(phrase, months, opts);
}

// The day-of-week part with its months: "on Fridays in June", "on the
// last Friday of June".
function weekdayWithMonths(facts: ScheduleFacts, opts: EnglishOptions):
  string {
  const {candidates, day} = facts.analyses;
  const months = candidates.month!;

  if (day.weekday?.kind === 'quartz') {
    return ofTheMonth(sayForm(quartzWeekdayIdioms, day.weekday.form, opts),
      months, opts);
  }

  const days = candidates.weekday!;

  return days[0].kind === 'all' ?
    '' :
    join(choose(days, daysOfTheWeek(opts), opts).text,
      unlessEvery(choose(months, monthsAlone(opts), opts)));
}

// The year. One day, one month and one year are a full date, so the year
// closes the date ("on January 1, 2030"); any other years follow "in".
function yearSlot(facts: ScheduleFacts, opts: EnglishOptions): Slot {
  const {candidates, day} = facts.analyses;
  const year = choose(candidates.year!, yearsByNumber(opts), opts);
  const fullDate = !day.union &&
    [candidates.date, candidates.month, candidates.year]
      .every(function isOne(field) {
        return field !== null && onlyValue(field[0]) !== null;
      });

  return fullDate ?
    {
      before: opts.style.dayFirst ? ' ' : ', ',
      text: lexicon.year(onlyValue(year.description) as number).text
    } :
    {before: ' ', text: unlessEvery(year)};
}

/**
 * The time, the days, the month and the year, each as it is said. A day
 * of the month and a day of the week are joined by "as well as", and
 * each carries the months; the month has its own part only when neither
 * kind of day is restricted.
 */
function partsOf(facts: ScheduleFacts, opts: EnglishOptions): Parts {
  const date = dateWithMonths(facts, opts);
  const weekday = weekdayWithMonths(facts, opts);
  const months = choose(facts.analyses.candidates.month!, monthsAlone(opts),
    opts);

  return {
    date: {before: ' ', text: date},
    month: {before: ' ', text: date || weekday ? '' : unlessEvery(months)},
    time: timeOfDay(facts, opts),
    weekday: {
      before: date ? ` ${extraWords.asWellAs} ` : ' ',
      text: weekday
    },
    year: yearSlot(facts, opts)
  };
}

export {partsOf};
